export default function errorMiddleware(err, req, res, next) {
  console.error(err);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      erro: err.errors.map(e => e.message),
    });
  }

  return res.status(500).json({
    erro: err.message || 'Erro interno do servidor',
  });
}
