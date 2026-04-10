import morgan from 'morgan'

morgan.token('status-color', (req, res) => {
  const s = res.statusCode
  if (s >= 500) return `\x1b[31m${s}\x1b[0m`
  if (s >= 400) return `\x1b[33m${s}\x1b[0m`
  if (s >= 300) return `\x1b[36m${s}\x1b[0m`
  return `\x1b[32m${s}\x1b[0m`
})

morgan.token('method-color', (req) => {
  const colors = { GET: '\x1b[34m', POST: '\x1b[32m', PATCH: '\x1b[33m', PUT: '\x1b[33m', DELETE: '\x1b[31m' }
  return `${colors[req.method] ?? '\x1b[0m'}${req.method}\x1b[0m`
})

export const httpLogger = morgan('  :method-color :url :status-color :response-time ms - :res[content-length] bytes')
