import Contact from '#models/contact.model.js'
import ContactList from '#models/contact-list.model.js'
import { notFound, conflict, badRequest } from '#utils/app-error.js'
import { paginate } from '#utils/pagination.js'

export const findAll = async (userId, listId, { page = 1, limit = 20 } = {}) => {
  const { skip, meta } = paginate({ page, limit })
  const filter = { userId, listId }
  const [data, total] = await Promise.all([
    Contact.find(filter).skip(skip).limit(limit).lean(),
    Contact.countDocuments(filter),
  ])
  return { data, meta: { ...meta, total } }
}

export const create = async (userId, body) => {
  const existing = await Contact.findOne({ listId: body.listId, phone: body.phone })
  if (existing) throw conflict('Phone number already exists in this list')

  const contact = await Contact.create({ userId, ...body })
  await ContactList.findByIdAndUpdate(body.listId, { $inc: { contactCount: 1 } })
  return contact
}

export const updateById = async (userId, id, body) => {
  const contact = await Contact.findOne({ _id: id, userId })
  if (!contact) throw notFound('Contact not found')
  return Contact.findByIdAndUpdate(id, body, { new: true }).lean()
}

export const deleteById = async (userId, id) => {
  const contact = await Contact.findOne({ _id: id, userId })
  if (!contact) throw notFound('Contact not found')
  await Contact.findByIdAndDelete(id)
  await ContactList.findByIdAndUpdate(contact.listId, { $inc: { contactCount: -1 } })
}

export const clearInvalidContacts = async (userId, listId) => {
  const list = await ContactList.findOne({ _id: listId, userId })
  if (!list) throw notFound('Contact list not found')

  const result = await Contact.deleteMany({ userId, listId, validationStatus: 'invalid' })
  const deletedCount = result.deletedCount || 0

  await ContactList.findByIdAndUpdate(listId, { $inc: { contactCount: -deletedCount } })
  return { deleted: deletedCount }
}

export const importFromCSV = async (userId, listId, csvText) => {
  const list = await ContactList.findOne({ _id: listId, userId })
  if (!list) throw notFound('Contact list not found')

  const lines = csvText.split('\n').map(l => l.trim()).filter(Boolean)
  if (lines.length < 2) throw badRequest('CSV must have a header row and at least one contact')

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const nameIdx = headers.indexOf('name')
  const phoneIdx = headers.indexOf('phone')
  if (nameIdx === -1 || phoneIdx === -1) throw badRequest('CSV must have "name" and "phone" columns')

  const rows = lines.slice(1).map(line => {
    const cols = line.split(',')
    return {
      name:  cols[nameIdx]?.trim()  || '',
      phone: cols[phoneIdx]?.trim() || '',
      notes: cols[headers.indexOf('notes')]?.trim() || '',
    }
  }).filter(r => r.phone)

  const existingPhones = await Contact.find({ listId, phone: { $in: rows.map(r => r.phone) } }).distinct('phone')
  const newRows = rows.filter(r => !existingPhones.includes(r.phone))

  if (newRows.length === 0) return { imported: 0, skipped: rows.length }

  await Contact.insertMany(newRows.map(r => ({ userId, listId, name: r.name, phone: r.phone, notes: r.notes })))
  await ContactList.findByIdAndUpdate(listId, { $inc: { contactCount: newRows.length } })

  return { imported: newRows.length, skipped: rows.length - newRows.length }
}
