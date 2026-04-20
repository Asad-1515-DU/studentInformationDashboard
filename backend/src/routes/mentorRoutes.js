import { Router } from 'express';
import mentorController from '../controllers/mentorController.js';

const mentorRoutes = Router();

/**
 * Mentor Routes
 * Base path: /api/v1/mentors
 */

// Get all mentors with filtering
mentorRoutes.get('/', mentorController.getAllMentors);

// Get mentor by ID
mentorRoutes.get('/:id', mentorController.getMentorById);

export default mentorRoutes;
