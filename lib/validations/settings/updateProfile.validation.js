import Joi from 'joi'

const schema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required()
    .messages({ 'string.min': 'Name must be at least 2 characters', 'any.required': 'Name is required', 'string.empty': 'Name is required' }),
})

export function validateUpdateProfile(data) {
  const { error } = schema.validate(data, { abortEarly: false })
  if (!error) return {}
  const errors = {}
  error.details.forEach(({ path, message }) => { errors[path[0]] = message })
  return errors
}
