import Joi from 'joi'

const schema = Joi.object({
  name: Joi.string().trim().min(2).max(100)
    .messages({ 'string.min': 'Name must be at least 2 characters', 'string.max': 'Name must be at most 100 characters', 'string.empty': 'Name is required' }),
  body: Joi.string().trim().min(5).max(2000)
    .messages({ 'string.min': 'Body must be at least 5 characters', 'string.empty': 'Body is required' }),
}).min(1)

export function validateUpdateTemplate(data) {
  const { error } = schema.validate(data, { abortEarly: false })
  if (!error) return {}
  const errors = {}
  error.details.forEach(({ path, message }) => { errors[path[0]] = message })
  return errors
}
