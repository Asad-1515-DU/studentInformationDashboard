import meetingService from '../services/meetingService.js';
import { sendSuccessResponse } from '../utils/errorResponse.js';
import { asyncHandler } from '../middleware/errorHandler.js';

class MeetingController {
  /**
   * Schedule a new meeting
   * POST /meetings
   */
  scheduleMeeting = asyncHandler(async (req, res) => {
    const data = req.body;
    const meeting = await meetingService.scheduleMeeting(data);

    res.status(201).json(
      sendSuccessResponse(meeting, {
        timestamp: new Date().toISOString(),
        version: 'v1',
        action: 'scheduled',
      })
    );
  });

  /**
   * Get meeting by ID
   * GET /meetings/:id
   */
  getMeetingById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const meeting = await meetingService.getMeetingById(id);

    res.status(200).json(
      sendSuccessResponse(meeting, {
        timestamp: new Date().toISOString(),
        version: 'v1',
      })
    );
  });

  /**
   * Get all meetings with filtering
   * GET /meetings
   */
  getAllMeetings = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const filters = {
      status: req.query.status,
      studentId: req.query.studentId,
      mentorId: req.query.mentorId,
      fromDate: req.query.fromDate,
      toDate: req.query.toDate,
      sortOrder: req.query.sortOrder || 'desc',
    };

    const result = await meetingService.getAllMeetings(page, limit, filters);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      meta: {
        timestamp: new Date().toISOString(),
        version: 'v1',
      },
    });
  });

  /**
   * Update meeting details
   * PUT /meetings/:id
   */
  updateMeeting = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const meeting = await meetingService.updateMeeting(id, data);

    res.status(200).json(
      sendSuccessResponse(meeting, {
        timestamp: new Date().toISOString(),
        version: 'v1',
        action: 'updated',
      })
    );
  });

  /**
   * Update meeting status
   * PATCH /meetings/:id/status
   */
  updateMeetingStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, reason } = req.body;

    const result = await meetingService.updateMeetingStatus(id, status, reason);

    res.status(200).json(
      sendSuccessResponse(result, {
        timestamp: new Date().toISOString(),
        version: 'v1',
        action: 'statusUpdated',
      })
    );
  });

  /**
   * Reschedule meeting
   * POST /meetings/:id/reschedule
   */
  rescheduleMeeting = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const result = await meetingService.rescheduleMeeting(id, data);

    res.status(200).json(
      sendSuccessResponse(result, {
        timestamp: new Date().toISOString(),
        version: 'v1',
        action: 'rescheduled',
      })
    );
  });

  /**
   * Delete meeting
   * DELETE /meetings/:id
   */
  deleteMeeting = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await meetingService.deleteMeeting(id);

    res.status(200).json(
      sendSuccessResponse(result, {
        timestamp: new Date().toISOString(),
        version: 'v1',
        action: 'deleted',
      })
    );
  });

  /**
   * Get mentor's calendar
   * GET /meetings/calendar/:mentorId
   */
  getMentorCalendar = asyncHandler(async (req, res) => {
    const { mentorId } = req.params;
    const { fromDate, toDate } = req.query;

    if (!fromDate || !toDate) {
      const error = new Error('fromDate and toDate are required');
      error.statusCode = 400;
      throw error;
    }

    const calendar = await meetingService.getMentorCalendar(
      mentorId,
      fromDate,
      toDate
    );

    res.status(200).json(
      sendSuccessResponse(calendar, {
        timestamp: new Date().toISOString(),
        version: 'v1',
      })
    );
  });
}

export default new MeetingController();
