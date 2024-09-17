/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Faculty } from './faculty.model';
import { User } from '../user/user.model';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { serachableFacultyFields } from './faculty.constant';
import { query } from 'express';

const getSingleFacultyFromDB = async (id: string) => {
  const result = await Faculty.findById(id)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};
const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    Faculty.find()
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(serachableFacultyFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await facultyQuery.modelQuery;

  return result;
};
const deleteFacucltyIntoDB = async (id: string) => {
  //   const existUser = await Faculty.isUserExists(id);

  //   if (!existUser) {
  //     throw new AppError(httpStatus.BAD_REQUEST, 'This student is not exists');
  //   }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deletedStudent = await Faculty.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Deleted student is failed');
    }
    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Deleted user is failed');
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Faculty can not delete');
  }
};

export const FacultyServices = {
  getSingleFacultyFromDB,
  getAllFacultiesFromDB,
  deleteFacucltyIntoDB,
};
