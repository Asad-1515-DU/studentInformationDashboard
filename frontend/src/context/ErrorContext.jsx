import { createContext, useContext, useState, useCallback } from 'react';

/**
 * Error Context
 * Global error handling for the application
 * 
 * Usage:
 * const { errors, addError, clearError, clearAllErrors } = useError();
 */
const ErrorContext = createContext();

export function ErrorProvider({ children }) {
  const [errors, setErrors] = useState([]);

  const addError = useCallback(
    (error, options = {}) => {
      const {
        id = Date.now(),
        type = 'error', // 'error', 'warning', 'info', 'success'
        duration = 5000, // Auto-dismiss after duration (0 = no auto-dismiss)
      } = options;

      const errorObj = {
        id,
        type,
        message: typeof error === 'string' ? error : error?.message || 'An unknown error occurred',
        timestamp: new Date(),
      };

      setErrors((prev) => [...prev, errorObj]);

      // Auto-dismiss error after duration
      if (duration > 0) {
        setTimeout(() => {
          clearError(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const clearError = useCallback((id) => {
    setErrors((prev) => prev.filter((err) => err.id !== id));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const value = {
    errors,
    addError,
    clearError,
    clearAllErrors,
  };

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
}

/**
 * Hook to use error context
 */
export function useError() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within ErrorProvider');
  }
  return context;
}

export default ErrorContext;
