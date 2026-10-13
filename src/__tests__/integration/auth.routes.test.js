/**
 * VÍDEO 1.4 — Testes de Integração: rotas HTTP com Supertest
 *
 * Conceito-chave: Supertest envia requisições HTTP reais para o app Express
 * sem precisar subir um servidor na porta — ideal para CI/CD.
 *
 * ATENÇÃO: estes testes usam o banco de dados real (Neon PostgreSQL).
 * Por isso são mais lentos que os unitários — e estão na base da pirâmide
 * de integração, não unitária.
 *
 * Pré-requisito: variáveis de ambiente em .env configuradas corretamente.
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../app.js';
import { sequelize } from '../../config/database.js';

// Dados usados em vários testes deste arquivo
// CPF e email únicos por execução para evitar conflito de unicidade no banco
const ts = Date.now();
const usuarioTeste = {
  nome: 'Usuário de Teste',
  email: `teste_${ts}@plantei.com`,
  senha: 'Senha@123',
  cpf: String(ts).slice(-11).padStart(11, '0'), // 11 dígitos únicos por execução
  id_perfil: 1,
};

beforeAll(async () => {
  // Garante conexão com o banco antes de todos os testes
  await sequelize.authenticate();
});

afterAll(async () => {
  // Fecha a conexão após todos os testes para evitar hang no Jest
  await sequelize.close();
});

// ─── POST /api/auth/register ──────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  it('deve criar um novo usuário e retornar 201', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(usuarioTeste);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('mensagem', 'Usuário criado com sucesso');
    expect(res.body.email).toBe(usuarioTeste.email);

    // A API NUNCA deve retornar a senha — nem hasheada
    expect(res.body).not.toHaveProperty('senha');
  });

  it('deve retornar 400 ao tentar registrar com e-mail já cadastrado', async () => {
    // Tenta cadastrar o mesmo usuário duas vezes
    await request(app).post('/api/auth/register').send(usuarioTeste);

    const res = await request(app).post('/api/auth/register').send(usuarioTeste);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('erro');
  });
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  // Garante que o usuário existe antes dos testes de login
  beforeAll(async () => {
    await request(app).post('/api/auth/register').send(usuarioTeste);
  });

  it('deve retornar token JWT com credenciais válidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: usuarioTeste.email, senha: usuarioTeste.senha });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('mensagem', 'Login realizado com sucesso');

    // Token deve ter o formato JWT: três partes separadas por ponto
    const partes = res.body.token.split('.');
    expect(partes).toHaveLength(3);
  });

  it('deve retornar 401 com senha incorreta', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: usuarioTeste.email, senha: 'senha-errada' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('erro');
  });

  it('deve retornar 401 com e-mail inexistente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'naoexiste@plantei.com', senha: 'qualquercoisa' });

    expect(res.status).toBe(401);
  });

  it('a resposta de erro deve ser igual para e-mail inválido e senha errada (segurança)', async () => {
    const resEmailInvalido = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nao@existe.com', senha: '123' });

    const resSenhaErrada = await request(app)
      .post('/api/auth/login')
      .send({ email: usuarioTeste.email, senha: 'errada' });

    // Ambos devem retornar a mesma mensagem genérica — não revelar qual campo errou
    expect(resEmailInvalido.body.erro).toBe(resSenhaErrada.body.erro);
  });
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────

describe('POST /api/auth/logout', () => {
  it('deve retornar 200 com mensagem de logout', async () => {
    const res = await request(app).post('/api/auth/logout');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('mensagem', 'Logout realizado');
  });
});
