/**
 * Classe base para engines de IA
 * Define interface comum para todos os provedores
 */
class BaseEngine {
  constructor(config) {
    this.config = config;
    this.name = config.name || 'unknown';
    this.model = config.model;
    this.embeddingModel = config.embeddingModel;
    this.supportsEmbeddings = config.supportsEmbeddings || false;
    this.embeddingEngine = null; // Engine delegada para embeddings
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
   * Define engine delegada para embeddings
   * @param {BaseEngine} engine - Engine que será usada para gerar embeddings
   */
  setEmbeddingEngine(engine) {
    this.embeddingEngine = engine;
  }

  /**
   * Gera embeddings (se suportado ou delegado)
   * @param {string} text - Texto para gerar embedding
   * @returns {Promise<number[]>} - Vetor de embeddings
   */
  async generateEmbeddings(text) {
    // Se tem engine delegada, usa ela
    if (this.embeddingEngine) {
      return this.embeddingEngine.generateEmbeddings(text);
    }
    
    // Se não suporta embeddings e não tem delegação, erro
    if (!this.supportsEmbeddings) {
      throw new Error(`Engine ${this.name} não suporta embeddings e nenhuma engine delegada foi configurada`);
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
   * Testa conexão com o provedor
   * @returns {Promise<object>} - Resultado do teste { success: boolean, message: string, error?: string }
   */
  async testConnection() {
    throw new Error('testConnection() deve ser implementado pela subclasse');
  }

  /**
   * Retorna informações da engine
   */
  getInfo() {
    return {
      name: this.name,
      model: this.model,
      embeddingModel: this.embeddingModel,
      embeddingEngine: this.embeddingEngine ? this.embeddingEngine.name : null,
      supportsEmbeddings: this.supportsEmbeddings || !!this.embeddingEngine,
      engine: this.config.engine
    };
  }
}

export default BaseEngine;
