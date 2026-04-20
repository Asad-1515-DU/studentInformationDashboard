import axios from 'axios';

/**
 * Enhanced API Client Configuration
 * Features:
 * - Automatic retry on network/server errors
 * - Request/response logging
 * - Global error handling
 * - Auth token management
 * - Timeout configuration
 */

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api/v1';
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Create axios instance with base configuration
const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * - Adds authentication token
 * - Adds request ID for tracking
 * - Logs requests in development
 */
client.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    config.headers['X-Request-ID'] = generateRequestId();

    // Log request in development
    if (import.meta.env.DEV) {
      console.log('📤 API Request:', {
        method: config.method.toUpperCase(),
        url: config.url,
        headers: config.headers,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * - Logs responses in development
 * - Handles errors globally
 * - Manages retry logic
 * - Handles token expiration
 */
client.interceptors.response.use(
  (response) => {
    // Log successful response
    if (import.meta.env.DEV) {
      console.log('📥 API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  async (error) => {
    const config = error.config;

    // Log error details
    console.error('❌ API Error:', {
      status: error.response?.status,
      message: error.message,
      url: config?.url,
      data: error.response?.data,
    });

    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      // Emit custom event for global handling
      window.dispatchEvent(
        new CustomEvent('auth:unauthorized', {
          detail: { message: 'Your session has expired. Please login again.' },
        })
      );
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      window.dispatchEvent(
        new CustomEvent('auth:forbidden', {
          detail: { message: 'You do not have permission to perform this action.' },
        })
      );
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      window.dispatchEvent(
        new CustomEvent('error:notfound', {
          detail: { message: 'The requested resource was not found.' },
        })
      );
    }

    // Handle 500 Server Error
    if (error.response?.status >= 500) {
      window.dispatchEvent(
        new CustomEvent('error:server', {
          detail: { message: 'Server error. Please try again later.' },
        })
      );
    }

    // Retry logic for network errors and 5xx errors
    if (!config) {
      return Promise.reject(error);
    }

    config.retryCount = config.retryCount || 0;

    // Don't retry POST, PUT, DELETE or if max retries exceeded
    const shouldRetry =
      (error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED' || error.response?.status >= 500) &&
      config.retryCount < MAX_RETRIES &&
      config.method === 'GET';

    if (shouldRetry) {
      config.retryCount += 1;
      const delay = RETRY_DELAY * Math.pow(2, config.retryCount - 1); // Exponential backoff

      console.log(`🔄 Retrying request (attempt ${config.retryCount}/${MAX_RETRIES})...`);

      await new Promise((resolve) => setTimeout(resolve, delay));
      return client(config);
    }

    return Promise.reject(error);
  }
);

/**
 * Generate unique request ID for tracking
 */
function generateRequestId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Utility function to handle API errors
 */
export function getErrorMessage(error) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message === 'Network Error') {
    return 'Network connection error. Please check your internet connection.';
  }

  if (error.code === 'ECONNABORTED') {
    return 'Request timeout. Please try again.';
  }

  return error.message || 'An unexpected error occurred.';
}

/**
 * Utility function to extract errors from validation responses
 */
export function getValidationErrors(error) {
  if (error.response?.data?.errors) {
    return error.response.data.errors;
  }

  if (error.response?.data?.error) {
    return { general: error.response.data.error };
  }

  return { general: getErrorMessage(error) };
}

export default client;
