import { Permissao } from '../models/index.js';

export async function seedPermissoes() {
  const permissoes = [
    { nome: 'Criar Produto', codigo: 'PRODUTO_CRIAR' },
    { nome: 'Listar Produto', codigo: 'PRODUTO_LISTAR' },
    { nome: 'Excluir Produto', codigo: 'PRODUTO_DELETAR' },
  ];

  for (const permissao of permissoes) {
    await Permissao.findOrCreate({
      where: { codigo: permissao.codigo },
      defaults: permissao,
    });
  }

  console.log('✅ Permissões criadas');
}