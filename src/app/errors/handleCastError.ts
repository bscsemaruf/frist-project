import mongoose from 'mongoose';
import { TErrorSources } from '../interface/errors';

const handleCastError = (err: mongoose.Error.CastError) => {
  const errorSources: TErrorSources = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  const statusCode = 404;
  return {
    statusCode,
    message: 'Invalid ID',
    errorSources,
  };
};
export default handleCastError;
