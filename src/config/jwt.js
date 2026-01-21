export default {
  secret: process.env.JWT_SECRET || 'chave_super_secreta',
  expiresIn: '1h',
};