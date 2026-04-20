import { Router } from 'express';
import meetingController from '../controllers/meetingController.js';

const meetingRoutes = Router();

/**
 * Meeting Routes
 * Base path: /api/v1/meetings
 */

// Schedule a new meeting
meetingRoutes.post('/', meetingController.scheduleMeeting);

// Get all meetings with filtering
meetingRoutes.get('/', meetingController.getAllMeetings);

// Get mentor's calendar with availability
meetingRoutes.get('/calendar/:mentorId', meetingController.getMentorCalendar);

// Get meeting by ID
meetingRoutes.get('/:id', meetingController.getMeetingById);

// Update meeting details
meetingRoutes.put('/:id', meetingController.updateMeeting);

// Update meeting status
meetingRoutes.patch('/:id/status', meetingController.updateMeetingStatus);

// Reschedule meeting
meetingRoutes.post('/:id/reschedule', meetingController.rescheduleMeeting);

// Delete meeting
meetingRoutes.delete('/:id', meetingController.deleteMeeting);

export default meetingRoutes;
