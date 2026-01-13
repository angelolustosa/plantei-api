import app from './app.js';
import { sequelize } from './config/database.js';
import { HOST } from './utils/ip.js';

const PORT = process.env.PORT || 5000;
// const HOST = process.env.HOST || 'localhost';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('🎉 Banco conectado');

    await sequelize.sync();
    console.log('📦 Modelos sincronizados');

    app.listen(PORT, () =>
        console.log(`🚀 Servidor rodando em http://${HOST}:${PORT}`)
    );
  } catch (error) {
    console.error('💥 Erro ao iniciar:', error);
  }
})();
