import { Produto } from '../models/Produto.js';

class ProdutoService {
  listar() {
    return Produto.findAll();
  }

  criar(payload) {
    return Produto.create(payload);
  }

  buscarPorId(id) {
    return Produto.findByPk(id);
  }
}

export default new ProdutoService();
