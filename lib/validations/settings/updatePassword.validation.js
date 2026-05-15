import Joi from 'joi'

const schema = Joi.object({
  currentPassword: Joi.string().required()
    .messages({ 'any.required': 'Current password is required', 'string.empty': 'Current password is required' }),
  newPassword: Joi.string().min(6).required()
    .messages({ 'string.min': 'Password must be at least 6 characters', 'any.required': 'New password is required', 'string.empty': 'New password is required' }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
    .messages({ 'any.only': 'Passwords do not match', 'any.required': 'Please confirm your password', 'string.empty': 'Please confirm your password' }),
})

export function validateUpdatePassword(data) {
  const { error } = schema.validate(data, { abortEarly: false })
  if (!error) return {}
  const errors = {}
  error.details.forEach(({ path, message }) => { errors[path[0]] = message })
  return errors
}
