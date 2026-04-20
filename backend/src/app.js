app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Student Information Dashboard API',
    status: 'running',
    version: env.apiVersion,
    apiPrefix: `${env.apiPrefix}/${env.apiVersion}`,
    timestamp: new Date().toISOString(),
  });
});

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';

import env from './config/env.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';
import logger from './utils/logger.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));

app.use(requestLogger);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

const apiPrefix = `${env.apiPrefix}/${env.apiVersion}`;
app.use(apiPrefix, apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
