import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import apiService from '../services/api.service';

/**
 * Banner de Propagandas
 */
function AdsBanner() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Carrega propagandas ao montar o componente
   */
  useEffect(() => {
    loadAds();
  }, []);

  /**
   * Busca propagandas da API
   */
  const loadAds = async () => {
    try {
      setLoading(true);
      const adsData = await apiService.getAds(3);
      setAds(adsData);
    } catch (error) {
      console.error('Erro ao carregar propagandas:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handler de erro de imagem
   */
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x150/FF8C42/FFFFFF?text=Imagem+Indisponível';
  };

  if (loading) {
    return (
      <div className="frame-dark">
        <h3 className="text-xl font-semibold mb-4 text-center text-white">Patrocinadores</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-primary-800 rounded-lg p-4 border border-brown-400 animate-pulse"
            >
              <div className="h-6 bg-primary-700 rounded mb-2"></div>
              <div className="bg-primary-900 h-32 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="frame-dark">
      <h3 className="text-xl font-semibold mb-4 text-center text-white">Patrocinadores</h3>
      {ads.length === 0 ? (
        <div className="bg-primary-800 rounded-lg p-8 border border-brown-400 text-center">
          <p className="text-white/60">Nenhuma propaganda disponível no momento</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ads.map((ad, index) => (
            <a
              key={index}
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary-800 rounded-lg p-4 border border-brown-400 hover:border-brown-300 transition-all hover:scale-105 group"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-white group-hover:text-primary-200 transition-colors">
                  {ad.titulo}
                </h4>
                <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
              </div>
              <div className="bg-primary-900 rounded overflow-hidden border border-brown-400/30">
                <img
                  src={ad.imagePath}
                  alt={ad.titulo}
                  className="w-full h-32 object-cover"
                  onError={handleImageError}
                />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdsBanner;
