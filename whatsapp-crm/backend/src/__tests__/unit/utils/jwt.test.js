import { describe, it, expect, beforeAll } from 'vitest'
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '#utils/jwt.js'

beforeAll(() => {
  process.env.JWT_ACCESS_SECRET      = 'test_access_secret'
  process.env.JWT_REFRESH_SECRET     = 'test_refresh_secret'
  process.env.JWT_ACCESS_EXPIRES_IN  = '15m'
  process.env.JWT_REFRESH_EXPIRES_IN = '7d'
})

describe('generateAccessToken', () => {

  it('returns a string', () => {
    const token = generateAccessToken({ id: '123' })
    expect(typeof token).toBe('string')
  })

  it('token has 3 parts separated by dots', () => {
    const token = generateAccessToken({ id: '123' })
    expect(token.split('.')).toHaveLength(3)
  })

})

describe('verifyAccessToken', () => {

  it('returns payload for valid token', () => {
    const token = generateAccessToken({ id: '123' })
    const result = verifyAccessToken(token)
    expect(result.id).toBe('123')
  })

  it('returns null for invalid token', () => {
    const result = verifyAccessToken('invalid.token.here')
    expect(result).toBeNull()
  })

})

describe('generateRefreshToken', () => {

  it('returns a string', () => {
    const token = generateRefreshToken({ id: '123' })
    expect(typeof token).toBe('string')
  })

})

describe('verifyRefreshToken', () => {

  it('returns payload for valid token', () => {
    const token = generateRefreshToken({ id: '123' })
    const result = verifyRefreshToken(token)
    expect(result.id).toBe('123')
  })

  it('returns null for invalid token', () => {
    const result = verifyRefreshToken('bad.token')
    expect(result).toBeNull()
  })

})
