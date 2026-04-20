import Joi from 'joi';
import { AppError } from './errorResponse.js';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(
      { body: req.body, query: req.query, params: req.params },
      { abortEarly: false, stripUnknown: false }
    );

    if (error) {
      const details = error.details.reduce((acc, detail) => {
        acc[detail.path.join('.')] = detail.message;
        return acc;
      }, {});

      return next(
        new AppError('VALIDATION_ERROR', 400, 'Invalid request data', details)
      );
    }

    if (value.body) req.body = value.body;
    if (value.query) req.query = value.query;
    if (value.params) req.params = value.params;
    next();
  };
};

export const studentValidationSchemas = {
  create: Joi.object({
    body: Joi.object({
      email: Joi.string().email().required(),
      name: Joi.string().min(3).max(100).required(),
      dateOfBirth: Joi.date().required(),
    }).required(),
    query: Joi.object().unknown(true),
    params: Joi.object().unknown(true),
  }),

  update: Joi.object({
    body: Joi.object({
      email: Joi.string().email(),
      name: Joi.string().min(3).max(100),
      dateOfBirth: Joi.date(),
      status: Joi.string().valid('ACTIVE', 'INACTIVE', 'GRADUATED'),
    }),
    params: Joi.object({
      id: Joi.string().required(),
    }).required(),
    query: Joi.object().unknown(true),
  }),

  getById: Joi.object({
    params: Joi.object({
      id: Joi.string().required(),
    }).required(),
    body: Joi.object().unknown(true),
    query: Joi.object().unknown(true),
  }),

  list: Joi.object({
    query: Joi.object({
      page: Joi.number().min(1).default(1),
      limit: Joi.number().min(1).max(100).default(20),
      status: Joi.string().valid('ACTIVE', 'INACTIVE', 'GRADUATED').allow('').optional(),
      search: Joi.string().allow('').optional(),
      major: Joi.string().allow('').optional(),
    }).unknown(true),
    body: Joi.object().unknown(true),
    params: Joi.object().unknown(true),
  }),
};
