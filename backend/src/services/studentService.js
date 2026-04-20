import prisma from '../config/database.js';
import { AppError } from '../utils/errorResponse.js';
import logger from '../utils/logger.js';

class StudentService {
  async createStudent(data) {
    try {
      const existingStudent = await prisma.student.findUnique({
        where: { email: data.email },
      });

      if (existingStudent) {
        throw new AppError('DUPLICATE_EMAIL', 409, 'Student with this email already exists');
      }

      const student = await prisma.student.create({
        data: {
          email: data.email,
          name: data.name,
          dateOfBirth: data.dateOfBirth,
          status: 'ACTIVE',
        },
      });

      logger.info(`Student created: ${student.id}`);
      return student;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error creating student', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to create student');
    }
  }

  async getStudentById(id) {
    try {
      const student = await prisma.student.findUnique({
        where: { id },
        include: {
          progressRecords: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              creditsEarned: true,
              gpa: true,
              status: true,
            }
          }
        }
      });

      if (!student) {
        throw new AppError('STUDENT_NOT_FOUND', 404, `Student with ID ${id} not found`);
      }

      // Transform to flatten progress into student object
      const transformedStudent = {
        ...student,
        creditsCompleted: student.progressRecords[0]?.creditsEarned || 0,
        progressRecords: undefined
      };

      return transformedStudent;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching student', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to fetch student');
    }
  }

  async getStudentFullProfile(id) {
    try {
      const student = await prisma.student.findUnique({
        where: { id },
        include: {
          mentor: {
            select: {
              id: true,
              name: true,
              email: true,
              expertise: true,
              department: true,
            },
          },
          scholarships: {
            include: {
              scholarship: {
                select: {
                  id: true,
                  name: true,
                  amount: true,
                  startDate: true,
                  endDate: true,
                  status: true,
                },
              },
            },
          },
          progressRecords: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          meetings: {
            orderBy: { date: 'desc' },
            take: 10,
            include: {
              mentor: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          courses: {
            include: {
              course: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                  credits: true,
                  semester: true,
                  major: true,
                },
              },
            },
            orderBy: [{ academicYear: 'desc' }, { semester: 'desc' }],
          },
        },
      });

      if (!student) {
        throw new AppError('STUDENT_NOT_FOUND', 404, `Student with ID ${id} not found`);
      }

      // Transform scholarships data to match API response format
      const transformedStudent = {
        ...student,
        scholarships: student.scholarships.map((assignment) => ({
          id: assignment.id,
          scholarshipId: assignment.scholarship.id,
          scholarshipName: assignment.scholarship.name,
          amount: assignment.scholarship.amount,
          status: assignment.status,
          awardedAmount: assignment.awardedAmount,
          awardedDate: assignment.awardedDate,
          startDate: assignment.scholarship.startDate,
          endDate: assignment.scholarship.endDate,
        })),
        courses: student.courses.map((enrollment) => ({
          id: enrollment.id,
          courseId: enrollment.course.id,
          code: enrollment.course.code,
          name: enrollment.course.name,
          credits: enrollment.course.credits,
          semester: enrollment.semester,
          academicYear: enrollment.academicYear,
          grade: enrollment.grade,
          status: enrollment.status,
          major: enrollment.course.major,
        })),
      };

      logger.info(`Full profile fetched for student: ${id}`);
      return transformedStudent;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching student full profile', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to fetch student profile');
    }
  }

  async getStudentCourses(id) {
    try {
      const courses = await prisma.studentCourse.findMany({
        where: { studentId: id },
        include: {
          course: {
            select: {
              id: true,
              code: true,
              name: true,
              credits: true,
              semester: true,
              major: true,
            },
          },
        },
        orderBy: [{ academicYear: 'desc' }, { semester: 'desc' }],
      });

      if (!courses || courses.length === 0) {
        return [];
      }

      return courses.map((enrollment) => ({
        id: enrollment.id,
        courseId: enrollment.course.id,
        code: enrollment.course.code,
        name: enrollment.course.name,
        credits: enrollment.course.credits,
        semester: enrollment.semester,
        academicYear: enrollment.academicYear,
        grade: enrollment.grade,
        status: enrollment.status,
        major: enrollment.course.major,
      }));
    } catch (error) {
      logger.error('Error fetching student courses', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to fetch student courses');
    }
  }

  async getAllStudents(page = 1, limit = 20, status, search, major) {
    try {
      const skip = (page - 1) * limit;
      
      // Build where clause with non-empty filters
      const whereClause = {};
      
      if (status && status.trim() !== '') {
        whereClause.status = status;
      }
      
      if (search && search.trim() !== '') {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }
      
      // Filter by major
      if (major && major.trim() !== '') {
        whereClause.major = major;
      }

      const [students, total] = await Promise.all([
        prisma.student.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            progressRecords: {
              orderBy: { createdAt: 'desc' },
              take: 1, // Get latest progress record
              select: {
                creditsEarned: true,
                gpa: true,
                status: true,
              }
            }
          }
        }),
        prisma.student.count({ where: whereClause }),
      ]);

      // Transform data to flatten progress into student object
      const transformedStudents = students.map(student => ({
        ...student,
        creditsCompleted: student.progressRecords[0]?.creditsEarned || 0,
        progressRecords: undefined // Remove the array after extracting data
      }));

      return {
        data: transformedStudents,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching students', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to fetch students');
    }
  }

  async updateStudent(id, data) {
    try {
      await this.getStudentById(id);

      const updatedStudent = await prisma.student.update({
        where: { id },
        data: {
          ...(data.email && { email: data.email }),
          ...(data.name && { name: data.name }),
          ...(data.dateOfBirth && { dateOfBirth: data.dateOfBirth }),
          ...(data.status && { status: data.status }),
        },
      });

      logger.info(`Student updated: ${id}`);
      return updatedStudent;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating student', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to update student');
    }
  }

  async deleteStudent(id) {
    try {
      await this.getStudentById(id);

      await prisma.student.delete({
        where: { id },
      });

      logger.info(`Student deleted: ${id}`);
      return { message: 'Student deleted successfully' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting student', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to delete student');
    }
  }

  async getStudentScholarships(id) {
    try {
      const student = await this.getStudentById(id);

      const scholarships = await prisma.studentScholarship.findMany({
        where: { studentId: id },
        include: {
          scholarship: {
            select: {
              id: true,
              name: true,
              amount: true,
              description: true,
              startDate: true,
              endDate: true,
              status: true,
            },
          },
        },
        orderBy: { awardedDate: 'desc' },
      });

      return scholarships.map((assignment) => ({
        id: assignment.id,
        scholarshipId: assignment.scholarship.id,
        scholarshipName: assignment.scholarship.name,
        amount: assignment.scholarship.amount,
        description: assignment.scholarship.description,
        awardedAmount: assignment.awardedAmount,
        awardedDate: assignment.awardedDate,
        status: assignment.status,
        startDate: assignment.scholarship.startDate,
        endDate: assignment.scholarship.endDate,
      }));
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching student scholarships', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to fetch scholarships');
    }
  }

  async getStudentMeetings(id) {
    try {
      const student = await this.getStudentById(id);

      const meetings = await prisma.meeting.findMany({
        where: {
          OR: [
            { studentId: id },
            { mentorId: student.mentorId },
          ],
        },
        include: {
          mentor: {
            select: {
              id: true,
              name: true,
              email: true,
              expertise: true,
            },
          },
        },
        orderBy: { date: 'desc' },
        take: 10,
      });

      return meetings || [];
    } catch (error) {
      logger.warn('Error fetching student meetings (may not exist)', error);
      return []; // Return empty array if meetings table doesn't exist
    }
  }

  async getStudentMentor(id) {
    try {
      const student = await prisma.student.findUnique({
        where: { id },
        include: {
          mentor: {
            select: {
              id: true,
              name: true,
              email: true,
              expertise: true,
              department: true,
            },
          },
        },
      });

      if (!student) {
        throw new AppError('STUDENT_NOT_FOUND', 404, `Student with ID ${id} not found`);
      }

      return student.mentor || { message: 'No mentor assigned' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching student mentor', error);
      throw new AppError('DATABASE_ERROR', 500, 'Failed to fetch mentor info');
    }
  }
}

export default new StudentService();
