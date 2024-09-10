import { model, Schema } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';

const academicDepartmentSchema = new Schema<TAcademicDepartment>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  academicFaculty: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicFaculty',
  },
});

academicDepartmentSchema.pre('save', async function (next) {
  const isDepartmentExists = await AcademicDepartment.find({
    name: this.name,
  });

  if (isDepartmentExists.length != 0) {
    throw new Error('This Department is exist already');
  }
  next();
});

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const isDepartmentIdIsExists = await AcademicDepartment.findById(
    this.getQuery(),
  );

  if (!isDepartmentIdIsExists) {
    throw new Error('Invalid department bro');
  }
  next();
});

export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
