import Joi from 'joi'

export const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().lowercase().required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
      }),
    password: Joi.string().required()
      .messages({ 'any.required': 'Password is required' }),
  }).required(),
})
