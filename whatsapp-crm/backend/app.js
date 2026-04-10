import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { httpLogger }  from '#config/morgan.js'
import { apiLimiter }  from '#config/rate-limit.js'
import { errorHandler } from '#middlewares/error.middleware.js'
import routes from '#routes/index.js'
import logger from '#config/logger.js'

const app = express()

app.use(helmet())
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*',
  credentials: true,
}))

app.use('/api', apiLimiter)

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))

app.use(httpLogger)

if (process.env.SWAGGER_ENABLED === 'true') {
  const { setupSwagger } = await import('#config/swagger.js')
  await setupSwagger(app)
}

app.use('/api/v1', routes)

app.get('/health', (req, res) =>
  res.json({ status: 'ok', env: process.env.NODE_ENV, ts: new Date().toISOString() })
)

app.use((req, res) =>
  res.status(404).json({ status: 'fail', message: `Route ${req.method} ${req.url} not found` })
)

app.use(errorHandler)

export default app
