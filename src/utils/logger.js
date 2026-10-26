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

// Compatibilidade com os controllers existentes (log.info, log.success, etc.)
export const log = {
  info: (msg) => logger.info(msg),
  success: (msg) => logger.info(`[SUCCESS] ${msg}`),
  warn: (msg) => logger.warn(msg),
  error: (err) => logger.error(err instanceof Error ? err.stack || err.message : err),
};

export { logger };
export default logger;
