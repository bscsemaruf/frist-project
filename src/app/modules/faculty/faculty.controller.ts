import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { FacultyServices } from './faculty.service';

const getSingleFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await FacultyServices.getSingleFacultyFromDB(facultyId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student get successfully',
    data: result,
  });
});

const getAllFaculties = catchAsync(async (req, res) => {
  const result = await FacultyServices.getAllFacultiesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students are retrieved successfully',
    data: result,
  });
});

// const updateStudent = catchAsync(async (req, res) => {
//   const { studentId } = req.params;
//   const { student } = req.body;
//   const result = await StudentServices.updateStudentIntoDB(studentId, student);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Student is updated successfully',
//     data: result,
//   });
// });

const deleteFaculty = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await FacultyServices.deleteFacucltyIntoDB(studentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student update successfully',
    data: result,
  });
});

export const FacultyControllers = {
  getSingleFaculty,
  getAllFaculties,
  deleteFaculty,
};
