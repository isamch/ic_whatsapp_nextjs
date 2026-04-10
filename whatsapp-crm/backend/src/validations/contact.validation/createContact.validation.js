import Joi from 'joi'

export const createContactSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
      'string.min': 'Name must be at least 2 characters',
      'any.required': 'Name is required',
    }),
    phone: Joi.string().trim().pattern(/^\+?[1-9]\d{6,14}$/).required().messages({
      'string.pattern.base': 'Invalid phone number format',
      'any.required': 'Phone is required',
    }),
    listId: Joi.string().hex().length(24).required().messages({ 'any.required': 'List is required' }),
    notes: Joi.string().trim().max(500).allow('').optional(),
  }).required(),
})
