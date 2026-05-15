import Joi from 'joi'

const schema = Joi.object({
  subject: Joi.string().trim().min(2).max(200).required()
    .messages({ 'string.min': 'Subject must be at least 2 characters', 'any.required': 'Subject is required', 'string.empty': 'Subject is required' }),
  body: Joi.string().trim().min(1).max(2000).required()
    .messages({ 'any.required': 'Message body is required', 'string.empty': 'Message body is required' }),
  recipientId: Joi.string().hex().length(24).allow(null, '').optional(),
})

export function validateSendNotification(data) {
  const { error } = schema.validate(data, { abortEarly: false })
  if (!error) return {}
  const errors = {}
  error.details.forEach(({ path, message }) => { errors[path[0]] = message })
  return errors
}
