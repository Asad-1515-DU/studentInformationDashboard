import React from 'react';
import './ScholarshipCard.css';

/**
 * ScholarshipCard Component
 * 
 * Displays a single scholarship in card format
 * Shows key information and action buttons
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.scholarship - Scholarship object
 * @param {string} props.scholarship.id - Scholarship ID
 * @param {string} props.scholarship.name - Scholarship name
 * @param {string} props.scholarship.provider - Provider name
 * @param {number} props.scholarship.amount - Award amount
 * @param {string} props.scholarship.endDate - Application deadline (ISO date)
 * @param {string} props.scholarship.status - Scholarship status
 * @param {string} props.scholarship.category - Category
 * @param {string} [props.scholarship.description] - Description
 * @param {Function} [props.onEdit] - Callback when edit button clicked
 * @param {Function} [props.onDelete] - Callback when delete button clicked
 * @param {Function} [props.onStatusChange] - Callback when status change requested
 * @example
 * <ScholarshipCard
 *   scholarship={scholarship}
 *   onEdit={() => handleEdit(scholarship)}
 *   onDelete={() => handleDelete(scholarship.id)}
 *   onStatusChange={(status) => updateStatus(scholarship.id, status)}
 * />
 */
const ScholarshipCard = ({
  scholarship,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  if (!scholarship) {
    return null;
  }

  /**
   * Get status badge class
   */
  const getStatusClass = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'status-available';
      case 'CLOSED':
        return 'status-closed';
      case 'ARCHIVED':
        return 'status-archived';
      default:
        return '';
    }
  };

  /**
   * Get category badge text
   */
  const getCategoryText = (category) => {
    const categoryMap = {
      MERIT: 'Merit-based',
      NEED_BASED: 'Need-based',
      DIVERSITY: 'Diversity',
      SPECIFIC_FIELD: 'Field Specific',
      REGIONAL: 'Regional',
      OTHER: 'Other',
    };
    return categoryMap[category] || category;
  };

  /**
   * Format currency
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  /**
   * Calculate days until deadline
   */
  const getDaysUntilDeadline = () => {
    const deadline = new Date(scholarship.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  /**
   * Format deadline for display
   */
  const formatDeadline = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  /**
   * Get deadline urgency class
   */
  const getDeadlineUrgency = () => {
    const daysLeft = getDaysUntilDeadline();
    if (daysLeft < 0) return 'deadline-passed';
    if (daysLeft <= 7) return 'deadline-urgent';
    if (daysLeft <= 30) return 'deadline-soon';
    return 'deadline-normal';
  };

  const daysUntilDeadline = getDaysUntilDeadline();
  const deadlineUrgency = getDeadlineUrgency();

  return (
    <div className="scholarship-card">
      {/* Card Header */}
      <div className="scholarship-card__header">
        <div className="scholarship-card__header-left">
          <h3 className="scholarship-card__name">{scholarship.name}</h3>
          <p className="scholarship-card__provider">{scholarship.provider}</p>
        </div>
        <span className={`scholarship-card__status ${getStatusClass(scholarship.status)}`}>
          {scholarship.status}
        </span>
      </div>

      {/* Card Body */}
      <div className="scholarship-card__body">
        {/* Main Info Row */}
        <div className="scholarship-card__info-grid">
          {/* Amount */}
          <div className="scholarship-card__info-item">
            <span className="scholarship-card__info-label">Award Amount</span>
            <span className="scholarship-card__info-value scholarship-card__amount">
              {formatCurrency(scholarship.amount)}
            </span>
          </div>

          {/* Category */}
          <div className="scholarship-card__info-item">
            <span className="scholarship-card__info-label">Category</span>
            <span className="scholarship-card__category-badge">
              {getCategoryText(scholarship.category)}
            </span>
          </div>

          {/* Deadline */}
          <div className="scholarship-card__info-item">
            <span className="scholarship-card__info-label">Deadline</span>
            <div className={`scholarship-card__deadline ${deadlineUrgency}`}>
              {formatDeadline(scholarship.endDate)}
              <span className="scholarship-card__days-left">
                {daysUntilDeadline < 0
                  ? 'PASSED'
                  : daysUntilDeadline === 0
                    ? 'TODAY'
                    : `${daysUntilDeadline} days left`}
              </span>
            </div>
          </div>
        </div>

        {/* Description (if available) */}
        {scholarship.description && (
          <p className="scholarship-card__description">
            {scholarship.description.substring(0, 150)}
            {scholarship.description.length > 150 ? '...' : ''}
          </p>
        )}
      </div>

      {/* Card Actions */}
      <div className="scholarship-card__actions">
        <button
          className="scholarship-card__button scholarship-card__button--edit"
          onClick={() => onEdit?.(scholarship)}
          title="Edit scholarship"
        >
          ✏️ Edit
        </button>

        <button
          className="scholarship-card__button scholarship-card__button--status"
          onClick={() => onStatusChange?.(scholarship)}
          title="Change status"
        >
          ↻ Status
        </button>

        <button
          className="scholarship-card__button scholarship-card__button--delete"
          onClick={() => onDelete?.(scholarship.id)}
          title="Delete scholarship"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default ScholarshipCard;
