import express from 'express';
import promptService from '../services/prompt.service.js';
import { validateOptimize } from '../middleware/validator.js';

const router = express.Router();

/**
 * POST /api/optimize
 * Otimiza um prompt
 */
router.post('/', validateOptimize, async (req, res, next) => {
  try {
    const { prompt } = req.body;
    
    const result = await promptService.optimizePrompt(prompt);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

export default router;
