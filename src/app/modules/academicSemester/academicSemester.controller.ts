import { Request, Response } from 'express';
import { AcademicSemesterServices } from './academicSemester.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';

const createAcademicSemester = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
      req.body,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semester created successfully',
      data: result,
    });
  },
);

export const AcademicSemesterControllers = {
  createAcademicSemester,
};
