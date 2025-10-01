import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Serviço de gerenciamento de propagandas
 */
class AdsService {
  constructor() {
    this.ads = [];
    this.watcher = null;
    this.adsPath = process.env.ADS_CONFIG_PATH || '/etc/genai-eng-prompt/ads.conf';
    // Mapa de hash -> caminho de arquivo local
    this.localImagePaths = new Map();
    this.loadAds();
    this.startWatching();
  }

  /**
   * Carrega propagandas do arquivo de configuração
   */
  loadAds() {
    try {
      if (fs.existsSync(this.adsPath)) {
        const adsData = fs.readFileSync(this.adsPath, 'utf8');
        this.ads = JSON.parse(adsData);
        
        // Processa imagePaths locais
        this.processLocalImagePaths();
        
        console.log(`✓ ${this.ads.length} propagandas carregadas de ${this.adsPath}`);
        return;
      }
    } catch (error) {
      console.warn(`Aviso: Não foi possível carregar ${this.adsPath}:`, error.message);
    }

    console.warn('Nenhum arquivo de propagandas encontrado');
    this.ads = [];
  }

  /**
   * Inicia monitoramento do arquivo de propagandas
   */
  startWatching() {
    // Verifica se o arquivo existe antes de monitorar
    if (!fs.existsSync(this.adsPath)) {
      console.log(`⚠ Arquivo ${this.adsPath} não existe. Monitoramento não iniciado.`);
      return;
    }

    try {
      // Monitora mudanças no arquivo
      this.watcher = fs.watch(this.adsPath, (eventType, filename) => {
        if (eventType === 'change') {
          console.log(`📢 Arquivo ${this.adsPath} foi modificado. Recarregando propagandas...`);
          
          // Pequeno delay para garantir que o arquivo foi completamente escrito
          setTimeout(() => {
            try {
              this.loadAds();
              console.log('✓ Propagandas recarregadas automaticamente');
            } catch (error) {
              console.error('✗ Erro ao recarregar propagandas:', error.message);
            }
          }, 100);
        }
      });

      console.log(`👁 Monitorando alterações em ${this.adsPath}`);
    } catch (error) {
      console.error(`Erro ao iniciar monitoramento de ${this.adsPath}:`, error.message);
    }
  }

  /**
   * Para o monitoramento do arquivo
   */
  stopWatching() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
      console.log('Monitoramento de propagandas encerrado');
    }
  }

  /**
   * Verifica se uma string é uma URL válida
   */
  isValidUrl(string) {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }

  /**
   * Verifica se o imagePath é válido (URL ou caminho de arquivo existente)
   */
  isValidImagePath(imagePath) {
    // Se for uma URL válida, aceita
    if (this.isValidUrl(imagePath)) {
      return true;
    }

    // Se não for URL, deve ser um caminho de arquivo que existe no servidor
    try {
      // Resolve o caminho absoluto
      const absolutePath = path.isAbsolute(imagePath) 
        ? imagePath 
        : path.resolve(process.cwd(), imagePath);
      
      // Verifica se o arquivo existe
      return fs.existsSync(absolutePath);
    } catch (error) {
      console.warn(`Erro ao validar caminho de imagem "${imagePath}":`, error.message);
      return false;
    }
  }

  /**
   * Gera hash único para um caminho de arquivo
   */
  generateImageHash(filePath) {
    return crypto.createHash('md5').update(filePath).digest('hex');
  }

  /**
   * Processa imagePaths locais e cria mapeamento para URLs do servidor
   */
  processLocalImagePaths() {
    this.localImagePaths.clear();
    
    this.ads.forEach(ad => {
      if (ad.imagePath && !this.isValidUrl(ad.imagePath)) {
        // É um caminho local
        const absolutePath = path.isAbsolute(ad.imagePath)
          ? ad.imagePath
          : path.resolve(process.cwd(), ad.imagePath);
        
        if (fs.existsSync(absolutePath)) {
          const hash = this.generateImageHash(absolutePath);
          this.localImagePaths.set(hash, absolutePath);
          
          // Substitui o imagePath pelo URL do servidor
          ad.imagePathOriginal = ad.imagePath;
          ad.imagePath = `/api/ads/images/${hash}`;
        }
      }
    });
  }

  /**
   * Obtém o caminho local de uma imagem pelo hash
   */
  getLocalImagePath(hash) {
    return this.localImagePaths.get(hash);
  }

  /**
   * Valida estrutura de uma propaganda
   */
  validateAd(ad) {
    const required = ['titulo', 'link', 'imagePath'];
    
    // Verifica campos obrigatórios
    for (const field of required) {
      if (!ad[field]) {
        return false;
      }
    }

    // Valida o imagePath especificamente
    if (!this.isValidImagePath(ad.imagePath)) {
      console.warn(`Propaganda "${ad.titulo}" possui imagePath inválido: "${ad.imagePath}"`);
      return false;
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
