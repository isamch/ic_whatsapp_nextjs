import Joi from 'joi'

export const deleteWhatsappSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required().messages({ 'any.required': 'Whatsapp ID is required' }),
  }).required(),
})
