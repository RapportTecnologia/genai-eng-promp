import axios from 'axios';
import axiosRetry from 'axios-retry';
import BaseEngine from './base.engine.js';

/**
 * Engine para Perplexity AI
 */
class PerplexityEngine extends BaseEngine {
  constructor(config) {
    super(config);
    
    this.baseURL = config.baseURL || 'https://api.perplexity.ai';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 60000,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
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
      const messages = [];
      
      if (systemPrompt) {
        messages.push({
          role: 'system',
          content: systemPrompt
        });
      }
      messages.push({
        role: 'user',
        content: prompt
      });

      const response = await this.client.post('/chat/completions', {
        model: this.model,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 4000
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Erro ao gerar completion:', error);
      throw new Error(`Erro na API Perplexity: ${error.message}`);
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

      const response = await this.client.post('/chat/completions', {
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.5,
        max_tokens: 150
      });

      const suggestions = response.data.choices[0].message.content
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
   * Valida configuração
   */
  validate() {
    super.validate();
    
    if (!this.config.apiKey) {
      throw new Error('API Key não configurada para Perplexity');
    }

    return true;
  }

  /**
   * Testa conexão com o provedor
   */
  async testConnection() {
    try {
      // Faz uma chamada simples para testar a API
      const response = await this.client.post('/chat/completions', {
        model: this.model,
        messages: [
          { role: 'user', content: 'test' }
        ],
        max_tokens: 5
      });

      if (response && response.data && response.data.choices && response.data.choices.length > 0) {
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

      // Trata erros específicos da API Perplexity
      if (error.response?.status === 401) {
        errorMessage = 'API Key inválida ou não autorizada';
        errorDetails = 'Verifique se a API Key está correta e ativa';
      } else if (error.response?.status === 403) {
        errorMessage = 'Acesso negado';
        errorDetails = 'Verifique as permissões da API Key';
      } else if (error.response?.status === 404) {
        errorMessage = 'Modelo não encontrado';
        errorDetails = `O modelo "${this.model}" não está disponível`;
      } else if (error.response?.status === 429) {
        errorMessage = 'Limite de requisições excedido';
        errorDetails = 'Aguarde alguns instantes antes de tentar novamente';
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        errorMessage = 'Não foi possível conectar ao servidor';
        errorDetails = `URL: ${this.baseURL}`;
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

export default PerplexityEngine;
