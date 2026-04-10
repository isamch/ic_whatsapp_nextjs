import Joi from 'joi'

const contactSchema = Joi.object({
  name:  Joi.string().trim().min(2).max(100).required()
    .messages({ 'string.min': 'Name must be at least 2 characters', 'any.required': 'Name is required', 'string.empty': 'Name is required' }),
  phone: Joi.string().trim().pattern(/^\+?[1-9]\d{6,14}$/).required()
    .messages({ 'string.pattern.base': 'Invalid phone number format', 'any.required': 'Phone is required', 'string.empty': 'Phone is required' }),
  notes: Joi.string().trim().max(500).allow('').optional(),
})

function extract(error) {
  const errors = {}
  error.details.forEach(({ path, message }) => { errors[path[0]] = message })
  return errors
}

export function validateContact(data) {
  const { error } = contactSchema.validate(data, { abortEarly: false })
  return error ? extract(error) : {}
}

export function validateContactUpdate(data) {
  const { error } = contactSchema.fork(['name', 'phone'], f => f.optional()).validate(data, { abortEarly: false })
  return error ? extract(error) : {}
}
