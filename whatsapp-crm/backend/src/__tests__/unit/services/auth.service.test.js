import { describe, it, expect, vi } from 'vitest'
import { fakeUser } from '../../helpers/factories.js'

vi.mock('#models/user.model.js', () => ({
  default: {
    findOne: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    create: vi.fn(),
  },
}))

vi.mock('#utils/hashing.js', () => ({
  hashPassword: vi.fn(),
  comparePassword: vi.fn(),
}))

vi.mock('#utils/jwt.js', () => ({
  generateAccessToken: vi.fn(() => 'fake-access-token'),
  generateRefreshToken: vi.fn(() => 'fake-refresh-token'),
  verifyRefreshToken: vi.fn(),
}))

import User from '#models/user.model.js'
import { hashPassword, comparePassword } from '#utils/hashing.js'
import * as AuthService from '#services/auth.service.js'

describe('AuthService.register', () => {

  it('should throw error if email already exists', async () => {
    User.findOne.mockResolvedValue(fakeUser)

    await expect(
      AuthService.register({ name: 'Test', email: fakeUser.email, password: '123456' })
    ).rejects.toThrow('Email already in use')
  })

  it('should create user if email is new', async () => {
    User.findOne.mockResolvedValue(null)
    hashPassword.mockResolvedValue('hashed_password')
    User.create.mockResolvedValue(fakeUser)

    const result = await AuthService.register({
      name: 'Test',
      email: 'new@example.com',
      password: '123456',
    })

    expect(User.create).toHaveBeenCalledOnce()
    expect(result).toEqual(fakeUser)
  })

})

describe('AuthService.login', () => {

  it('should throw error if user not found', async () => {
    User.findOne.mockReturnValue({ select: vi.fn().mockResolvedValue(null) })

    await expect(
      AuthService.login({ email: 'wrong@example.com', password: '123456' })
    ).rejects.toThrow('Invalid email or password')
  })

  it('should throw error if password is wrong', async () => {
    User.findOne.mockReturnValue({ select: vi.fn().mockResolvedValue(fakeUser) })
    comparePassword.mockResolvedValue(false)

    await expect(
      AuthService.login({ email: fakeUser.email, password: 'wrongpassword' })
    ).rejects.toThrow('Invalid email or password')
  })

  it('should return tokens if credentials are correct', async () => {
    User.findOne.mockReturnValue({ select: vi.fn().mockResolvedValue(fakeUser) })
    comparePassword.mockResolvedValue(true)
    User.findByIdAndUpdate.mockResolvedValue(fakeUser)

    const result = await AuthService.login({ email: fakeUser.email, password: 'correctpassword' })

    expect(result.accessToken).toBe('fake-access-token')
    expect(result.refreshToken).toBe('fake-refresh-token')
    expect(result.user).toEqual(fakeUser)
  })

})

describe('AuthService.logout', () => {

  it('should clear refresh token', async () => {
    User.findByIdAndUpdate.mockResolvedValue(fakeUser)

    await AuthService.logout(fakeUser._id)

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(fakeUser._id, { refreshToken: null })
  })

})
