import { Router } from 'express';
import studentController from '../controllers/studentController.js';
import { validateRequest, studentValidationSchemas } from '../utils/validators.js';

const router = Router();

router.post('/', validateRequest(studentValidationSchemas.create), studentController.createStudent);
router.get('/', validateRequest(studentValidationSchemas.list), studentController.getAllStudents);
router.get('/:id/profile', validateRequest(studentValidationSchemas.getById), studentController.getStudentFullProfile);
router.get('/:id/scholarships', validateRequest(studentValidationSchemas.getById), studentController.getStudentScholarships);
router.get('/:id/meetings', validateRequest(studentValidationSchemas.getById), studentController.getStudentMeetings);
router.get('/:id/courses', validateRequest(studentValidationSchemas.getById), studentController.getStudentCourses);
router.get('/:id/mentors', validateRequest(studentValidationSchemas.getById), studentController.getStudentMentor);
router.get('/:id', validateRequest(studentValidationSchemas.getById), studentController.getStudentById);
router.put('/:id', validateRequest(studentValidationSchemas.update), studentController.updateStudent);
router.delete('/:id', validateRequest(studentValidationSchemas.getById), studentController.deleteStudent);

export default router;
