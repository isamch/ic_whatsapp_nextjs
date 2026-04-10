import Joi from 'joi'

export const createCategorySchema = Joi.object({
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).required()
      .messages({
        'string.min':   'Name must be at least 2 characters',
        'any.required': 'Name is required',
      }),
  }).required(),
})
