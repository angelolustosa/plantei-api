import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';
import { Usuario } from '../models/Usuario.js';

export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ erro: 'Token não informado' });

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    //req.user = decoded;

    const usuario = await Usuario.findByPk(decoded.id);

    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    req.user = usuario;

    next();
  } catch {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
};
