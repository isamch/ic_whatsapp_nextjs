import Joi from 'joi'

const schema = Joi.object({
  name:  Joi.string().trim().min(2).max(100)
    .messages({ 'string.min': 'Name must be at least 2 characters', 'string.empty': 'Name is required' }),
  phone: Joi.string().trim().pattern(/^\+?[1-9]\d{6,14}$/)
    .messages({ 'string.pattern.base': 'Invalid phone number format', 'string.empty': 'Phone is required' }),
  notes: Joi.string().trim().max(500).allow('').optional(),
}).min(1)

export function validateUpdateContact(data) {
  const { error } = schema.validate(data, { abortEarly: false })
  if (!error) return {}
  const errors = {}
  error.details.forEach(({ path, message }) => { errors[path[0]] = message })
  return errors
}
