import React, { useState } from 'react';
import { useUpdateScholarshipStatus, useDeleteScholarship } from '../../../api/hooks/useScholarships';
import './ScholarshipStatusUpdate.css';

/**
 * ScholarshipStatusUpdate Component
 * 
 * Modal for updating scholarship status or deleting it
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.scholarship - Scholarship object
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onClose - Callback when modal closes
 * @param {Function} [props.onSuccess] - Callback after successful update
 * @example
 * <ScholarshipStatusUpdate
 *   scholarship={scholarship}
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   onSuccess={() => refetch()}
 * />
 */
const ScholarshipStatusUpdate = ({
  scholarship,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [newStatus, setNewStatus] = useState(scholarship?.status || 'AVAILABLE');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const statusMutation = useUpdateScholarshipStatus();
  const deleteMutation = useDeleteScholarship();

  const isLoading = statusMutation.isPending || deleteMutation.isPending;

  if (!isOpen || !scholarship) {
    return null;
  }

  /**
   * Handle status update
   */
  const handleStatusUpdate = () => {
    if (newStatus === scholarship.status) {
      onClose?.();
      return;
    }

    statusMutation.mutate(
      { id: scholarship.id, status: newStatus },
      {
        onSuccess: () => {
          onSuccess?.();
          onClose?.();
        },
      }
    );
  };

  /**
   * Handle delete
   */
  const handleDelete = () => {
    deleteMutation.mutate(scholarship.id, {
      onSuccess: () => {
        onSuccess?.();
        onClose?.();
      },
    });
  };

  /**
   * Get status description
   */
  const getStatusDescription = (status) => {
    const descriptions = {
      AVAILABLE: 'Applications open for new candidates',
      CLOSED: 'Application period has ended',
      ARCHIVED: 'Scholarship is no longer available',
    };
    return descriptions[status] || '';
  };

  return (
    <div className="scholarship-status-modal">
      {/* Overlay */}
      <div className="scholarship-status-modal__overlay" onClick={onClose} />

      {/* Modal Content */}
      <div className="scholarship-status-modal__content">
        {!showDeleteConfirm ? (
          <>
            {/* Header */}
            <div className="scholarship-status-modal__header">
              <h2 className="scholarship-status-modal__title">
                Manage Scholarship
              </h2>
              <button
                className="scholarship-status-modal__close"
                onClick={onClose}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="scholarship-status-modal__body">
              {/* Scholarship Info */}
              <div className="scholarship-status-modal__info">
                <h3 className="scholarship-status-modal__scholarship-name">
                  {scholarship.name}
                </h3>
                <p className="scholarship-status-modal__provider">
                  {scholarship.provider}
                </p>
              </div>

              {/* Status Section */}
              <fieldset className="scholarship-status-modal__fieldset">
                <legend className="scholarship-status-modal__legend">
                  Change Status
                </legend>

                <div className="scholarship-status-modal__current-status">
                  <span className="status-label">Current Status:</span>
                  <span
                    className={`status-badge status-${scholarship.status.toLowerCase()}`}
                  >
                    {scholarship.status}
                  </span>
                </div>

                {/* Status Options */}
                <div className="scholarship-status-modal__options">
                  {['AVAILABLE', 'CLOSED', 'ARCHIVED'].map((status) => (
                    <label
                      key={status}
                      className="scholarship-status-modal__option"
                    >
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={newStatus === status}
                        onChange={(e) => setNewStatus(e.target.value)}
                        disabled={isLoading}
                        className="scholarship-status-modal__radio"
                      />
                      <div className="scholarship-status-modal__option-content">
                        <span className="option-name">{status}</span>
                        <span className="option-description">
                          {getStatusDescription(status)}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Danger Zone */}
              <div className="scholarship-status-modal__danger-zone">
                <h4 className="scholarship-status-modal__danger-title">
                  Danger Zone
                </h4>
                <p className="scholarship-status-modal__danger-description">
                  Deleting this scholarship cannot be undone. All associated data
                  will be permanently removed.
                </p>
                <button
                  className="scholarship-status-modal__button scholarship-status-modal__button--delete"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isLoading}
                >
                  🗑️ Delete Scholarship
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="scholarship-status-modal__footer">
              <button
                className="scholarship-status-modal__button scholarship-status-modal__button--cancel"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="scholarship-status-modal__button scholarship-status-modal__button--save"
                onClick={handleStatusUpdate}
                disabled={isLoading || newStatus === scholarship.status}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Delete Confirmation */}
            <div className="scholarship-status-modal__header">
              <h2 className="scholarship-status-modal__title">
                Confirm Delete
              </h2>
              <button
                className="scholarship-status-modal__close"
                onClick={() => setShowDeleteConfirm(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="scholarship-status-modal__body">
              <div className="delete-confirmation">
                <div className="delete-confirmation__icon">⚠️</div>
                <h3 className="delete-confirmation__title">
                  Are you absolutely sure?
                </h3>
                <p className="delete-confirmation__message">
                  You are about to delete <strong>{scholarship.name}</strong>.
                </p>
                <p className="delete-confirmation__warning">
                  This action cannot be undone. All related data will be
                  permanently lost.
                </p>
              </div>
            </div>

            <div className="scholarship-status-modal__footer">
              <button
                className="scholarship-status-modal__button scholarship-status-modal__button--cancel"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="scholarship-status-modal__button scholarship-status-modal__button--confirm-delete"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Deleting...
                  </>
                ) : (
                  'Yes, Delete It'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ScholarshipStatusUpdate;
