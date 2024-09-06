import { Student } from './student.interface';
import { StudentModel } from './student.model';

const createStudentIntoDB = async (studentData: Student) => {
  const result = await StudentModel.create(studentData);
  return result;
};

export const StudentServices = {
  createStudentIntoDB,
};
