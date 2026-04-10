import Joi from 'joi'

const schema = Joi.object({
  name:          Joi.string().trim().min(2).max(100)
    .messages({ 'string.min': 'Name must be at least 2 characters', 'string.empty': 'Name is required' }),
  templateId:    Joi.string().hex().length(24)
    .messages({ 'string.empty': 'Template is required' }),
  listId:        Joi.string().hex().length(24)
    .messages({ 'string.empty': 'Contact list is required' }),
  ratePerMinute: Joi.number().integer().min(1).max(60),
}).min(1)

export function validateUpdateCampaign(data) {
  const { error } = schema.validate(data, { abortEarly: false })
  if (!error) return {}
  const errors = {}
  error.details.forEach(({ path, message }) => { errors[path[0]] = message })
  return errors
}
