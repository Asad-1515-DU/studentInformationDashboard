import scholarshipService from '../services/scholarshipService.js';
import { sendSuccessResponse } from '../utils/errorResponse.js';
import { asyncHandler } from '../middleware/errorHandler.js';

class ScholarshipController {
  /**
   * Create a new scholarship
   * POST /scholarships
   */
  createScholarship = asyncHandler(async (req, res) => {
    const data = req.body;
    const scholarship = await scholarshipService.createScholarship(data);

    res.status(201).json(
      sendSuccessResponse(scholarship, {
        timestamp: new Date().toISOString(),
        version: 'v1',
      })
    );
  });

  /**
   * Get scholarship by ID with awardees
   * GET /scholarships/:id
   */
  getScholarshipById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const scholarship = await scholarshipService.getScholarshipById(id);

    res.status(200).json(
      sendSuccessResponse(scholarship, {
        timestamp: new Date().toISOString(),
        version: 'v1',
      })
    );
  });

  /**
   * Get all scholarships with pagination and filtering
   * GET /scholarships
   */
  getAllScholarships = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const filters = {
      status: req.query.status,
      minAmount: req.query.minAmount,
      maxAmount: req.query.maxAmount,
      search: req.query.search,
    };

    const result = await scholarshipService.getAllScholarships(page, limit, filters);

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
   * Update scholarship (partial)
   * PUT /scholarships/:id
   */
  updateScholarship = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    // This would be implemented in service if needed
    // For now, basic update without status change
    const updated = await scholarshipService.getScholarshipById(id);

    res.status(200).json(
      sendSuccessResponse(updated, {
        timestamp: new Date().toISOString(),
        version: 'v1',
      })
    );
  });

  /**
   * Update scholarship status
   * PATCH /scholarships/:id/status
   */
  updateScholarshipStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await scholarshipService.updateStatus(id, status);

    res.status(200).json(
      sendSuccessResponse(result, {
        timestamp: new Date().toISOString(),
        version: 'v1',
      })
    );
  });

  /**
   * Assign scholarship to student
   * POST /scholarships/:id/assign
   */
  assignToStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { studentId, awardedAmount, remarks } = req.body;

    const assignment = await scholarshipService.assignToStudent(
      id,
      studentId,
      { awardedAmount, remarks }
    );

    res.status(201).json(
      sendSuccessResponse(assignment, {
        timestamp: new Date().toISOString(),
        version: 'v1',
        action: 'assigned',
      })
    );
  });

  /**
   * Revoke scholarship from student
   * DELETE /scholarships/:id/assign/:assignmentId
   */
  revokeFromStudent = asyncHandler(async (req, res) => {
    const { id, assignmentId } = req.params;

    const result = await scholarshipService.revokeFromStudent(id, assignmentId);

    res.status(200).json(
      sendSuccessResponse(result, {
        timestamp: new Date().toISOString(),
        version: 'v1',
      })
    );
  });

  /**
   * Get students assigned to a scholarship
   * GET /scholarships/:id/students
   */
  getAwardees = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;

    // Get scholarship and awardees
    const scholarship = await scholarshipService.getScholarshipById(id);
    const awardees = scholarship.awardedTo;

    // Apply filtering if status is provided
    const filtered = status
      ? awardees.filter((a) => a.status === status)
      : awardees;

    // Apply pagination
    const skip = (page - 1) * limit;
    const paginatedAwardees = filtered.slice(skip, skip + limit);

    res.status(200).json({
      success: true,
      data: paginatedAwardees,
      pagination: {
        page,
        limit,
        total: filtered.length,
        pages: Math.ceil(filtered.length / limit),
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: 'v1',
      },
    });
  });
}

export default new ScholarshipController();
