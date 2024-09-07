import { Student } from './student.model';

const getSingleStudent = async (id: string) => {
  const result = await Student.findOne({ id });
  return result;
};

const getAllStudentsFromDB = async () => {
  const result = await Student.find();
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ id, isDeleted: true });
  return result;
};

export const StudentServices = {
  getSingleStudent,
  getAllStudentsFromDB,
  deleteStudentFromDB,
};
