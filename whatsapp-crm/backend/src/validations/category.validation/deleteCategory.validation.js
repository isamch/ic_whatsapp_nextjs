import Joi from 'joi'

export const deleteCategorySchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required().messages({ 'any.required': 'Category ID is required' }),
  }).required(),
})
