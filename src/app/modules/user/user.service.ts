/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Faculty } from '../faculty/faculty.model';
import { TFaculty } from '../faculty/faculty.interface';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';

const createStudentIntoDB = async (
  file: any,
  password: string,
  studentData: TStudent,
) => {
  const user: Partial<TUser> = {};
  user.password = password || (config.default_pass as string);
  //  create a custom  role
  user.role = 'student';
  user.email = studentData.email;
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
  if (!admissionSemester) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admission Semester is not found');
  }

  const isAcademicDepartmentExists = await AcademicDepartment.findById(
    studentData.academicDepartment,
  );
  if (!isAcademicDepartmentExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic Department is not found',
    );
  }

  studentData.academicFaculty = isAcademicDepartmentExists?.academicFaculty;

  // transactions
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //   create a custom id
    user.id = await generatedStudentId(admissionSemester);

    if (file) {
      const imageName = `${user.id} ${studentData.name.firstName}`;
      const path = file.path;
      const { secure_url } = await sendImageToCloudinary(path, imageName);
      studentData.profileImg = secure_url;
    }

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
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createFacultyIntoDB = async (
  file: any,
  password: string,
  payload: TFaculty,
) => {
  const user: Partial<TUser> = {};

  user.password = password || config.default_pass;
  user.role = 'faculty';
  user.email = payload.email;
  const getLastFacultyId = async () => {
    const lastFacultyID = await User.findOne(
      { role: 'faculty' },
      {
        id: 1,
        _id: 0,
      },
      {
        sort: { createdAt: -1 },
      },
    );
    return lastFacultyID?.id ? lastFacultyID?.id : undefined;
  };

  const generateFacultyId = async () => {
    let currentId = 'F-0001';
    const lastFacultyId = await getLastFacultyId();

    if (lastFacultyId) {
      const updatedId = Number(lastFacultyId.substring(2)) + 1;
      currentId = updatedId.toString().padStart(4, '0');

      return `F-${currentId}`;
    }
    return currentId;
  };

  const isAcademicDepartmentExists = await AcademicDepartment.findById(
    payload.academicDepartment,
  );
  if (!isAcademicDepartmentExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic Department is not found',
    );
  }

  user.id = await generateFacultyId();
  user.role = 'faculty';

  const createUser = await User.create(user);

  if (Object.keys(createUser).length) {
    payload.id = createUser.id;
    payload.user = createUser._id;
  }
  payload.academicFaculty = isAcademicDepartmentExists.academicFaculty;

  if (file) {
    const imageName = `${user.id} ${payload.name.firstName}`;
    const path = file.path;
    const { secure_url } = await sendImageToCloudinary(path, imageName);
    payload.profileImg = secure_url;
  }

  const result = await Faculty.create(payload);

  return result;
};

const getMe = async (userId: string, role: string) => {
  let result = null;
  if (role === 'student') {
    result = await Student.findOne({ id: userId });
  }

  if (role === 'faculty') {
    result = await Faculty.findOne({ id: userId });
  }
  // if (role === 'admin') {
  //   result = await Admin.findOne({ id: userId });
  // }
  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const { status } = payload;
  const isUserExists = await User.findById(id);
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }

  const result = await User.findByIdAndUpdate(id, { status }, { new: true });

  return result;
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  getMe,
  changeStatus,
};
