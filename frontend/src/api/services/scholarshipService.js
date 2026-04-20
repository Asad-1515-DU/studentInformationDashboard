import client from '../client';

/**
 * Scholarship Service
 * Handles all scholarship-related API calls
 * 
 * @module scholarshipService
 */

/**
 * Get all scholarships with optional filtering and pagination
 * 
 * @param {number} page - Current page (1-indexed)
 * @param {number} limit - Items per page
 * @param {Object} filters - Filter parameters
 * @param {string} [filters.search] - Search by scholarship name or provider
 * @param {string} [filters.status] - Filter by status (AVAILABLE, CLOSED, ARCHIVED)
 * @param {string} [filters.category] - Filter by category
 * @param {boolean} [filters.upcoming] - Only show scholarships with upcoming deadlines
 * @returns {Promise<{data: Array, pagination: Object}>} Scholarships list with pagination
 * @throws {Error} API error
 */
export const getAllScholarships = async (page = 1, limit = 20, filters = {}) => {
  try {
    const params = {
      page,
      limit,
      ...filters,
    };

    const response = await client.get('/scholarships', { params });
    
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response structure: missing data field');
    }

    return {
      data: response.data.data,
      pagination: response.data.pagination || {
        page,
        limit,
        total: response.data.data.length,
        pages: 1,
      },
    };
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch scholarships');
  }
};

/**
 * Get a single scholarship by ID
 * 
 * @param {string} id - Scholarship ID
 * @returns {Promise<Object>} Scholarship object
 * @throws {Error} API error
 */
export const getScholarshipById = async (id) => {
  try {
    const response = await client.get(`/scholarships/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch scholarship');
  }
};

/**
 * Create a new scholarship
 * 
 * @param {Object} scholarshipData - Scholarship data
 * @param {string} scholarshipData.name - Scholarship name
 * @param {string} scholarshipData.provider - Provider organization
 * @param {number} scholarshipData.amount - Award amount
 * @param {string} scholarshipData.deadline - Application deadline (YYYY-MM-DD)
 * @param {string} [scholarshipData.category] - scholarship category (MERIT, NEED_BASED, DIVERSITY, etc.)
 * @param {string} [scholarshipData.description] - Detailed description
 * @param {string} [scholarshipData.requirements] - Eligibility requirements
 * @param {string} [scholarshipData.status] - Status (AVAILABLE, CLOSED, ARCHIVED)
 * @returns {Promise<Object>} Created scholarship object
 * @throws {Error} API error
 */
export const createScholarship = async (scholarshipData) => {
  try {
    const response = await client.post('/scholarships', scholarshipData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create scholarship');
  }
};

/**
 * Update an existing scholarship
 * 
 * @param {string} id - Scholarship ID
 * @param {Object} scholarshipData - Updated scholarship data (partial object)
 * @returns {Promise<Object>} Updated scholarship object
 * @throws {Error} API error
 */
export const updateScholarship = async (id, scholarshipData) => {
  try {
    const response = await client.put(`/scholarships/${id}`, scholarshipData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update scholarship');
  }
};

/**
 * Update scholarship status only
 * 
 * @param {string} id - Scholarship ID
 * @param {string} status - New status (AVAILABLE, CLOSED, ARCHIVED)
 * @returns {Promise<Object>} Updated scholarship object
 * @throws {Error} API error
 */
export const updateScholarshipStatus = async (id, status) => {
  try {
    const response = await client.patch(`/scholarships/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update scholarship status');
  }
};

/**
 * Delete a scholarship
 * 
 * @param {string} id - Scholarship ID
 * @returns {Promise<void>}
 * @throws {Error} API error
 */
export const deleteScholarship = async (id) => {
  try {
    await client.delete(`/scholarships/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete scholarship');
  }
};

/**
 * Get scholarships expiring soon
 * 
 * @param {number} days - Days until deadline (default: 30)
 * @returns {Promise<Array>} Array of scholarships with deadlines within specified days
 * @throws {Error} API error
 */
export const getUpcomingDeadlines = async (days = 30) => {
  try {
    // Fetch all active scholarships
    const response = await client.get('/scholarships', {
      params: {
        status: 'ACTIVE',
        limit: 100, // Get more to filter client-side
      },
    });

    if (!response.data || !response.data.data) {
      throw new Error('Invalid response structure from scholarships API');
    }

    // Filter scholarships with upcoming deadlines
    const today = new Date();
    const deadlineDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    
    const upcoming = response.data.data.filter((scholarship) => {
      if (!scholarship.endDate) return false;
      const endDate = new Date(scholarship.endDate);
      if (isNaN(endDate.getTime())) return false; // Invalid date
      return endDate > today && endDate <= deadlineDate;
    });

    return upcoming;
  } catch (error) {
    console.error('Error fetching upcoming deadlines:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch upcoming deadlines');
  }
};

/**
 * Get scholarship statistics
 * 
 * @returns {Promise<Object>} Statistics object with counts and totals
 * @throws {Error} API error
 */
export const getScholarshipStats = async () => {
  try {
    const response = await client.get('/scholarships/stats');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch scholarship statistics');
  }
};
