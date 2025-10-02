import configLoader from '../config/config.loader.js';
import EngineFactory from '../engines/index.js';

/**
 * Serviço de otimização de prompts
 */
class PromptService {
  constructor() {
    this.engine = null;
    this.initializeEngine();
  }

  /**
   * Inicializa engine de IA
   */
  initializeEngine() {
    try {
      const providerConfig = configLoader.getActiveProvider();
      configLoader.validateProvider(providerConfig);
      this.engine = EngineFactory.createEngine(providerConfig);
      console.log(`✓ Engine ${providerConfig.name} inicializada`);
    } catch (error) {
      console.error('Erro ao inicializar engine:', error);
      throw error;
    }
  }

  /**
   * Prompt do sistema para otimização
   */
  getOptimizationSystemPrompt() {
    return `Você é um especialista em engenharia de prompts para modelos de linguagem de IA.

Sua tarefa é otimizar prompts seguindo as melhores práticas:

1. **Clareza e Especificidade**: Seja claro e específico sobre o que deseja
2. **Contexto**: Forneça contexto relevante quando necessário
3. **Estrutura**: Organize o prompt de forma lógica
4. **Instruções Explícitas**: Seja explícito sobre formato de saída, tom, estilo
5. **Exemplos**: Inclua exemplos quando apropriado (few-shot learning)
6. **Delimitadores**: Use delimitadores claros para separar seções
7. **Restrições**: Especifique limitações e restrições
8. **Persona**: Defina uma persona quando relevante

Otimize o prompt do usuário aplicando essas técnicas. Mantenha a intenção original, mas melhore:
- Clareza
- Estrutura
- Especificidade
- Efetividade

<<<<<<< HEAD
IMPORTANTE: Retorne EXCLUSIVAMENTE o texto do prompt otimizado. NÃO inclua:
- Explicações sobre as mudanças realizadas
- Comentários ou observações
- Introduções como "Aqui está o prompt otimizado:"
- Conclusões ou sugestões adicionais
- Qualquer texto que não faça parte do prompt otimizado

Responda SOMENTE com o prompt otimizado, nada mais.`;
=======
Retorne APENAS o prompt otimizado, sem explicações adicionais.`;
>>>>>>> 4d9df0b9cddd4289ba46442be7aaf7ad7fac51da
  }

  /**
   * Otimiza um prompt
   * @param {string} originalPrompt - Prompt original do usuário
   * @returns {Promise<object>} - Prompt otimizado e metadados
   */
  async optimizePrompt(originalPrompt) {
    try {
      if (!originalPrompt || originalPrompt.trim().length === 0) {
        throw new Error('Prompt vazio');
      }

      const systemPrompt = this.getOptimizationSystemPrompt();
      
      // Gera prompt otimizado
      const optimizedPrompt = await this.engine.generateCompletion(
        originalPrompt,
        systemPrompt,
        {
          temperature: 0.7,
<<<<<<< HEAD
          maxTokens: 4096
=======
          maxTokens: 2000
>>>>>>> 4d9df0b9cddd4289ba46442be7aaf7ad7fac51da
        }
      );

      // Calcula tokens
      const inputTokens = await this.engine.countTokens(originalPrompt);
      const outputTokens = await this.engine.countTokens(optimizedPrompt);

      return {
        originalPrompt,
        optimizedPrompt: optimizedPrompt.trim(),
        tokens: {
          input: inputTokens,
          output: outputTokens,
          total: inputTokens + outputTokens
        },
        provider: this.engine.name,
        model: this.engine.model,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erro ao otimizar prompt:', error);
      throw error;
    }
  }

  /**
   * Gera sugestões em tempo real
   * @param {string} text - Texto parcial
   * @param {number} cursorPosition - Posição do cursor
   * @returns {Promise<string[]>} - Lista de sugestões
   */
  async generateSuggestions(text, cursorPosition) {
    try {
      if (!text || text.trim().length === 0) {
        return [];
      }

      const suggestions = await this.engine.generateSuggestions(text, cursorPosition);
      return suggestions;
    } catch (error) {
      console.error('Erro ao gerar sugestões:', error);
      return [];
    }
  }

  /**
   * Retorna informações do provedor ativo
   */
  getProviderInfo() {
    return this.engine ? this.engine.getInfo() : null;
  }

  /**
   * Lista todos os provedores configurados
   */
  listProviders() {
    try {
      const providers = configLoader.getAllProviders();
      return providers.map(p => ({
        name: p.name,
        model: p.model,
        engine: p.engine,
        supportsEmbeddings: p.supportsEmbeddings,
        isActive: p.name === this.engine?.name
      }));
    } catch (error) {
      console.error('Erro ao listar provedores:', error);
      return [];
    }
  }
<<<<<<< HEAD

  /**
   * Testa conexão com o provedor ativo
   * @returns {Promise<object>} - Resultado do teste
   */
  async testConnection() {
    try {
      if (!this.engine) {
        return {
          success: false,
          message: 'Nenhum engine inicializado',
          error: 'Engine não está disponível'
        };
      }

      return await this.engine.testConnection();
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      return {
        success: false,
        message: 'Erro ao testar conexão',
        error: error.message
      };
    }
  }
=======
>>>>>>> 4d9df0b9cddd4289ba46442be7aaf7ad7fac51da
}

// Singleton
const promptService = new PromptService();

export default promptService;
