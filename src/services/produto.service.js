import { Produto } from '../models/Produto.js';

class ProdutoService {
  listar() {
    return Produto.findAll();
  }

  criar(payload) {
    return Produto.create(payload);
  }
}

export default new ProdutoService();
