import { Produto } from './Produto.js';
import { Contato } from './Contato.js';
import { Usuario } from './Usuario.js';
import { Perfil } from './Perfil.js';

// relacionamento
Perfil.hasMany(Usuario, { foreignKey: 'id_perfil' });
Usuario.belongsTo(Perfil, { foreignKey: 'id_perfil' });

export {
  Produto,
  Contato,
  Usuario,
  Perfil
};
