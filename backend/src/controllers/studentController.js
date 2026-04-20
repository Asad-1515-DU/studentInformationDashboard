import studentService from '../services/studentService.js';
import { sendSuccessResponse } from '../utils/errorResponse.js';
import { asyncHandler } from '../middleware/errorHandler.js';

class StudentController {
  createStudent = asyncHandler(async (req, res) => {
    const data = req.body;
    const student = await studentService.createStudent(data);

    res.status(201).json(
      sendSuccessResponse(student, {
        timestamp: new Date().toISOString(),
        version: 'v1',
      })
    );
  });

  getStudentById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const student = await studentService.getStudentById(id);

    res.status(200).json(
      sendSuccessResponse(student, {
        timestamp: new Date().toISOString(),
        version: 'v1',
      })
    );
  });

  getStudentFullProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const student = await studentService.getStudentFullProfile(id);

    res.status(200).json(
      sendSuccessResponse(student, {
        timestamp: new Date().toISOString(),
        version: 'v1',
        includesRelated: ['mentor', 'scholarships', 'progressRecords', 'meetings'],
      })
    );
  });

  getAllStudents = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const search = req.query.search;
    const major = req.query.major;

    const result = await studentService.getAllStudents(page, limit, status, search, major);

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

  updateStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const student = await studentService.updateStudent(id, data);

    res.status(200).json(
      sendSuccessResponse(student, {
        timestamp: new Date().toISOString(),
        version: 'v1',
      })
    );
  });

  deleteStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await studentService.deleteStudent(id);

    res.status(200).json(
      sendSuccessResponse(result, {
        timestamp: new Date().toISOString(),
        version: 'v1',
      })
    );
  });

  getStudentScholarships = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const scholarships = await studentService.getStudentScholarships(id);

    res.status(200).json({
      success: true,
      data: scholarships,
      meta: {
        timestamp: new Date().toISOString(),
        version: 'v1',
      },
    });
  });

  getStudentMeetings = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const meetings = await studentService.getStudentMeetings(id);

    res.status(200).json({
      success: true,
      data: meetings,
      meta: {
        timestamp: new Date().toISOString(),
        version: 'v1',
      },
    });
  });

  getStudentMentor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const mentorInfo = await studentService.getStudentMentor(id);

    res.status(200).json({
      success: true,
      data: mentorInfo,
      meta: {
        timestamp: new Date().toISOString(),
        version: 'v1',
      },
    });
  });

  getStudentCourses = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const courses = await studentService.getStudentCourses(id);

    res.status(200).json({
      success: true,
      data: courses,
      meta: {
        timestamp: new Date().toISOString(),
        version: 'v1',
      },
    });
  });
}

export default new StudentController();
