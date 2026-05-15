export function handleApiError(err, { setErrors, showAlert }) {
  const response = err.response?.data

  if (err.response?.status === 422 && Array.isArray(response?.details)) {
    const fieldErrors = {}
    response.details.forEach(({ field, message }) => {
      fieldErrors[field.replace('body.', '')] = message.replace(/body\./g, '')
    })
    setErrors(fieldErrors)
    return
  }

  showAlert(response?.message || 'Something went wrong. Please try again.', 'error')
}
