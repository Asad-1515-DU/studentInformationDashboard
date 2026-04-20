import client from '../client';

/**
 * Student Service
 * Handles all student-related API calls
 * 
 * @module studentService
 */

/**
 * Get all students with optional filtering and pagination
 * 
 * @param {number} page - Current page (1-indexed)
 * @param {number} limit - Items per page
 * @param {Object} filters - Filter parameters
 * @param {string} [filters.search] - Search by name or email
 * @param {string} [filters.status] - Filter by status (ACTIVE, INACTIVE, SUSPENDED)
 * @param {string} [filters.major] - Filter by major
 * @returns {Promise<{data: Array, pagination: Object}>} Students list with pagination
 * @throws {Error} API error
 */
export const getAllStudents = async (page = 1, limit = 20, filters = {}) => {
  try {
    // Only include filters that have actual values (not empty strings)
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value && value.trim !== undefined ? value.trim() !== '' : value)
    );

    const params = {
      page,
      limit,
      ...cleanedFilters,
    };

    console.log('🔄 Fetching students with params:', { page, limit, filters: cleanedFilters });
    const response = await client.get('/students', { params });
    
    // Return only data and pagination (exclude success and meta)
    const { data, pagination } = response.data;
    console.log('✅ Students fetched successfully:', { data, pagination });
    
    return {
      data,
      pagination,
    };
  } catch (error) {
    console.error('❌ Error fetching students:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch students';
    console.error('Error message:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get a single student by ID
 * 
 * @param {string} id - Student ID
 * @returns {Promise<Object>} Student object
 * @throws {Error} API error
 */
export const getStudentById = async (id) => {
  try {
    console.log('🌐 API Request: GET /students/' + id);
    const response = await client.get(`/students/${id}`);
    console.log('✅ API Response received:', response.status);
    console.log('📦 Response data:', response.data.data);
    return response.data.data; // Extract actual student data
  } catch (error) {
    console.error('❌ API Error for student:', id);
    console.error('Error details:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch student');
  }
};

/**
 * Get full student profile with additional details
 * 
 * @param {string} id - Student ID
 * @returns {Promise<Object>} Full student profile
 * @throws {Error} API error
 */
export const getStudentFullProfile = async (id) => {
  try {
    const response = await client.get(`/students/${id}/profile`);
    return response.data.data; // Extract actual profile data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch student profile');
  }
};

/**
 * Create a new student
 * 
 * @param {Object} studentData - Student data
 * @param {string} studentData.name - Full name
 * @param {string} studentData.email - Email address
 * @param {string} studentData.dateOfBirth - Date of birth (YYYY-MM-DD)
 * @param {string} [studentData.phone] - Phone number
 * @param {string} [studentData.address] - Address
 * @param {string} [studentData.major] - Major
 * @param {number} [studentData.gpa] - GPA
 * @returns {Promise<Object>} Created student object
 * @throws {Error} Validation or API error
 */
export const createStudent = async (studentData) => {
  try {
    const response = await client.post('/students', studentData);
    return response.data.data; // Extract actual student data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create student');
  }
};

/**
 * Update an existing student
 * 
 * @param {string} id - Student ID
 * @param {Object} studentData - Updated student data
 * @returns {Promise<Object>} Updated student object
 * @throws {Error} API error
 */
export const updateStudent = async (id, studentData) => {
  try {
    const response = await client.put(`/students/${id}`, studentData);
    return response.data.data; // Extract actual student data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update student');
  }
};

/**
 * Delete a student
 * 
 * @param {string} id - Student ID
 * @returns {Promise<Object>} Deletion confirmation
 * @throws {Error} API error
 */
export const deleteStudent = async (id) => {
  try {
    const response = await client.delete(`/students/${id}`);
    return response.data.data; // Extract actual response data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete student');
  }
};

/**
 * Get student's scholarships
 * 
 * @param {string} id - Student ID
 * @returns {Promise<Array>} Array of scholarship objects
 * @throws {Error} API error
 */
export const getStudentScholarships = async (id) => {
  try {
    const response = await client.get(`/students/${id}/scholarships`);
    return response.data.data; // Extract actual scholarship data array
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch scholarships');
  }
};

/**
 * Get student's meetings
 * 
 * @param {string} id - Student ID
 * @param {Object} [filters] - Optional filters
 * @returns {Promise<Array>} Array of meeting objects
 * @throws {Error} API error
 */
export const getStudentMeetings = async (id, filters = {}) => {
  try {
    const response = await client.get(`/students/${id}/meetings`, { params: filters });
    return response.data.data; // Extract actual meetings data array
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch meetings');
  }
};

/**
 * Get student's mentors/mentorship info
 * 
 * @param {string} id - Student ID
 * @returns {Promise<Array>} Array of mentor objects
 * @throws {Error} API error
 */
export const getStudentMentors = async (id) => {
  try {
    const response = await client.get(`/students/${id}/mentors`);
    return response.data.data; // Extract actual mentor data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch mentors');
  }
};

/**
 * Get student's courses
 * 
 * @param {string} id - Student ID
 * @returns {Promise<Array>} Array of course objects
 * @throws {Error} API error
 */
export const getStudentCourses = async (id) => {
  try {
    const response = await client.get(`/students/${id}/courses`);
    return response.data.data; // Extract actual courses data array
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch courses');
  }
};

export default {
  getAllStudents,
  getStudentById,
  getStudentFullProfile,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentScholarships,
  getStudentMeetings,
  getStudentMentors,
  getStudentCourses,
};
