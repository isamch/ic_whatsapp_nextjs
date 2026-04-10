import Category from '#models/category.model.js'
import ContactList from '#models/contact-list.model.js'
import Contact from '#models/contact.model.js'
import { notFound, forbidden } from '#utils/app-error.js'

export const findAll = async (userId) => {
  return Category.find({ userId }).lean()
}

export const create = async (userId, body) => {
  return Category.create({ userId, ...body })
}

export const updateById = async (userId, id, body) => {
  const category = await Category.findOne({ _id: id, userId })
  if (!category) throw notFound('Category not found')
  return Category.findByIdAndUpdate(id, body, { new: true }).lean()
}

export const deleteById = async (userId, id) => {
  const category = await Category.findOne({ _id: id, userId })
  if (!category) throw notFound('Category not found')

  const lists = await ContactList.find({ categoryId: id }).lean()
  const listIds = lists.map(l => l._id)

  await Contact.deleteMany({ listId: { $in: listIds } })
  await ContactList.deleteMany({ categoryId: id })
  await Category.findByIdAndDelete(id)
}
