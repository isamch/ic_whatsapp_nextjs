import { createHmac }    from 'crypto'
import { hash, compare } from 'bcryptjs'

// Hash a plain-text password using bcrypt salt 12
export const hashPassword = async (password) => {
  return hash(password, 12)
}

// Compare a plain-text password against a bcrypt hash — returns true or false
export const comparePassword = async (enteredPassword, hashedPassword) => {
  return compare(enteredPassword, hashedPassword)
}

// Create a deterministic HMAC-SHA256 hex hash — use to hash OTPs/tokens before storing in DB
export const hmacHash = (value) => {
  return createHmac('sha256', process.env.HMAC_VERIFICATION_CODE_SECRET)
    .update(value)
    .digest('hex')
}
