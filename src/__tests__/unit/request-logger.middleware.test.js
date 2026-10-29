import { EventEmitter } from 'node:events';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import requestLoggerMiddleware from '../../middlewares/request-logger.middleware.js';
import { log, logger } from '../../utils/logger.js';

describe('requestLoggerMiddleware', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('adds request metadata to logs and returns the correlation ID header', () => {
    const loggerInfo = jest.spyOn(logger, 'info').mockImplementation(() => logger);
    const req = {
      get: jest.fn().mockReturnValue('req-test-123'),
      path: '/api/contatos',
      method: 'GET',
    };
    const res = new EventEmitter();
    res.statusCode = 200;
    res.setHeader = jest.fn();
    const next = jest.fn(() => {
      log.info('[Contato] Listando contatos');
    });

    requestLoggerMiddleware(req, res, next);

    expect(req.correlationId).toBe('req-test-123');
    expect(res.setHeader).toHaveBeenCalledWith('x-correlation-id', 'req-test-123');
    expect(loggerInfo).toHaveBeenCalledWith(
      '[Contato] Listando contatos',
      expect.objectContaining({
        correlationId: 'req-test-123',
        endpoint: '/api/contatos',
        method: 'GET',
        statusCode: 200,
      }),
    );

    res.emit('finish');

    expect(loggerInfo).toHaveBeenCalledWith(
      'HTTP request completed: GET /api/contatos',
      expect.objectContaining({ statusCode: 200 }),
    );
  });
});
