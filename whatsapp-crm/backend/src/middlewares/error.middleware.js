import logger             from '#config/logger.js'
import { errorResponse } from '#utils/api-response.js'

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode ?? 500

  logger.error({ message: err.message, statusCode, path: req.path, method: req.method, stack: err.stack })

  if (err.name === 'CastError')
    return errorResponse(res, 400, `Invalid ${err.path}: ${err.value}`)

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return errorResponse(res, 409, `Duplicate value for field: ${field}`)
  }

  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map(e => ({ field: e.path, message: e.message }))
    return errorResponse(res, 422, 'Validation failed', details)
  }

  if (err.name === 'JsonWebTokenError') return errorResponse(res, 401, 'Invalid token')
  if (err.name === 'TokenExpiredError')  return errorResponse(res, 401, 'Token expired')

  if (err.statusCode) return errorResponse(res, statusCode, err.message, err.details ?? null)

  const message = process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  return errorResponse(res, 500, message, process.env.NODE_ENV !== 'production' ? err.stack : null)
}
