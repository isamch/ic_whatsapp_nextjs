import prisma from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'

export const POST = withAuth(async (req) => {
  const formData = await req.formData()
  const file     = formData.get('file')
  const listId   = formData.get('listId')

  if (!file || !listId) return error('file and listId are required')

  const text  = await file.text()
  const lines = text.trim().split('\n').slice(1) // skip header

  const contacts = lines.map(line => {
    const [name, phone, notes] = line.split(',').map(v => v?.trim())
    return { name, phone, notes: notes || null, contactListId: Number(listId) }
  }).filter(c => c.name && c.phone)

  await prisma.contact.createMany({ data: contacts, skipDuplicates: true })

  return ok({ imported: contacts.length })
})
