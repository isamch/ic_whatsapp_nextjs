import Joi from 'joi'

export const registerSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().trim().min(2).max(50).required()
      .messages({
        'string.min':   'Name must be at least 2 characters',
        'string.max':   'Name cannot exceed 50 characters',
        'any.required': 'Name is required',
      }),
    email: Joi.string().email().lowercase().required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
      }),
    password: Joi.string().min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      .required()
      .messages({
        'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character',
        'string.min':          'Password must be at least 8 characters',
        'any.required':        'Password is required',
      }),

  }).required(),
})
