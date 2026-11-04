import { Produto } from "../models/Produto.js";

class ProdutoService {
  
  listar() {
    return Produto.findAll();
  }

  listarProdutosOtimizado = async ({ limite = 20, ultimoId = null }) => {
    const where = {};

    // Keyset Pagination: usa o índice primário (B-Tree) em O(log n), sem sofrer a degradação de OFFSET 50000
    if (ultimoId) {
      where.id = { [Op.lt]: ultimoId };
    }

    return await Produto.findAll({
      where,
      attributes: ["id", "nome", "preco", "estoque", "image_url"], // Projeta só o necessário
      include: [
        {
          model: Categoria,
          as: "categoria",
          attributes: ["id", "nome"],
          required: false, // LEFT OUTER JOIN eficiente
        },
      ],
      limit: parseInt(limite, 10),
      order: [["id", "DESC"]],
    });
  };

  criar(payload) {
    return Produto.create(payload);
  }

  buscarPorId(id) {
    return Produto.findByPk(id);
  }
}

export default new ProdutoService();
