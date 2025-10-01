import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import optimizeRoutes from './src/routes/optimize.routes.js';
import suggestRoutes from './src/routes/suggest.routes.js';
import adsRoutes from './src/routes/ads.routes.js';
import { errorHandler, notFoundHandler } from './src/middleware/errorHandler.js';
import promptService from './src/services/prompt.service.js';
import EngineFactory from './src/engines/index.js';
import configLoader from './src/config/config.loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3010;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requisições em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Rotas da API
app.use('/api/optimize', optimizeRoutes);
app.use('/api/suggest', suggestRoutes);
app.use('/api/ads', adsRoutes);

/**
 * GET /api/health
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    provider: promptService.getProviderInfo()
  });
});

/**
 * GET /api/providers
 * Lista provedores disponíveis
 */
app.get('/api/providers', (req, res) => {
  try {
    const providers = promptService.listProviders();
    const availableEngines = EngineFactory.getAvailableEngines();
    
    res.json({
      success: true,
      data: {
        configured: providers,
        available: availableEngines
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/config
 * Retorna APENAS configurações públicas e seguras
 * NUNCA expõe API keys, senhas ou informações sensíveis
 */
app.get('/api/config', (req, res) => {
  try {
    const gtagId = configLoader.getGtagId();
    
    // Retorna APENAS dados públicos e seguros
    res.json({
      success: true,
      data: {
        gtagId: gtagId || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao carregar configurações públicas'
    });
  }
});

/**
 * Serve arquivos estáticos do frontend (produção)
 */
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

/**
 * GET /api
 * Informações da API
 */
app.get('/api', (req, res) => {
  res.json({
    name: 'GenAI Eng Prompt API',
    version: '0.1.0',
    description: 'API para otimização de prompts com IA',
    endpoints: {
      health: '/api/health',
      providers: '/api/providers',
      optimize: 'POST /api/optimize',
      suggest: 'POST /api/suggest',
      ads: 'GET /api/ads'
    }
  });
});

/**
 * Catch-all route para SPA (deve ser a última rota)
 * Retorna index.html para todas as rotas não-API
 */
app.get('*', (req, res) => {
  // Se não for rota de API, serve o index.html
  if (!req.path.startsWith('/api')) {
    const indexPath = path.join(publicPath, 'index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        res.status(404).json({
          error: 'Frontend não encontrado',
          message: 'Execute "npm run build:prod" no frontend para gerar os arquivos'
        });
      }
    });
  } else {
    // Rotas de API não encontradas
    notFoundHandler(req, res);
  }
});

// Tratamento de erros
app.use(errorHandler);

// Inicia servidor
app.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  GenAI Eng Prompt API');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`  📝 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  🤖 Provedor: ${promptService.getProviderInfo()?.name || 'N/A'}`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Encerra monitoramento de arquivos ao finalizar processo
process.on('SIGINT', () => {
  console.log('\n\nEncerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\nEncerrando servidor...');
  process.exit(0);
});

export default app;
