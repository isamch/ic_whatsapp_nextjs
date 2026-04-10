import winston from 'winston'
import fs from 'fs'

fs.mkdirSync('logs', { recursive: true })

const { combine, timestamp, errors, colorize, printf, json } = winston.format

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack }) =>
    `${timestamp} [${level}]: ${stack ?? message}`
  )
)

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
)

const logger = winston.createLogger({
  level:      process.env.LOG_LEVEL ?? 'info',
  format:     process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log',    level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
})

export default logger
