import express from 'express';
import promptService from '../services/prompt.service.js';
import { validateSuggest } from '../middleware/validator.js';

const router = express.Router();

/**
 * POST /api/suggest
 * Gera sugestões em tempo real
 */
router.post('/', validateSuggest, async (req, res, next) => {
  try {
    const { text, cursorPosition } = req.body;
    
    const suggestions = await promptService.generateSuggestions(text, cursorPosition);
    
    res.json({
      success: true,
      data: {
        suggestions
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
