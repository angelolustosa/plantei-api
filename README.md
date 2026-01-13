# Plantei API

API para gerenciamento de produtos e contatos do sistema Plantei.

## Funcionalidades

- Gerenciamento de produtos (CRUD completo)
- Gerenciamento de contatos
- Documentação automática com Swagger
- Health check da API

## Tecnologias

- Node.js
- Express.js
- Sequelize (ORM)
- PostgreSQL
- Swagger (Documentação)

## Instalação

```bash
npm install
```

## Configuração

Crie um arquivo `.env` com as seguintes variáveis:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=plantei
DB_USER=seu_usuario
DB_PASS=sua_senha
PORT=3000
```

## Execução

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

## Deploy no Render

### 1. Configuração no Render

1. Conecte seu repositório GitHub ao Render
2. Configure as seguintes variáveis de ambiente:

```env
DB_HOST=seu_host_postgresql
DB_PORT=5432
DB_NAME=plantei
DB_USER=seu_usuario
DB_PASS=sua_senha
NODE_ENV=production
```

### 2. Configurações de Build

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: 18 ou superior

### 3. Banco de Dados

Recomenda-se usar o PostgreSQL do próprio Render ou um serviço externo como:
- Render PostgreSQL
- Supabase
- ElephantSQL

### 4. Acesso à Documentação

Após o deploy, a documentação estará disponível em:
`https://seu-app.onrender.com/api-docs`

## Documentação da API

Após iniciar o servidor, acesse a documentação interativa do Swagger em:

**http://localhost:3000/api-docs**

A documentação inclui:
- Todos os endpoints disponíveis
- Exemplos de requisições e respostas
- Schemas dos dados
- Possibilidade de testar os endpoints diretamente

## Endpoints Principais

### Produtos
- `GET /api/produtos` - Lista todos os produtos
- `GET /api/produtos/:id` - Busca produto por ID
- `POST /api/produtos` - Cria novo produto
- `PUT /api/produtos/:id` - Atualiza produto completo
- `PATCH /api/produtos/:id` - Atualiza produto parcial
- `DELETE /api/produtos/:id` - Remove produto

### Contatos
- `GET /api/contatos` - Lista todos os contatos
- `GET /api/contatos/:id` - Busca contato por ID
- `POST /api/contatos` - Cria novo contato

### Health
- `GET /api/health` - Status da API

## Desenvolvimento

### Estrutura do Projeto

```
src/
├── config/          # Configurações (DB, CORS, Swagger)
├── controllers/     # Controladores das rotas
├── middlewares/     # Middlewares customizados
├── models/          # Modelos do Sequelize
├── routes/          # Definição das rotas
├── services/        # Lógica de negócio
├── utils/           # Utilitários
├── app.js           # Configuração do Express
└── server.js        # Inicialização do servidor
```

### Testando a API

1. **Via Swagger UI**: Acesse http://localhost:3000/api-docs
2. **Via Postman**: Importe a collection usando a URL do Swagger JSON
3. **Via cURL**: Use os exemplos da documentação

### Exemplos de Uso

#### Criar um Produto
```bash
curl -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Tomate Orgânico",
    "descricao": "Tomates orgânicos frescos",
    "preco": 12.50,
    "estoque": 100,
    "image_url": "https://exemplo.com/tomate.jpg"
  }'
```

#### Criar um Contato
```bash
curl -X POST http://localhost:3000/api/contatos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "mensagem": "Gostaria de mais informações sobre os produtos."
  }'
```

## Branch de Desenvolvimento

Para criar a branch de contato:

```bash
git checkout -b contato
```

### Tarefas Back-end ✅
- [x] Criar o model
- [x] Conferir se foi criada a tabela
- [x] Criar os endpoints da API
- [x] Testar no Postman
- [x] Adicionar documentação Swagger

### Tarefas Front-end
- [ ] Criar em /pages o Contato.jsx
- [ ] Adicionar a rota no main.jsx
- [ ] Criar o formulário
- [ ] HandleSubmit para chamar o POST
- [ ] Mostrar mensagem após salvar
- [ ] Validação do campo mensagem (até 500 caracteres)

