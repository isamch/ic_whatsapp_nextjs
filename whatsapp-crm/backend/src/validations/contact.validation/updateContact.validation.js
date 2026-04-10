import Joi from 'joi'

export const updateContactSchema = Joi.object({
  params: Joi.object({ id: Joi.string().hex().length(24).required() }),
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).messages({ 'string.min': 'Name must be at least 2 characters' }),
    phone: Joi.string().trim().pattern(/^\+?[1-9]\d{6,14}$/).messages({ 'string.pattern.base': 'Invalid phone number format' }),
    notes: Joi.string().trim().max(500).allow('').optional(),
  }).min(1).required().messages({ 'object.min': 'At least one field is required' }),
})
