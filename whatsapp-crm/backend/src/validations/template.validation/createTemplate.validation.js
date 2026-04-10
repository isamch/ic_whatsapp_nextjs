import Joi from 'joi'

export const createTemplateSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must be at most 100 characters',
      'any.required': 'Name is required',
    }),
    body: Joi.string().trim().min(5).max(2000).required().messages({
      'string.min': 'Body must be at least 5 characters',
      'any.required': 'Body is required',
    }),
  }).required(),
})
