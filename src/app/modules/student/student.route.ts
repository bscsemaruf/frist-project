import express from 'express';
import { StudentControllers } from './student.controller';

const router = express.Router();
router.post('/create-student', StudentControllers.createStudent);
router.get('/:id', StudentControllers.getSingleStudent);
router.get('/', StudentControllers.getAllStudents);

export const StudentRoutes = router;
