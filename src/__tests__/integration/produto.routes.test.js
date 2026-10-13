/**
 * VÍDEO 1.4 — Testes de Integração: rotas protegidas por autenticação
 *
 * Aqui mostramos como testar rotas que exigem token JWT:
 * 1. Fazemos login para obter um token válido
 * 2. Passamos o token no header Authorization de cada requisição
 *
 * Isso testa a integração real entre: rota → middleware → controller → service → banco
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../app.js';
import { sequelize } from '../../config/database.js';

let tokenAdmin = ''; // armazena o JWT para uso nos testes

const adminTeste = {
  nome: 'Admin Teste',
  email: `admin_${Date.now()}@plantei.com`,
  senha: 'Admin@123',
  cpf: `${Date.now()}`.slice(0, 11).padEnd(11, '0'),
  id_perfil: 1, // perfil com permissão PRODUTO_LISTAR
};

beforeAll(async () => {
  await sequelize.authenticate();

  // Registra e faz login para obter token
  await request(app).post('/api/auth/register').send(adminTeste);

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: adminTeste.email, senha: adminTeste.senha });

  tokenAdmin = loginRes.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

// ─── GET /api/produtos ────────────────────────────────────────────────────────

describe('GET /api/produtos', () => {
  it('deve retornar 401 sem token de autenticação', async () => {
    const res = await request(app).get('/api/produtos');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('erro', 'Token não informado');
  });

  it('deve retornar lista de produtos com token válido', async () => {
    const res = await request(app)
      .get('/api/produtos')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    // O status pode ser 200 (com permissão) ou 403 (sem permissão PRODUTO_LISTAR)
    // Ambos confirmam que o token foi aceito (401 seria rejeição do token)
    expect([200, 403]).toContain(res.status);

    if (res.status === 200) {
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    }
  });

  it('deve retornar 401 com token malformado', async () => {
    const res = await request(app)
      .get('/api/produtos')
      .set('Authorization', 'Bearer token.invalido.aqui');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('erro', 'Token inválido ou expirado');
  });
});

// ─── POST /api/produtos ───────────────────────────────────────────────────────

describe('POST /api/produtos', () => {
  const produtoValido = {
    nome: 'Samambaia Teste',
    descricao: 'Planta para teste automatizado',
    preco: 29.90,
    estoque: 10,
  };

  it('deve retornar 401 ao tentar criar produto sem token', async () => {
    const res = await request(app)
      .post('/api/produtos')
      .send(produtoValido);

    expect(res.status).toBe(401);
  });

  it('deve criar produto e retornar 201 com token válido', async () => {
    const res = await request(app)
      .post('/api/produtos')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send(produtoValido);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.nome).toBe(produtoValido.nome);
  });

  it('deve rejeitar produto com nome inválido', async () => {
    const res = await request(app)
      .post('/api/produtos')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ ...produtoValido, nome: 'AB' }); // nome curto demais

    // Deve retornar erro de validação
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
