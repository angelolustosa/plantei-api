import express from 'express';

// IMPORTAR MODELS AQUI
import './models/Produto.js';
import { sequelize } from './config/database.js';
import { Produto } from './models/Produto.js';

const HOST = '127.0.0.1'
const PORT = '5000'

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API de Produtos funcionando 🚀');
});

//Buscar produtos
app.get('/produtos', async (req, res) => {
    try {
        const produtos = await Produto.findAll()

        res.status(200).json({
            mensagem: "Sucesso ao trazer os produtos!",
            size: produtos.length,
            data: produtos,
        });
    } catch (error) {
        console.error(err);

        // erros de validação do Sequelize
        if (err.name === "SequelizeValidationError") {
            return res.status(400).json({
                erro: err.errors.map(e => e.message)
            });
        }
        res.status(500).json({ erro: "Erro ao buscar produto" });
    }
});

// Buscar por ID
app.get('/produto/:id', async (req, res) => {
    try {
        const { id } = req.params; //igual a const id = req.param.id

        const produto = await Produto.findByPk(id);

        /* 
            (produto) valida se o objeto produto existe, ou seja, se não é, null ou undefined
            (!produto) negação (!), ou seja, se o produto não existe, não veio na busca
        */
        if (!produto) {
            console.log(`❌ Produto ID ${id} não encontrado`);
            return res.status(404).json({ erro: "Produto não encontrado" });
        }

        console.log(`🔎 Produto ID ${id} encontrado!`);
        res.status(200).json({
            mensagem: "Produto encontrado com sucesso!",
            data: produto,
        });

    } catch (err) {
        console.error("💥 Erro ao buscar por ID:", err);
        res.status(500).json({ erro: "Erro interno ao buscar produto" });
    }
});

// Criar um produto
app.post('/produto', async (req, res) => {
    try {
        //payload é o produto que vem do request, através do body
        const payload = req.body;

        const produto = await Produto.create(payload)

        res.status(201).json({
            mensagem: "Produto criado com sucesso!",
            data: produto,
        });

    } catch (err) {
        console.error(err);

        // erros de validação do Sequelize
        if (err.name === "SequelizeValidationError") {
            return res.status(400).json({
                erro: err.errors.map(e => e.message)
            });
        }

        res.status(500).json({ erro: "Erro ao criar produto" });
    }
})

// Criar vários produtos de uma vez (Bulk Insert)
app.post('/produtos/lote', async (req, res) => {
    try {
        const payload = req.body; // deve ser um array de produtos

        if (!Array.isArray(payload)) {
            return res.status(400).json({
                erro: "O corpo da requisição deve ser um array de produtos."
            });
        }

        const produtos = await Produto.bulkCreate(payload, {
            validate: true // valida cada item individualmente
        });

        console.log(`📦 Inseridos ${produtos.length} produtos via bulkCreate`);

        res.status(201).json({
            mensagem: "Produtos inseridos com sucesso!",
            quantidade: produtos.length,
            data: produtos,
        });

    } catch (err) {
        console.error("💥 Erro no bulk insert:", err);

        if (err.name === "SequelizeValidationError") {
            return res.status(400).json({
                erro: err.errors.map(e => e.message)
            });
        }

        res.status(500).json({ erro: "Erro ao inserir produtos" });
    }
});

// Atualizar produto
app.put('/produto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;

        // procura por id o produto a ser atualizado
        const produto = await Produto.findByPk(id);

        // Se o produto não existe, retorna o 404, e retorna produto não encontrado
        if (!produto) {
            console.log(`❌ Não existe produto com ID ${id}`);
            return res.status(404).json({ erro: "Produto não encontrado" });
        }

        //await Produto.update(payload, { where: { id } });
        await produto.update(payload);

        console.log(`✏️ Produto ID ${id} atualizado!`);

        res.status(200).json({
            mensagem: "Produto atualizado com sucesso!",
            data: produto,
        });

    } catch (err) {
        console.error("💥 Erro ao atualizar:", err);

        if (err.name === "SequelizeValidationError") {
            return res.status(400).json({ erro: err.errors.map(e => e.message) });
        }

        res.status(500).json({ erro: "Erro ao atualizar produto" });
    }
});

// Deletar produto
app.delete('/produto/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const produto = await Produto.findByPk(id);

        if (!produto) {
            console.log(`❌ Não existe produto com ID ${id}`);
            return res.status(404).json({ erro: "Produto não encontrado" });
        }

        await produto.destroy();

        console.log(`🗑️ Produto ID ${id} deletado!`);

        res.status(200).json({
            mensagem: "Produto deletado com sucesso!"
        });

    } catch (err) {
        console.error("💥 Erro ao deletar:", err);
        res.status(500).json({ erro: "Erro ao deletar produto" });
    }
});

try {
    await sequelize.authenticate();
    console.log("🎉 Conectado ao Postgres Neon com sucesso!");

    // CRIAR TABELAS AUTOMATICAMENTE
    await sequelize.sync({ alter: true }); // ou { force: true } se quiser recriar
    console.log("📦 Modelos sincronizados com o banco!");

    app.listen(PORT, () =>
        console.log(`🚀 Servidor rodando em http://${HOST}:${PORT}`)
    );
} catch (err) {
    console.error("Erro ao iniciar o servidor:", err);
}

