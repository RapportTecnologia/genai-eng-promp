/**
 * Middleware de tratamento de erros
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Erro:', err);

  // Erro de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erro de validação',
      message: err.message
    });
  }

  // Erro de autenticação
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Não autorizado',
      message: 'Credenciais inválidas'
    });
  }

  // Erro de API externa
  if (err.message && err.message.includes('API')) {
    return res.status(502).json({
      error: 'Erro no provedor de IA',
      message: err.message
    });
  }

  // Erro genérico
  res.status(err.status || 500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ocorreu um erro inesperado'
  });
};

/**
 * Middleware para rotas não encontradas
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `Rota ${req.method} ${req.path} não existe`
  });
};
