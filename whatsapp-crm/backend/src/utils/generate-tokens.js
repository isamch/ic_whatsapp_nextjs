import crypto        from 'crypto'
import { hmacHash }  from './hashing.js'

// Generate a numeric OTP with expiry — send plain otp to user, store nothing in DB
export const generateOTP = (length = 6, expiresInMinutes = 10) => {
  const otp     = crypto.randomInt(Math.pow(10, length - 1), Math.pow(10, length) - 1).toString()
  const expires = new Date(Date.now() + expiresInMinutes * 60 * 1000)
  return { otp, expires }
}

// Generate a secure random token — store hashedToken in DB, send plain token to user via email
export const generateCryptoToken = (length = 32, expiresInMinutes = 10) => {
  const token       = crypto.randomBytes(length).toString('hex')
  const hashedToken = hmacHash(token)
  const expires     = new Date(Date.now() + expiresInMinutes * 60 * 1000)
  return { token, hashedToken, expires }
}
