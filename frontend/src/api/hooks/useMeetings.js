import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as meetingService from '../services/meetingService';

/**
 * React Query Hooks for Meeting API
 * 
 * These hooks handle data fetching, caching, and mutations
 * They automatically manage loading/error states
 */

/**
 * Fetch meetings list with pagination and filters
 * 
 * Caching: 3 minutes stale time (meetings have shorter cache due to real-time nature)
 * Retries: 1 automatic retry on failure
 * 
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {Object} filters - Filter parameters
 * @returns {Object} Query result with data, isLoading, error, refetch
 */
export const useMeetings = (page = 1, limit = 20, filters = {}) => {
  return useQuery({
    queryKey: ['meetings', { page, limit, ...filters }],
    queryFn: () => meetingService.getAllMeetings(page, limit, filters),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
};

/**
 * Fetch a single meeting by ID
 * 
 * Caching: 5 minutes stale time
 * 
 * @param {string} id - Meeting ID
 * @param {Object} options - Query options
 * @param {boolean} [options.enabled=true] - Whether to run query
 * @returns {Object} Query result with data, isLoading, error
 */
export const useMeeting = (id, options = {}) => {
  return useQuery({
    queryKey: ['meeting', id],
    queryFn: () => meetingService.getMeetingById(id),
    enabled: !!id && (options.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
  });
};

/**
 * Fetch upcoming meetings (next 7 days)
 * 
 * Caching: 2 minutes (time-sensitive data)
 * 
 * @param {Object} filters - Optional filters
 * @returns {Object} Query result with data, isLoading, error, refetch
 */
export const useUpcomingMeetings = (filters = {}) => {
  return useQuery({
    queryKey: ['meetings', 'upcoming', filters],
    queryFn: () => meetingService.getUpcomingMeetings(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
};

/**
 * Get meetings by student ID
 * 
 * @param {string} studentId - Student ID
 * @param {Object} filters - Optional filters
 * @returns {Object} Query result
 */
export const useMeetingsByStudent = (studentId, filters = {}) => {
  return useQuery({
    queryKey: ['meetings', 'student', studentId, filters],
    queryFn: () => meetingService.getMeetingsByStudent(studentId, filters),
    enabled: !!studentId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
};

/**
 * Get meetings by mentor ID
 * 
 * @param {string} mentorId - Mentor ID
 * @param {Object} filters - Optional filters
 * @returns {Object} Query result
 */
export const useMeetingsByMentor = (mentorId, filters = {}) => {
  return useQuery({
    queryKey: ['meetings', 'mentor', mentorId, filters],
    queryFn: () => meetingService.getMeetingsByMentor(mentorId, filters),
    enabled: !!mentorId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
};

/**
 * Create a new meeting - MUTATION
 * 
 * Usage:
 * const { mutate: createMeeting, isPending } = useCreateMeeting();
 * 
 * @returns {Object} Mutation object with mutate, isPending, error
 */
export const useCreateMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meetingData) => meetingService.createMeeting(meetingData),
    onSuccess: () => {
      // Invalidate all meetings queries
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
    onError: (error) => {
      console.error('Failed to create meeting:', error.message);
    },
  });
};

/**
 * Update an existing meeting - MUTATION
 * 
 * Usage:
 * const { mutate: updateMeeting } = useUpdateMeeting();
 * 
 * @returns {Object} Mutation object
 */
export const useUpdateMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => meetingService.updateMeeting(id, data),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      queryClient.invalidateQueries({ queryKey: ['meeting', data.id] });
    },
    onError: (error) => {
      console.error('Failed to update meeting:', error.message);
    },
  });
};

/**
 * Update meeting status only - MUTATION
 * 
 * Usage:
 * const { mutate: updateStatus } = useUpdateMeetingStatus();
 * 
 * @returns {Object} Mutation object
 */
export const useUpdateMeetingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => meetingService.updateMeetingStatus(id, status),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      queryClient.invalidateQueries({ queryKey: ['meeting', data.id] });
    },
    onError: (error) => {
      console.error('Failed to update meeting status:', error.message);
    },
  });
};

/**
 * Delete a meeting - MUTATION
 * 
 * Usage:
 * const { mutate: deleteMeeting } = useDeleteMeeting();
 * 
 * @returns {Object} Mutation object
 */
export const useDeleteMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => meetingService.deleteMeeting(id),
    onSuccess: () => {
      // Invalidate all meetings queries
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
    onError: (error) => {
      console.error('Failed to delete meeting:', error.message);
    },
  });
};

export default {
  useMeetings,
  useMeeting,
  useUpcomingMeetings,
  useMeetingsByStudent,
  useMeetingsByMentor,
  useCreateMeeting,
  useUpdateMeeting,
  useUpdateMeetingStatus,
  useDeleteMeeting,
};
