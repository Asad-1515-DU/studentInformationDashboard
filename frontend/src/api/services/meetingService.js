import client from '../client';

/**
 * Meeting Service
 * Handles all meeting-related API calls
 * 
 * @module meetingService
 */

/**
 * Get all meetings with optional filtering and pagination
 * 
 * @param {number} page - Current page (1-indexed)
 * @param {number} limit - Items per page
 * @param {Object} filters - Filter parameters
 * @param {string} [filters.search] - Search by title or description
 * @param {string} [filters.status] - Filter by status (SCHEDULED, COMPLETED, CANCELLED)
 * @param {string} [filters.type] - Filter by type (MENTORSHIP, COUNSELING, ADVISORY)
 * @param {string} [filters.studentId] - Filter by student ID
 * @param {string} [filters.mentorId] - Filter by mentor ID
 * @returns {Promise<{data: Array, pagination: Object}>} Meetings list with pagination
 * @throws {Error} API error
 */
export const getAllMeetings = async (page = 1, limit = 20, filters = {}) => {
  try {
    const params = {
      page,
      limit,
      ...filters,
    };

    const response = await client.get('/meetings', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch meetings');
  }
};

/**
 * Get a single meeting by ID
 * 
 * @param {string} id - Meeting ID
 * @returns {Promise<Object>} Meeting object
 * @throws {Error} API error
 */
export const getMeetingById = async (id) => {
  try {
    const response = await client.get(`/meetings/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch meeting');
  }
};

/**
 * Create a new meeting
 * 
 * @param {Object} meetingData - Meeting data
 * @param {string} meetingData.title - Meeting title
 * @param {string} meetingData.description - Meeting description
 * @param {string} meetingData.type - Meeting type (MENTORSHIP, COUNSELING, ADVISORY)
 * @param {string} meetingData.studentId - Student ID
 * @param {string} meetingData.mentorId - Mentor/advisor ID
 * @param {string} meetingData.scheduledAt - Scheduled date/time (ISO string)
 * @param {string} [meetingData.location] - Meeting location
 * @param {string} [meetingData.notes] - Additional notes
 * @returns {Promise<Object>} Created meeting object
 * @throws {Error} Validation or API error
 */
export const createMeeting = async (meetingData) => {
  try {
    const response = await client.post('/meetings', meetingData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create meeting');
  }
};

/**
 * Update an existing meeting
 * 
 * @param {string} id - Meeting ID
 * @param {Object} meetingData - Updated meeting data
 * @returns {Promise<Object>} Updated meeting object
 * @throws {Error} API error
 */
export const updateMeeting = async (id, meetingData) => {
  try {
    const response = await client.put(`/meetings/${id}`, meetingData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update meeting');
  }
};

/**
 * Update meeting status only
 * 
 * @param {string} id - Meeting ID
 * @param {string} status - New status (SCHEDULED, COMPLETED, CANCELLED)
 * @returns {Promise<Object>} Updated meeting object
 * @throws {Error} API error
 */
export const updateMeetingStatus = async (id, status) => {
  try {
    const response = await client.patch(`/meetings/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update meeting status');
  }
};

/**
 * Delete a meeting
 * 
 * @param {string} id - Meeting ID
 * @returns {Promise<Object>} Deletion confirmation
 * @throws {Error} API error
 */
export const deleteMeeting = async (id) => {
  try {
    const response = await client.delete(`/meetings/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete meeting');
  }
};

/**
 * Get upcoming meetings (next 7 days)
 * 
 * @param {Object} [filters] - Optional filters
 * @returns {Promise<Array>} Array of upcoming meeting objects
 * @throws {Error} API error
 */
export const getUpcomingMeetings = async (filters = {}) => {
  try {
    const response = await client.get('/meetings/upcoming', {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch upcoming meetings');
  }
};

/**
 * Get meetings by student ID
 * 
 * @param {string} studentId - Student ID
 * @param {Object} [filters] - Optional filters
 * @returns {Promise<Array>} Array of meeting objects
 * @throws {Error} API error
 */
export const getMeetingsByStudent = async (studentId, filters = {}) => {
  try {
    const response = await client.get(`/meetings`, {
      params: { studentId, ...filters },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch meetings');
  }
};

/**
 * Get meetings by mentor ID
 * 
 * @param {string} mentorId - Mentor ID
 * @param {Object} [filters] - Optional filters
 * @returns {Promise<Array>} Array of meeting objects
 * @throws {Error} API error
 */
export const getMeetingsByMentor = async (mentorId, filters = {}) => {
  try {
    const response = await client.get(`/meetings`, {
      params: { mentorId, ...filters },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch meetings');
  }
};

export default {
  getAllMeetings,
  getMeetingById,
  createMeeting,
  updateMeeting,
  updateMeetingStatus,
  deleteMeeting,
  getUpcomingMeetings,
  getMeetingsByStudent,
  getMeetingsByMentor,
};
