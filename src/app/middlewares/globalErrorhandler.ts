/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config';
import { TErrorSources } from '../interface/errors';
import handleError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateKeyError from '../errors/handleDuplicateKeyError';
import AppError from '../errors/AppError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // setting default values
  let statusCode = 500;
  let message = 'something went wrong';

  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  if (err instanceof ZodError) {
    const modifiedError = handleError(err);
    statusCode = modifiedError?.statusCode;
    message = modifiedError?.message;
    errorSources = modifiedError?.errorSources;
  } else if (err?.name === 'ValidationError') {
    const modifiedError = handleValidationError(err);
    statusCode = modifiedError?.statusCode;
    message = modifiedError?.message;
    errorSources = modifiedError?.errorSources;
  } else if (err?.name === 'CastError') {
    const modifiedError = handleCastError(err);
    statusCode = modifiedError?.statusCode;
    message = modifiedError?.message;
    errorSources = modifiedError?.errorSources;
  } else if (err?.code === 11000) {
    const modifiedError = handleDuplicateKeyError(err);
    statusCode = modifiedError?.statusCode;
    message = modifiedError?.message;
    errorSources = modifiedError?.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err?.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,

    err,

    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};
export default globalErrorHandler;
