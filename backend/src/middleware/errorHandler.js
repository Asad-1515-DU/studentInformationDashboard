import { AppError, sendErrorResponse } from '../utils/errorResponse.js';
import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('API Error', err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json(
      sendErrorResponse(err.code, err.message, err.details)
    );
  } else {
    res.status(500).json(
      sendErrorResponse('INTERNAL_SERVER_ERROR', 'An unexpected error occurred')
    );
  }
};

export const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    'ROUTE_NOT_FOUND',
    404,
    `Route ${req.originalUrl} not found`
  );
  next(error);
};

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
