import Joi from 'joi'

export const getCategoryByIdSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required().messages({ 'any.required': 'Category ID is required' }),
  }).required(),
})
