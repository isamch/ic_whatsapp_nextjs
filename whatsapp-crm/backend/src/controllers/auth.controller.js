import asyncHandler          from '#utils/async-handler.js'
import { unauthorized }      from '#utils/app-error.js'
import { successResponse }   from '#utils/api-response.js'
import * as AuthService      from '#services/auth.service.js'

export const register = asyncHandler(async (req, res) => {
  const user = await AuthService.register(req.body)
  successResponse(res, 201, 'User created successfully', { user })
})

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await AuthService.login(req.body)
  successResponse(res, 200, 'Login successful', { user, accessToken, refreshToken })
})

export const refreshToken = asyncHandler(async (req, res) => {
  const { token } = req.body
  if (!token) throw unauthorized('Refresh token missing')
  const tokens = await AuthService.refresh(token)
  successResponse(res, 200, 'Token refreshed', tokens)
})

export const logout = asyncHandler(async (req, res) => {
  await AuthService.logout(req.user._id)
  successResponse(res, 200, 'Logged out successfully', null)
})
