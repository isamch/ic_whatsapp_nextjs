import User from '#models/user.model.js'
import { conflict, unauthorized } from '#utils/app-error.js'
import { hashPassword, comparePassword } from '#utils/hashing.js'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '#utils/jwt.js'

export const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email })
  if (existing) throw conflict('Email already in use')

  const hashed = await hashPassword(password)
  return User.create({ name, email, password: hashed })
}

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password')
  if (!user) throw unauthorized('Invalid email or password')

  const isMatch = await comparePassword(password, user.password)
  if (!isMatch) throw unauthorized('Invalid email or password')

  const payload = { id: user._id }
  const accessToken = generateAccessToken(payload)
  const refreshToken = generateRefreshToken(payload)

  await User.findByIdAndUpdate(user._id, { refreshToken })
  return { user, accessToken, refreshToken }
}

export const refresh = async (token) => {
  const decoded = verifyRefreshToken(token)
  if (!decoded) throw unauthorized('Invalid or expired refresh token')

  const user = await User.findById(decoded.id).select('+refreshToken')
  if (!user || user.refreshToken !== token) throw unauthorized('Refresh token revoked')

  const payload = { id: user._id }
  const accessToken = generateAccessToken(payload)
  const refreshToken = generateRefreshToken(payload)

  await User.findByIdAndUpdate(user._id, { refreshToken })
  return { accessToken, refreshToken }
}

export const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null })
}
