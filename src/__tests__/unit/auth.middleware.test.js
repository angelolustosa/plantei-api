/**
 * VÍDEO 1.3 — Mocks: testando middleware de autenticação
 *
 * Aqui mostramos como testar um middleware Express sem subir
 * o servidor real — usando objetos req/res/next falsos (stubs).
 *
 * NOTA ESM: com "type":"module" o jest.mock() estático não funciona.
 * Usamos jest.unstable_mockModule() + import dinâmico, que é a API
 * correta do Jest para projetos ESM puros.
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// ── 1. Declarar os mocks ANTES do import dinâmico do módulo testado ──────────

const jwtMock = { verify: jest.fn() };
const usuarioMock = { findByPk: jest.fn() };

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: jwtMock,
}));

jest.unstable_mockModule('../../models/Usuario.js', () => ({
  Usuario: usuarioMock,
}));

// ── 2. Importar dinamicamente APÓS registrar os mocks ────────────────────────

const { default: jwt } = await import('jsonwebtoken');
const { Usuario } = await import('../../models/Usuario.js');
const { default: authMiddleware } = await import('../../middlewares/auth.middleware.js');

// ── 3. Fábrica de objetos falsos de req/res/next ──────────────────────────────

function criarMocks() {
  const req = { headers: {} };
  const res = {
    status: jest.fn().mockReturnThis(), // permite encadear .status(401).json(...)
    json: jest.fn(),
  };
  const next = jest.fn();
  return { req, res, next };
}

// ── 4. Testes ─────────────────────────────────────────────────────────────────

describe('authMiddleware', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve retornar 401 quando o header Authorization não é enviado', async () => {
    const { req, res, next } = criarMocks();
    // req.headers.authorization está vazio — nenhum token

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ erro: 'Token não informado' });
    expect(next).not.toHaveBeenCalled(); // não deve prosseguir
  });

  it('deve retornar 401 quando o token é inválido ou expirado', async () => {
    const { req, res, next } = criarMocks();
    req.headers.authorization = 'Bearer token-invalido';

    // Simula jwt.verify lançando erro (token inválido)
    jwt.verify.mockImplementation(() => { throw new Error('jwt malformed'); });

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ erro: 'Token inválido ou expirado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 401 quando o usuário do token não existe mais no banco', async () => {
    const { req, res, next } = criarMocks();
    req.headers.authorization = 'Bearer token-valido';

    jwt.verify.mockReturnValue({ id: 99, email: 'deletado@test.com' });
    Usuario.findByPk.mockResolvedValue(null); // usuário foi deletado

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ erro: 'Usuário não encontrado' });
  });

  it('deve chamar next() e popular req.user quando o token é válido', async () => {
    const { req, res, next } = criarMocks();
    req.headers.authorization = 'Bearer token-valido';

    const usuario = { id: 1, nome: 'Ana', email: 'ana@plantei.com' };
    jwt.verify.mockReturnValue({ id: 1, email: 'ana@plantei.com' });
    Usuario.findByPk.mockResolvedValue(usuario);

    await authMiddleware(req, res, next);

    // O middleware deve prosseguir e injetar o usuário na requisição
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(usuario);
  });
});
