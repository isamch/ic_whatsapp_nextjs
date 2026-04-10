import 'dotenv/config'
import app from './app.js'
import { connectMongo } from '#config/database.mongo.js'
import logger from '#config/logger.js'
import { restoreAllSessions } from '#services/whatsapp/sessionManager.js'

const PORT = process.env.PORT ?? 3000

async function startServer() {
  try {
    await connectMongo()
    app.listen(PORT, () =>
      logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV}]`)
    )
    await restoreAllSessions()
    logger.info('WhatsApp sessions restored')
  } catch (err) {
    logger.error('Failed to start server', err)
    process.exit(1)
  }
}

startServer()
