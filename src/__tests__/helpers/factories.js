// Fábricas de dados de teste reutilizáveis.
// Geram valores únicos por chamada para evitar colisões de constraints
// (email e CPF são UNIQUE no model Usuario), já que os testes de integração
// apontam para um banco compartilhado.

/**
 * Gera um CPF fictício de 11 dígitos, único por chamada.
 * Não é um CPF válido (sem dígito verificador) — serve apenas para testes,
 * já que o model valida somente o tamanho (11 caracteres).
 *
 * @returns {string} CPF com 11 dígitos
 */
export const gerarCpf = () => {
  const base = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return base.slice(-11).padStart(11, '0');
};

/**
 * Gera um email único por chamada.
 *
 * @param {string} [prefixo='teste'] - Prefixo do email
 * @param {string} [dominio='plantei.com'] - Domínio do email
 * @returns {string} Email único
 */
export const gerarEmail = (prefixo = 'teste', dominio = 'plantei.com') => {
  const sufixo = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return `${prefixo}_${sufixo}@${dominio}`;
};

/**
 * Cria um payload de usuário de teste com email e CPF únicos.
 * Campos podem ser sobrescritos via overrides.
 *
 * @param {object} [overrides={}] - Campos para sobrescrever os valores padrão
 * @returns {object} Payload de usuário
 */
export const criarUsuarioTeste = (overrides = {}) => ({
  nome: 'Usuário de Teste',
  email: gerarEmail(),
  senha: 'Senha@123',
  cpf: gerarCpf(),
  id_perfil: 1,
  ...overrides,
});

export const criarAdminTeste = (overrides = {}) => ({
  nome: 'Admin Teste',
  email: gerarEmail('admin'),
  senha: 'Admin@123',
  cpf: gerarCpf(),
  id_perfil: 1,
  ...overrides,
});