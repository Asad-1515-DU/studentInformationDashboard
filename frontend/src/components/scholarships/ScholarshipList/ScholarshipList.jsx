import React, { useState } from 'react';
import ScholarshipCard from '../ScholarshipCard/ScholarshipCard';
import './ScholarshipList.css';

/**
 * ScholarshipList Component
 * 
 * Displays a list of scholarships in card format
 * Includes filtering, sorting, and pagination controls
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array<Object>} props.scholarships - Array of scholarship objects
 * @param {boolean} props.isLoading - Loading state
 * @param {string} [props.error] - Error message from API
 * @param {Function} [props.onEdit] - Callback when edit button clicked
 * @param {Function} [props.onDelete] - Callback when delete button clicked
 * @param {Function} [props.onStatusChange] - Callback for status change
 * @param {Object} [props.filters] - Current filter values
 * @param {Function} [props.onFilterChange] - Callback when filters change
 * @param {number} [props.total] - Total scholarships count
 * @param {number} [props.page] - Current page number
 * @param {Function} [props.onPageChange] - Callback when page changes
 * @example
 * <ScholarshipList
 *   scholarships={scholarships}
 *   isLoading={isLoading}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 */
const ScholarshipList = ({
  scholarships = [],
  isLoading = false,
  error = '',
  onEdit,
  onDelete,
  onStatusChange,
  filters = {},
  onFilterChange,
  total = 0,
  page = 1,
  onPageChange,
}) => {
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  /**
   * Handle sort change
   */
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  /**
   * Sort scholarships
   */
  const getSortedScholarships = () => {
    if (!scholarships || scholarships.length === 0) {
      return [];
    }

    const sorted = [...scholarships].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle null/undefined
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      // Convert to lowercase for string comparison
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      // Compare
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  /**
   * Filter scholarships by status
   */
  const getFilteredScholarships = () => {
    let filtered = getSortedScholarships();

    if (filters.status) {
      filtered = filtered.filter((s) => s.status === filters.status);
    }

    // Category field not in schema - ignoring category filter

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchLower) ||
          s.provider.toLowerCase().includes(searchLower)
      );
    }

    if (filters.upcomingOnly) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      filtered = filtered.filter((s) => {
        const deadline = new Date(s.endDate);
        deadline.setHours(0, 0, 0, 0);
        return deadline >= today;
      });
    }

    return filtered;
  };

  const displayedScholarships = getFilteredScholarships();

  // Loading state
  if (isLoading) {
    return (
      <div className="scholarship-list">
        <div className="scholarship-list__loading">
          <div className="spinner"></div>
          <p>Loading scholarships...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="scholarship-list">
        <div className="scholarship-list__error">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!displayedScholarships || displayedScholarships.length === 0) {
    return (
      <div className="scholarship-list">
        <div className="scholarship-list__empty">
          <span className="empty-icon">📋</span>
          <p>
            {filters.search || filters.status
              ? 'No scholarships match your filters'
              : 'No scholarships available'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="scholarship-list">
      {/* List Header */}
      <div className="scholarship-list__header">
        <h3 className="scholarship-list__title">
          Scholarships ({displayedScholarships.length})
        </h3>

        {/* Sort Controls */}
        <div className="scholarship-list__sort">
          <label htmlFor="sort-by" className="scholarship-list__sort-label">
            Sort by:
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className="scholarship-list__sort-select"
          >
            <option value="name">Name</option>
            <option value="amount">Amount</option>
            <option value="endDate">Deadline</option>
            <option value="provider">Provider</option>
            <option value="status">Status</option>
          </select>
          <button
            className={`scholarship-list__sort-toggle ${
              sortOrder === 'asc' ? 'asc' : 'desc'
            }`}
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Filter Info */}
      {(filters.status || filters.search || filters.upcomingOnly) && (
        <div className="scholarship-list__filter-info">
          <span className="filter-badge">
            Filtered: {Object.values(filters).filter(Boolean).length} filter(s) active
          </span>
          {onFilterChange && (
            <button
              className="clear-filters-btn"
              onClick={() =>
                onFilterChange({
                  status: '',
                  search: '',
                  upcomingOnly: false,
                })
              }
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Scholarships Grid */}
      <div className="scholarship-list__grid">
        {displayedScholarships.map((scholarship) => (
          <ScholarshipCard
            key={scholarship.id}
            scholarship={scholarship}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>

      {/* Pagination Info */}
      {total > 0 && total > displayedScholarships.length && onPageChange && (
        <div className="scholarship-list__pagination">
          <p className="pagination-info">
            Showing {displayedScholarships.length} of {total} scholarships
          </p>
        </div>
      )}
    </div>
  );
};

export default ScholarshipList;
