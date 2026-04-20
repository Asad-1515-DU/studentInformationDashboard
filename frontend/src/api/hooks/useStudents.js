import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as studentService from '../services/studentService';

/**
 * React Query Hooks for Student API
 * 
 * These hooks handle data fetching, caching, and mutations
 * They automatically manage loading/error states
 */

/**
 * Fetch students list with pagination and filters
 * 
 * Caching: 30 seconds stale time, 5 minutes garbage collection
 * Refetches when component mounts or filters/pagination changes
 * Refetches when query is stale (30 seconds)
 * 
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {Object} filters - Filter parameters
 * @returns {Object} Query result with data, isLoading, error, refetch
 */
export const useStudents = (page = 1, limit = 20, filters = {}) => {
  return useQuery({
    queryKey: ['students', { page, limit, ...filters }],
    queryFn: () => studentService.getAllStudents(page, limit, filters),
    staleTime: 30 * 1000, // 30 seconds - shorter for more responsive UI
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
};

/**
 * Fetch a single student by ID
 * 
 * Caching: 2 minutes stale time, 10 minutes garbage collection
 * Will refetch immediately when component mounts or ID changes
 * 
 * @param {string} id - Student ID
 * @param {Object} options - Query options
 * @param {boolean} [options.enabled=true] - Whether to run query
 * @returns {Object} Query result with data, isLoading, error
 */
export const useStudent = (id, options = {}) => {
  console.log('🎯 useStudent hook called with ID:', id);
  return useQuery({
    queryKey: ['student', id],
    queryFn: async () => {
      console.log('🔄 Fetching student with ID:', id);
      const data = await studentService.getStudentById(id);
      console.log('✅ Student data fetched:', data);
      return data;
    },
    enabled: !!id && (options.enabled !== false),
    staleTime: 2 * 60 * 1000, // 2 minutes (reduced from 10)
    gcTime: 10 * 60 * 1000, // 10 minutes (reduced from 30)
    retry: 1,
    refetchOnMount: 'stale', // Refetch if data is stale
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
};

/**
 * Fetch full student profile with additional details
 * 
 * Caching: 10 minutes stale time
 * 
 * @param {string} id - Student ID
 * @param {Object} options - Query options
 * @returns {Object} Query result with data, isLoading, error
 */
export const useStudentFullProfile = (id, options = {}) => {
  return useQuery({
    queryKey: ['studentProfile', id],
    queryFn: () => studentService.getStudentFullProfile(id),
    enabled: !!id && (options.enabled !== false),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Fetch student's scholarships
 * 
 * Caching: 2 minutes stale time
 * Will refetch immediately when component mounts or student ID changes
 * 
 * @param {string} id - Student ID
 * @param {Object} options - Query options
 * @returns {Object} Query result with scholarships array
 */
export const useStudentScholarships = (id, options = {}) => {
  return useQuery({
    queryKey: ['studentScholarships', id],
    queryFn: () => studentService.getStudentScholarships(id),
    enabled: !!id && (options.enabled !== false),
    staleTime: 2 * 60 * 1000, // 2 minutes (reduced from 15)
    gcTime: 10 * 60 * 1000, // 10 minutes (reduced from 30)
    retry: 1,
    refetchOnMount: 'stale',
    refetchOnWindowFocus: false,
  });
};

/**
 * Fetch student's meetings
 * 
 * Caching: 2 minutes stale time
 * Will refetch immediately when component mounts or student ID changes
 * 
 * @param {string} id - Student ID
 * @param {Object} filters - Optional filters
 * @param {Object} options - Query options
 * @returns {Object} Query result with meetings array
 */
export const useStudentMeetings = (id, filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['studentMeetings', id, filters],
    queryFn: () => studentService.getStudentMeetings(id, filters),
    enabled: !!id && (options.enabled !== false),
    staleTime: 2 * 60 * 1000, // 2 minutes (reduced from 10)
    gcTime: 10 * 60 * 1000, // 10 minutes (reduced from 30)
    retry: 1,
    refetchOnMount: 'stale',
    refetchOnWindowFocus: false,
  });
};

/**
 * Fetch student's mentors
 * 
 * Caching: 2 minutes stale time
 * Will refetch immediately when component mounts or student ID changes
 * 
 * @param {string} id - Student ID
 * @param {Object} options - Query options
 * @returns {Object} Query result with mentors array
 */
export const useStudentMentors = (id, options = {}) => {
  return useQuery({
    queryKey: ['studentMentors', id],
    queryFn: async () => {
      const mentor = await studentService.getStudentMentors(id);
      // Wrap single mentor object in array for consistent data structure
      return mentor ? [mentor] : [];
    },
    enabled: !!id && (options.enabled !== false),
    staleTime: 2 * 60 * 1000, // 2 minutes (reduced from 15)
    gcTime: 10 * 60 * 1000, // 10 minutes (reduced from 30)
    retry: 1,
    refetchOnMount: 'stale',
    refetchOnWindowFocus: false,
  });
};

/**
 * Fetch student's courses
 * 
 * Caching: 2 minutes stale time
 * Will refetch immediately when component mounts or student ID changes
 * 
 * @param {string} id - Student ID
 * @param {Object} options - Query options
 * @returns {Object} Query result with courses array
 */
export const useStudentCourses = (id, options = {}) => {
  return useQuery({
    queryKey: ['studentCourses', id],
    queryFn: () => studentService.getStudentCourses(id),
    enabled: !!id && (options.enabled !== false),
    staleTime: 2 * 60 * 1000, // 2 minutes (reduced from 10)
    gcTime: 10 * 60 * 1000, // 10 minutes (reduced from 30)
    retry: 1,
    refetchOnMount: 'stale',
    refetchOnWindowFocus: false,
  });
};

/**
 * Create a new student (mutation)
 * 
 * Automatically invalidates students list after success
 * 
 * @returns {Object} Mutation object with mutate, isPending, error
 */
export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studentData) => studentService.createStudent(studentData),
    onSuccess: () => {
      // Invalidate students list to refetch
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (error) => {
      console.error('Failed to create student:', error.message);
    },
  });
};

/**
 * Update a student (mutation)
 * 
 * Automatically invalidates both student and list queries after success
 * 
 * @returns {Object} Mutation object with mutate, isPending, error
 */
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => studentService.updateStudent(id, data),
    onSuccess: (data, variables) => {
      // Invalidate specific student and list
      queryClient.invalidateQueries({ queryKey: ['student', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (error) => {
      console.error('Failed to update student:', error.message);
    },
  });
};

/**
 * Delete a student (mutation)
 * 
 * Automatically invalidates students list after success
 * 
 * @returns {Object} Mutation object with mutate, isPending, error
 */
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => studentService.deleteStudent(id),
    onSuccess: () => {
      // Invalidate students list to refetch
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (error) => {
      console.error('Failed to delete student:', error.message);
    },
  });
};
