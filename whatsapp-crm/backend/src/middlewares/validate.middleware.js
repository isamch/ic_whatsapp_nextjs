import { createError } from '#utils/app-error.js'

export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(
    { body: req.body, params: req.params, query: req.query },
    { abortEarly: false, stripUnknown: true, allowUnknown: false }
  )

  if (error) {
    const details = error.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message.replace(/['"]/g, ''),
    }))
    return next(createError(422, 'Validation failed', details))
  }

  req.body = value.body ?? req.body
  req.params = value.params ?? req.params
  if (value.query) Object.assign(req.query, value.query)

  next()
}
