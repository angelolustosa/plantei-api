import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';

export default (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ erro: 'Token não informado' });

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
};
