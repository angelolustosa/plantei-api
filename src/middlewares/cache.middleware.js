// src/middlewares/cache.middleware.js
import redisClient from '../config/redis.js';
import { log } from '../utils/logger.js';

/**
 * Middleware para cacheamento de rotas GET via Redis.
 * @param {number} durationSeconds - Tempo de expiração do cache (TTL) em segundos.
 */
export const cacheMiddleware = (durationSeconds = 60) => async (req, res, next) => {
  // 1. Aplica apenas para métodos de leitura idempotentes
  if (req.method !== 'GET') {
    return next();
  }

  // Se o Redis não estiver pronto/conectado, segue para o banco sem travar a requisição
  if (!redisClient.isReady) {
    res.setHeader('X-Cache', 'BYPASS');
    return next();
  }

  const cacheKey = `cache:${req.originalUrl || req.url}`;

  try {
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).send(cachedData);
    }

    // Intercepta a resposta da rota para gravar o resultado no Redis
    const originalJson = res.json.bind(res);

    res.json = (body) => {
      res.setHeader('X-Cache', 'MISS');

      // Só grava no Redis se o status for de sucesso (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        redisClient.setEx(cacheKey, durationSeconds, JSON.stringify(body))
          .catch((err) => log.error(`[Redis] Falha ao gravar cache: ${err.message}`));
      }

      return originalJson(body);
    };

    next();
  } catch (err) {
    log.error(`[Cache Middleware Error] ${err.message}`);
    res.setHeader('X-Cache', 'BYPASS');
    next(); // Fallback gracioso: a API continua funcionando mesmo se o cache falhar
  }
};

/**
 * Helper para invalidar chaves de cache por padrão (Ex: após POST, PUT ou DELETE)
 * @param {string} pattern - Ex: 'cache:/api/produtos*'
 */
export const invalidarCache = async (pattern) => {
  try {
    if (!redisClient.isReady) return;
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      log.info(`🧹 [Cache Invalidation] ${keys.length} chave(s) removida(s) para o padrão: ${pattern}`);
    }
  } catch (err) {
    log.error(`[Cache Invalidation Error] ${err.message}`);
  }
};
