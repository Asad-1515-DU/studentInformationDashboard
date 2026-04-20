import React from 'react';
import './StudentFilters.css';

/**
 * StudentFilters Component
 * 
 * Provides filter controls for status and major
 * Allows clearing all filters
 */

const MAJORS = [
  'All',
  'Computer Science',
  'Engineering',
  'Business',
  'Fine Arts',
  'Medicine',
  'Law',
  'Other',
];

const STATUS_OPTIONS = ['All', 'ACTIVE', 'INACTIVE', 'SUSPENDED'];

const StudentFilters = ({
  filters,
  onStatusChange,
  onMajorChange,
  onClearFilters,
  isDisabled = false,
}) => {
  return (
    <div className="student-filters">
      <div className="student-filters__group">
        <label htmlFor="status-filter" className="student-filters__label">
          Status:
        </label>
        <select
          id="status-filter"
          className="student-filters__select"
          value={filters.status || 'All'}
          onChange={(e) => onStatusChange(e.target.value)}
          disabled={isDisabled}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="student-filters__group">
        <label htmlFor="major-filter" className="student-filters__label">
          Major:
        </label>
        <select
          id="major-filter"
          className="student-filters__select"
          value={filters.major || 'All'}
          onChange={(e) => onMajorChange(e.target.value)}
          disabled={isDisabled}
        >
          {MAJORS.map((major) => (
            <option key={major} value={major}>
              {major}
            </option>
          ))}
        </select>
      </div>

      <button
        className="student-filters__clear-btn"
        onClick={onClearFilters}
        disabled={
          isDisabled ||
          (!filters.status && !filters.major && !filters.search)
        }
        title="Clear all filters"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default StudentFilters;
