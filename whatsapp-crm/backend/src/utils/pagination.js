// Compute skip offset and normalized meta — page min 1, limit clamped 1-100
export const paginate = ({ page = 1, limit = 20 } = {}) => {
  const p    = Math.max(1, +page)
  const l    = Math.min(100, Math.max(1, +limit))
  const skip = (p - 1) * l
  return { skip, meta: { page: p, limit: l } }
}
