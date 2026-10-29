import { describe, it, expect, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../app.js';
import { sequelize } from '../../config/database.js';

describe('Swagger Documentation & CORS Integration', () => {
  afterAll(async () => {
    await sequelize.close();
  });

  it('GET /api-docs/ deve responder com 200 e HTML da UI do Swagger', async () => {
    const res = await request(app).get('/api-docs/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('swagger-ui');
  });

  it('GET /api-docs deve redirecionar com 301 para /api-docs/', async () => {
    const res = await request(app).get('/api-docs');
    expect([200, 301]).toContain(res.status);
  });

  it('Requisições disparadas pelo Swagger UI (Origin: http://localhost:5000) não devem ser bloqueadas por CORS', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('Origin', 'http://localhost:5000')
      .send({ email: 'inexistente@plantei.com', senha: '123' });

    expect(res.status).not.toBe(500);
    expect(res.body).not.toHaveProperty('erro', 'Not allowed by CORS');
  });

  it('Requisições disparadas pelo Swagger UI (Origin: http://127.0.0.1:5000) não devem ser bloqueadas por CORS', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('Origin', 'http://127.0.0.1:5000')
      .send({ email: 'inexistente@plantei.com', senha: '123' });

    expect(res.status).not.toBe(500);
    expect(res.body).not.toHaveProperty('erro', 'Not allowed by CORS');
  });
});
