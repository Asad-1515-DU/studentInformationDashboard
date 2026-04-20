import prisma from '../config/database.js';
import { AppError } from '../utils/errorResponse.js';
import logger from '../utils/logger.js';

class ScholarshipService {
  /**
   * Create a new scholarship program
   * @param {Object} data - Scholarship data {name, amount, startDate, endDate, description, maxAwardees, status}
   * @returns {Promise<Object>} Created scholarship
   */
  async createScholarship(data) {
    try {
      // Validate dates
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      if (endDate <= startDate) {
        throw new AppError(
          'INVALID_DATE_RANGE',
          422,
          'End date must be after start date'
        );
      }

      // Check for duplicate scholarship name
      const existingScholarship = await prisma.scholarship.findUnique({
        where: { name: data.name },
      });

      if (existingScholarship) {
        throw new AppError(
          'DUPLICATE_SCHOLARSHIP_NAME',
          409,
          'Scholarship with this name already exists'
        );
      }

      const scholarship = await prisma.scholarship.create({
        data: {
          name: data.name,
          amount: data.amount,
          startDate,
          endDate,
          description: data.description || null,
          maxAwardees: data.maxAwardees || null,
          status: data.status || 'PENDING',
        },
      });

      logger.info(`Scholarship created: ${scholarship.id}`);
      return {
        ...scholarship,
        amount: parseFloat(scholarship.amount), // Convert Decimal to number
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error creating scholarship', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to create scholarship');
    }
  }

  /**
   * Get scholarship by ID with awardee information
   * @param {string} id - Scholarship ID
   * @returns {Promise<Object>} Scholarship with awardees
   */
  async getScholarshipById(id) {
    try {
      const scholarship = await prisma.scholarship.findUnique({
        where: { id },
        include: {
          studentScholarships: {
            where: { status: 'ACTIVE' },
            include: {
              student: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  status: true,
                },
              },
            },
          },
        },
      });

      if (!scholarship) {
        throw new AppError(
          'SCHOLARSHIP_NOT_FOUND',
          404,
          `Scholarship with ID ${id} not found`
        );
      }

      // Transform response
      const transformedScholarship = {
        ...scholarship,
        amount: parseFloat(scholarship.amount), // Convert Decimal to number
        awardedTo: scholarship.studentScholarships.map((assignment) => ({
          assignmentId: assignment.id,
          studentId: assignment.student.id,
          studentName: assignment.student.name,
          email: assignment.student.email,
          awardedAmount: assignment.awardedAmount,
          awardedDate: assignment.awardedDate,
          status: assignment.status,
        })),
        studentScholarships: undefined, // Remove raw data
      };

      logger.info(`Scholarship fetched: ${id}`);
      return transformedScholarship;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching scholarship', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to fetch scholarship');
    }
  }

  /**
   * Get all scholarships with pagination and filtering
   * @param {number} page - Page number (starting from 1)
   * @param {number} limit - Items per page
   * @param {Object} filters - Filter options {status, minAmount, maxAmount, search}
   * @returns {Promise<Object>} Scholarships with pagination
   */
  async getAllScholarships(page = 1, limit = 20, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const whereClause = {};

      if (filters.status && filters.status.trim() !== '') {
        whereClause.status = filters.status;
      }

      if (filters.search && filters.search.trim() !== '') {
        whereClause.name = {
          contains: filters.search,
          mode: 'insensitive',
        };
      }

      // Category field not in schema - ignore if provided
      // if (filters.category && filters.category.trim() !== '') {
      //   whereClause.category = filters.category;
      // }

      const [scholarships, total] = await Promise.all([
        prisma.scholarship.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            description: true,
            amount: true,
            startDate: true,
            endDate: true,
            status: true,
            maxAwardees: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: { studentAssignments: true },
            },
          },
        }),
        prisma.scholarship.count({ where: whereClause }),
      ]);

      const data = scholarships.map((scholarship) => ({
        ...scholarship,
        amount: parseFloat(scholarship.amount), // Convert Decimal to number
        awardeeCount: scholarship._count.studentAssignments,
        _count: undefined,
      }));

      logger.info(`Scholarships fetched: page ${page}, total ${total}`);
      return {
        data,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching scholarships', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to fetch scholarships');
    }
  }

  /**
   * Assign scholarship to a student
   * @param {string} scholarshipId - Scholarship ID
   * @param {string} studentId - Student ID
   * @param {Object} data - {awardedAmount, remarks}
   * @returns {Promise<Object>} Assignment record
   */
  async assignToStudent(scholarshipId, studentId, data = {}) {
    try {
      // Verify scholarship exists
      const scholarship = await prisma.scholarship.findUnique({
        where: { id: scholarshipId },
      });

      if (!scholarship) {
        throw new AppError(
          'SCHOLARSHIP_NOT_FOUND',
          404,
          'Scholarship not found'
        );
      }

      // Verify student exists
      const student = await prisma.student.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        throw new AppError(
          'STUDENT_NOT_FOUND',
          404,
          'Student not found'
        );
      }

      // Check if already assigned
      const existingAssignment = await prisma.studentScholarship.findUnique({
        where: {
          studentId_scholarshipId: { studentId, scholarshipId },
        },
      });

      if (existingAssignment) {
        throw new AppError(
          'ALREADY_ASSIGNED',
          409,
          'Student is already assigned this scholarship'
        );
      }

      // Check max awardees limit
      if (scholarship.maxAwardees) {
        const currentAwardees = await prisma.studentScholarship.count({
          where: {
            scholarshipId,
            status: 'ACTIVE',
          },
        });

        if (currentAwardees >= scholarship.maxAwardees) {
          throw new AppError(
            'MAX_AWARDEES_REACHED',
            409,
            `Maximum number of awardees (${scholarship.maxAwardees}) reached for this scholarship`
          );
        }
      }

      // Validate awarded amount
      const awardedAmount = data.awardedAmount || scholarship.amount;
      if (awardedAmount > scholarship.amount) {
        throw new AppError(
          'AWARDED_AMOUNT_EXCEEDS',
          422,
          'Awarded amount cannot exceed scholarship amount'
        );
      }

      // Create assignment
      const assignment = await prisma.studentScholarship.create({
        data: {
          studentId,
          scholarshipId,
          awardedAmount,
          awardedDate: new Date(),
          status: 'ACTIVE',
          remarks: data.remarks || null,
        },
        include: {
          student: {
            select: { id: true, name: true, email: true },
          },
          scholarship: {
            select: { id: true, name: true, amount: true },
          },
        },
      });

      const transformedAssignment = {
        assignmentId: assignment.id,
        studentId: assignment.student.id,
        studentName: assignment.student.name,
        scholarshipId: assignment.scholarship.id,
        scholarshipName: assignment.scholarship.name,
        scholarshipAmount: assignment.scholarship.amount,
        awardedAmount: assignment.awardedAmount,
        awardedDate: assignment.awardedDate,
        status: assignment.status,
        remarks: assignment.remarks,
      };

      logger.info(
        `Scholarship ${scholarshipId} assigned to student ${studentId}`
      );
      return transformedAssignment;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error assigning scholarship', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to assign scholarship');
    }
  }

  /**
   * Revoke scholarship from student
   * @param {string} scholarshipId - Scholarship ID
   * @param {string} assignmentId - Assignment record ID
   * @returns {Promise<Object>} Confirmation
   */
  async revokeFromStudent(scholarshipId, assignmentId) {
    try {
      // Verify assignment exists and belongs to this scholarship
      const assignment = await prisma.studentScholarship.findUnique({
        where: { id: assignmentId },
      });

      if (!assignment || assignment.scholarshipId !== scholarshipId) {
        throw new AppError(
          'ASSIGNMENT_NOT_FOUND',
          404,
          'Assignment not found'
        );
      }

      // Delete assignment (soft delete possible: update status: 'REVOKED')
      await prisma.studentScholarship.delete({
        where: { id: assignmentId },
      });

      logger.info(`Scholarship assignment ${assignmentId} revoked`);
      return {
        message: 'Scholarship revoked successfully',
        scholarshipId,
        assignmentId,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error revoking scholarship', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to revoke scholarship');
    }
  }

  /**
   * Update scholarship status with workflow validation
   * @param {string} id - Scholarship ID
   * @param {string} newStatus - New status
   * @returns {Promise<Object>} Updated scholarship
   */
  async updateStatus(id, newStatus) {
    try {
      const scholarship = await prisma.scholarship.findUnique({
        where: { id },
      });

      if (!scholarship) {
        throw new AppError(
          'SCHOLARSHIP_NOT_FOUND',
          404,
          'Scholarship not found'
        );
      }

      // Status transition validation
      const validTransitions = {
        PENDING: ['ACTIVE', 'DISCONTINUED'],
        ACTIVE: ['EXPIRED', 'DISCONTINUED'],
        EXPIRED: ['DISCONTINUED'],
        DISCONTINUED: [],
      };

      if (
        !validTransitions[scholarship.status] ||
        !validTransitions[scholarship.status].includes(newStatus)
      ) {
        throw new AppError(
          'INVALID_STATUS_TRANSITION',
          422,
          `Cannot transition from ${scholarship.status} to ${newStatus}`
        );
      }

      const updated = await prisma.scholarship.update({
        where: { id },
        data: { status: newStatus },
      });

      logger.info(`Scholarship ${id} status updated to ${newStatus}`);
      return {
        id: updated.id,
        status: updated.status,
        previousStatus: scholarship.status,
        updatedAt: updated.updatedAt,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating scholarship status', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to update scholarship status');
    }
  }
}

export default new ScholarshipService();
