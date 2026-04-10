import Joi from 'joi'

export const deleteContact-listSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required().messages({ 'any.required': 'Contact-list ID is required' }),
  }).required(),
})
