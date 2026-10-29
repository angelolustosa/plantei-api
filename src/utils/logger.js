import { AsyncLocalStorage } from 'node:async_hooks';
import winston from 'winston';

const logContext = new AsyncLocalStorage();

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'plantei-api', environment: process.env.NODE_ENV || 'development' },
  transports: [
    new winston.transports.Console()
  ]
});

function withContext(meta = {}) {
  return { ...logContext.getStore(), ...meta };
}

export function runWithLogContext(context, callback) {
  return logContext.run(context, callback);
}

export function updateLogContext(context) {
  Object.assign(logContext.getStore() || {}, context);
}

// Suporte a logs simples ou com metadados (correlationId, userId, endpoint, etc.)
export const log = {
  info: (msg, meta = {}) => logger.info(msg, withContext(meta)),
  success: (msg, meta = {}) => logger.info(`[SUCCESS] ${msg}`, withContext(meta)),
  warn: (msg, meta = {}) => logger.warn(msg, withContext(meta)),
  error: (err, meta = {}) => {
    if (err instanceof Error) {
      logger.error(err.message, withContext({ stack: err.stack, ...meta }));
    } else if (typeof err === 'object' && err !== null) {
      logger.error(err.message || 'Error', withContext({ ...err, ...meta }));
    } else {
      logger.error(err, withContext(meta));
    }
  },
};

export { logger };
export default logger;
