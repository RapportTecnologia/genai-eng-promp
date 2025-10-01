import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Serviço de gerenciamento de propagandas
 */
class AdsService {
  constructor() {
    this.ads = [];
    this.loadAds();
  }

  /**
   * Carrega propagandas do arquivo de configuração
   */
  loadAds() {
    const adsPath = process.env.ADS_CONFIG_PATH || '/etc/rapport/genai-eng-prompt/ads.conf';
    
    try {
      if (fs.existsSync(adsPath)) {
        const adsData = fs.readFileSync(adsPath, 'utf8');
        this.ads = JSON.parse(adsData);
        console.log(`✓ ${this.ads.length} propagandas carregadas de ${adsPath}`);
        return;
      }
    } catch (error) {
      console.warn(`Aviso: Não foi possível carregar ${adsPath}:`, error.message);
    }

    // Fallback para arquivo de exemplo no desenvolvimento
    const examplePath = path.join(__dirname, '../../../config/ads.example.conf');
    if (fs.existsSync(examplePath)) {
      console.log('Usando propagandas de exemplo (desenvolvimento)');
      const adsData = fs.readFileSync(examplePath, 'utf8');
      this.ads = JSON.parse(adsData);
      return;
    }

    console.warn('Nenhum arquivo de propagandas encontrado');
    this.ads = [];
  }

  /**
   * Valida estrutura de uma propaganda
   */
  validateAd(ad) {
    const required = ['titulo', 'link', 'imagePath'];
    
    for (const field of required) {
      if (!ad[field]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Retorna propagandas válidas
   */
  getValidAds() {
    return this.ads.filter(ad => this.validateAd(ad));
  }

  /**
   * Retorna N propagandas aleatórias
   * @param {number} count - Número de propagandas a retornar
   * @returns {Array} - Array de propagandas
   */
  getRandomAds(count = 3) {
    const validAds = this.getValidAds();
    
    if (validAds.length === 0) {
      return [];
    }

    // Se temos menos propagandas do que solicitado, retorna todas
    if (validAds.length <= count) {
      return validAds;
    }

    // Seleciona aleatoriamente sem repetição
    const shuffled = [...validAds].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Retorna todas as propagandas
   */
  getAllAds() {
    return this.getValidAds();
  }

  /**
   * Recarrega propagandas do arquivo
   */
  reload() {
    this.loadAds();
  }

  /**
   * Retorna estatísticas
   */
  getStats() {
    return {
      total: this.ads.length,
      valid: this.getValidAds().length,
      invalid: this.ads.length - this.getValidAds().length
    };
  }
}

// Singleton
const adsService = new AdsService();

export default adsService;
