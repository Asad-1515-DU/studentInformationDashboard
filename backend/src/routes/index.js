import { Router } from 'express';
import studentRoutes from './studentRoutes.js';
import mentorRoutes from './mentorRoutes.js';
import scholarshipRoutes from './scholarshipRoutes.js';
import meetingRoutes from './meetingRoutes.js';

const routes = Router();

routes.use('/students', studentRoutes);
routes.use('/mentors', mentorRoutes);
routes.use('/scholarships', scholarshipRoutes);
routes.use('/meetings', meetingRoutes);

export default routes;
