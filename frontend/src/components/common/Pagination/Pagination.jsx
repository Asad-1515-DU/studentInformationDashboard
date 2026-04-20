import React, { useMemo } from 'react';
import './Pagination.css';

/**
 * Pagination Component
 * 
 * Provides navigation between pages
 * Shows current page and total pages
 */

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  totalItems = 0,
  itemsPerPage = 20,
}) => {
  /**
   * Calculate visible page numbers
   * Shows max 5 neighbor pages
   */
  const visiblePages = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages]);

  /**
   * Handle previous page
   */
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  /**
   * Handle next page
   */
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  /**
   * Calculate start and end item numbers
   */
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Don't show if only 1 page or no data
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <div className="pagination__info">
        {totalItems > 0 && (
          <span className="pagination__count">
            Showing {startItem}-{endItem} of {totalItems} students
          </span>
        )}
      </div>

      <div className="pagination__controls">
        <button
          className="pagination__btn pagination__btn--prev"
          onClick={handlePrevious}
          disabled={disabled || currentPage === 1}
          title="Previous page"
          aria-label="Previous page"
        >
          ← Previous
        </button>

        <div className="pagination__pages">
          {visiblePages.map((page) => (
            <button
              key={page}
              className={`pagination__page ${page === currentPage ? 'pagination__page--active' : ''}`}
              onClick={() => onPageChange(page)}
              disabled={disabled}
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className="pagination__btn pagination__btn--next"
          onClick={handleNext}
          disabled={disabled || currentPage === totalPages}
          title="Next page"
          aria-label="Next page"
        >
          Next →
        </button>
      </div>

      <div className="pagination__meta">
        <span className="pagination__page-info">
          Page {currentPage} of {totalPages}
        </span>
      </div>
    </div>
  );
};

export default Pagination;
