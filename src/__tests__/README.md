# Testes — plantei-api

Estrutura de testes do projeto, organizada seguindo a **Pirâmide de Testes**.

```
src/__tests__/
  unit/
    hash.test.js              → Funções puras (sem mocks)
    produto.model.test.js     → Validações do Model Sequelize (sem banco)
    auth.service.test.js      → Lógica de negócio com mocks do banco/JWT
    auth.middleware.test.js   → Middleware com req/res/next falsos
  integration/
    auth.routes.test.js       → Fluxo HTTP completo: register / login / logout
    produto.routes.test.js    → Rotas protegidas com autenticação JWT
```

## Rodando os testes

```bash
# Instalar dependências (primeira vez)
npm install

# Todos os testes (uma execução)
npm test

# Modo watch (re-executa ao salvar)
npm run test:watch

# Com relatório de cobertura
npm run test:coverage
```

## Pirâmide de qualidade

```
        /\
       /  \   Integração (2 arquivos)
      /----\  → Testa o fluxo HTTP real com banco
     /      \
    /--------\ Unitários (4 arquivos)
   /          \ → Rápidos, sem I/O, cobrem a lógica
  /____________\
```

## Metas de cobertura

| Camada         | Meta  |
|----------------|-------|
| `utils/`       | 100%  |
| `services/`    | ≥ 80% |
| `middlewares/` | ≥ 70% |
| `controllers/` | ≥ 60% |
