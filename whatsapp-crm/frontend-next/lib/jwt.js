import jwt from 'jsonwebtoken'

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET  || 'access_secret_dev'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret_dev'

export const signAccessToken  = (payload) => jwt.sign(payload, ACCESS_SECRET,  { expiresIn: '15m' })
export const signRefreshToken = (payload) => jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' })

export const verifyAccessToken  = (token) => jwt.verify(token, ACCESS_SECRET)
export const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET)
