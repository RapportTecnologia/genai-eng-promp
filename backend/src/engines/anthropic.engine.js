import Anthropic from '@anthropic-ai/sdk';
import BaseEngine from './base.engine.js';

/**
 * Engine para Anthropic Claude
 */
class AnthropicEngine extends BaseEngine {
  constructor(config) {
    super(config);
    
    this.client = new Anthropic({
      apiKey: config.apiKey
    });
  }

  /**
   * Gera completion de texto
   */
  async generateCompletion(prompt, systemPrompt = '', options = {}) {
    try {
      const params = {
        model: this.model,
        max_tokens: options.maxTokens || 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      };

      // Anthropic usa system como parâmetro separado
      if (systemPrompt) {
        params.system = systemPrompt;
      }

      if (options.temperature !== undefined) {
        params.temperature = options.temperature;
      }

      const response = await this.client.messages.create(params);

      return response.content[0].text;
    } catch (error) {
      console.error('Erro ao gerar completion:', error);
      throw new Error(`Erro na API Anthropic: ${error.message}`);
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

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 150,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      });

      const suggestions = response.content[0].text
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
   * Calcula tokens (aproximação para Anthropic)
   */
  async countTokens(text) {
    // Anthropic usa aproximadamente 1 token por 4 caracteres
    // Esta é uma aproximação, a API não fornece contagem exata
    return Math.ceil(text.length / 3.5);
  }

  /**
   * Valida configuração
   */
  validate() {
    super.validate();
    
    if (!this.config.apiKey) {
      throw new Error('API Key não configurada para Anthropic');
    }

    return true;
  }
}

export default AnthropicEngine;
