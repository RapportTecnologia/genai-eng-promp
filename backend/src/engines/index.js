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
   * @param {object} allProviders - Todos os provedores disponíveis (para delegação de embeddings)
   * @returns {BaseEngine} - Instância da engine
   */
  static createEngine(config, allProviders = null) {
    const engineType = config.engine.toLowerCase();

    let engine;
    switch (engineType) {
      case 'openai':
        engine = new OpenAIEngine(config);
        break;
      
      case 'anthropic':
        engine = new AnthropicEngine(config);
        break;
      
      case 'ollama':
        engine = new OllamaEngine(config);
        break;
      
      case 'perplexity':
        engine = new PerplexityEngine(config);
        break;
      
      default:
        throw new Error(`Engine '${engineType}' não suportada`);
    }

    // Se a engine não suporta embeddings mas tem embeddingModel configurado,
    // interpreta como nome de outro provedor para delegação
    if (!engine.supportsEmbeddings && config.embeddingModel && allProviders) {
      const delegateProviderName = config.embeddingModel;
      const delegateProvider = allProviders[delegateProviderName];
      
      if (delegateProvider) {
        try {
          const delegateEngine = this.createEngine(delegateProvider);
          if (delegateEngine.supportsEmbeddings) {
            engine.setEmbeddingEngine(delegateEngine);
            console.log(`✓ Engine ${config.name} delegando embeddings para ${delegateProviderName}`);
          } else {
            console.warn(`⚠ Provedor ${delegateProviderName} não suporta embeddings`);
          }
        } catch (error) {
          console.warn(`⚠ Não foi possível criar engine delegada ${delegateProviderName}:`, error.message);
        }
      } else {
        console.warn(`⚠ Provedor ${delegateProviderName} não encontrado para delegação de embeddings`);
      }
    }

    return engine;
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
