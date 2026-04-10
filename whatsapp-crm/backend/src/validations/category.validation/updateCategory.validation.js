import Joi from 'joi'

export const updateCategorySchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required().messages({ 'any.required': 'Category ID is required' }),
  }).required(),
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100),
  }).min(1).required()
    .messages({ 'object.min': 'At least one field is required for update' }),
})
