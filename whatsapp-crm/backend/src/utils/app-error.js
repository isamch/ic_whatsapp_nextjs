// Creates a base HTTP error with statusCode and optional details
const createError = (statusCode, message, details = null) => {
  const error = new Error(message)
  error.statusCode = statusCode
  error.details = details
  return error
}

// 400 — invalid input not caught by validation
export const badRequest = (msg, details = null) => createError(400, msg, details)

// 401 — missing or invalid token
export const unauthorized = (msg = 'Unauthorized', details = null) => createError(401, msg, details)

// 403 — authenticated but not allowed
export const forbidden = (msg = 'Forbidden', details = null) => createError(403, msg, details)

// 404 — resource does not exist
export const notFound = (msg = 'Not Found', details = null) => createError(404, msg, details)

// 409 — duplicate resource (e.g. email already in use)
export const conflict = (msg, details = null) => createError(409, msg, details)

// exported for custom status codes not covered above
export { createError }
