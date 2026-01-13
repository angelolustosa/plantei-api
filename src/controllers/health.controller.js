import { sequelize } from '../config/database.js';

export const healthCheck = async (req, res) => {
  try {
    // Verifica se o banco está conectado
    await sequelize.authenticate();

    return res.status(200).json({
      status: 'UP',
      service: 'API de Produtos',
      database: 'Connected',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({
      status: 'DOWN',
      service: 'API de Produtos',
      database: 'Disconnected',
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
};
