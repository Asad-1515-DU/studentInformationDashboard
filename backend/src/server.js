import app from './app.js';
import env from './config/env.js';
import logger from './utils/logger.js';
import prisma from './config/database.js';

const startServer = async () => {
  try {
    // Try to connect to database, but don't fail if it's not available
    try {
      await prisma.$queryRaw`SELECT 1`;
      logger.info('✓ Database connected successfully');
    } catch (dbError) {
      logger.warn('⚠ Database connection failed, server will run in demo mode');
      logger.warn(`Database error: ${dbError.message}`);
    }

    app.listen(env.port, () => {
      logger.info(
        `🚀 Server running on http://localhost:${env.port} (${env.nodeEnv})`
      );
      logger.info(`📍 API prefix: ${env.apiPrefix}/${env.apiVersion}`);
      logger.info(`✓ CORS enabled for: ${env.corsOrigin}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
