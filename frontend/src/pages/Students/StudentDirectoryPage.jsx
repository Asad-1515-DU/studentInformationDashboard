import React from 'react';
import SearchInput from '../../components/common/SearchInput/SearchInput';
import StudentFilters from '../../components/students/StudentFilters/StudentFilters';
import StudentList from '../../components/students/StudentList/StudentList';
import Pagination from '../../components/common/Pagination/Pagination';
import { useStudents } from '../../api/hooks/useStudents';
import { useStudentDirectory } from '../../hooks/useStudentDirectory';
import './StudentDirectoryPage.css';

/**
 * Student Directory Page
 * 
 * Professional student directory with search, filters, and pagination
 */

const ITEMS_PER_PAGE = 20;

const StudentDirectoryPage = () => {
  // Get directory state and handlers
  const {
    page,
    searchTerm,
    filters,
    handleSearch,
    handleStatusChange,
    handleMajorChange,
    handleClearFilters,
    handlePageChange,
  } = useStudentDirectory();

  // Fetch students with React Query
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useStudents(page, ITEMS_PER_PAGE, {
    search: filters.search,
    status: filters.status,
    major: filters.major,
  });

  // Extract data from response
  const students = response?.data || [];
  const totalPages = response?.pagination?.pages || response?.pagination?.totalPages || 1;
  const totalItems = response?.pagination?.total || 0;

  /**
   * Handle clear search
   */
  const handleClearSearch = () => {
    handleSearch('');
  };

  /**
   * Handle retry on error
   */
  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="student-directory">
      {/* Header Section */}
      <div className="student-directory__header">
        <div className="student-directory__header-content">
          <div className="student-directory__title-group">
            <h1 className="student-directory__title">Student Directory</h1>
            <p className="student-directory__subtitle">
              Browse and manage student profiles
            </p>
          </div>
          
          {/* Header Stats */}
          {!isLoading && !error && totalItems > 0 && (
            <div className="student-directory__header-stats">
              <div className="stat-card">
                <span className="stat-value">{totalItems}</span>
                <span className="stat-label">Total Students</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="student-directory__container">
        {/* Search & Filter Section */}
        <div className="student-directory__controls">
          {/* Search */}
          <div className="student-directory__search-area">
            <SearchInput
              value={searchTerm}
              onChange={handleSearch}
              onClear={handleClearSearch}
              disabled={isLoading}
              placeholder="Search by name, email, or ID..."
            />
          </div>

          {/* Filters */}
          <div className="student-directory__filters-area">
            <StudentFilters
              filters={filters}
              onStatusChange={handleStatusChange}
              onMajorChange={handleMajorChange}
              onClearFilters={handleClearFilters}
              isDisabled={isLoading}
            />
          </div>
        </div>

        {/* Results Status */}
        {!isLoading && !error && totalItems > 0 && (
          <div className="student-directory__results-banner">
            <div className="results-text">
              Showing <strong>{students.length}</strong> of <strong>{totalItems}</strong> students
            </div>
            {(filters.status || filters.major || filters.search) && (
              <div className="results-filters">
                {filters.search && <span className="filter-tag">Search: {filters.search}</span>}
                {filters.status && <span className="filter-tag">Status: {filters.status}</span>}
                {filters.major && <span className="filter-tag">Major: {filters.major}</span>}
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="student-directory__error-card">
            <div className="error-content">
              <h3 className="error-title">Failed to Load Students</h3>
              <p className="error-message">{error.message}</p>
              <button className="error-retry-btn" onClick={handleRetry}>
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Student List */}
        <section className="student-directory__content">
          <StudentList
            students={students}
            isLoading={isLoading}
            error={error}
          />
        </section>

        {/* Pagination */}
        {!error && (
          <section className="student-directory__footer">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
              disabled={isLoading}
            />
          </section>
        )}
      </div>
    </div>
  );
};

export default StudentDirectoryPage;
