import axios from 'axios';

// Configuração base do axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de resposta para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error);
    
    if (error.response) {
      // Erro com resposta do servidor
      throw new Error(error.response.data.message || error.response.data.error || 'Erro na API');
    } else if (error.request) {
      // Erro sem resposta (timeout, rede)
      throw new Error('Erro de conexão. Verifique sua internet ou se o servidor está rodando.');
    } else {
      // Erro na configuração da requisição
      throw new Error('Erro ao fazer requisição');
    }
  }
);

/**
 * Serviço de API
 */
const apiService = {
  /**
   * Otimiza um prompt
   * @param {string} prompt - Prompt original
   * @returns {Promise<object>} - Dados do prompt otimizado
   */
  async optimizePrompt(prompt) {
    try {
      const response = await api.post('/optimize', { prompt });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Gera sugestões em tempo real
   * @param {string} text - Texto parcial
   * @param {number} cursorPosition - Posição do cursor
   * @returns {Promise<string[]>} - Lista de sugestões
   */
  async getSuggestions(text, cursorPosition) {
    try {
      const response = await api.post('/suggest', { text, cursorPosition });
      return response.data.data.suggestions || [];
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      return [];
    }
  },

  /**
   * Busca propagandas aleatórias
   * @param {number} count - Número de propagandas
   * @returns {Promise<Array>} - Lista de propagandas
   */
  async getAds(count = 3) {
    try {
      const response = await api.get(`/ads?count=${count}`);
      return response.data.data.ads || [];
    } catch (error) {
      console.error('Erro ao buscar propagandas:', error);
      return [];
    }
  },

  /**
   * Verifica saúde da API
   * @returns {Promise<object>} - Status da API
   */
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lista provedores disponíveis
   * @returns {Promise<object>} - Provedores configurados e disponíveis
   */
  async getProviders() {
    try {
      const response = await api.get('/providers');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
};

export default apiService;
