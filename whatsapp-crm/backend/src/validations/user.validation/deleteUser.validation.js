import Joi from 'joi'

export const deleteUserSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required().messages({ 'any.required': 'User ID is required' }),
  }).required(),
})
