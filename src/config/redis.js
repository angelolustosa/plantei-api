// src/config/redis.js
import { createClient } from 'redis';
import { log } from '../utils/logger.js';

const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;

const redisClient = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        log.error('[Redis] Limite de tentativas de reconexão excedido.');
        return new Error('Redis connection failed');
      }
      return Math.min(retries * 100, 3000); // Backoff exponencial até 3s
    }
  }
});

redisClient.on('error', (err) => {
  log.error(`[Redis Error] ${err.message}`);
});

redisClient.on('connect', () => {
  log.info('🔌 [Redis] Conectando ao servidor...');
});

redisClient.on('ready', () => {
  log.info('⚡ [Redis] Conexão estabelecida e pronta para cache!');
});

// Inicialização segura
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    log.error(`[Redis] Falha inicial ao conectar no Redis: ${err.message}`);
  }
})();

export default redisClient;
