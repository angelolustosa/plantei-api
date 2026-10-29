import { log } from '../utils/logger.js';

export default function errorMiddleware(err, req, res, next) {
  if (err.name === 'SequelizeValidationError') {
    log.warn(err.message, {
      correlationId: req.correlationId,
      endpoint: req.path,
      statusCode: 400,
      ...(req.user?.id !== undefined ? { userId: req.user.id } : {}),
    });

    return res.status(400).json({
      erro: err.errors.map(e => e.message),
    });
  }

  log.error(err, {
    correlationId: req.correlationId,
    endpoint: req.path,
    statusCode: 500,
    ...(req.user?.id !== undefined ? { userId: req.user.id } : {}),
  });

  return res.status(500).json({
    erro: err.message || 'Erro interno do servidor',
  });
}
