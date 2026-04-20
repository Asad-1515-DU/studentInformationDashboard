import client from '../client';

/**
 * Mentor Service
 * Handles all mentor-related API calls
 * 
 * @module mentorService
 */

/**
 * Get all mentors with optional filtering
 * 
 * @param {number} page - Current page (1-indexed)
 * @param {number} limit - Items per page
 * @param {Object} filters - Filter parameters
 * @returns {Promise<{data: Array, pagination: Object}>} Mentors list with pagination
 * @throws {Error} API error
 */
export const getAllMentors = async (page = 1, limit = 100, filters = {}) => {
  try {
    const params = {
      page,
      limit,
      ...filters,
    };

    const response = await client.get('/mentors', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch mentors');
  }
};

/**
 * Get a single mentor by ID
 * 
 * @param {string} id - Mentor ID
 * @returns {Promise<Object>} Mentor object
 * @throws {Error} API error
 */
export const getMentorById = async (id) => {
  try {
    const response = await client.get(`/mentors/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch mentor');
  }
};

export default {
  getAllMentors,
  getMentorById,
};
