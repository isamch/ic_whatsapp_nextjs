import Joi from 'joi'

export const getTemplateByIdSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required().messages({ 'any.required': 'Template ID is required' }),
  }).required(),
})
