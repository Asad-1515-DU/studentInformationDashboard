/**
 * Student Directory - Type Definitions
 * 
 * Plain JavaScript object definitions for type documentation
 * These are not enforced by TypeScript but document the expected shapes
 */

/**
 * @typedef {Object} Student
 * @property {string} id - Unique identifier (UUID)
 * @property {string} name - Full name
 * @property {string} email - Email address
 * @property {string} dateOfBirth - ISO date string (YYYY-MM-DD)
 * @property {string} status - ACTIVE | INACTIVE | SUSPENDED
 * @property {string} [phone] - Optional phone number
 * @property {string} [address] - Optional address
 * @property {string} [major] - Optional major/field of study
 * @property {number} [gpa] - Optional GPA (0-4.0)
 * @property {string} createdAt - ISO datetime
 * @property {string} updatedAt - ISO datetime
 */

/**
 * @typedef {Object} StudentListResponse
 * @property {Student[]} data - Array of students
 * @property {Object} pagination - Pagination info
 * @property {number} pagination.total - Total number of students
 * @property {number} pagination.page - Current page
 * @property {number} pagination.limit - Items per page
 * @property {number} pagination.totalPages - Total pages
 * @property {Object} [meta] - Optional metadata
 */

/**
 * @typedef {Object} FilterParams
 * @property {string} [search] - Search query
 * @property {string} [status] - Filter by status
 * @property {string} [major] - Filter by major
 */

/**
 * @typedef {Object} ApiError
 * @property {number} status - HTTP status code
 * @property {string} message - Error message
 * @property {Object} [data] - Additional error data
 */

/**
 * @typedef {Object} StudentState
 * @property {Student[]} students - Array of students
 * @property {boolean} isLoading - Loading state
 * @property {ApiError | null} error - Error object
 * @property {number} page - Current page
 * @property {number} totalPages - Total pages
 * @property {number} total - Total students
 */

/**
 * @typedef {Object} FilterState
 * @property {string} search - Search query
 * @property {string} status - Status filter
 * @property {string} major - Major filter
 */

// Export as default for reference
export default {
  // This file documents the types used throughout the app
  // Use JSDoc comments in each file for type hints
};
