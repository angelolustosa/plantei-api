/**
 * VÍDEO 1.3 — Mocks: testando a camada de Service sem banco de dados
 *
 * Conceito-chave: jest.unstable_mockModule() substitui módulos reais por
 * versões controladas pelo teste. Isso garante:
 *  - Velocidade (sem I/O de banco)
 *  - Isolamento (o service é testado sozinho)
 *  - Determinismo (os dados não mudam entre execuções)
 *
 * NOTA ESM: com "type":"module" o jest.mock() estático não funciona.
 * Usamos jest.unstable_mockModule() + import dinâmico, que é a API
 * correta do Jest para projetos ESM puros.
 * Os mocks devem ser declarados ANTES do import dinâmico do módulo testado.
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// ── 1. Mockar dependências externas ──────────────────────────────────────────

const usuarioModelMock = { create: jest.fn(), findOne: jest.fn() };

// Mock do banco de dados (models)
jest.unstable_mockModule('../../models/index.js', () => ({
  Usuario: usuarioModelMock,
  Perfil: {},
}));

const hashMock = { gerarHash: jest.fn(), compararHash: jest.fn() };

// Mock das funções de hash
jest.unstable_mockModule('../../utils/hash.js', () => hashMock);

// Mock do JWT
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: { sign: jest.fn(() => 'token-de-teste-mockado') },
}));

// ── 2. Importar dinamicamente APÓS registrar os mocks ────────────────────────

const authService = await import('../../services/auth.service.js');
const { Usuario } = await import('../../models/index.js');
const { gerarHash, compararHash } = await import('../../utils/hash.js');

// ── 3. Dados reutilizáveis ────────────────────────────────────────────────────

const usuarioMock = {
  id: 1,
  nome: 'Ana Silva',
  email: 'ana@plantei.com',
  senha: '$2b$10$hashfakeparatestes',
  perfil: { nome: 'Cliente', codigo: 'CLIENTE' },
};

// ── 4. Testes ─────────────────────────────────────────────────────────────────

describe('authService.registrarUsuario()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve criar usuário com a senha hasheada (nunca a senha em texto puro)', async () => {
    // Arrange
    const payload = { nome: 'Ana', email: 'ana@plantei.com', senha: 'Senha@123' };
    gerarHash.mockResolvedValue('$2b$10$hashgerado');
    Usuario.create.mockResolvedValue({ id: 1, ...payload, senha: '$2b$10$hashgerado' });

    // Act
    await authService.registrarUsuario(payload);

    // Assert — o service deve ter chamado gerarHash antes de salvar
    expect(gerarHash).toHaveBeenCalledWith('Senha@123');

    // Assert — o create nunca deve receber a senha em texto puro
    expect(Usuario.create).toHaveBeenCalledWith(
      expect.objectContaining({ senha: '$2b$10$hashgerado' })
    );
    expect(Usuario.create).not.toHaveBeenCalledWith(
      expect.objectContaining({ senha: 'Senha@123' })
    );
  });
});

describe('authService.autenticarUsuario()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve lançar erro quando o e-mail não existe no banco', async () => {
    // Arrange
    Usuario.findOne.mockResolvedValue(null); // banco não encontrou o usuário

    // Act & Assert
    await expect(
      authService.autenticarUsuario({ email: 'naoexiste@x.com', senha: '123' })
    ).rejects.toThrow('Usuário ou senha inválidos');
  });

  it('deve lançar erro quando a senha está incorreta', async () => {
    // Arrange
    Usuario.findOne.mockResolvedValue(usuarioMock);
    compararHash.mockResolvedValue(false); // senha errada

    // Act & Assert
    await expect(
      authService.autenticarUsuario({ email: 'ana@plantei.com', senha: 'senhaerrada' })
    ).rejects.toThrow('Usuário ou senha inválidos');
  });

  it('deve retornar token e usuário com credenciais corretas', async () => {
    // Arrange
    Usuario.findOne.mockResolvedValue(usuarioMock);
    compararHash.mockResolvedValue(true); // senha correta

    // Act
    const resultado = await authService.autenticarUsuario({
      email: 'ana@plantei.com',
      senha: 'Senha@123',
    });

    // Assert
    expect(resultado).toHaveProperty('token', 'token-de-teste-mockado');
    expect(resultado).toHaveProperty('usuario', usuarioMock);
  });

  it('a mensagem de erro deve ser a mesma para e-mail inexistente e senha errada', async () => {
    // Segurança: não deve revelar qual dado está errado
    const mensagemEsperada = 'Usuário ou senha inválidos';

    Usuario.findOne.mockResolvedValue(null);
    const erro1 = await authService
      .autenticarUsuario({ email: 'x@x.com', senha: '123' })
      .catch((e) => e.message);

    Usuario.findOne.mockResolvedValue(usuarioMock);
    compararHash.mockResolvedValue(false);
    const erro2 = await authService
      .autenticarUsuario({ email: 'ana@plantei.com', senha: 'errada' })
      .catch((e) => e.message);

    expect(erro1).toBe(mensagemEsperada);
    expect(erro2).toBe(mensagemEsperada);
  });
});
