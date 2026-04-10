import Joi from 'joi'

export const updateUserSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required().messages({ 'any.required': 'User ID is required' }),
  }).required(),
  body: Joi.object({
    name:  Joi.string().trim().min(2).max(50),
    email: Joi.string().email().lowercase(),
    role:  Joi.string().valid('user', 'admin', 'moderator'),
  }).min(1).required()
    .messages({ 'object.min': 'At least one field is required for update' }),
})
