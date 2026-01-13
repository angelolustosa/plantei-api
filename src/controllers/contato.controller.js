import contatoService from '../services/contato.service.js';
import { log } from '../utils/logger.js';

export default {
  async listar(req, res, next) {
    try {
      log.info('[Contato] Listando contatos');
      const contatos = await contatoService.listar();

      return res.status(200).json({
        mensagem: 'Contatos retornados com sucesso!',
        size: contatos.length,
        data: contatos,
      });
    } catch (err) {
      log.error(err);
      next(err);
    }
  },

  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;

      const contato = await contatoService.buscarPorId(id);

      if (!contato) {
        return res.status(404).json({ erro: 'Contato não encontrado' });
      }

      return res.json(contato);
    } catch (err) {
      log.error(err);
      next(err);
    }
  },

  async criar(req, res, next) {
    try {
      const novo = await contatoService.criar(req.body);

      log.success(`[Contato] Criado: ${novo.nome}`);

      return res.status(201).json({
        mensagem: 'Contato criado com sucesso!',
        data: novo,
      });
    } catch (err) {
      log.error(err);
      next(err);
    }
  },

  async atualizar(req, res, next) {
    try {
      const { id } = req.params;

      const contato = await contatoService.atualizar(id, req.body);

      if (!contato) {
        return res.status(404).json({ erro: 'Contato não encontrado' });
      }

      return res.json({
        mensagem: 'Contato atualizado com sucesso!',
        data: contato,
      });
    } catch (err) {
      log.error(err);
      next(err);
    }
  },

  async patch(req, res, next) {
    try {
      const { id } = req.params;

      const contato = await contatoService.atualizar(id, req.body);

      if (!contato) {
        return res.status(404).json({ erro: 'Contato não encontrado' });
      }

      return res.json({
        mensagem: 'Contato atualizado parcialmente!',
        data: contato,
      });
    } catch (err) {
      log.error(err);
      next(err);
    }
  },

  async remover(req, res, next) {
    try {
      const { id } = req.params;

      const removido = await contatoService.remover(id);

      if (!removido) {
        return res.status(404).json({ erro: 'Contato não encontrado' });
      }

      return res.json({
        mensagem: 'Contato removido com sucesso!',
      });
    } catch (err) {
      log.error(err);
      next(err);
    }
  },
};
