/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorResponse } from '../interface/errors';

const handleDuplicateKeyError = (err: any): TGenericErrorResponse => {
  const regex = /"([^"]+)"/;
  const match = err.errorResponse.errmsg.match(regex);
  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${match[1]} is already exist`,
    },
  ];

  const statusCode = 404;
  return {
    statusCode,
    message: 'Invalid ID',
    errorSources,
  };
};
export default handleDuplicateKeyError;
