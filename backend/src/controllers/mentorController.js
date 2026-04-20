import mentorService from '../services/mentorService.js';
import { sendSuccessResponse } from '../utils/errorResponse.js';
import { asyncHandler } from '../middleware/errorHandler.js';

class MentorController {
  /**
   * Get all mentors with pagination and filtering
   * GET /mentors
   */
  getAllMentors = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const filters = {
      search: req.query.search,
      availability: req.query.availability,
      department: req.query.department,
    };

    const result = await mentorService.getAllMentors(page, limit, filters);

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
   * Get mentor by ID
   * GET /mentors/:id
   */
  getMentorById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const mentor = await mentorService.getMentorById(id);

    res.status(200).json(
      sendSuccessResponse(mentor, {
        timestamp: new Date().toISOString(),
        version: 'v1',
      })
    );
  });
}

export default new MentorController();
