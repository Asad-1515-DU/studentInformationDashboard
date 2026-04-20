import { useEffect } from 'react';
import { useError } from '@/context/ErrorContext';
import { useLoading } from '@/context/LoadingContext';

/**
 * Global Error Display Component
 * Shows all errors from the ErrorContext
 * Place this in your root App component
 * 
 * Usage:
 * <ErrorDisplay />
 */
export function ErrorDisplay() {
  const { errors, clearError } = useError();

  if (errors.length === 0) return null;

  return (
    <div className="error-toast-container">
      {errors.map((error) => (
        <div key={error.id} className={`error-toast error-${error.type}`}>
          <div className="error-content">
            <span className="error-message">{error.message}</span>
            <button
              className="error-close"
              onClick={() => clearError(error.id)}
              aria-label="Close error"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Global Loading Indicator Component
 * Shows a loading bar when requests are in progress
 * Place this in your root App component
 * 
 * Usage:
 * <GlobalLoadingIndicator />
 */
export function GlobalLoadingIndicator() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="global-loading-bar">
      <div className="loading-bar-progress"></div>
      <p className="loading-text">Processing request...</p>
    </div>
  );
}

/**
 * Global Event Listeners for API Errors
 * Listens to custom events dispatched by the API client
 * Place this in your root App component or a useEffect hook
 * 
 * Usage:
 * <APIEventListener />
 */
export function APIEventListener() {
  const { addError } = useError();

  useEffect(() => {
    // Handle 401 Unauthorized
    const handleUnauthorized = (event) => {
      addError(event.detail?.message || 'Unauthorized', { type: 'error' });
    };

    // Handle 403 Forbidden
    const handleForbidden = (event) => {
      addError(event.detail?.message || 'Access Forbidden', { type: 'error' });
    };

    // Handle 404 Not Found
    const handleNotFound = (event) => {
      addError(event.detail?.message || 'Resource not found', { type: 'error' });
    };

    // Handle 500+ Server Errors
    const handleServerError = (event) => {
      addError(event.detail?.message || 'Server error occurred', { type: 'error' });
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    window.addEventListener('auth:forbidden', handleForbidden);
    window.addEventListener('error:notfound', handleNotFound);
    window.addEventListener('error:server', handleServerError);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
      window.removeEventListener('auth:forbidden', handleForbidden);
      window.removeEventListener('error:notfound', handleNotFound);
      window.removeEventListener('error:server', handleServerError);
    };
  }, [addError]);

  return null;
}

/**
 * Example CSS for Error Display
 * Add this to your global styles
 * 
 * .error-toast-container {
 *   position: fixed;
 *   top: 20px;
 *   right: 20px;
 *   z-index: 9999;
 *   display: flex;
 *   flex-direction: column;
 *   gap: 10px;
 *   max-width: 400px;
 * }
 *
 * .error-toast {
 *   padding: 15px;
 *   border-radius: 8px;
 *   display: flex;
 *   justify-content: space-between;
 *   align-items: center;
 *   box-shadow: 0 4px 12px rgba(0,0,0,0.15);
 *   animation: slideIn 0.3s ease-out;
 * }
 *
 * .error-toast.error-error {
 *   background-color: #fee;
 *   color: #c33;
 *   border-left: 4px solid #c33;
 * }
 *
 * .error-toast.error-success {
 *   background-color: #efe;
 *   color: #3c3;
 *   border-left: 4px solid #3c3;
 * }
 *
 * .error-toast.error-warning {
 *   background-color: #ffe;
 *   color: #cc3;
 *   border-left: 4px solid #cc3;
 * }
 *
 * .error-toast.error-info {
 *   background-color: #eef;
 *   color: #33c;
 *   border-left: 4px solid #33c;
 * }
 *
 * .error-close {
 *   background: none;
 *   border: none;
 *   font-size: 24px;
 *   cursor: pointer;
 *   color: inherit;
 *   padding: 0;
 *   margin-left: 10px;
 * }
 *
 * .global-loading-bar {
 *   position: fixed;
 *   top: 0;
 *   left: 0;
 *   right: 0;
 *   height: 3px;
 *   background-color: transparent;
 *   z-index: 10000;
 * }
 *
 * .loading-bar-progress {
 *   height: 100%;
 *   background: linear-gradient(90deg, #3b82f6, #10b981);
 *   animation: progress 2s ease-in-out infinite;
 * }
 *
 * @keyframes slideIn {
 *   from {
 *     transform: translateX(400px);
 *     opacity: 0;
 *   }
 *   to {
 *     transform: translateX(0);
 *     opacity: 1;
 *   }
 * }
 *
 * @keyframes progress {
 *   0% {
 *     width: 0;
 *   }
 *   50% {
 *     width: 100%;
 *   }
 *   100% {
 *     width: 100%;
 *   }
 * }
 */

export default {
  ErrorDisplay,
  GlobalLoadingIndicator,
  APIEventListener,
};
