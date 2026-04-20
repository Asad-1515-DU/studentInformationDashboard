import prisma from '../config/database.js';
import { AppError } from '../utils/errorResponse.js';
import logger from '../utils/logger.js';

class MeetingService {
  /**
   * Schedule a new meeting
   * @param {Object} data - Meeting data {studentId, mentorId, date, duration, notes, status}
   * @returns {Promise<Object>} Created meeting
   */
  async scheduleMeeting(data) {
    try {
      // Validate student exists
      const student = await prisma.student.findUnique({
        where: { id: data.studentId },
      });

      if (!student) {
        throw new AppError(
          'STUDENT_NOT_FOUND',
          404,
          'Student not found'
        );
      }

      // Validate mentor exists
      const mentor = await prisma.mentor.findUnique({
        where: { id: data.mentorId },
      });

      if (!mentor) {
        throw new AppError(
          'MENTOR_NOT_FOUND',
          404,
          'Mentor not found'
        );
      }

      // Validate date and time
      const meetingDate = new Date(data.date);
      const now = new Date();

      if (meetingDate <= now) {
        throw new AppError(
          'INVALID_DATE',
          400,
          'Meeting date must be in the future'
        );
      }

      // Validate duration (15-480 minutes = 15 min to 8 hours)
      const duration = parseInt(data.duration);
      if (duration < 15 || duration > 480) {
        throw new AppError(
          'INVALID_DURATION',
          422,
          'Meeting duration must be between 15 and 480 minutes'
        );
      }

      // Check for time conflicts with mentor's other meetings
      const meetingEndTime = new Date(
        meetingDate.getTime() + duration * 60000
      );

      const conflicts = await prisma.meeting.findMany({
        where: {
          mentorId: data.mentorId,
          status: { in: ['SCHEDULED', 'RESCHEDULED'] },
          AND: [
            {
              date: {
                lt: meetingEndTime,
              },
            },
            {
              date: {
                gte: new Date(meetingDate.getTime() - 480 * 60000), // Check 8 hours before
              },
            },
          ],
        },
      });

      if (conflicts.length > 0) {
        throw new AppError(
          'MEETING_TIME_CONFLICT',
          409,
          'Mentor has conflicting meetings at this time',
          {
            conflicts: conflicts.map((meeting) => ({
              meetingId: meeting.id,
              conflictDate: meeting.date,
            })),
          }
        );
      }

      // Create meeting
      const meeting = await prisma.meeting.create({
        data: {
          studentId: data.studentId,
          mentorId: data.mentorId,
          date: meetingDate,
          duration,
          notes: data.notes || null,
          status: 'SCHEDULED',
        },
        include: {
          student: {
            select: { id: true, name: true, email: true },
          },
          mentor: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      const transformedMeeting = {
        id: meeting.id,
        studentId: meeting.student.id,
        studentName: meeting.student.name,
        mentorId: meeting.mentor.id,
        mentorName: meeting.mentor.name,
        date: meeting.date,
        duration: meeting.duration,
        status: meeting.status,
        notes: meeting.notes,
        createdAt: meeting.createdAt,
        updatedAt: meeting.updatedAt,
      };

      logger.info(
        `Meeting scheduled: ${meeting.id} between student ${data.studentId} and mentor ${data.mentorId}`
      );
      return transformedMeeting;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error scheduling meeting', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to schedule meeting');
    }
  }

  /**
   * Get meeting by ID
   * @param {string} id - Meeting ID
   * @returns {Promise<Object>} Meeting details
   */
  async getMeetingById(id) {
    try {
      const meeting = await prisma.meeting.findUnique({
        where: { id },
        include: {
          student: {
            select: { id: true, name: true, email: true },
          },
          mentor: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      if (!meeting) {
        throw new AppError(
          'MEETING_NOT_FOUND',
          404,
          `Meeting with ID ${id} not found`
        );
      }

      logger.info(`Meeting fetched: ${id}`);
      return meeting;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching meeting', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to fetch meeting');
    }
  }

  /**
   * Get all meetings with pagination and filtering
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {Object} filters - Filter options {status, studentId, mentorId, fromDate, toDate}
   * @returns {Promise<Object>} Meetings with pagination
   */
  async getAllMeetings(page = 1, limit = 20, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const whereClause = {};

      if (filters.status) {
        whereClause.status = filters.status;
      }

      if (filters.studentId) {
        whereClause.studentId = filters.studentId;
      }

      if (filters.mentorId) {
        whereClause.mentorId = filters.mentorId;
      }

      if (filters.fromDate || filters.toDate) {
        whereClause.date = {};
        if (filters.fromDate) {
          whereClause.date.gte = new Date(filters.fromDate);
        }
        if (filters.toDate) {
          whereClause.date.lte = new Date(filters.toDate);
        }
      }

      const [meetings, total] = await Promise.all([
        prisma.meeting.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { date: filters.sortOrder === 'asc' ? 'asc' : 'desc' },
          include: {
            student: {
              select: { id: true, name: true, email: true },
            },
            mentor: {
              select: { id: true, name: true, email: true },
            },
          },
        }),
        prisma.meeting.count({ where: whereClause }),
      ]);

      logger.info(`Meetings fetched: page ${page}, total ${total}`);
      return {
        data: meetings,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching meetings', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to fetch meetings');
    }
  }

  /**
   * Update meeting details (only for SCHEDULED status)
   * @param {string} id - Meeting ID
   * @param {Object} data - Updated data {date, duration, notes}
   * @returns {Promise<Object>} Updated meeting
   */
  async updateMeeting(id, data) {
    try {
      const meeting = await prisma.meeting.findUnique({
        where: { id },
      });

      if (!meeting) {
        throw new AppError('MEETING_NOT_FOUND', 404, 'Meeting not found');
      }

      if (meeting.status !== 'SCHEDULED') {
        throw new AppError(
          'CANNOT_UPDATE_MEETING',
          422,
          'Can only update SCHEDULED meetings'
        );
      }

      // Validate new date if provided
      if (data.date) {
        const newDate = new Date(data.date);
        const now = new Date();
        if (newDate <= now) {
          throw new AppError(
            'INVALID_DATE',
            400,
            'Meeting date must be in the future'
          );
        }

        // Check for conflicts with new date
        const duration = data.duration || meeting.duration;
        const meetingEndTime = new Date(newDate.getTime() + duration * 60000);

        const conflicts = await prisma.meeting.findMany({
          where: {
            mentorId: meeting.mentorId,
            id: { not: id },
            status: { in: ['SCHEDULED', 'RESCHEDULED'] },
            AND: [
              { date: { lt: meetingEndTime } },
              { date: { gte: new Date(newDate.getTime() - 480 * 60000) } },
            ],
          },
        });

        if (conflicts.length > 0) {
          throw new AppError(
            'MEETING_TIME_CONFLICT',
            409,
            'Mentor has conflicting meetings at the new time'
          );
        }
      }

      // Validate duration if provided
      if (data.duration) {
        const duration = parseInt(data.duration);
        if (duration < 15 || duration > 480) {
          throw new AppError(
            'INVALID_DURATION',
            422,
            'Meeting duration must be between 15 and 480 minutes'
          );
        }
      }

      const updated = await prisma.meeting.update({
        where: { id },
        data: {
          ...(data.date && { date: new Date(data.date) }),
          ...(data.duration && { duration: parseInt(data.duration) }),
          ...(data.notes !== undefined && { notes: data.notes }),
        },
        include: {
          student: {
            select: { id: true, name: true, email: true },
          },
          mentor: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      logger.info(`Meeting updated: ${id}`);
      return updated;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating meeting', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to update meeting');
    }
  }

  /**
   * Update meeting status
   * @param {string} id - Meeting ID
   * @param {string} newStatus - New status {COMPLETED, CANCELLED, RESCHEDULED}
   * @param {string} reason - Reason for status change (required for CANCELLED/RESCHEDULED)
   * @returns {Promise<Object>} Updated meeting
   */
  async updateMeetingStatus(id, newStatus, reason) {
    try {
      const meeting = await prisma.meeting.findUnique({
        where: { id },
      });

      if (!meeting) {
        throw new AppError('MEETING_NOT_FOUND', 404, 'Meeting not found');
      }

      // Validate status transition
      const validTransitions = {
        SCHEDULED: ['COMPLETED', 'CANCELLED', 'RESCHEDULED'],
        COMPLETED: ['CANCELLED'],
        CANCELLED: [],
        RESCHEDULED: ['SCHEDULED'],
      };

      if (
        !validTransitions[meeting.status] ||
        !validTransitions[meeting.status].includes(newStatus)
      ) {
        throw new AppError(
          'INVALID_STATUS_TRANSITION',
          422,
          `Cannot transition from ${meeting.status} to ${newStatus}`
        );
      }

      // Require reason for CANCELLED or RESCHEDULED
      if (
        (newStatus === 'CANCELLED' || newStatus === 'RESCHEDULED') &&
        !reason
      ) {
        throw new AppError(
          'REASON_REQUIRED',
          400,
          `Reason is required when ${newStatus.toLowerCase()}ing a meeting`
        );
      }

      const updated = await prisma.meeting.update({
        where: { id },
        data: {
          status: newStatus,
          cancelReason: newStatus === 'CANCELLED' ? reason : null,
          rescheduleReason: newStatus === 'RESCHEDULED' ? reason : null,
        },
      });

      logger.info(
        `Meeting ${id} status updated to ${newStatus}`
      );
      return {
        id: updated.id,
        status: updated.status,
        previousStatus: meeting.status,
        reason: reason || null,
        updatedAt: updated.updatedAt,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating meeting status', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to update meeting status');
    }
  }

  /**
   * Reschedule meeting to new date/time
   * @param {string} id - Meeting ID
   * @param {Object} data - {newDate, newDuration, reason}
   * @returns {Promise<Object>} Rescheduled meeting
   */
  async rescheduleMeeting(id, data) {
    try {
      const meeting = await prisma.meeting.findUnique({
        where: { id },
      });

      if (!meeting) {
        throw new AppError('MEETING_NOT_FOUND', 404, 'Meeting not found');
      }

      if (meeting.status !== 'SCHEDULED') {
        throw new AppError(
          'CANNOT_RESCHEDULE',
          422,
          'Can only reschedule SCHEDULED meetings'
        );
      }

      const newDate = new Date(data.newDate);
      const now = new Date();

      if (newDate <= now) {
        throw new AppError(
          'INVALID_DATE',
          400,
          'New meeting date must be in the future'
        );
      }

      const newDuration = data.newDuration || meeting.duration;
      if (newDuration < 15 || newDuration > 480) {
        throw new AppError(
          'INVALID_DURATION',
          422,
          'Meeting duration must be between 15 and 480 minutes'
        );
      }

      // Check for conflicts
      const meetingEndTime = new Date(newDate.getTime() + newDuration * 60000);
      const conflicts = await prisma.meeting.findMany({
        where: {
          mentorId: meeting.mentorId,
          id: { not: id },
          status: { in: ['SCHEDULED', 'RESCHEDULED'] },
          AND: [
            { date: { lt: meetingEndTime } },
            { date: { gte: new Date(newDate.getTime() - 480 * 60000) } },
          ],
        },
      });

      if (conflicts.length > 0) {
        throw new AppError(
          'MEETING_TIME_CONFLICT',
          409,
          'Mentor has conflicting meetings at the new time'
        );
      }

      const updated = await prisma.meeting.update({
        where: { id },
        data: {
          date: newDate,
          duration: newDuration,
          status: 'RESCHEDULED',
          rescheduleReason: data.reason || null,
        },
      });

      logger.info(`Meeting ${id} rescheduled to ${newDate}`);
      return {
        id: updated.id,
        originalDate: meeting.date,
        newDate: updated.date,
        newDuration: updated.duration,
        status: updated.status,
        reason: data.reason || null,
        rescheduledAt: updated.updatedAt,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error rescheduling meeting', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to reschedule meeting');
    }
  }

  /**
   * Delete meeting (only for SCHEDULED status)
   * @param {string} id - Meeting ID
   * @returns {Promise<Object>} Confirmation
   */
  async deleteMeeting(id) {
    try {
      const meeting = await prisma.meeting.findUnique({
        where: { id },
      });

      if (!meeting) {
        throw new AppError('MEETING_NOT_FOUND', 404, 'Meeting not found');
      }

      if (meeting.status !== 'SCHEDULED') {
        throw new AppError(
          'CANNOT_DELETE_MEETING',
          422,
          'Can only delete SCHEDULED meetings'
        );
      }

      await prisma.meeting.delete({
        where: { id },
      });

      logger.info(`Meeting ${id} deleted`);
      return {
        message: 'Meeting cancelled successfully',
        id,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting meeting', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to delete meeting');
    }
  }

  /**
   * Get mentor's calendar with availability
   * @param {string} mentorId - Mentor ID
   * @param {string} fromDate - Start date (ISO8601)
   * @param {string} toDate - End date (ISO8601)
   * @returns {Promise<Object>} Calendar with meetings and available slots
   */
  async getMentorCalendar(mentorId, fromDate, toDate) {
    try {
      // Verify mentor exists
      const mentor = await prisma.mentor.findUnique({
        where: { id: mentorId },
      });

      if (!mentor) {
        throw new AppError('MENTOR_NOT_FOUND', 404, 'Mentor not found');
      }

      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);

      // Get all meetings in date range
      const meetings = await prisma.meeting.findMany({
        where: {
          mentorId,
          status: { in: ['SCHEDULED', 'RESCHEDULED'] },
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          student: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { date: 'asc' },
      });

      // Calculate available slots (simplified: full day minus booked meetings)
      const availableSlots = this._calculateAvailableSlots(
        startDate,
        endDate,
        meetings
      );

      logger.info(`Calendar fetched for mentor ${mentorId}`);
      return {
        mentorId,
        mentorName: mentor.name,
        dateRange: {
          from: startDate,
          to: endDate,
        },
        meetings: meetings.map((m) => ({
          id: m.id,
          date: m.date,
          duration: m.duration,
          status: m.status,
          studentId: m.student.id,
          studentName: m.student.name,
          isFree: false,
        })),
        availableSlots,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching mentor calendar', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to fetch calendar');
    }
  }

  /**
   * Calculate available time slots (internal helper)
   */
  _calculateAvailableSlots(startDate, endDate, meetings) {
    const slots = [];
    const workStartHour = 9; // 9 AM
    const workEndHour = 17; // 5 PM
    const minSlotDuration = 15; // 15 minutes

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        const dayMeetings = meetings.filter(
          (m) =>
            m.date.toDateString() === currentDate.toDateString()
        );

        // Simple available slot: morning and afternoon if no meetings
        if (dayMeetings.length === 0) {
          slots.push({
            date: currentDate.toISOString().split('T')[0],
            startTime: `${workStartHour}:00`,
            endTime: `${workEndHour}:00`,
          });
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return slots;
  }
}

export default new MeetingService();
