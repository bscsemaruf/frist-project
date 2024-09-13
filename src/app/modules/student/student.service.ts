/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

const getSingleStudent = async (id: string) => {
  const result = await Student.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  // const queryObj = { ...query };
  // const studentSearchableFields = ['email', 'name.firstName'];
  // console.log('basequery', query);
  // let serachItem = '';
  // if (query?.searchTerm) {
  //   serachItem = query?.searchTerm as string;
  // }
  // // {'email': {$regex: value}}

  // const searchQuery = Student.find({
  //   $or: studentSearchableFields.map((field) => ({
  //     [field]: { $regex: serachItem, $options: 'i' },
  //   })),
  // });
  // filtering
  // const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  // excludeFields.forEach((el) => delete queryObj[el]);
  // console.log(queryObj);
  // const filteringQuery = searchQuery
  //   .find(queryObj)
  //   .populate('admissionSemester')
  //   .populate({
  //     path: 'academicDepartment',
  //     populate: {
  //       path: 'academicFaculty',
  //     },
  //   });

  // sorting
  // let sort = '-createdAt';
  // if (query?.sort) {
  //   sort = query.sort as string;
  // }

  // const sortingQuery = filteringQuery.sort(sort);

  // // limit and pagination
  // let page = 1;
  // let limit = 1;
  // let skip = 0;

  // if (query?.limit) {
  //   limit = Number(query?.limit);
  // }
  // if (query?.page) {
  //   page = Number(query.page);
  //   skip = (page - 1) * limit;
  // }
  // const paginateQuery = sortingQuery.skip(skip);

  // const limitQuery = paginateQuery.limit(limit);

  // fields value
  // { fields: 'name,email' }
  // have to format {'name email'}, query.select('a b')
  // let fields = '-__v';
  // if (query?.fields) {
  //   fields = (query.fields as string).split(',').join(' ');
  // }

  // const fieldsQuery = await paginateQuery.select(fields);

  // return fieldsQuery;

  const studentQuery = new QueryBuilder(
    Student.find()
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  console.log({ query }, typeof query);
  // if (Object.keys(query).length === 0) {
  //   const result = await Student.find();
  //   return result;
  // }
  const result = await studentQuery.modelQuery;
  return result;
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedData: Record<string, unknown> = { ...remainingStudentData };

  if (name && Object.keys(name).length) {
    for (const [keys, value] of Object.entries(name)) {
      modifiedData[`name.${keys}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [keys, value] of Object.entries(guardian)) {
      modifiedData[`guardian.${keys}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [keys, value] of Object.entries(localGuardian)) {
      modifiedData[`guardian.${keys}`] = value;
    }
  }
  const result = await Student.findOneAndUpdate({ id }, modifiedData, {
    new: true,
  });

  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const existUser = await Student.isUserExists(id);

  if (!existUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This student is not exists');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deletedStudent = await Student.findOneAndUpdate(
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
  }
};

export const StudentServices = {
  getSingleStudent,
  getAllStudentsFromDB,
  updateStudentIntoDB,
  deleteStudentFromDB,
};
