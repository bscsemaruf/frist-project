import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartment } from './academicDepartment.model';

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartment.create(payload);
  return result;
};

const getSingleAcademicDepartmentFromDB = async (departmentId: string) => {
  const result = await AcademicDepartment.findById(departmentId);
  return result;
};
const getAllAcademicDepartmentFromDB = async () => {
  const result = await AcademicDepartment.find();
  return result;
};
const updateAcademicDepartmentFromDB = async (
  departmentId: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartment.findOneAndUpdate(
    { _id: departmentId },
    payload,
  );
  return result;
};

export const AcademicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  getSingleAcademicDepartmentFromDB,
  getAllAcademicDepartmentFromDB,
  updateAcademicDepartmentFromDB,
};
