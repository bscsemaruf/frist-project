import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';
import { catchAsync } from '../../utils/catchAsync';

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourseIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is created successfullly',
    data: result,
  });
});

const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.getSingleCourseFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Course is found successfullly',
    data: result,
  });
});

const getAllCourses = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCoursesFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Courses are found successfullly',
    data: result,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await CourseServices.updateCoruseIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course update is successfull',
    data: result,
  });
});

const deleteCourse = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await CourseServices.deleteCourseIntoDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is deleted successfullly',
    data: result,
  });
});

const assignFacultiesToCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  const result = await CourseServices.assignFacultiesToCourseIntoDB(
    courseId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assign faculties to course successfullly',
    data: result,
  });
});

const removeFacultiesFromCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  const result = await CourseServices.removeFacultiesFromCourseFromDB(
    courseId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Remove faculties from course successfullly',
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getSingleCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
  assignFacultiesToCourse,
  removeFacultiesFromCourse,
};
