import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/errors';

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = Object.values(err.errors).map(
    (value: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      console.log(value);
      return {
        path: value?.path,
        message: value?.message,
      };
    },
  );
  const statusCode = 404;

  return {
    statusCode,
    message: 'Validation error',
    errorSources: errorSources,
  };
};
export default handleValidationError;
