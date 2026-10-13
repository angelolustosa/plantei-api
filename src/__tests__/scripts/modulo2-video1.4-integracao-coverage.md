# Módulo 2 — Qualidade de Software e Testes com IA
# Vídeo 1.4 — Testes de Integração com Supertest + Relatório de Cobertura
**Duração estimada:** 10 min  
**Projeto:** `plantei-api`  
**Arquivos:** `src/__tests__/integration/auth.routes.test.js` · `src/__tests__/integration/produto.routes.test.js`

---

## 🎬 ABERTURA (0:00 – 0:40)

**[TELA: os 4 arquivos de teste unitário já existentes no explorer]**

> "Nos três vídeos anteriores a gente montou uma suíte sólida de testes unitários. Agora vamos subir um nível na pirâmide: **testes de integração**."

> "A diferença fundamental é essa: no teste unitário, a gente isolou cada peça. No teste de integração, a gente vai conectar tudo — rota, middleware, controller, service e banco — e testar o fluxo real."

---

## 📡 PARTE 1 — O que é Supertest e como funciona (0:40 – 2:00)

**[TELA: abrir `src/app.js`]**

> "Repara que o nosso `app.js` exporta o `app` do Express sem subir o servidor numa porta. Esse é o padrão correto — separar a configuração do app do ato de escutar uma porta."

> "O Supertest consegue pegar esse `app` e fazer requisições HTTP completas em memória, sem ocupar nenhuma porta de rede. É rápido, não tem conflito de porta, e funciona perfeitamente em CI/CD."

```js
import request from 'supertest';
import app from '../../app.js';

// Isso faz uma requisição POST real ao Express, sem subir servidor
const res = await request(app)
  .post('/api/auth/login')
  .send({ email: 'test@plantei.com', senha: 'Senha@123' });

expect(res.status).toBe(200);
```

> "Simples assim. O `res` tem `status`, `body`, `headers` — tudo que você esperaria de uma resposta HTTP."

---

## 🧪 PARTE 2 — Testando as rotas de autenticação (2:00 – 6:30)

**[Abrir / criar `src/__tests__/integration/auth.routes.test.js`]**

> "Testes de integração precisam de banco real. Por isso usamos `beforeAll` e `afterAll` para conectar e fechar a conexão uma vez por suíte — não reabrimos a cada teste."

```js
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../app.js';
import { sequelize } from '../../config/database.js';

const usuarioTeste = {
  nome: 'Usuário de Teste',
  email: `teste_${Date.now()}@plantei.com`, // email único por execução
  senha: 'Senha@123',
  cpf: '12345678901',
  id_perfil: 1,
};

beforeAll(async () => {
  await sequelize.authenticate(); // verifica conexão antes de começar
});

afterAll(async () => {
  await sequelize.close(); // fecha a conexão para o Jest terminar limpo
});
```

> "O `Date.now()` no email garante que cada execução usa um email diferente. Sem isso, o segundo `npm test` falharia por email duplicado."

**[Teste de register]**

```js
describe('POST /api/auth/register', () => {
  it('deve criar um novo usuário e retornar 201', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(usuarioTeste);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(usuarioTeste.email);

    // Regra de segurança: a API NUNCA deve retornar a senha
    expect(res.body).not.toHaveProperty('senha');
  });

  it('deve retornar 400 ao tentar registrar e-mail duplicado', async () => {
    await request(app).post('/api/auth/register').send(usuarioTeste);
    const res = await request(app).post('/api/auth/register').send(usuarioTeste);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('erro');
  });
});
```

**[Teste de login]**

```js
describe('POST /api/auth/login', () => {
  beforeAll(async () => {
    // Garante que o usuário existe antes dos testes de login
    await request(app).post('/api/auth/register').send(usuarioTeste);
  });

  it('deve retornar token JWT com credenciais válidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: usuarioTeste.email, senha: usuarioTeste.senha });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');

    // Verifica o formato JWT: três partes separadas por ponto
    const partes = res.body.token.split('.');
    expect(partes).toHaveLength(3);
  });

  it('deve retornar 401 com senha incorreta', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: usuarioTeste.email, senha: 'errada' });

    expect(res.status).toBe(401);
  });
});
```

> "Repara nesse teste de formato JWT. A gente divide o token por ponto — todo JWT tem exatamente três partes: header, payload e signature. Se isso mudar, algo está muito errado."

**[Rodar]**

```bash
npm test auth.routes
```

> "Os testes de integração são mais lentos — uns 3–5 segundos por conta da rede com o banco. É o preço de testar o fluxo real."

---

## 🔐 PARTE 3 — Testando rotas protegidas por JWT (6:30 – 8:30)

**[Abrir / criar `src/__tests__/integration/produto.routes.test.js`]**

> "As rotas de produto exigem autenticação. Como testamos isso? A gente faz login no `beforeAll` e guarda o token para usar em todos os testes."

```js
let tokenAdmin = '';

const adminTeste = {
  nome: 'Admin Teste',
  email: `admin_${Date.now()}@plantei.com`,
  senha: 'Admin@123',
  cpf: `${Date.now()}`.slice(0, 11).padEnd(11, '0'),
  id_perfil: 1,
};

beforeAll(async () => {
  await sequelize.authenticate();
  await request(app).post('/api/auth/register').send(adminTeste);

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: adminTeste.email, senha: adminTeste.senha });

  tokenAdmin = loginRes.body.token; // guarda para os testes
});
```

```js
describe('GET /api/produtos', () => {
  it('deve retornar 401 sem token', async () => {
    const res = await request(app).get('/api/produtos');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('erro', 'Token não informado');
  });

  it('deve aceitar token válido', async () => {
    const res = await request(app)
      .get('/api/produtos')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    // 200 ou 403 (sem permissão) — ambos confirmam que o token foi aceito
    expect([200, 403]).toContain(res.status);
  });

  it('deve retornar 401 com token malformado', async () => {
    const res = await request(app)
      .get('/api/produtos')
      .set('Authorization', 'Bearer token.invalido.aqui');

    expect(res.status).toBe(401);
  });
});
```

> "O `.set('Authorization', ...)` adiciona o header HTTP. É assim que você autentica qualquer requisição no Supertest."

---

## 📊 PARTE 4 — Relatório de Cobertura (8:30 – 9:45)

**[TELA: terminal]**

```bash
npm run test:coverage
```

> "O Jest gera um relatório mostrando quantas linhas, branches e funções foram exercitadas pelos testes. Vamos ler juntos."

**[Mostrar a saída no terminal — exemplo]**

```
----------|---------|----------|---------|---------|
File      | % Stmts | % Branch | % Funcs | % Lines |
----------|---------|----------|---------|---------|
utils/    |         |          |         |         |
  hash.js |   100   |   100    |   100   |   100   |
services/ |         |          |         |         |
  auth..  |    87   |    75    |   100   |    87   |
----------|---------|----------|---------|---------|
```

> "**Stmts**: linhas de código executadas. **Branch**: todos os `if/else` cobertos. **Funcs**: funções chamadas. **Lines**: linhas únicas tocadas."

> "Uma cobertura alta é boa, mas não é garantia de bons testes. Eu posso escrever um teste que chama todas as funções sem verificar nenhum resultado — cobertura 100%, testes inúteis."

> "A cobertura é uma métrica de *onde você ainda não foi*, não de *qualidade do que você testou*."

**[Mostrar pasta `coverage/` gerada]**

> "O Jest também gera um relatório HTML em `coverage/index.html`. Você consegue ver linha a linha o que foi ou não coberto. Muito útil para identificar gaps."

---

## 🏁 ENCERRAMENTO (9:45 – 10:00)

> "Fechamos o primeiro tema do Módulo 2. Recapitulando o que a gente construiu:"

> "- Testes unitários para as funções puras de hash"  
> "- Testes das validações do model sem banco"  
> "- Mocks para isolar o service e o middleware"  
> "- Testes de integração com Supertest para as rotas reais"  
> "- Relatório de cobertura"

> "No próximo vídeo a gente começa o **Tema 2 — Testes Automatizados com IA**: vamos usar ferramentas de IA para gerar testes automaticamente, analisar lacunas de cobertura e otimizar o que já temos."

> "Até lá."

---

## 📋 Checklist antes de gravar

- [ ] Banco Neon acessível (testar conexão antes)
- [ ] `src/__tests__/unit/` com os 4 arquivos do vídeo anterior
- [ ] `src/__tests__/integration/` vazia (vai criar ao vivo)
- [ ] `npm test` rodando sem erros nos unitários
- [ ] Terminal com fonte legível
- [ ] Pasta `coverage/` **não** existente ainda (vai ser gerada ao vivo)
