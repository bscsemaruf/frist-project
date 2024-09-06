import { Student } from './student.interface';
import { StudentModel } from './student.model';

const createStudentIntoDB = async (studentData: Student) => {
  const result = await StudentModel.create(studentData);
  return result;
};

const getSingleStudent = async (id: string) => {
  const result = await StudentModel.findOne({ id });
  return result;
};

const getAllStudentsFromDB = async () => {
  const result = await StudentModel.find();
  return result;
};

export const StudentServices = {
  createStudentIntoDB,
  getSingleStudent,
  getAllStudentsFromDB,
};
