import Joi from 'joi'

const campaignSchema = Joi.object({
  name:          Joi.string().trim().min(2).max(100).required()
    .messages({ 'string.min': 'Name must be at least 2 characters', 'any.required': 'Name is required', 'string.empty': 'Name is required' }),
  templateId:    Joi.number().integer().required()
    .messages({ 'any.required': 'Template is required', 'number.base': 'Template is required' }),
  listId:        Joi.number().integer().required()
    .messages({ 'any.required': 'Contact list is required', 'number.base': 'Contact list is required' }),
  ratePerMinute: Joi.number().integer().min(1).max(60).default(10),
})

function extract(error) {
  const errors = {}
  error.details.forEach(({ path, message }) => { errors[path[0]] = message })
  return errors
}

export function validateCampaign(data) {
  const { error } = campaignSchema.validate(data, { abortEarly: false })
  return error ? extract(error) : {}
}
