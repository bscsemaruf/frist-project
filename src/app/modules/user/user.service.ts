/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose';
import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  const user: Partial<TUser> = {};
  user.password = password || (config.default_pass as string);

  const getLastStudent = async () => {
    const lastStudentId = await User.findOne(
      {
        role: 'student',
      },
      {
        id: 1,
        _id: 0,
      },
    )
      .sort({ createdAt: -1 })
      .lean();
    return lastStudentId?.id ? lastStudentId.id : undefined;
  };

  const generatedStudentId = async (payload: TAcademicSemester) => {
    let currentId = (0).toString();

    const lastStudent = await getLastStudent();

    const lastStudentYear = lastStudent?.substring(0, 4);
    const lastStudentCode = lastStudent?.substring(4, 6);
    const currentYear = payload.year;
    const currentCode = payload.code;

    if (
      lastStudent &&
      lastStudentYear === currentYear &&
      lastStudentCode === currentCode
    ) {
      currentId = lastStudent.substring(6);
    }

    let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
    incrementId = `${payload.year}${payload.code}${incrementId}`;
    return incrementId;
  };

  const admissionSemester = await AcademicSemester.findById(
    studentData.admissionSemester,
  );

  // transactions
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //   create a custom id
    user.id = await generatedStudentId(admissionSemester);
    //  create a custom  role
    user.role = 'student';

    // create a user
    const newUser = await User.create([user], { session }); //transaction - 1
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    studentData.id = newUser[0].id;
    studentData.user = newUser[0]._id;

    // create a student
    const newStudent = await Student.create([studentData], { session }); //transaction-2
    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Student');
    }
    await session.commitTransaction();
    await session.endSession();
    return newStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
  }
};

export const UserServices = {
  createStudentIntoDB,
};
