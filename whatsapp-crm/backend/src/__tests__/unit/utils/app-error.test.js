import { describe, it, expect } from 'vitest'
import { badRequest, unauthorized, forbidden, notFound, conflict } from '#utils/app-error.js'

describe('app-error', () => {

  it('badRequest returns status 400', () => {
    const err = badRequest('Bad input')
    expect(err.statusCode).toBe(400)
    expect(err.message).toBe('Bad input')
  })

  it('unauthorized returns status 401', () => {
    const err = unauthorized('Not allowed')
    expect(err.statusCode).toBe(401)
    expect(err.message).toBe('Not allowed')
  })

  it('forbidden returns status 403', () => {
    const err = forbidden('Forbidden')
    expect(err.statusCode).toBe(403)
  })

  it('notFound returns status 404', () => {
    const err = notFound('Not found')
    expect(err.statusCode).toBe(404)
    expect(err.message).toBe('Not found')
  })

  it('conflict returns status 409', () => {
    const err = conflict('Already exists')
    expect(err.statusCode).toBe(409)
    expect(err.message).toBe('Already exists')
  })

  it('error is instance of Error', () => {
    const err = notFound('test')
    expect(err).toBeInstanceOf(Error)
  })

})
