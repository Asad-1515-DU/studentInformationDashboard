import logger from '../utils/logger.js';

export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'warn' : 'info';
    const message = `${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`;
    logger[level](message);
  });

  next();
};
