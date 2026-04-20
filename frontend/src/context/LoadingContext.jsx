import { createContext, useContext, useState, useCallback } from 'react';

/**
 * Loading Context
 * Global loading state management for the application
 * Useful for showing a single loading indicator for multiple requests
 * 
 * Usage:
 * const { isLoading, startLoading, stopLoading } = useLoading();
 */
const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [loadingCount, setLoadingCount] = useState(0);

  const startLoading = useCallback(() => {
    setLoadingCount((prev) => prev + 1);
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingCount((prev) => Math.max(0, prev - 1));
  }, []);

  const isLoading = loadingCount > 0;

  const value = {
    isLoading,
    startLoading,
    stopLoading,
    loadingCount,
  };

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
}

/**
 * Hook to use loading context
 */
export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
}

export default LoadingContext;
