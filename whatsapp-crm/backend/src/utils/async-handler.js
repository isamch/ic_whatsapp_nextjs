// Wraps async controllers — forwards any thrown error to next() automatically, no try/catch needed
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

export default asyncHandler
