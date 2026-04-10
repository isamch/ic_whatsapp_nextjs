import ContactList from '#models/contact-list.model.js'
import Contact from '#models/contact.model.js'
import { notFound } from '#utils/app-error.js'

export const findAll = async (userId, categoryId) => {
  const filter = { userId }
  if (categoryId) filter.categoryId = categoryId
  return ContactList.find(filter).lean()
}

export const create = async (userId, body) => {
  return ContactList.create({ userId, ...body })
}

export const updateById = async (userId, id, body) => {
  const list = await ContactList.findOne({ _id: id, userId })
  if (!list) throw notFound('Contact list not found')
  return ContactList.findByIdAndUpdate(id, body, { new: true }).lean()
}

export const deleteById = async (userId, id) => {
  const list = await ContactList.findOne({ _id: id, userId })
  if (!list) throw notFound('Contact list not found')
  await Contact.deleteMany({ listId: id })
  await ContactList.findByIdAndDelete(id)
}
