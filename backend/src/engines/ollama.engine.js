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
          num_predict: options.maxTokens || 2000
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
      const response = await this.client.post('/api/embeddings', {
        model: this.model,
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
}

export default OllamaEngine;
