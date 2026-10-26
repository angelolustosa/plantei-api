import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../app.js';
import { sequelize } from '../../config/database.js';

describe('Healthcheck Route', () => {
  beforeAll(async () => {
    await sequelize.authenticate();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('GET /api/health deve retornar 200 com status UP e banco CONNECTED', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'UP');
    expect(res.body).toHaveProperty('service', 'plantei-api');
    expect(res.body).toHaveProperty('database', 'CONNECTED');
    expect(res.body).toHaveProperty('uptimeSeconds');
    expect(res.body).toHaveProperty('memoryUsageMB');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('GET /health deve retornar 200 diretamente na raiz', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
  });
});

