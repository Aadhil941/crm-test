import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends CustomError {
  constructor(message: string = 'Validation failed') {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT');
  }
}

export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'An unexpected error occurred';

  if (err instanceof CustomError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode,
    code,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

