import { db } from '@/lib/db'
import { contacts as contactsTable } from '@/lib/db/schema'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const POST = withAuth(async (req) => {
  const formData = await req.formData()
  const file     = formData.get('file')
  const listId   = formData.get('listId')

  if (!file || !listId) return error('file and listId are required')

  const text  = await file.text()
  const lines = text.trim().split('\n').slice(1) // skip header

  const data = lines.map(line => {
    const [name, phone, notes] = line.split(',').map(v => v?.trim())
    return { name, phone, notes: notes || null, contactListId: Number(listId), isValid: null }
  }).filter(c => c.name && c.phone)

  if (data.length > 0) {
    await db.insert(contactsTable).values(data)
  }

  return ok({ imported: data.length })
})
