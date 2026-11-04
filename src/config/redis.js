// src/config/redis.js
import { createClient } from 'redis';
import { log } from '../utils/logger.js';

// 1. Lê a URL do .env ou usa o padrão localhost:6379 como fallback
const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;

// 2. Cria o cliente com estratégia de reconexão automática inteligente
const redisClient = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        log.error('[Redis] Limite de tentativas de reconexão excedido.');
        return new Error('Redis connection failed');
      }
      return Math.min(retries * 100, 3000); // Backoff exponencial: tenta a cada 100ms, 200ms... até o máximo de 3s
    }
  }
});

// 3. Ouvintes de eventos para monitorar a saúde da conexão
redisClient.on('error', (err) => log.error(`[Redis Error] ${err.message}`));
redisClient.on('connect', () => log.info('🔌 [Redis] Conectando ao servidor...'));
redisClient.on('ready', () => log.info('⚡ [Redis] Conectado e pronto para acelerar a API!'));

// 4. Conecta automaticamente na inicialização da aplicação
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    log.error(`[Redis] Falha inicial ao conectar no Redis: ${err.message}`);
  }
})();

export default redisClient;