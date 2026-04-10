// Send a success response — { status, message, data }
export const successResponse = (res, statusCode, message, data) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
  })
}

// Send an error response — { status, code, message, details? }
export const errorResponse = (res, statusCode, message, details = null) => {
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message,
    ...(details && { details }),
  })
}
