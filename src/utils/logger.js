import winston from 'winston';

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

// Suporte a logs simples ou com metadados (correlationId, userId, endpoint, etc.)
export const log = {
  info: (msg, meta = {}) => logger.info(msg, meta),
  success: (msg, meta = {}) => logger.info(`[SUCCESS] ${msg}`, meta),
  warn: (msg, meta = {}) => logger.warn(msg, meta),
  error: (err, meta = {}) => {
    if (err instanceof Error) {
      logger.error(err.message, { stack: err.stack, ...meta });
    } else if (typeof err === 'object' && err !== null) {
      logger.error(err.message || 'Error', { ...err, ...meta });
    } else {
      logger.error(err, meta);
    }
  },
};

export { logger };
export default logger;
