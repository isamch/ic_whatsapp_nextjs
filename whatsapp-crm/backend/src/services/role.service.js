import Role from '#models/role.model.js'
import { paginate } from '#utils/pagination.js'

export const findAll = async ({ page = 1, limit = 20 } = {}) => {
  const { skip, meta } = paginate({ page, limit })
  const [data, total] = await Promise.all([
    Role.find().skip(skip).limit(limit).lean(),
    Role.countDocuments(),
  ])
  return { data, meta: { ...meta, total } }
}

export const findById = async (id) => Role.findById(id).lean()

export const findByName = async (name) => Role.findOne({ name }).lean()

export const create = async (body) => Role.create(body)

export const updateById = async (id, body) =>
  Role.findByIdAndUpdate(id, body, { new: true, runValidators: true }).lean()

export const deleteById = async (id) => Role.findByIdAndDelete(id)

export const addPermissions = async (id, permissions) =>
  Role.findByIdAndUpdate(id, { $addToSet: { permissions: { $each: permissions } } }, { new: true }).lean()

export const removePermissions = async (id, permissions) =>
  Role.findByIdAndUpdate(id, { $pull: { permissions: { $in: permissions } } }, { new: true }).lean()
