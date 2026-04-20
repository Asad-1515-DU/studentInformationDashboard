import prisma from '../config/database.js';
import { AppError } from '../utils/errorResponse.js';
import logger from '../utils/logger.js';

class MentorService {
  /**
   * Get all mentors with optional filtering and pagination
   * @param {number} page - Current page
   * @param {number} limit - Items per page
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Mentors with pagination
   */
  async getAllMentors(page = 1, limit = 20, filters = {}) {
    try {
      const skip = (page - 1) * limit;

      // Build where clause
      const where = {};
      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { email: { contains: filters.search, mode: 'insensitive' } },
          { expertise: { contains: filters.search, mode: 'insensitive' } },
        ];
      }
      if (filters.availability) {
        where.availability = filters.availability;
      }
      if (filters.department) {
        where.department = filters.department;
      }

      // Get total count
      const total = await prisma.mentor.count({ where });

      // Get mentors
      const mentors = await prisma.mentor.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          expertise: true,
          phone: true,
          department: true,
          availability: true,
          maxStudents: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { name: 'asc' },
      });

      return {
        data: mentors,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching mentors', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to fetch mentors');
    }
  }

  /**
   * Get a single mentor by ID
   * @param {string} id - Mentor ID
   * @returns {Promise<Object>} Mentor details
   */
  async getMentorById(id) {
    try {
      const mentor = await prisma.mentor.findUnique({
        where: { id },
        include: {
          students: {
            select: {
              id: true,
              name: true,
              email: true,
              major: true,
              status: true,
            },
          },
          meetings: {
            select: {
              id: true,
              date: true,
              duration: true,
              status: true,
              student: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: { date: 'desc' },
            take: 10,
          },
        },
      });

      if (!mentor) {
        throw new AppError(
          'MENTOR_NOT_FOUND',
          404,
          `Mentor with ID ${id} not found`
        );
      }

      return mentor;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching mentor', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to fetch mentor');
    }
  }
}

export default new MentorService();
