import { Router } from 'express';
import scholarshipController from '../controllers/scholarshipController.js';

const scholarshipRoutes = Router();

/**
 * Scholarship Routes
 * Base path: /api/v1/scholarships
 */

// Create scholarship
scholarshipRoutes.post('/', scholarshipController.createScholarship);

// Get all scholarships with filtering
scholarshipRoutes.get('/', scholarshipController.getAllScholarships);

// Get scholarship by ID
scholarshipRoutes.get('/:id', scholarshipController.getScholarshipById);

// Update scholarship
scholarshipRoutes.put('/:id', scholarshipController.updateScholarship);

// Update scholarship status
scholarshipRoutes.patch('/:id/status', scholarshipController.updateScholarshipStatus);

// Assign scholarship to student
scholarshipRoutes.post('/:id/assign', scholarshipController.assignToStudent);

// Get students assigned to scholarship
scholarshipRoutes.get('/:id/students', scholarshipController.getAwardees);

// Revoke scholarship from student
scholarshipRoutes.delete('/:id/assign/:assignmentId', scholarshipController.revokeFromStudent);

export default scholarshipRoutes;
