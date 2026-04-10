import Joi from 'joi'

export const updateTemplateSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).messages({ 'string.min': 'Name must be at least 2 characters' }),
    body: Joi.string().trim().min(5).max(2000).messages({ 'string.min': 'Body must be at least 5 characters' }),
  }).min(1).required().messages({ 'object.min': 'At least one field is required' }),
})
