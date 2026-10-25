import { describe, it, expect, jest, beforeEach } from '@jest/globals';

const contatoModelMock = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
};

jest.unstable_mockModule('../../models/Contato.js', () => ({
  Contato: contatoModelMock,
}));

const { default: contatoService } = await import('../../services/contato.service.js');
const { Contato } = await import('../../models/Contato.js');

describe('contatoService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('listar()', () => {
    it('deve chamar Contato.findAll() e retornar a lista de contatos', async () => {
      // Arrange
      const contatos = [{ id: 1, nome: 'Ana Silva' }, { id: 2, nome: 'João Souza' }];
      Contato.findAll.mockResolvedValue(contatos);

      // Act
      const resultado = await contatoService.listar();

      // Assert
      expect(Contato.findAll).toHaveBeenCalledTimes(1);
      expect(resultado).toBe(contatos);
    });
  });

  describe('buscarPorId()', () => {
    it('deve chamar Contato.findByPk(id) e retornar o contato encontrado', async () => {
      // Arrange
      const id = 1;
      const contato = { id, nome: 'Ana Silva' };
      Contato.findByPk.mockResolvedValue(contato);

      // Act
      const resultado = await contatoService.buscarPorId(id);

      // Assert
      expect(Contato.findByPk).toHaveBeenCalledWith(id);
      expect(resultado).toBe(contato);
    });

    it('deve retornar null quando o contato não existir', async () => {
      // Arrange
      const id = 99;
      Contato.findByPk.mockResolvedValue(null);

      // Act
      const resultado = await contatoService.buscarPorId(id);

      // Assert
      expect(Contato.findByPk).toHaveBeenCalledWith(id);
      expect(resultado).toBeNull();
    });
  });

  describe('criar()', () => {
    it('deve chamar Contato.create(payload) e retornar o contato criado', async () => {
      // Arrange
      const payload = {
        nome: 'Ana Silva',
        email: 'ana@example.com',
        mensagem: 'Olá!',
      };
      const contatoCriado = { id: 1, ...payload };
      Contato.create.mockResolvedValue(contatoCriado);

      // Act
      const resultado = await contatoService.criar(payload);

      // Assert
      expect(Contato.create).toHaveBeenCalledWith(payload);
      expect(resultado).toBe(contatoCriado);
    });
  });

  describe('atualizar()', () => {
    it('deve retornar null quando o contato não existir', async () => {
      // Arrange
      const id = 99;
      const payload = { nome: 'Nome atualizado' };
      Contato.findByPk.mockResolvedValue(null);

      // Act
      const resultado = await contatoService.atualizar(id, payload);

      // Assert
      expect(Contato.findByPk).toHaveBeenCalledWith(id);
      expect(resultado).toBeNull();
    });

    it('deve atualizar e retornar o contato quando ele existir', async () => {
      // Arrange
      const id = 1;
      const payload = { nome: 'Ana Silva Atualizada' };
      const contato = { id, nome: 'Ana Silva', update: jest.fn() };
      Contato.findByPk.mockResolvedValue(contato);
      contato.update.mockResolvedValue(contato);

      // Act
      const resultado = await contatoService.atualizar(id, payload);

      // Assert
      expect(contato.update).toHaveBeenCalledWith(payload);
      expect(resultado).toBe(contato);
    });
  });

  describe('remover()', () => {
    it('deve retornar null quando o contato não existir', async () => {
      // Arrange
      const id = 99;
      Contato.findByPk.mockResolvedValue(null);

      // Act
      const resultado = await contatoService.remover(id);

      // Assert
      expect(Contato.findByPk).toHaveBeenCalledWith(id);
      expect(resultado).toBeNull();
    });

    it('deve excluir o contato e retornar true quando ele existir', async () => {
      // Arrange
      const id = 1;
      const contato = { id, destroy: jest.fn() };
      Contato.findByPk.mockResolvedValue(contato);
      contato.destroy.mockResolvedValue(undefined);

      // Act
      const resultado = await contatoService.remover(id);

      // Assert
      expect(contato.destroy).toHaveBeenCalledTimes(1);
      expect(resultado).toBe(true);
    });
  });
});
