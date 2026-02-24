import { Permissao } from '../models/index.js';

export async function seedPermissoes() {
  const permissoes = [
    { nome: 'Criar Produto', codigo: 'produto_criar' },
    { nome: 'Listar Produto', codigo: 'produto_listar' },
    { nome: 'Excluir Produto', codigo: 'produto_deletar' },
  ];

  for (const permissao of permissoes) {
    await Permissao.findOrCreate({
      where: { codigo: permissao.codigo },
      defaults: permissao,
    });
  }

  console.log('✅ Permissões criadas');
}