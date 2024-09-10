import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFaculty } from './academicFaculty.model';

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
  const result = await AcademicFaculty.create(payload);
  return result;
};
const getSingleAcademicFacultyFromDB = async (facultyId: string) => {
  const result = await AcademicFaculty.findById(facultyId);
  return result;
};
const getAllAcademicFacultyFromDB = async () => {
  const result = await AcademicFaculty.find();
  return result;
};
const updateAcademicFacultyIntoDB = async (
  facultyId: string,
  payload: Partial<TAcademicFaculty>,
) => {
  const result = await AcademicFaculty.findOneAndUpdate(
    { _id: facultyId },
    payload,
  );

  return result;
};

export const AcademicFacultyServices = {
  createAcademicFacultyIntoDB,
  getSingleAcademicFacultyFromDB,
  getAllAcademicFacultyFromDB,
  updateAcademicFacultyIntoDB,
};
