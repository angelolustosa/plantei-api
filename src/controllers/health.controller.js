import { sequelize } from '../config/database.js';

export const healthCheck = async (req, res) => {
  const healthStatus = {
    status: 'UP',
    service: 'plantei-api',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    database: 'UNKNOWN',
  };

  try {
    // Verifica a conexão real com o PostgreSQL
    await sequelize.authenticate();
    healthStatus.database = 'CONNECTED';
    return res.status(200).json(healthStatus);
  } catch (err) {
    healthStatus.status = 'DEGRADED';
    healthStatus.database = 'DISCONNECTED';
    healthStatus.error = err.message;
    return res.status(503).json(healthStatus);
  }
};

export const checkHealth = healthCheck;

