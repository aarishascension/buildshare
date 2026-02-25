import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

// Format log message
function formatLog(level, message, meta = {}) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta
  }) + '\n';
}

// Write to log file
function writeLog(filename, content) {
  const logPath = path.join(logsDir, filename);
  fs.appendFileSync(logPath, content);
}

// Logger class
class Logger {
  error(message, meta = {}) {
    const log = formatLog(LOG_LEVELS.ERROR, message, meta);
    console.error(log);
    writeLog('error.log', log);
    writeLog('combined.log', log);
  }

  warn(message, meta = {}) {
    const log = formatLog(LOG_LEVELS.WARN, message, meta);
    console.warn(log);
    writeLog('combined.log', log);
  }

  info(message, meta = {}) {
    const log = formatLog(LOG_LEVELS.INFO, message, meta);
    console.log(log);
    writeLog('combined.log', log);
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      const log = formatLog(LOG_LEVELS.DEBUG, message, meta);
      console.log(log);
      writeLog('debug.log', log);
    }
  }
}

export const logger = new Logger();

// Request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    };

    if (res.statusCode >= 400) {
      logger.error('Request failed', logData);
    } else if (duration > 1000) {
      logger.warn('Slow request', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });

  next();
};

// Error logging middleware
export const errorLogger = (err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query
  });

  next(err);
};

// Database operation logger
export function logDatabaseOperation(operation, collection, duration, error = null) {
  if (error) {
    logger.error('Database operation failed', {
      operation,
      collection,
      duration: `${duration}ms`,
      error: error.message
    });
  } else if (duration > 500) {
    logger.warn('Slow database operation', {
      operation,
      collection,
      duration: `${duration}ms`
    });
  } else {
    logger.debug('Database operation', {
      operation,
      collection,
      duration: `${duration}ms`
    });
  }
}

export default logger;
