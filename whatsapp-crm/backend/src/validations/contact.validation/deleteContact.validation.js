import Joi from 'joi'

export const deleteContactSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required().messages({ 'any.required': 'Contact ID is required' }),
  }).required(),
})
