import OpenAIEngine from './openai.engine.js';
import AnthropicEngine from './anthropic.engine.js';
import OllamaEngine from './ollama.engine.js';
import PerplexityEngine from './perplexity.engine.js';

/**
 * Factory para criar engines de IA
 */
class EngineFactory {
  /**
   * Cria uma engine baseada na configuração
   * @param {object} config - Configuração do provedor
   * @returns {BaseEngine} - Instância da engine
   */
  static createEngine(config) {
    const engineType = config.engine.toLowerCase();

    switch (engineType) {
      case 'openai':
        return new OpenAIEngine(config);
      
      case 'anthropic':
        return new AnthropicEngine(config);
      
      case 'ollama':
        return new OllamaEngine(config);
      
      case 'perplexity':
        return new PerplexityEngine(config);
      
      default:
        throw new Error(`Engine '${engineType}' não suportada`);
    }
  }

  /**
   * Lista engines disponíveis
   */
  static getAvailableEngines() {
    return [
      {
        name: 'openai',
        description: 'OpenAI GPT (e APIs compatíveis)',
        supportsEmbeddings: true,
        requiresApiKey: true,
        supportsCustomURL: true
      },
      {
        name: 'anthropic',
        description: 'Anthropic Claude',
        supportsEmbeddings: false,
        requiresApiKey: true,
        supportsCustomURL: false
      },
      {
        name: 'ollama',
        description: 'Ollama (local)',
        supportsEmbeddings: true,
        requiresApiKey: false,
        supportsCustomURL: true
      },
      {
        name: 'perplexity',
        description: 'Perplexity AI',
        supportsEmbeddings: false,
        requiresApiKey: true,
        supportsCustomURL: false
      }
    ];
  }
}

export default EngineFactory;
export {
  OpenAIEngine,
  AnthropicEngine,
  OllamaEngine,
  PerplexityEngine
};
