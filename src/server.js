import express from 'express';

const HOST = '127.0.0.1'
const PORT = '5000'

const app = express();

// Middlewares
app.use(express.json())

app.get('/', (req, res) => {
    res.send('API de Produtos funcionando 🚀');
})


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
