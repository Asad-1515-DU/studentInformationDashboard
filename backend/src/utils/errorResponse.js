export class AppError extends Error {
  constructor(code, statusCode, message, details) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'AppError';
  }
}

export const sendErrorResponse = (code, message, details) => ({
  success: false,
  error: {
    code,
    message,
    ...(details && { details }),
  },
});

export const sendSuccessResponse = (data, meta) => ({
  success: true,
  data,
  ...(meta && { meta }),
});
