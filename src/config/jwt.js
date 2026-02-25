export default {
  // Chave secreta para assinar o token JWT em https://jwtsecrets.com/ (256 bits)
  secret: process.env.JWT_SECRET || '2bf66e6bf284d3c7c554022e61bbe3b02ab29de157ea3349f821960bfbb36728',
  expiresIn: '30m', // Tempo de expiração do token
};