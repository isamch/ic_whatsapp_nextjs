import Joi from 'joi'

export const createUserSchema = Joi.object({
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
    password: Joi.string().min(6)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])/)
      .required()
      .messages({
        'string.pattern.base': 'Must contain uppercase, lowercase and a symbol',
        'string.min':          'Password must be at least 6 characters',
        'any.required':        'Password is required',
      }),
    roles: Joi.array().items(Joi.string().valid('user', 'admin')).default(['user']),
  }).required(),
})
