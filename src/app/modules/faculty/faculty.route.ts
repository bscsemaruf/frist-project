import express from 'express';
import { FacultyControllers } from './faculty.controller';

const router = express.Router();

router.get('/:facultyId', FacultyControllers.getSingleFaculty);
router.get('/', FacultyControllers.getAllFaculties);

router.delete('/:studentId', FacultyControllers.deleteFaculty);

export const FacultyRoutes = router;
