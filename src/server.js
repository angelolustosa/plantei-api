import app from './app.js';
import { sequelize } from './config/database.js';
import { HOST } from './utils/ip.js';

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('🎉 Banco conectado');

    await sequelize.sync();
    console.log('📦 Modelos sincronizados');

    app.listen(PORT, () => {
      if (isProduction) {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
        console.log(`📄 Documentação: https://plantei-api.onrender.com/api-docs`);
      } else {
        console.log(`🚀 Servidor rodando em http://${HOST}:${PORT}`);
        console.log(`📄 Documentação: http://${HOST}:${PORT}/api-docs`);
      }
    });
  } catch (error) {
    console.error('💥 Erro ao iniciar:', error);
  }
})();
