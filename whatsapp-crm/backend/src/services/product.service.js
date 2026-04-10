import Product      from '#models/product.model.js'
import { paginate } from '#utils/pagination.js'

export const findAll = async ({ page = 1, limit = 20 } = {}) => {
  const { skip, meta } = paginate({ page, limit })
  const [data, total]  = await Promise.all([
    Product.find().skip(skip).limit(limit).lean(),
    Product.countDocuments(),
  ])
  return { data, meta: { ...meta, total } }
}

export const findById = async (id) => Product.findById(id).lean()

export const create = async (body) => Product.create(body)

export const updateById = async (id, body) =>
  Product.findByIdAndUpdate(id, body, { new: true, runValidators: true }).lean()

export const deleteById = async (id) => Product.findByIdAndDelete(id)
