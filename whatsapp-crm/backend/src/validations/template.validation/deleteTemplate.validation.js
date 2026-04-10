import Joi from 'joi'

export const deleteTemplateSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required().messages({ 'any.required': 'Template ID is required' }),
  }).required(),
})
