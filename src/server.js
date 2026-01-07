import express from 'express';
import './models/Produto.js';
import { sequelize } from './config/database.js';
import produtosRoutes from './routes/produto.routes.js'

const HOST = process.env.HOST
const PORT = process.env.PORT

const app = express();

app.use(express.json());
app.use('/produtos',produtosRoutes)

try {
    await sequelize.authenticate();
    console.log("🎉 Conectado ao Postgres Neon com sucesso!");

    await sequelize.sync({ alter: true });
    console.log("📦 Modelos sincronizados com o banco!");

    app.listen(PORT, () =>
        console.log(`🚀 Servidor rodando em http://${HOST}:${PORT}`)
    );
} catch (err) {
    console.error("Erro ao iniciar o servidor:", err);
}

