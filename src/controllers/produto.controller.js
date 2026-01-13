import produtoService from '../services/produto.service.js';
import { log } from '../utils/logger.js';

export default {
  async listar(req, res, next) {
    try {
      log.info('[Produto] Listando produtos');
      const produtos = await produtoService.listar();

      return res.status(200).json({
        mensagem: 'Produtos retornados com sucesso!',
        size: produtos.length,
        data: produtos,
      });
    } catch (err) {
      log.error(err);
      next(err);
    }
  },

  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;

      const produto = await produtoService.buscarPorId(id);

      if (!produto) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
      }

      return res.json(produto);
    } catch (err) {
      log.error(err);
      next(err);
    }
  },

  async criar(req, res, next) {
    try {
      const novo = await produtoService.criar(req.body);

      log.success(`[Produto] Criado: ${novo.nome}`);

      return res.status(201).json({
        mensagem: 'Produto criado com sucesso!',
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

      const produto = await produtoService.atualizar(id, req.body);

      if (!produto) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
      }

      return res.json({
        mensagem: 'Produto atualizado com sucesso!',
        data: produto,
      });
    } catch (err) {
      log.error(err);
      next(err);
    }
  },

  async patch(req, res, next) {
    try {
      const { id } = req.params;

      const produto = await produtoService.atualizar(id, req.body);

      if (!produto) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
      }

      return res.json({
        mensagem: 'Produto atualizado parcialmente!',
        data: produto,
      });
    } catch (err) {
      log.error(err);
      next(err);
    }
  },

  async remover(req, res, next) {
    try {
      const { id } = req.params;

      const removido = await produtoService.remover(id);

      if (!removido) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
      }

      return res.json({
        mensagem: 'Produto removido com sucesso!',
      });
    } catch (err) {
      log.error(err);
      next(err);
    }
  },
};
