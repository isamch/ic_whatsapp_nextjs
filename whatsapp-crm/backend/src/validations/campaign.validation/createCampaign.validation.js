import Joi from 'joi'

export const createCampaignSchema = Joi.object({
  body: Joi.object({
    name:          Joi.string().trim().min(2).max(100).required().messages({ 'any.required': 'Name is required' }),
    templateId:    Joi.string().hex().length(24).required().messages({ 'any.required': 'Template is required' }),
    listId:        Joi.string().hex().length(24).required().messages({ 'any.required': 'Contact list is required' }),
    ratePerMinute: Joi.number().integer().min(1).max(60).default(10),
  }).required(),
})
