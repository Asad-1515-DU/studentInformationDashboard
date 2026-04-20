import React, { useState, useEffect } from 'react';
import { useCreateScholarship, useUpdateScholarship } from '../../../api/hooks/useScholarships';
import {
  validateScholarshipForm,
  hasFormErrors,
  formatErrorMessage,
} from '../../../utils/scholarshipValidation';
import './ScholarshipForm.css';

/**
 * ScholarshipForm Component
 * 
 * Handles adding and editing scholarships
 * Includes form validation, error handling, and success callbacks
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.scholarship] - Scholarship to edit (omit for add mode)
 * @param {Function} props.onSuccess - Callback when form submission succeeds
 * @param {Function} [props.onCancel] - Callback when user cancels form
 * @example
 * <ScholarshipForm 
 *   onSuccess={() => closeModal()}
 *   scholarship={editingScholarship}
 * />
 */
const ScholarshipForm = ({ scholarship, onSuccess, onCancel }) => {
  const isEditMode = !!scholarship;

  // Form state
  const [formData, setFormData] = useState({
    name: scholarship?.name || '',
    amount: scholarship?.amount || '',
    startDate: scholarship?.startDate || '',
    endDate: scholarship?.endDate || '',
    description: scholarship?.description || '',
    maxAwardees: scholarship?.maxAwardees || '',
    status: scholarship?.status || 'ACTIVE',
  });

  const [errors, setErrors] = useState({});
  const [formErrors, setFormErrors] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // API mutations
  const createMutation = useCreateScholarship();
  const updateMutation = useUpdateScholarship();

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const apiError = createMutation.error || updateMutation.error;

  // Update form error message when API error changes
  useEffect(() => {
    if (apiError) {
      setFormErrors(formatErrorMessage(apiError.message));
    }
  }, [apiError]);

  /**
   * Handle input field changes
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error if user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    // Validate form
    const validationErrors = validateScholarshipForm(formData);
    setErrors(validationErrors);

    if (hasFormErrors(validationErrors)) {
      return;
    }

    // Clear any previous form errors
    setFormErrors('');

    // Transform data to match backend schema
    const submitData = {
      name: formData.name.trim(),
      amount: parseFloat(formData.amount), // Convert to number
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      description: formData.description.trim() || null,
      maxAwardees: formData.maxAwardees ? parseInt(formData.maxAwardees) : null,
      status: formData.status || 'ACTIVE',
    };

    // Submit based on mode
    if (isEditMode) {
      updateMutation.mutate(
        { id: scholarship.id, data: submitData },
        {
          onSuccess: () => {
            onSuccess?.();
          },
          onError: (error) => {
            console.error('Update error:', error);
            setFormErrors(error.response?.data?.message || error.message || 'Failed to update scholarship');
          },
        }
      );
    } else {
      createMutation.mutate(submitData, {
        onSuccess: () => {
          // Reset form on successful creation
          setFormData({
            name: '',
            amount: '',
            startDate: '',
            endDate: '',
            description: '',
            maxAwardees: '',
            status: 'ACTIVE',
          });
          setErrors({});
          setSubmitAttempted(false);
          onSuccess?.();
        },
        onError: (error) => {
          console.error('Create error:', error);
          const errorMsg = error.response?.data?.message || error.message || 'Failed to create scholarship';
          setFormErrors(errorMsg);
        },
      });
    }
  };

  /**
   * Handle form reset
   */
  const handleReset = () => {
    if (isEditMode) {
      // Reset to original scholarship data
      setFormData({
        name: scholarship.name || '',
        amount: scholarship.amount || '',
        startDate: scholarship.startDate || '',
        endDate: scholarship.endDate || '',
        description: scholarship.description || '',
        maxAwardees: scholarship.maxAwardees || '',
        status: scholarship.status || 'ACTIVE',
      });
    } else {
      // Clear all fields
      setFormData({
        name: '',
        amount: '',
        startDate: '',
        endDate: '',
        description: '',
        maxAwardees: '',
        status: 'ACTIVE',
      });
    }
    setErrors({});
    setFormErrors('');
    setSubmitAttempted(false);
  };

  return (
    <form className="scholarship-form" onSubmit={handleSubmit}>
      {/* Form Title */}
      <h2 className="scholarship-form__title">
        {isEditMode ? 'Edit Scholarship' : 'Add New Scholarship'}
      </h2>

      {/* Form Errors */}
      {formErrors && (
        <div className="scholarship-form__error-message">
          <span className="error-icon">⚠️</span>
          {formErrors}
        </div>
      )}

      {/* Form Sections */}
      <fieldset className="scholarship-form__fieldset">
        <legend className="scholarship-form__legend">Basic Information</legend>

        {/* Scholarship Name */}
        <div className="scholarship-form__group">
          <label htmlFor="name" className="scholarship-form__label">
            Scholarship Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter scholarship name"
            className={`scholarship-form__input ${
              submitAttempted && errors.name ? 'error' : ''
            }`}
            disabled={isLoading}
          />
          {submitAttempted && errors.name && (
            <span className="scholarship-form__error">{errors.name}</span>
          )}
        </div>

        {/* Max Awardees */}
        <div className="scholarship-form__group">
          <label htmlFor="maxAwardees" className="scholarship-form__label">
            Maximum Awardees
          </label>
          <input
            type="number"
            id="maxAwardees"
            name="maxAwardees"
            value={formData.maxAwardees}
            onChange={handleInputChange}
            placeholder="Leave blank for unlimited"
            min="1"
            className="scholarship-form__input"
            disabled={isLoading}
          />
        </div>

        {/* Two Column: Amount and Date Range */}
        <div className="scholarship-form__row">
          {/* Amount */}
          <div className="scholarship-form__group">
            <label htmlFor="amount" className="scholarship-form__label">
              Award Amount <span className="required">*</span>
            </label>
            <div className="scholarship-form__input-wrapper">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`scholarship-form__input amount-input ${
                  submitAttempted && errors.amount ? 'error' : ''
                }`}
                disabled={isLoading}
              />
            </div>
            {submitAttempted && errors.amount && (
              <span className="scholarship-form__error">{errors.amount}</span>
            )}
          </div>

          {/* Start Date */}
          <div className="scholarship-form__group">
            <label htmlFor="startDate" className="scholarship-form__label">
              Start Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className={`scholarship-form__input ${
                submitAttempted && errors.startDate ? 'error' : ''
              }`}
              disabled={isLoading}
            />
            {submitAttempted && errors.startDate && (
              <span className="scholarship-form__error">{errors.startDate}</span>
            )}
          </div>

          {/* End Date / Deadline */}
          <div className="scholarship-form__group">
            <label htmlFor="endDate" className="scholarship-form__label">
              End Date (Deadline) <span className="required">*</span>
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className={`scholarship-form__input ${
                submitAttempted && errors.endDate ? 'error' : ''
              }`}
              disabled={isLoading}
            />
            {submitAttempted && errors.endDate && (
              <span className="scholarship-form__error">{errors.endDate}</span>
            )}
          </div>
        </div>
      </fieldset>

      {/* Description Section */}
      <fieldset className="scholarship-form__fieldset">
        <legend className="scholarship-form__legend">Details</legend>

        {/* Description */}
        <div className="scholarship-form__group">
          <label htmlFor="description" className="scholarship-form__label">
            Description <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Detailed description of the scholarship..."
            rows="4"
            className={`scholarship-form__textarea ${
              submitAttempted && errors.description ? 'error' : ''
            }`}
            disabled={isLoading}
          />
          <span className="scholarship-form__char-count">
            {formData.description.length}/1000
          </span>
          {submitAttempted && errors.description && (
            <span className="scholarship-form__error">{errors.description}</span>
          )}
        </div>
      </fieldset>

      {/* Form Actions */}
      <div className="scholarship-form__actions">
        <button
          type="submit"
          className="scholarship-form__button scholarship-form__button--submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              {isEditMode ? 'Updating...' : 'Adding...'}
            </>
          ) : isEditMode ? (
            'Update Scholarship'
          ) : (
            'Add Scholarship'
          )}
        </button>

        <button
          type="button"
          className="scholarship-form__button scholarship-form__button--reset"
          onClick={handleReset}
          disabled={isLoading}
        >
          Reset
        </button>

        {onCancel && (
          <button
            type="button"
            className="scholarship-form__button scholarship-form__button--cancel"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ScholarshipForm;
