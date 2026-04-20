const logLevelPriority = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  constructor(level = 'debug') {
    this.currentLevel = level.toLowerCase() || 'debug';
  }

  log(level, message, data) {
    if (logLevelPriority[level] >= logLevelPriority[this.currentLevel]) {
      const timestamp = new Date().toISOString();
      const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
      console.log(prefix, message, data ? JSON.stringify(data, null, 2) : '');
    }
  }

  debug(message, data) {
    this.log('debug', message, data);
  }

  info(message, data) {
    this.log('info', message, data);
  }

  warn(message, data) {
    this.log('warn', message, data);
  }

  error(message, error) {
    this.log('error', message, error instanceof Error ? error.message : error);
  }
}

export default new Logger(process.env.LOG_LEVEL || 'debug');
