import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega variáveis de ambiente
dotenv.config();

/**
 * Carrega configuração do sistema
 * Prioridade: .env > /etc/rapport/genai-eng-prompt/config.json
 */
class ConfigLoader {
  constructor() {
    this.config = null;
    this.loadConfig();
  }

  /**
   * Carrega configuração de arquivo JSON
   */
  loadFromFile() {
    const configPath = process.env.CONFIG_PATH || '/etc/rapport/genai-eng-prompt/config.json';
    
    try {
      if (fs.existsSync(configPath)) {
        const configData = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(configData);
      }
    } catch (error) {
      console.warn(`Aviso: Não foi possível carregar ${configPath}:`, error.message);
    }

    // Fallback para arquivo de exemplo no desenvolvimento
    const examplePath = path.join(__dirname, '../../../config/config.example.json');
    if (fs.existsSync(examplePath)) {
      console.log('Usando configuração de exemplo (desenvolvimento)');
      const configData = fs.readFileSync(examplePath, 'utf8');
      return JSON.parse(configData);
    }

    return null;
  }

  /**
   * Carrega configuração de variáveis de ambiente
   */
  loadFromEnv() {
    const provider = process.env.PROVIDER || 'openai';
    const config = {
      provider,
      providers: {}
    };

    // Google Analytics
    if (process.env.GTAG_ID) {
      config.gtagId = process.env.GTAG_ID;
    }

    // OpenAI
    if (process.env.OPENAI_API_KEY) {
      config.providers.openai = {
        apiKey: process.env.OPENAI_API_KEY,
        engine: 'openai',
        model: process.env.OPENAI_MODEL || 'gpt-4',
        embeddingModel: process.env.OPENAI_EMBEDDING_MODEL,
        supportsEmbeddings: true
      };
    }

    // Anthropic
    if (process.env.ANTHROPIC_API_KEY) {
      config.providers.anthropic = {
        apiKey: process.env.ANTHROPIC_API_KEY,
        engine: 'anthropic',
        model: process.env.ANTHROPIC_MODEL || 'claude-3-opus-20240229',
        embeddingModel: process.env.ANTHROPIC_EMBEDDING_MODEL,
        supportsEmbeddings: false
      };
    }

    // Ollama
    if (process.env.OLLAMA_URL) {
      config.providers.ollama = {
        url: process.env.OLLAMA_URL,
        engine: 'ollama',
        model: process.env.OLLAMA_MODEL || 'llama2',
        embeddingModel: process.env.OLLAMA_EMBEDDING_MODEL,
        supportsEmbeddings: true
      };
    }

    // OpenRouter
    if (process.env.OPENROUTER_API_KEY) {
      config.providers.openrouter = {
        apiKey: process.env.OPENROUTER_API_KEY,
        engine: 'openai',
        baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-4',
        embeddingModel: process.env.OPENROUTER_EMBEDDING_MODEL,
        supportsEmbeddings: true
      };
    }

    // Perplexity
    if (process.env.PERPLEXITY_API_KEY) {
      config.providers.perplexity = {
        apiKey: process.env.PERPLEXITY_API_KEY,
        engine: 'perplexity',
        baseURL: process.env.PERPLEXITY_BASE_URL || 'https://api.perplexity.ai',
        model: process.env.PERPLEXITY_MODEL || 'pplx-70b-online',
        embeddingModel: process.env.PERPLEXITY_EMBEDDING_MODEL,
        supportsEmbeddings: false
      };
    }

    // OpenWebUI
    if (process.env.OPENWEBUI_API_KEY) {
      config.providers.openwebui = {
        apiKey: process.env.OPENWEBUI_API_KEY,
        engine: 'openai',
        baseURL: process.env.OPENWEBUI_BASE_URL || 'http://localhost:8080/api/v1',
        model: process.env.OPENWEBUI_MODEL || 'gpt-4',
        embeddingModel: process.env.OPENWEBUI_EMBEDDING_MODEL,
        supportsEmbeddings: true
      };
    }

    // GenerAtiva
    if (process.env.GENERATIVA_API_KEY) {
      config.providers.generativa = {
        apiKey: process.env.GENERATIVA_API_KEY,
        engine: 'openai',
        baseURL: process.env.GENERATIVA_BASE_URL || 'https://api.generativa.com/v1',
        model: process.env.GENERATIVA_MODEL || 'gpt-4',
        embeddingModel: process.env.GENERATIVA_EMBEDDING_MODEL,
        supportsEmbeddings: true
      };
    }

    return Object.keys(config.providers).length > 0 ? config : null;
  }

  /**
   * Carrega configuração com prioridade: .env > arquivo JSON
   */
  loadConfig() {
    // Tenta carregar de variáveis de ambiente primeiro
    const envConfig = this.loadFromEnv();
    
    if (envConfig && Object.keys(envConfig.providers).length > 0) {
      this.config = envConfig;
      console.log('✓ Configuração carregada de variáveis de ambiente');
      return;
    }

    // Fallback para arquivo JSON
    const fileConfig = this.loadFromFile();
    if (fileConfig) {
      this.config = fileConfig;
      console.log('✓ Configuração carregada de arquivo JSON');
      return;
    }

    throw new Error('Nenhuma configuração válida encontrada. Configure .env ou /etc/rapport/genai-eng-prompt/config.json');
  }

  /**
   * Retorna configuração do provedor ativo
   */
  getActiveProvider() {
    if (!this.config) {
      throw new Error('Configuração não carregada');
    }

    const providerName = this.config.provider;
    const provider = this.config.providers[providerName];

    if (!provider) {
      throw new Error(`Provedor '${providerName}' não configurado`);
    }

    return {
      name: providerName,
      ...provider
    };
  }

  /**
   * Retorna todos os provedores configurados
   */
  getAllProviders() {
    if (!this.config) {
      throw new Error('Configuração não carregada');
    }

    return Object.keys(this.config.providers).map(name => ({
      name,
      ...this.config.providers[name]
    }));
  }

  /**
   * Retorna o Google Analytics ID
   */
  getGtagId() {
    return this.config?.gtagId || null;
  }

  /**
   * Valida configuração do provedor
   */
  validateProvider(provider) {
    const required = ['engine', 'model'];
    
    for (const field of required) {
      if (!provider[field]) {
        throw new Error(`Campo obrigatório '${field}' não encontrado na configuração`);
      }
    }

    // Valida autenticação
    if (provider.engine === 'ollama') {
      if (!provider.url) {
        throw new Error('URL é obrigatória para Ollama');
      }
    } else {
      if (!provider.apiKey) {
        throw new Error('API Key é obrigatória para este provedor');
      }
    }

    return true;
  }
}

// Singleton
const configLoader = new ConfigLoader();

export default configLoader;
