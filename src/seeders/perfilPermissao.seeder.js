import { Perfil, Permissao } from '../models/index.js';

export async function seedPerfilPermissoes() {
  const admin = await Perfil.findOne({ where: { codigo: 'ADMIN' } });
  const user = await Perfil.findOne({ where: { codigo: 'USER' } });

  const permissoes = await Permissao.findAll();

  // ADMIN recebe tudo
  await admin.setPermissoes(permissoes);

  // USER recebe apenas listar
  const listar = permissoes.filter(p => p.codigo === 'produto_listar');
  await user.setPermissoes(listar);

  console.log('✅ Perfil x Permissões associadas');
}