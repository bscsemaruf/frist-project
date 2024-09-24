import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { SemesterStatus } from './semesterRegistration.constant';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;

  //   check if have any upcoming or ongoing semester
  const isHaveUpcomingOrOngoingSemester = await SemesterRegistration.findOne({
    $or: [
      { status: 'UPCOMING' },
      {
        status: 'ONGOING',
      },
    ],
  });

  if (isHaveUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You have an ${isHaveUpcomingOrOngoingSemester.status} registerd semester already !`,
    );
  }

  const isAcademicSemesterExists =
    await AcademicSemester.findById(academicSemester);

  if (!isAcademicSemesterExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This Academic Semester is not exists at all',
    );
  }

  //   check if the semester is already exists
  const isSemesterRegistrationAlreadyExists =
    await SemesterRegistration.findOne({
      academicSemester,
    });
  if (isSemesterRegistrationAlreadyExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This Academic Semester is already registered',
    );
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  return result;
};

const getAllSemesterRegistrationFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Record<string, unknown>,
) => {
  const isCurrentSemesterExists = await SemesterRegistration.findById(id);
  if (!isCurrentSemesterExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This semester is not found !');
  }
  const currentSemesterStatus = isCurrentSemesterExists?.status;
  const requestedSemesterStatus = payload?.status;

  if (currentSemesterStatus === SemesterStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This semester is already ended !',
    );
  }

  if (
    currentSemesterStatus === SemesterStatus.UPCOMING &&
    requestedSemesterStatus === SemesterStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can't update from ${currentSemesterStatus} to ${requestedSemesterStatus} !`,
    );
  }

  if (
    currentSemesterStatus === SemesterStatus.ONGOING &&
    requestedSemesterStatus === SemesterStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can't update from ${currentSemesterStatus} to ${requestedSemesterStatus} !`,
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getSingleSemesterRegistrationFromDB,
  getAllSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
};
