import Joi from 'joi'

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
      'string.empty': 'Email is required',
    }),
  password: Joi.string().required()
    .messages({
      'any.required': 'Password is required',
      'string.empty': 'Password is required',
    }),
})

export function validateLogin(data) {
  const { error } = loginSchema.validate(data, { abortEarly: false })
  if (!error) return {}

  const errors = {}
  error.details.forEach(({ path, message }) => {
    errors[path[0]] = message
  })
  return errors
}
