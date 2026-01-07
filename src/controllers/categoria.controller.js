import { Categoria } from "../models/Categoria.js";
import { log } from "../utils/logger.js";

export default {
  async listar(req, res) {
    try {
      const categorias = await Categoria.findAll();

      log.info("Listando categorias...");

      return res.status(200).json({
        mensagem: "categorias retornados com sucesso!",
        size: categorias.length,
        data: categorias,
      });
    } catch (err) {
      log.error(err);
      return res.status(500).json({ erro: "Erro ao buscar categorias" });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;

      const categoria = await Categoria.findByPk(id);

      if (!categoria) {
        return res.status(404).json({ erro: "categoria não encontrada" });
      }

      return res.json(categoria);
    } catch (err) {
      log.error(err);
      return res.status(500).json({ erro: "Erro no servidor" });
    }
  },

  async criar(req, res) {
    try {
      const payload = req.body;

      const novo = await Categoria.create(payload);

      log.success(`categoria criado: ${novo.nome}`);

      return res.status(201).json({
        mensagem: "categoria criada com sucesso!",
        data: novo,
      });
    } catch (err) {
      log.error(err);

      if (err.name === "SequelizeValidationError") {
        return res.status(400).json({
          erro: err.errors.map((e) => e.message),
        });
      }

      return res.status(500).json({ erro: "Erro ao criar categoria" });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const payload = req.body;

      const categoria = await Categoria.findByPk(id);

      if (!categoria) {
        return res.status(404).json({ erro: "categoria não encontrada" });
      }

      await categoria.update(payload);

      return res.json({
        mensagem: "categoria atualizada com sucesso!",
        data: categoria,
      });
    } catch (err) {
      log.error(err);
      return res.status(500).json({ erro: "Erro ao atualizar categoria" });
    }
  },

  async patch(req, res) {
    try {
      const { id } = req.params;
      const payload = req.body;

      const categoria = await Categoria.findByPk(id);

      if (!categoria) {
        return res.status(404).json({ erro: "categoria não encontrada" });
      }

      await categoria.update(payload);

      return res.json({
        mensagem: "categoria atualizado parcialmente!",
        data: categoria,
      });
    } catch (err) {
      log.error(err);
      return res.status(500).json({ erro: "Erro ao atualizar parcialmente categoria" });
    }
  },

  async remover(req, res) {
    try {
      const { id } = req.params;

      const categoria = await Categoria.findByPk(id);

      if (!categoria) {
        return res.status(404).json({ erro: "categoria não encontrada" });
      }

      await categoria.destroy();

      return res.json({ mensagem: "categoria removida com sucesso!" });
    } catch (err) {
      log.error(err);
      return res.status(500).json({ erro: "Erro ao remover categoria" });
    }
  },
};
