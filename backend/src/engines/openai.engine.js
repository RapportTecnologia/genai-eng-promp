import OpenAI from 'openai';
import { encoding_for_model } from 'tiktoken';
import BaseEngine from './base.engine.js';

/**
 * Engine para OpenAI (e APIs compatíveis: OpenRouter, OpenWebUI, GenerAtiva)
 */
class OpenAIEngine extends BaseEngine {
  constructor(config) {
    super(config);
    
    const clientConfig = {
      apiKey: config.apiKey
    };

    // Suporte a baseURL customizada (para OpenRouter, OpenWebUI, GenerAtiva)
    if (config.baseURL) {
      clientConfig.baseURL = config.baseURL;
    }

    this.client = new OpenAI(clientConfig);
    this.encoding = null;
    
    // Inicializa encoding para contagem de tokens
    this.initTokenizer();
  }

  /**
   * Inicializa tokenizer
   */
  async initTokenizer() {
    try {
      // Tenta usar o modelo específico, fallback para gpt-4
      const modelName = this.model.includes('gpt-4') ? 'gpt-4' : 
                       this.model.includes('gpt-3.5') ? 'gpt-3.5-turbo' : 
                       'gpt-4';
      this.encoding = encoding_for_model(modelName);
    } catch (error) {
      console.warn('Aviso: Não foi possível inicializar tokenizer:', error.message);
    }
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

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 4000,
        ...options
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Erro ao gerar completion:', error);
      throw new Error(`Erro na API OpenAI: ${error.message}`);
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

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.5,
        max_tokens: 150
      });

      const suggestions = response.choices[0].message.content
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
      // Usa o modelo configurado ou determina baseado no provedor (fallback)
      let embeddingModel = this.embeddingModel;
      
      if (!embeddingModel) {
        // Fallback: determina o modelo baseado no provedor
        if (this.config.baseURL && this.config.baseURL.includes('openrouter')) {
          embeddingModel = 'text-embedding-3-small';
        } else if (this.config.baseURL && this.config.baseURL.includes('openwebui')) {
          embeddingModel = 'granite-embedding:278m';
        } else {
          embeddingModel = 'text-embedding-3-large';
        }
      }

      const response = await this.client.embeddings.create({
        model: embeddingModel,
        input: text
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Erro ao gerar embeddings:', error);
      throw new Error(`Erro ao gerar embeddings: ${error.message}`);
    }
  }

  /**
   * Calcula tokens usando tiktoken
   */
  async countTokens(text) {
    if (this.encoding) {
      try {
        const tokens = this.encoding.encode(text);
        return tokens.length;
      } catch (error) {
        console.warn('Erro ao contar tokens, usando aproximação:', error.message);
      }
    }
    
    // Fallback para aproximação
    return super.countTokens(text);
  }

  /**
   * Valida configuração
   */
  validate() {
    super.validate();
    
    if (!this.config.apiKey) {
      throw new Error('API Key não configurada para OpenAI');
    }

    return true;
  }

  /**
   * Testa conexão com o provedor
   */
  async testConnection() {
    try {
      // Faz uma chamada simples para testar a API
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'user', content: 'test' }
        ],
        max_tokens: 5,
        temperature: 0
      });

      if (response && response.choices && response.choices.length > 0) {
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

      // Trata erros específicos da API
      if (error.status === 401) {
        errorMessage = 'API Key inválida ou não autorizada';
        errorDetails = 'Verifique se a API Key está correta e ativa';
      } else if (error.status === 403) {
        errorMessage = 'Acesso negado';
        errorDetails = 'Verifique as permissões da API Key';
      } else if (error.status === 404) {
        errorMessage = 'Modelo não encontrado';
        errorDetails = `O modelo "${this.model}" não está disponível`;
      } else if (error.status === 429) {
        errorMessage = 'Limite de requisições excedido';
        errorDetails = 'Aguarde alguns instantes antes de tentar novamente';
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        errorMessage = 'Não foi possível conectar ao servidor';
        errorDetails = this.config.baseURL ? `URL: ${this.config.baseURL}` : 'Verifique sua conexão com a internet';
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

export default OpenAIEngine;
