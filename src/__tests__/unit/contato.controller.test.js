import { beforeEach, describe, expect, it, jest } from '@jest/globals';

const contatoServiceMock = {
  listar: jest.fn(),
  buscarPorId: jest.fn(),
  criar: jest.fn(),
  atualizar: jest.fn(),
  remover: jest.fn(),
};

const logMock = {
  info: jest.fn(),
  success: jest.fn(),
  error: jest.fn(),
};

jest.unstable_mockModule('../../services/contato.service.js', () => ({
  default: contatoServiceMock,
}));

jest.unstable_mockModule('../../utils/logger.js', () => ({
  log: logMock,
}));

const { default: contatoController } = await import(
  '../../controllers/contato.controller.js'
);

describe('contatoController', () => {
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  describe('listar()', () => {
    it('retorna a lista de contatos', async () => {
      const contatos = [{ id: 1, nome: 'Ana' }];
      contatoServiceMock.listar.mockResolvedValue(contatos);

      await contatoController.listar({}, res, next);

      expect(logMock.info).toHaveBeenCalledWith('[Contato] Listando contatos');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        mensagem: 'Contatos retornados com sucesso!',
        size: 1,
        data: contatos,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('encaminha erros do service', async () => {
      const error = new Error('Falha ao listar');
      contatoServiceMock.listar.mockRejectedValue(error);

      await contatoController.listar({}, res, next);

      expect(logMock.error).toHaveBeenCalledWith(error);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('buscarPorId()', () => {
    it('retorna o contato encontrado', async () => {
      const contato = { id: 1, nome: 'Ana' };
      contatoServiceMock.buscarPorId.mockResolvedValue(contato);

      await contatoController.buscarPorId({ params: { id: '1' } }, res, next);

      expect(contatoServiceMock.buscarPorId).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(contato);
      expect(next).not.toHaveBeenCalled();
    });

    it('retorna 404 quando o contato não existe', async () => {
      contatoServiceMock.buscarPorId.mockResolvedValue(null);

      await contatoController.buscarPorId({ params: { id: '99' } }, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Contato não encontrado' });
      expect(next).not.toHaveBeenCalled();
    });

    it('encaminha erros do service', async () => {
      const error = new Error('Falha ao buscar');
      contatoServiceMock.buscarPorId.mockRejectedValue(error);

      await contatoController.buscarPorId({ params: { id: '1' } }, res, next);

      expect(logMock.error).toHaveBeenCalledWith(error);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('criar()', () => {
    it('cria contato e retorna 201', async () => {
      const payload = { nome: 'Ana', email: 'ana@example.com' };
      const contato = { id: 1, ...payload };
      contatoServiceMock.criar.mockResolvedValue(contato);

      await contatoController.criar({ body: payload }, res, next);

      expect(contatoServiceMock.criar).toHaveBeenCalledWith(payload);
      expect(logMock.success).toHaveBeenCalledWith('[Contato] Criado: Ana');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        mensagem: 'Contato criado com sucesso!',
        data: contato,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('encaminha erros do service', async () => {
      const error = new Error('Falha ao criar');
      contatoServiceMock.criar.mockRejectedValue(error);

      await contatoController.criar({ body: {} }, res, next);

      expect(logMock.error).toHaveBeenCalledWith(error);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('atualizar()', () => {
    it('atualiza contato existente', async () => {
      const payload = { nome: 'Ana atualizada' };
      const contato = { id: 1, ...payload };
      contatoServiceMock.atualizar.mockResolvedValue(contato);

      await contatoController.atualizar(
        { params: { id: '1' }, body: payload },
        res,
        next,
      );

      expect(contatoServiceMock.atualizar).toHaveBeenCalledWith('1', payload);
      expect(res.json).toHaveBeenCalledWith({
        mensagem: 'Contato atualizado com sucesso!',
        data: contato,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('retorna 404 quando o contato não existe', async () => {
      contatoServiceMock.atualizar.mockResolvedValue(null);

      await contatoController.atualizar(
        { params: { id: '99' }, body: {} },
        res,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Contato não encontrado' });
      expect(next).not.toHaveBeenCalled();
    });

    it('encaminha erros do service', async () => {
      const error = new Error('Falha ao atualizar');
      contatoServiceMock.atualizar.mockRejectedValue(error);

      await contatoController.atualizar(
        { params: { id: '1' }, body: {} },
        res,
        next,
      );

      expect(logMock.error).toHaveBeenCalledWith(error);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('patch()', () => {
    it('atualiza parcialmente contato existente', async () => {
      const payload = { nome: 'Ana parcial' };
      const contato = { id: 1, ...payload };
      contatoServiceMock.atualizar.mockResolvedValue(contato);

      await contatoController.patch(
        { params: { id: '1' }, body: payload },
        res,
        next,
      );

      expect(contatoServiceMock.atualizar).toHaveBeenCalledWith('1', payload);
      expect(res.json).toHaveBeenCalledWith({
        mensagem: 'Contato atualizado parcialmente!',
        data: contato,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('retorna 404 quando o contato não existe', async () => {
      contatoServiceMock.atualizar.mockResolvedValue(null);

      await contatoController.patch(
        { params: { id: '99' }, body: {} },
        res,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Contato não encontrado' });
      expect(next).not.toHaveBeenCalled();
    });

    it('encaminha erros do service', async () => {
      const error = new Error('Falha ao atualizar parcialmente');
      contatoServiceMock.atualizar.mockRejectedValue(error);

      await contatoController.patch(
        { params: { id: '1' }, body: {} },
        res,
        next,
      );

      expect(logMock.error).toHaveBeenCalledWith(error);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('remover()', () => {
    it('remove contato existente', async () => {
      contatoServiceMock.remover.mockResolvedValue(true);

      await contatoController.remover({ params: { id: '1' } }, res, next);

      expect(contatoServiceMock.remover).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith({
        mensagem: 'Contato removido com sucesso!',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('retorna 404 quando o contato não existe', async () => {
      contatoServiceMock.remover.mockResolvedValue(null);

      await contatoController.remover({ params: { id: '99' } }, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Contato não encontrado' });
      expect(next).not.toHaveBeenCalled();
    });

    it('encaminha erros do service', async () => {
      const error = new Error('Falha ao remover');
      contatoServiceMock.remover.mockRejectedValue(error);

      await contatoController.remover({ params: { id: '1' } }, res, next);

      expect(logMock.error).toHaveBeenCalledWith(error);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
