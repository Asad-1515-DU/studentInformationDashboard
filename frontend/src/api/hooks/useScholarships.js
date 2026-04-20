import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as scholarshipService from '../services/scholarshipService';

/**
 * React Query Hooks for Scholarship API
 * 
 * These hooks handle data fetching, caching, and mutations
 * They automatically manage loading/error states
 */

/**
 * Fetch scholarships list with pagination and filters
 * 
 * Caching: 5 minutes stale time, 10 minutes garbage collection
 * Retries: 1 automatic retry on failure
 * 
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {Object} filters - Filter parameters
 * @returns {Object} Query result with data, isLoading, error, refetch
 */
export const useScholarships = (page = 1, limit = 20, filters = {}) => {
  return useQuery({
    queryKey: ['scholarships', { page, limit, ...filters }],
    queryFn: () => scholarshipService.getAllScholarships(page, limit, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1,
  });
};

/**
 * Fetch a single scholarship by ID
 * 
 * Caching: 10 minutes stale time, 30 minutes garbage collection
 * 
 * @param {string} id - Scholarship ID
 * @param {Object} options - Query options
 * @param {boolean} [options.enabled=true] - Whether to run query
 * @returns {Object} Query result with data, isLoading, error
 */
export const useScholarship = (id, options = {}) => {
  return useQuery({
    queryKey: ['scholarship', id],
    queryFn: () => scholarshipService.getScholarshipById(id),
    enabled: !!id && (options.enabled !== false),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 1,
  });
};

/**
 * Fetch scholarships with upcoming deadlines
 * 
 * Caching: 2 minutes stale time (deadlines are time-sensitive)
 * 
 * @param {number} days - Days until deadline
 * @param {Object} options - Query options
 * @returns {Object} Query result with scholarships array
 */
export const useUpcomingDeadlines = (days = 30, options = {}) => {
  return useQuery({
    queryKey: ['scholarships', 'upcoming', days],
    queryFn: () => scholarshipService.getUpcomingDeadlines(days),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    ...options,
  });
};

/**
 * Fetch scholarship statistics
 * 
 * Caching: 5 minutes stale time
 * 
 * @returns {Object} Query result with stats data
 */
export const useScholarshipStats = () => {
  return useQuery({
    queryKey: ['scholarships', 'stats'],
    queryFn: () => scholarshipService.getScholarshipStats(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Create a new scholarship
 * 
 * Auto-invalidates scholarships list cache on success
 * 
 * @returns {Object} Mutation result with mutate, isPending, error
 */
export const useCreateScholarship = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scholarshipData) =>
      scholarshipService.createScholarship(scholarshipData),
    onSuccess: () => {
      // Invalidate scholarships list to refetch
      queryClient.invalidateQueries({ queryKey: ['scholarships'] });
    },
  });
};

/**
 * Update an existing scholarship
 * 
 * Auto-invalidates specific scholarship and list cache on success
 * 
 * @returns {Object} Mutation result with mutate, isPending, error
 */
export const useUpdateScholarship = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      scholarshipService.updateScholarship(id, data),
    onSuccess: (data) => {
      // Invalidate specific scholarship
      queryClient.invalidateQueries({ queryKey: ['scholarship', data.id] });
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: ['scholarships'] });
    },
  });
};

/**
 * Update scholarship status only
 * 
 * Auto-invalidates caches on success
 * 
 * @returns {Object} Mutation result with mutate, isPending, error
 */
export const useUpdateScholarshipStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) =>
      scholarshipService.updateScholarshipStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['scholarship', data.id] });
      queryClient.invalidateQueries({ queryKey: ['scholarships'] });
    },
  });
};

/**
 * Delete a scholarship
 * 
 * Auto-invalidates scholarships list cache on success
 * 
 * @returns {Object} Mutation result with mutate, isPending, error
 */
export const useDeleteScholarship = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => scholarshipService.deleteScholarship(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scholarships'] });
    },
  });
};
