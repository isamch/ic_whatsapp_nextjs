import { describe, it, expect } from 'vitest'
import { hashPassword, comparePassword } from '#utils/hashing.js'

describe('hashPassword', () => {

  it('returns a string', async () => {
    const result = await hashPassword('mypassword')
    expect(typeof result).toBe('string')
  })

  it('hashed value is different from original', async () => {
    const result = await hashPassword('mypassword')
    expect(result).not.toBe('mypassword')
  })

  it('two hashes of same password are different', async () => {
    const hash1 = await hashPassword('mypassword')
    const hash2 = await hashPassword('mypassword')
    expect(hash1).not.toBe(hash2)
  })

})

describe('comparePassword', () => {

  it('returns true for correct password', async () => {
    const hash = await hashPassword('mypassword')
    const result = await comparePassword('mypassword', hash)
    expect(result).toBe(true)
  })

  it('returns false for wrong password', async () => {
    const hash = await hashPassword('mypassword')
    const result = await comparePassword('wrongpassword', hash)
    expect(result).toBe(false)
  })

})
