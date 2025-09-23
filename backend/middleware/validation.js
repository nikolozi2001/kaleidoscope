const Joi = require('joi');
const logger = require('../config/logger');

// Generic validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);
    
    if (error) {
      logger.warn({
        message: 'Validation error',
        error: error.details[0].message,
        url: req.originalUrl,
        method: req.method,
        params: req.params
      });
      
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation Error',
          details: error.details[0].message
        }
      });
    }
    
    next();
  };
};

// Validation schemas
const schemas = {
  // Group index validation
  groupIndex: Joi.object({
    year: Joi.number().integer().min(2000).max(2030).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    code: Joi.string().pattern(/^[0-9]+$/).required(),
    level: Joi.number().integer().min(0).max(3).required()
  }),

  // Group weight validation
  groupWeight: Joi.object({
    year: Joi.number().integer().min(2000).max(2030).required(),
    level: Joi.number().integer().min(0).max(3).required()
  }),

  // Group index right panel validation
  groupIndexRightPanel: Joi.object({
    year: Joi.number().integer().min(2000).max(2030).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    level: Joi.number().integer().min(0).max(3).required()
  }),

  // Group weight chart validation
  groupWeightChart: Joi.object({
    year: Joi.number().integer().min(2000).max(2030).required()
  })
};

module.exports = {
  validate,
  schemas
};