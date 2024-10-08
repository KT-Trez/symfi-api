import { ApiErrorV2 } from '@resources';
import type { NextFunction, Request, Response } from 'express';
import { type ValidationError, validationResult } from 'express-validator';

const errorFormatter = (err: ValidationError) => {
  switch (err.type) {
    case 'field':
      return `${err.location} [${err.path}]: ${err.msg}`;
    default:
      return err.msg;
  }
};

export const requestValidatorService = (req: Request, _: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    next(new ApiErrorV2(400, 'Bad Request', errors.formatWith(errorFormatter).array().join('\n')));
  }
};
