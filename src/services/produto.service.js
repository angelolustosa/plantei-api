import { Produto } from '../models/Produto.js';

class ProdutoService {
  listar() {
    return Produto.findAll({});
  }

  /* 
  listar() {
    return Produto.findAll({
      attributes: ['id', 'nome', 'preco', 'estoque'],
      include: [{
        model: Categoria,
        as: 'categoria',
        attributes: ['id', 'nome']
      }]
    });
  }
  */

  criar(payload) {
    return Produto.create(payload);
  }

  buscarPorId(id) {
    return Produto.findByPk(id);
  }
}

export default new ProdutoService();
