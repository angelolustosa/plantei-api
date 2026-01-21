import bcrypt from 'bcrypt';

export const gerarHash = async (senha) => {
  return bcrypt.hash(senha, 10);
};

export const compararHash = async (senha, hash) => {
  return bcrypt.compare(senha, hash);
};
