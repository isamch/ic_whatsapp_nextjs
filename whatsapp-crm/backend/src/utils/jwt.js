import jwt from 'jsonwebtoken'

// Sign a short-lived access token using JWT_ACCESS_SECRET
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  })
}

// Sign a long-lived refresh token using JWT_REFRESH_SECRET
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  })
}

// Verify an access token — returns decoded payload or null if invalid/expired
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
  } catch {
    return null
  }
}

// Verify a refresh token — returns decoded payload or null if invalid/expired
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
  } catch {
    return null
  }
}

// Decode a token without verifying — useful for reading an expired token's payload
export const decode = jwt.decode
