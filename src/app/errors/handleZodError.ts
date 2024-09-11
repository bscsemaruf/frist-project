import { ZodError, ZodIssue } from 'zod';
import { TErrorSources } from '../interface/errors';

const handleError = (err: ZodError) => {
  const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    };
  });
  return {
    statusCode: 404,
    message: ' Validation error',
    errorSources: errorSources,
  };
};

export default handleError;
