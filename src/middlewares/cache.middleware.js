// src/middlewares/cache.middleware.js
import redisClient from '../config/redis.js';

export const cacheMiddleware = (tempoSegundos = 60) => async (req, res, next) => {
  // 1. Cria uma chave única baseada na URL chamada (ex: 'cache:/api/produtos')
  const chave = `cache:${req.originalUrl}`;

  try {
    // 2. Procura se esse resultado já está gravado na memória RAM do Redis
    const dadoEmCache = await redisClient.get(chave);

    if (dadoEmCache) {
      // 🎯 Cache HIT: Achou no Redis! Responde imediatamente em ~3ms
      res.setHeader('X-Cache', 'HIT');
      return res.json(JSON.parse(dadoEmCache));
    }

    // 3. Cache MISS: Se não achou, interceptamos o res.json para gravar no Redis quando o banco responder
    const jsonOriginal = res.json.bind(res);
    res.json = (corpo) => {
      res.setHeader('X-Cache', 'MISS');
      // Salva no Redis com tempo de expiração (TTL) de 60 segundos
      redisClient.setEx(chave, tempoSegundos, JSON.stringify(corpo));
      return jsonOriginal(corpo);
    };

    next(); // Passa a vez para o controller buscar no PostgreSQL
  } catch (err) {
    next(); // Fallback de segurança: se o Redis falhar, segue para o banco sem travar a API
  }
};
