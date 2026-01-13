import { Contato } from '../models/Contato.js';

class ContatoService {
  listar() {
    return Contato.findAll();
  }

  buscarPorId(id) {
    return Contato.findByPk(id);
  }

  criar(payload) {
    return Contato.create(payload);
  }

  async atualizar(id, payload) {
    const contato = await Contato.findByPk(id);
    if (!contato) return null;

    await contato.update(payload);
    return contato;
  }

  async remover(id) {
    const contato = await Contato.findByPk(id);
    if (!contato) return null;

    await contato.destroy();
    return true;
  }
}

export default new ContatoService();
