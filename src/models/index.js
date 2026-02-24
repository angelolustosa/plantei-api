import { Produto } from './Produto.js';
import { Contato } from './Contato.js';
import { Usuario } from './Usuario.js';
import { Perfil } from './Perfil.js';
import { Permissao } from './Permissoes.js';

// Perfil 1:N Usuario
Usuario.belongsTo(Perfil, { foreignKey: 'id_perfil', as: 'perfil' });
Perfil.hasMany(Usuario, { foreignKey: 'id_perfil', as: 'usuarios' });

// Perfil N:N Permissao
Perfil.belongsToMany(Permissao, {
  through: 'perfil_permissoes',
  foreignKey: 'perfil_id',
  otherKey: 'permissao_id',
  as: 'permissoes',
});

Permissao.belongsToMany(Perfil, {
  through: 'perfil_permissoes',
  foreignKey: 'permissao_id',
  otherKey: 'perfil_id',
  as: 'perfil',
});

export {
  Produto,
  Contato,
  Usuario,
  Perfil,
  Permissao
};
