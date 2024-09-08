import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

const validateRequest = (scheam: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await scheam.parseAsync({
        body: req.body,
      });
      return next();
    } catch (err) {
      next(err);
    }
  };
};

export default validateRequest;
