import * as authService from '../services/auth.service.js';

export default {
  async register(req, res) {
    try {
      const usuario = await authService.registrarUsuario(req.body);

      return res.status(201).json({
        mensagem: 'Usuário criado com sucesso',
        id: usuario.id,
        email: usuario.email,
      });
    } catch (err) {
      return res.status(400).json({ erro: err.message });
    }
  },

  async login(req, res) {
    try {
      const { token, usuario } = await authService.autenticarUsuario(req.body);

      return res.json({
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          perfil: usuario.perfil.nome,
        },
        mensagem: 'Login realizado com sucesso',
      });
    } catch (err) {
      return res.status(401).json({ erro: err.message });
    }
  },

  async logout(req, res) {
    // JWT simples → logout no frontend
    return res.json({ mensagem: 'Logout realizado' });
  },
};
