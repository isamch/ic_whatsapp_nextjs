import rateLimit from 'express-rate-limit'

const isDev = process.env.NODE_ENV !== 'production'

export const apiLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             isDev ? 2000 : 200,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { status: 'fail', message: 'Too many requests, please try again later.' },
})

export const authLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             isDev ? 100 : 20,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { status: 'fail', message: 'Too many login attempts, please try again later.' },
})
