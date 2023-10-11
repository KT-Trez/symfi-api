import { NextFunction, Request, Response } from 'express';
import { ValidationError, validationResult } from 'express-validator';
import { ApiError } from '../resources';

const errorFormatter = (err: ValidationError) => {
  switch (err.type) {
    case 'field':
      return `${err.location} [${err.path}]: ${err.msg}`;
    default:
      return err.msg;
  }
};

export const requestValidatorService = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new ApiError('Bad Request', 400, undefined, errors.formatWith(errorFormatter).array()));
  } else {
    next();
  }
};
