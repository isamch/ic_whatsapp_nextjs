import Joi from 'joi'

const schema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required()
    .messages({ 'string.min': 'Name must be at least 2 characters', 'string.max': 'Name cannot exceed 50 characters', 'any.required': 'Name is required', 'string.empty': 'Name is required' }),
  email: Joi.string().email({ tlds: { allow: false } }).required()
    .messages({ 'string.email': 'Please provide a valid email address', 'any.required': 'Email is required', 'string.empty': 'Email is required' }),
  password: Joi.string().min(6).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])/).required()
    .messages({ 'string.min': 'Password must be at least 6 characters', 'string.pattern.base': 'Must contain uppercase, lowercase and a symbol', 'any.required': 'Password is required', 'string.empty': 'Password is required' }),
  roles: Joi.array().items(Joi.string().valid('user', 'admin')).default(['user']),
})

export function validateCreateUser(data) {
  const { error } = schema.validate(data, { abortEarly: false })
  if (!error) return {}
  const errors = {}
  error.details.forEach(({ path, message }) => { errors[path[0]] = message })
  return errors
}

export function generatePassword() {
  const upper   = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lower   = 'abcdefghijkmnpqrstuvwxyz'
  const symbols = '@$!%*?&'
  const all     = upper + lower + symbols + '23456789'
  const required = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ]
  const rest = Array.from({ length: 7 }, () => all[Math.floor(Math.random() * all.length)])
  return [...required, ...rest].sort(() => Math.random() - 0.5).join('')
}

export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' }
  const checks = [password.length >= 6, /[A-Z]/.test(password), /[a-z]/.test(password), /[@$!%*?&]/.test(password)]
  const score = checks.filter(Boolean).length
  const map = [
    { label: '',       color: '' },
    { label: 'Weak',   color: 'bg-red-400' },
    { label: 'Fair',   color: 'bg-amber-400' },
    { label: 'Good',   color: 'bg-blue-400' },
    { label: 'Strong', color: 'bg-green-400' },
  ]
  return { score, ...map[score] }
}
