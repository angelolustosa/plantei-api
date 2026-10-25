import { describe, it, expect, jest } from '@jest/globals';
import { autorizarPermissao } from '../../middlewares/autorizar.middleware.js';

describe('autorizarPermissao Middleware (Unit)', () => {
  it('deve permitir acesso (chamar next) se o usuário tiver a permissão necessária', async () => {
    const req = {
      user: {
        getPerfil: jest.fn().mockResolvedValue({
          permissoes: [
            { codigo: 'LER_PRODUTOS' },
            { codigo: 'CRIAR_PRODUTOS' },
          ],
        }),
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const middleware = autorizarPermissao('CRIAR_PRODUTOS');
    await middleware(req, res, next);

    expect(req.user.getPerfil).toHaveBeenCalledWith({
      include: { association: 'permissoes' },
    });
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('deve retornar 403 se o usuário não possuir a permissão requerida', async () => {
    const req = {
      user: {
        getPerfil: jest.fn().mockResolvedValue({
          permissoes: [
            { codigo: 'LER_PRODUTOS' },
          ],
        }),
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const middleware = autorizarPermissao('EXCLUIR_PRODUTOS');
    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      erro: 'Você não tem permissão para essa ação',
    });
  });
});
