import express from 'express';
import { Sequelize } from 'sequelize';

const HOST = '127.0.0.1'
const PORT = '5000'

const app = express();

// Middlewares
app.use(express.json())

app.get('/', (req, res) => {
    res.send('API de Produtos funcionando 🚀');
})

const sequelize = new Sequelize(
    'postgresql://neondb_owner:npg_7AViXEFWeg5U@ep-polished-smoke-ad3mfwae-pooler.c-2.us-east-1.aws.neon.tech/planteidb?sslmode=require&channel_binding=require',
    {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true
            }
        },
        loggin: true
    }
) // Example for postgres

try {
    await sequelize.authenticate()
    console.log('🟢 Conectado ao banco de dados!');
} catch (error) {
    console.error('🔴 Erro ao conectar no banco:', error);
}

//Iniciando o server
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://${HOST}:${PORT}`);
})
