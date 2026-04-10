import Template from '#models/template.model.js'
import { paginate } from '#utils/pagination.js'
import { notFound } from '#utils/app-error.js'

const extractVariables = (body) => {
  const matches = body.match(/\{\{(\w+)\}\}/g) || []
  return [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))]
}

export const findAll = async (userId, { page = 1, limit = 20 } = {}) => {
  const { skip, meta } = paginate({ page, limit })
  const [data, total] = await Promise.all([
    Template.find({ userId }).skip(skip).limit(limit).lean(),
    Template.countDocuments({ userId }),
  ])
  return { data, meta: { ...meta, total } }
}

export const findById = async (userId, id) => {
  const template = await Template.findOne({ _id: id, userId }).lean()
  if (!template) throw notFound('Template not found')
  return template
}

export const create = async (userId, body) => {
  const variables = extractVariables(body.body || '')
  return Template.create({ userId, ...body, variables })
}

export const updateById = async (userId, id, body) => {
  const template = await Template.findOne({ _id: id, userId })
  if (!template) throw notFound('Template not found')
  if (body.body) body.variables = extractVariables(body.body)
  return Template.findByIdAndUpdate(id, body, { new: true, runValidators: true }).lean()
}

export const deleteById = async (userId, id) => {
  const template = await Template.findOne({ _id: id, userId })
  if (!template) throw notFound('Template not found')
  await Template.findByIdAndDelete(id)
}
