// Export all React Query hooks from a single point

// Student hooks
export {
  useStudents,
  useStudent,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
} from './useStudents';

// Mentor hooks
export {
  useMentors,
  useMentorById,
} from './useMentors';

// Scholarship hooks
export {
  useScholarships,
  useScholarship,
  useUpcomingDeadlines,
  useScholarshipStats,
  useCreateScholarship,
  useUpdateScholarship,
  useUpdateScholarshipStatus,
  useDeleteScholarship,
} from './useScholarships';

// Meeting hooks
export {
  useMeetings,
  useMeeting,
  useUpcomingMeetings,
  useMeetingsByStudent,
  useMeetingsByMentor,
  useCreateMeeting,
  useUpdateMeeting,
  useUpdateMeetingStatus,
  useDeleteMeeting,
} from './useMeetings';
