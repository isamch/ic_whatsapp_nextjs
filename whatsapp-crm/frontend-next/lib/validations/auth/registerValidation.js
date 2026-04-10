import Joi from 'joi'

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required()
    .messages({
      'string.min':      'Name must be at least 2 characters',
      'string.max':      'Name cannot exceed 50 characters',
      'any.required':    'Name is required',
      'string.empty':    'Name is required',
    }),
  email: Joi.string().email({ tlds: { allow: false } }).required()
    .messages({
      'string.email':    'Please provide a valid email address',
      'any.required':    'Email is required',
      'string.empty':    'Email is required',
    }),
  password: Joi.string().min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required()
    .messages({
      'string.min':          'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character',
      'any.required':        'Password is required',
      'string.empty':        'Password is required',
    }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    .messages({
      'any.only':        'Passwords do not match',
      'any.required':    'Please confirm your password',
      'string.empty':    'Please confirm your password',
    }),
})

export function validateRegister(data) {
  const { error } = registerSchema.validate(data, { abortEarly: false })
  if (!error) return {}

  const errors = {}
  error.details.forEach(({ path, message }) => {
    errors[path[0]] = message
  })
  return errors
}
