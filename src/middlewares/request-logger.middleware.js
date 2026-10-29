import { randomUUID } from 'node:crypto';
import { log, runWithLogContext } from '../utils/logger.js';

export default function requestLoggerMiddleware(req, res, next) {
  const correlationId = req.get('x-correlation-id') || randomUUID();
  const context = {
    correlationId,
    endpoint: req.path,
    method: req.method,
    statusCode: res.statusCode,
  };

  req.correlationId = correlationId;
  res.setHeader('x-correlation-id', correlationId);

  res.on('finish', () => {
    context.statusCode = res.statusCode;
    const message = `HTTP request completed: ${req.method} ${req.path}`;

    if (res.statusCode >= 500) {
      log.error(message, context);
    } else if (res.statusCode >= 400) {
      log.warn(message, context);
    } else {
      log.info(message, context);
    }
  });

  runWithLogContext(context, next);
}
