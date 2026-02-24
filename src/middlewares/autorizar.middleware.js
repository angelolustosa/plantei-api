export function autorizarPermissao(codigoPermissao) {
  return async (req, res, next) => {
    const usuario = req.user;

    const perfil = await usuario.getPerfil({
      include: {
        association: 'permissoes',
      },
    });

    const permissoes = perfil.permissoes.map(p => p.codigo);

    if (!permissoes.includes(codigoPermissao)) {
      return res.status(403).json({
        erro: 'Você não tem permissão para essa ação',
      });
    }

    next();
  };
}