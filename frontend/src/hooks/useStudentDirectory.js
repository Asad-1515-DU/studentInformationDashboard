import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Custom Hook: useStudentDirectory
 * 
 * Manages all state and logic for the Student Directory page
 * Handles search, filters, pagination, and debouncing
 * 
 * State is persisted in URL query parameters so it survives navigation
 */

/**
 * @returns {Object} Directory state and handlers
 */
export const useStudentDirectory = () => {
  // Get and set URL search parameters for persistence
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial values from URL or use defaults
  const initialPage = parseInt(searchParams.get('page')) || 1;
  const initialSearch = searchParams.get('search') || '';
  const initialStatus = searchParams.get('status') || '';
  const initialMajor = searchParams.get('major') || '';

  // Pagination state
  const [page, setPage] = useState(initialPage);

  // Search state with debouncing
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  // Filter state
  const [filters, setFilters] = useState({
    search: initialSearch,
    status: initialStatus,
    major: initialMajor,
  });

  /**
   * Debounce search term (300ms delay)
   * Reduces API calls while user is typing
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  /**
   * Update filters when debounced search changes
   * Reset to page 1 when search changes
   * Update URL query parameters
   */
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: debouncedSearch,
    }));
    // Reset page when search changes
    const newParams = new URLSearchParams();
    newParams.set('page', '1');
    if (debouncedSearch) newParams.set('search', debouncedSearch);
    if (filters.status) newParams.set('status', filters.status);
    if (filters.major) newParams.set('major', filters.major);
    
    setSearchParams(newParams, { replace: false });
    setPage(1);
  }, [debouncedSearch]);

  /**
   * Handle search input change
   * @param {string} value - New search value
   */
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  /**
   * Handle status filter change
   * @param {string} status - New status value
   */
  const handleStatusChange = useCallback((status) => {
    const newStatus = status === 'All' ? '' : status;
    setFilters((prev) => ({
      ...prev,
      status: newStatus,
    }));
    
    // Update URL with new status
    const newParams = new URLSearchParams();
    newParams.set('page', '1');
    if (searchTerm) newParams.set('search', searchTerm);
    if (newStatus) newParams.set('status', newStatus);
    if (filters.major) newParams.set('major', filters.major);
    
    setSearchParams(newParams, { replace: false });
    setPage(1);
  }, [searchTerm, filters.major]);

  /**
   * Handle major filter change
   * @param {string} major - New major value
   */
  const handleMajorChange = useCallback((major) => {
    const newMajor = major === 'All' ? '' : major;
    setFilters((prev) => ({
      ...prev,
      major: newMajor,
    }));
    
    // Update URL with new major
    const newParams = new URLSearchParams();
    newParams.set('page', '1');
    if (searchTerm) newParams.set('search', searchTerm);
    if (filters.status) newParams.set('status', filters.status);
    if (newMajor) newParams.set('major', newMajor);
    
    setSearchParams(newParams, { replace: false });
    setPage(1);
  }, [searchTerm, filters.status]);

  /**
   * Reset all filters and search
   */
  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearch('');
    setFilters({
      search: '',
      status: '',
      major: '',
    });
    setPage(1);
    setSearchParams({}, { replace: false });
  }, [setSearchParams]);

  /**
   * Handle pagination change
   * @param {number} newPage - New page number
   */
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    
    // Update URL with new page
    const newParams = new URLSearchParams();
    newParams.set('page', String(newPage));
    if (searchTerm) newParams.set('search', searchTerm);
    if (filters.status) newParams.set('status', filters.status);
    if (filters.major) newParams.set('major', filters.major);
    
    setSearchParams(newParams, { replace: false });
    
    // Auto-scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchTerm, filters, setSearchParams]);

  return {
    // State
    page,
    searchTerm,
    filters,

    // Handlers
    handleSearch,
    handleStatusChange,
    handleMajorChange,
    handleClearFilters,
    handlePageChange,
  };
};

export default useStudentDirectory;
