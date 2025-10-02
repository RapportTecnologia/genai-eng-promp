import express from 'express';
import adsService from '../services/ads.service.js';

const router = express.Router();

/**
 * GET /api/ads
 * Retorna propagandas aleatórias
 */
router.get('/', (req, res, next) => {
  try {
    const count = parseInt(req.query.count) || 3;
    const ads = adsService.getRandomAds(count);
    
    res.json({
      success: true,
      data: {
        ads,
        count: ads.length
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/ads/all
 * Retorna todas as propagandas
 */
router.get('/all', (req, res, next) => {
  try {
    const ads = adsService.getAllAds();
    
    res.json({
      success: true,
      data: {
        ads,
        count: ads.length
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/ads/stats
 * Retorna estatísticas das propagandas
 */
router.get('/stats', (req, res, next) => {
  try {
    const stats = adsService.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/ads/reload
 * Recarrega propagandas do arquivo
 */
router.post('/reload', (req, res, next) => {
  try {
    adsService.reload();
    
    res.json({
      success: true,
      message: 'Propagandas recarregadas com sucesso'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/ads/images/:hash
 * Serve imagens locais através do servidor
 */
router.get('/images/:hash', (req, res, next) => {
  try {
    const { hash } = req.params;
    const imagePath = adsService.getLocalImagePath(hash);
    
    if (!imagePath) {
      return res.status(404).json({
        success: false,
        message: 'Imagem não encontrada'
      });
    }
    
    // Envia o arquivo com cache headers
    res.sendFile(imagePath, {
      maxAge: '1d', // Cache de 1 dia
      lastModified: true,
      headers: {
        'Cache-Control': 'public, max-age=86400'
      }
    }, (err) => {
      if (err) {
        next(err);
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
