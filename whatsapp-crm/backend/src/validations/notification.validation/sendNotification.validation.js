import Joi from 'joi'

export const sendNotificationSchema = Joi.object({
  body: Joi.object({
    recipientId: Joi.string().hex().length(24).allow(null, '').optional(),
    subject:     Joi.string().trim().min(2).max(200).required().messages({ 'any.required': 'Subject is required' }),
    body:        Joi.string().trim().min(1).max(2000).required().messages({ 'any.required': 'Body is required' }),
  }).required(),
})
