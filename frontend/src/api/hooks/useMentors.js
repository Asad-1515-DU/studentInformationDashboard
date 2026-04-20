import { useQuery } from '@tanstack/react-query';
import mentorService from '../services/mentorService';

/**
 * Hook to fetch mentors
 * 
 * Auto-caches results with 10-minute stale time
 * 
 * @param {number} page - Current page (1-indexed)
 * @param {number} limit - Items per page
 * @param {Object} filters - Filter parameters
 * @returns {Object} Query result with data, isLoading, error
 */
export const useMentors = (page = 1, limit = 100, filters = {}) => {
  return useQuery({
    queryKey: ['mentors', page, limit, filters],
    queryFn: () => mentorService.getAllMentors(page, limit, filters),
    staleTime: 10 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to fetch a single mentor by ID
 * 
 * @param {string} id - Mentor ID
 * @returns {Object} Query result with data, isLoading, error
 */
export const useMentorById = (id) => {
  return useQuery({
    queryKey: ['mentor', id],
    queryFn: () => mentorService.getMentorById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export default {
  useMentors,
  useMentorById,
};
