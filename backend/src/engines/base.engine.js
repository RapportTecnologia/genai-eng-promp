/**
 * Classe base para engines de IA
 * Define interface comum para todos os provedores
 */
class BaseEngine {
  constructor(config) {
    this.config = config;
    this.name = config.name || 'unknown';
    this.model = config.model;
    this.supportsEmbeddings = config.supportsEmbeddings || false;
  }

  /**
   * Gera completion de texto
   * @param {string} prompt - Prompt do usuário
   * @param {string} systemPrompt - Prompt do sistema
   * @param {object} options - Opções adicionais
   * @returns {Promise<string>} - Texto gerado
   */
  async generateCompletion(prompt, systemPrompt = '', options = {}) {
    throw new Error('generateCompletion() deve ser implementado pela subclasse');
  }

  /**
   * Gera sugestões em tempo real
   * @param {string} text - Texto parcial
   * @param {number} cursorPosition - Posição do cursor
   * @returns {Promise<string[]>} - Lista de sugestões
   */
  async generateSuggestions(text, cursorPosition) {
    throw new Error('generateSuggestions() deve ser implementado pela subclasse');
  }

  /**
   * Gera embeddings (se suportado)
   * @param {string} text - Texto para gerar embedding
   * @returns {Promise<number[]>} - Vetor de embeddings
   */
  async generateEmbeddings(text) {
    if (!this.supportsEmbeddings) {
      throw new Error(`Engine ${this.name} não suporta embeddings`);
    }
    throw new Error('generateEmbeddings() deve ser implementado pela subclasse');
  }

  /**
   * Calcula tokens de um texto
   * @param {string} text - Texto para calcular tokens
   * @returns {number} - Número de tokens
   */
  async countTokens(text) {
    // Implementação padrão: aproximação simples
    // Subclasses podem sobrescrever com cálculo mais preciso
    return Math.ceil(text.length / 4);
  }

  /**
   * Valida configuração da engine
   */
  validate() {
    if (!this.model) {
      throw new Error('Model não configurado');
    }
    return true;
  }

  /**
   * Retorna informações da engine
   */
  getInfo() {
    return {
      name: this.name,
      model: this.model,
      supportsEmbeddings: this.supportsEmbeddings,
      engine: this.config.engine
    };
  }
}

export default BaseEngine;
