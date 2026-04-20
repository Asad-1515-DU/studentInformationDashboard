/**
 * Form Validation Utilities
 * 
 * Handles validation for scholarship forms
 * Returns error messages or empty string if valid
 */

/**
 * Validate required field
 * @param {*} value - Field value
 * @param {string} fieldName - Name of field for error message
 * @returns {string} Error message or empty string
 */
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return '';
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {string} Error message or empty string
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

/**
 * Validate scholarship name
 * @param {string} name - Scholarship name
 * @returns {string} Error message or empty string
 */
export const validateScholarshipName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'Scholarship name is required';
  }
  if (name.length < 3) {
    return 'Scholarship name must be at least 3 characters';
  }
  if (name.length > 100) {
    return 'Scholarship name must not exceed 100 characters';
  }
  return '';
};

/**
 * Validate provider name
 * @param {string} provider - Provider name
 * @returns {string} Error message or empty string
 */
export const validateProvider = (provider) => {
  if (!provider || provider.trim().length === 0) {
    return 'Provider name is required';
  }
  if (provider.length < 2) {
    return 'Provider name must be at least 2 characters';
  }
  if (provider.length > 100) {
    return 'Provider name must not exceed 100 characters';
  }
  return '';
};

/**
 * Validate scholarship amount
 * @param {number|string} amount - Scholarship amount
 * @returns {string} Error message or empty string
 */
export const validateAmount = (amount) => {
  if (amount === null || amount === undefined || amount === '') {
    return 'Amount is required';
  }

  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount)) {
    return 'Amount must be a valid number';
  }

  if (numAmount <= 0) {
    return 'Amount must be greater than 0';
  }

  if (numAmount > 999999999) {
    return 'Amount is too large';
  }

  // Check decimal places
  if (!Number.isInteger(numAmount * 100)) {
    return 'Amount must have at most 2 decimal places';
  }

  return '';
};

/**
 * Validate deadline date
 * @param {string} deadline - Deadline date (YYYY-MM-DD format)
 * @returns {string} Error message or empty string
 */
export const validateDeadline = (deadline) => {
  if (!deadline) {
    return 'Deadline is required';
  }

  // Parse the date
  const deadlineDate = new Date(deadline);
  
  // Check if valid date
  if (isNaN(deadlineDate.getTime())) {
    return 'Please enter a valid date';
  }

  // Check if deadline is in the future
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (deadlineDate < today) {
    return 'Deadline must be in the future';
  }

  return '';
};

/**
 * Validate description
 * @param {string} description - Scholarship description
 * @returns {string} Error message or empty string
 */
export const validateDescription = (description) => {
  if (!description || description.trim().length === 0) {
    return 'Description is required';
  }

  if (description.length < 10) {
    return 'Description must be at least 10 characters';
  }

  if (description.length > 1000) {
    return 'Description must not exceed 1000 characters';
  }

  return '';
};

/**
 * Validate requirements field
 * @param {string} requirements - Eligibility requirements
 * @returns {string} Error message or empty string
 */
export const validateRequirements = (requirements) => {
  if (!requirements || requirements.trim().length === 0) {
    return 'Requirements are required';
  }

  if (requirements.length < 10) {
    return 'Requirements must be at least 10 characters';
  }

  if (requirements.length > 1000) {
    return 'Requirements must not exceed 1000 characters';
  }

  return '';
};

/**
 * Validate category
 * @param {string} category - Scholarship category
 * @returns {string} Error message or empty string
 */
export const validateCategory = (category) => {
  const validCategories = [
    'MERIT',
    'NEED_BASED',
    'DIVERSITY',
    'SPECIFIC_FIELD',
    'REGIONAL',
    'OTHER',
  ];

  if (!category) {
    return 'Category is required';
  }

  if (!validCategories.includes(category)) {
    return 'Please select a valid category';
  }

  return '';
};

/**
 * Validate status
 * @param {string} status - Scholarship status
 * @returns {string} Error message or empty string
 */
export const validateStatus = (status) => {
  const validStatuses = ['AVAILABLE', 'CLOSED', 'ARCHIVED'];

  if (!status) {
    return 'Status is required';
  }

  if (!validStatuses.includes(status)) {
    return 'Please select a valid status';
  }

  return '';
};

/**
 * Validate entire scholarship form
 * Returns object with field names as keys and error messages as values
 * 
 * @param {Object} formData - Form data object
 * @param {string} formData.name - Scholarship name
 * @param {number} formData.amount - Award amount
 * @param {string} formData.startDate - Start date
 * @param {string} formData.endDate - End date (deadline)
 * @param {string} formData.description - Scholarship description (optional)
 * @param {number} formData.maxAwardees - Maximum awardees (optional)
 * @param {string} formData.status - Scholarship status
 * @returns {Object} Errors object with field names as keys
 */
export const validateScholarshipForm = (formData) => {
  const errors = {};

  // Validate required fields
  errors.name = validateScholarshipName(formData.name);
  errors.amount = validateAmount(formData.amount);
  
  // Validate date range
  if (!formData.startDate) {
    errors.startDate = 'Start date is required';
  }
  if (!formData.endDate) {
    errors.endDate = 'End date is required';
  }
  
  if (formData.startDate && formData.endDate) {
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (endDate <= startDate) {
      errors.endDate = 'End date must be after start date';
    }
  }

  // Remove empty errors
  Object.keys(errors).forEach(
    (key) => errors[key] === '' && delete errors[key]
  );

  return errors;
};

/**
 * Check if form has any errors
 * @param {Object} errors - Errors object from validation
 * @returns {boolean} true if there are errors
 */
export const hasFormErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

/**
 * Format error message for display
 * @param {string} errorMessage - Error message from API or validation
 * @returns {string} Formatted error message
 */
export const formatErrorMessage = (errorMessage) => {
  if (!errorMessage) return '';

  // Handle common API error patterns
  if (errorMessage.includes('Conflict')) {
    return 'This scholarship already exists';
  }
  if (errorMessage.includes('Not Found')) {
    return 'Scholarship not found';
  }
  if (errorMessage.includes('Unauthorized')) {
    return 'You do not have permission to perform this action';
  }

  return errorMessage;
};
