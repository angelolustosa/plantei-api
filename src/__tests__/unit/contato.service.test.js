import { describe, it, expect, jest, beforeEach } from '@jest/globals';

const mockContato = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
};

jest.unstable_mockModule('../../models/Contato.js', () => ({
  Contato: mockContato,
}));

const { default: contatoService } = await import('../../services/contato.service.js');

describe('ContatoService (Unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listar', () => {
    it('deve listar todos os contatos', async () => {
      const listaFalsa = [{ id: 1, nome: 'Maria' }, { id: 2, nome: 'João' }];
      mockContato.findAll.mockResolvedValue(listaFalsa);

      const resultado = await contatoService.listar();

      expect(mockContato.findAll).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(listaFalsa);
    });
  });

  describe('buscarPorId', () => {
    it('deve retornar contato quando id existir', async () => {
      const contatoFalso = { id: 10, nome: 'Ana' };
      mockContato.findByPk.mockResolvedValue(contatoFalso);

      const resultado = await contatoService.buscarPorId(10);

      expect(mockContato.findByPk).toHaveBeenCalledWith(10);
      expect(resultado).toEqual(contatoFalso);
    });

    it('deve retornar null quando contato não existir', async () => {
      mockContato.findByPk.mockResolvedValue(null);

      const resultado = await contatoService.buscarPorId(999);

      expect(mockContato.findByPk).toHaveBeenCalledWith(999);
      expect(resultado).toBeNull();
    });
  });

  describe('criar', () => {
    it('deve criar um novo contato com sucesso', async () => {
      const payload = { nome: 'Carlos', email: 'carlos@plantei.com', mensagem: 'Dúvida' };
      const criado = { id: 1, ...payload };
      mockContato.create.mockResolvedValue(criado);

      const resultado = await contatoService.criar(payload);

      expect(mockContato.create).toHaveBeenCalledWith(payload);
      expect(resultado).toEqual(criado);
    });
  });

  describe('atualizar', () => {
    it('deve atualizar contato existente', async () => {
      const instanciaMock = {
        id: 1,
        nome: 'Antigo',
        update: jest.fn().mockResolvedValue(true),
      };
      mockContato.findByPk.mockResolvedValue(instanciaMock);

      const payload = { nome: 'Novo Nome' };
      const resultado = await contatoService.atualizar(1, payload);

      expect(mockContato.findByPk).toHaveBeenCalledWith(1);
      expect(instanciaMock.update).toHaveBeenCalledWith(payload);
      expect(resultado).toBe(instanciaMock);
    });

    it('deve retornar null ao tentar atualizar contato inexistente', async () => {
      mockContato.findByPk.mockResolvedValue(null);

      const resultado = await contatoService.atualizar(999, { nome: 'Novo' });

      expect(resultado).toBeNull();
    });
  });

  describe('remover', () => {
    it('deve remover contato existente e retornar true', async () => {
      const instanciaMock = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };
      mockContato.findByPk.mockResolvedValue(instanciaMock);

      const resultado = await contatoService.remover(1);

      expect(mockContato.findByPk).toHaveBeenCalledWith(1);
      expect(instanciaMock.destroy).toHaveBeenCalledTimes(1);
      expect(resultado).toBe(true);
    });

    it('deve retornar null ao tentar remover contato inexistente', async () => {
      mockContato.findByPk.mockResolvedValue(null);

      const resultado = await contatoService.remover(999);

      expect(resultado).toBeNull();
    });
  });
});
