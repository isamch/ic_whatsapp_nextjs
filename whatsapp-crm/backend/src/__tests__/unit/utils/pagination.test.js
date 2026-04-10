import { describe, it, expect } from 'vitest'
import { paginate } from '#utils/pagination.js'

describe('paginate', () => {

  it('page 1 limit 10 → skip 0', () => {
    const { skip } = paginate({ page: 1, limit: 10 })
    expect(skip).toBe(0)
  })

  it('page 2 limit 10 → skip 10', () => {
    const { skip } = paginate({ page: 2, limit: 10 })
    expect(skip).toBe(10)
  })

  it('page 3 limit 20 → skip 40', () => {
    const { skip } = paginate({ page: 3, limit: 20 })
    expect(skip).toBe(40)
  })

  it('returns correct meta', () => {
    const { meta } = paginate({ page: 2, limit: 15 })
    expect(meta.page).toBe(2)
    expect(meta.limit).toBe(15)
  })

  it('page 0 → defaults to page 1', () => {
    const { skip } = paginate({ page: 0, limit: 10 })
    expect(skip).toBe(0)
  })

  it('limit 200 → clamped to 100', () => {
    const { meta } = paginate({ page: 1, limit: 200 })
    expect(meta.limit).toBe(100)
  })

  it('limit 0 → clamped to 1', () => {
    const { meta } = paginate({ page: 1, limit: 0 })
    expect(meta.limit).toBe(1)
  })

  it('no args → defaults page 1 limit 20 skip 0', () => {
    const { skip, meta } = paginate()
    expect(skip).toBe(0)
    expect(meta.page).toBe(1)
    expect(meta.limit).toBe(20)
  })

})
