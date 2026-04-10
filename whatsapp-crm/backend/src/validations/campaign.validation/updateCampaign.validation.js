import Joi from 'joi'

export const updateCampaignSchema = Joi.object({
  params: Joi.object({ id: Joi.string().hex().length(24).required() }),
  body: Joi.object({
    name:          Joi.string().trim().min(2).max(100),
    templateId:    Joi.string().hex().length(24),
    listId:        Joi.string().hex().length(24),
    ratePerMinute: Joi.number().integer().min(1).max(60),
  }).min(1).required(),
})
