import Joi from 'joi'

export const scheduleCampaignSchema = Joi.object({
  params: Joi.object({ id: Joi.string().hex().length(24).required() }),
  body: Joi.object({
    scheduledAt: Joi.date().iso().greater('now').required().messages({
      'any.required': 'scheduledAt is required',
      'date.greater': 'scheduledAt must be in the future',
    }),
  }).required(),
})
