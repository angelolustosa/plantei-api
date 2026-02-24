import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';
import { Usuario, Perfil } from '../models/index.js';
import { gerarHash, compararHash } from '../utils/hash.js';

// Salva um novo usuário no banco de dados, encriptando a senha e retorna o usuário criado
export const registrarUsuario = async (payload) => {
  const senhaHash = await gerarHash(payload.senha);

  return Usuario.create({
    ...payload,
    senha: senhaHash,
  });
};

export const autenticarUsuario = async ({ email, senha }) => {
  // Buscar usuário pelo email, apenas um usuário já deve existir apenas um por email
  const usuario = await Usuario.findOne({
    where: { email },
    include: {
      model: Perfil,
      as: 'perfil',
    },
  });
  // Se não encontrar ou a senha for inválida, lança erro
  if (!usuario) throw new Error('Usuário ou senha inválidos');

  // Verificar se a senha bate com o que foi informado no campo do login
  const senhaValida = await compararHash(senha, usuario.senha);

  // Se a senha não for válida, lança erro
  if (!senhaValida) throw new Error('Usuário ou senha inválidos');

  // Gerar um token JWT para o usuário autenticado
  const token = jwt.sign(
    { id: usuario.id, email: usuario.email }, // ao invés do email posso utilizar o perfil: usuario.perfil.codigo,
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  return { token, usuario };
};
