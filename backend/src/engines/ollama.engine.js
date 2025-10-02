import axios from 'axios';
import axiosRetry from 'axios-retry';
import BaseEngine from './base.engine.js';

/**
 * Engine para Ollama (local)
 */
class OllamaEngine extends BaseEngine {
  constructor(config) {
    super(config);
    
    this.baseURL = config.url || 'http://localhost:11434';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 60000 // 60 segundos
    });

    // Configurar retry
    axiosRetry(this.client, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
               error.response?.status === 429;
      }
    });
  }

  /**
   * Gera completion de texto
   */
  async generateCompletion(prompt, systemPrompt = '', options = {}) {
    try {
      const fullPrompt = systemPrompt 
        ? `${systemPrompt}\n\n${prompt}`
        : prompt;

      const response = await this.client.post('/api/generate', {
        model: this.model,
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: options.temperature || 0.7,
          num_predict: options.maxTokens || 4000
        }
      });

      return response.data.response;
    } catch (error) {
      console.error('Erro ao gerar completion:', error);
      throw new Error(`Erro na API Ollama: ${error.message}`);
    }
  }

  /**
   * Gera sugestões em tempo real
   */
  async generateSuggestions(text, cursorPosition) {
    try {
      const contextBefore = text.substring(0, cursorPosition);
      const contextAfter = text.substring(cursorPosition);

      const systemPrompt = `Você é um assistente que sugere continuações de texto para prompts de IA.
Analise o contexto e sugira 3 continuações curtas e relevantes (máximo 10 palavras cada).
Retorne apenas as sugestões, uma por linha, sem numeração ou marcadores.`;

      const userPrompt = `Texto antes do cursor: "${contextBefore}"
Texto depois do cursor: "${contextAfter}"

Sugira continuações relevantes:`;

      const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

      const response = await this.client.post('/api/generate', {
        model: this.model,
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: 0.5,
          num_predict: 150
        }
      });

      const suggestions = response.data.response
        .split('\n')
        .filter(s => s.trim().length > 0)
        .slice(0, 3);

      return suggestions;
    } catch (error) {
      console.error('Erro ao gerar sugestões:', error);
      return [];
    }
  }

  /**
   * Gera embeddings
   */
  async generateEmbeddings(text) {
    if (!this.supportsEmbeddings) {
      throw new Error('Este provedor não suporta embeddings');
    }

    try {
      // Usa o modelo configurado ou fallback para granite-embedding:278m
      const embeddingModel = this.embeddingModel || 'granite-embedding:278m';
      
      const response = await this.client.post('/api/embeddings', {
        model: embeddingModel,
        prompt: text
      });

      return response.data.embedding;
    } catch (error) {
      console.error('Erro ao gerar embeddings:', error);
      throw new Error(`Erro ao gerar embeddings: ${error.message}`);
    }
  }

  /**
   * Valida configuração
   */
  validate() {
    super.validate();
    
    if (!this.baseURL) {
      throw new Error('URL não configurada para Ollama');
    }

    return true;
  }

  /**
   * Verifica se Ollama está disponível
   */
  async healthCheck() {
    try {
      await this.client.get('/api/tags');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Testa conexão com o provedor
   */
  async testConnection() {
    try {
      // Primeiro verifica se o servidor está acessível
      const healthOk = await this.healthCheck();
      if (!healthOk) {
        return {
          success: false,
          message: `Falha ao conectar com ${this.name}`,
          error: 'Servidor Ollama não está acessível',
          details: `Verifique se o Ollama está rodando em ${this.baseURL}`
        };
      }

      // Testa se o modelo está disponível
      const response = await this.client.post('/api/generate', {
        model: this.model,
        prompt: 'test',
        stream: false,
        options: {
          num_predict: 5
        }
      });

      if (response && response.data && response.data.response !== undefined) {
        return {
          success: true,
          message: `Conexão com ${this.name} estabelecida com sucesso`,
          model: this.model
        };
      } else {
        return {
          success: false,
          message: `Resposta inesperada do provedor ${this.name}`,
          error: 'Formato de resposta inválido'
        };
      }
    } catch (error) {
      let errorMessage = error.message;
      let errorDetails = '';

      // Trata erros específicos do Ollama
      if (error.response?.status === 404) {
        errorMessage = 'Modelo não encontrado';
        errorDetails = `O modelo "${this.model}" não está disponível. Execute: ollama pull ${this.model}`;
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        errorMessage = 'Não foi possível conectar ao servidor Ollama';
        errorDetails = `Verifique se o Ollama está rodando em ${this.baseURL}`;
      } else if (error.code === 'ETIMEDOUT') {
        errorMessage = 'Timeout ao conectar com Ollama';
        errorDetails = 'O servidor demorou muito para responder';
      }

      return {
        success: false,
        message: `Falha ao conectar com ${this.name}`,
        error: errorMessage,
        details: errorDetails
      };
    }
  }
}

export default OllamaEngine;
