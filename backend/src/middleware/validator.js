import { body, validationResult } from 'express-validator';

/**
 * Middleware de validação para otimização de prompt
 */
export const validateOptimize = [
  body('prompt')
    .trim()
    .notEmpty()
    .withMessage('Prompt é obrigatório')
    .isLength({ min: 10, max: 10000 })
    .withMessage('Prompt deve ter entre 10 e 10000 caracteres'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validação falhou',
        details: errors.array()
      });
    }
    next();
  }
];

/**
 * Middleware de validação para sugestões
 */
export const validateSuggest = [
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Texto é obrigatório')
    .isLength({ max: 5000 })
    .withMessage('Texto deve ter no máximo 5000 caracteres'),
  
  body('cursorPosition')
    .isInt({ min: 0 })
    .withMessage('Posição do cursor deve ser um número inteiro positivo'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validação falhou',
        details: errors.array()
      });
    }
    next();
  }
];
