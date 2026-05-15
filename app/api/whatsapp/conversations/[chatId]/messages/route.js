import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'
import { getClient } from '@/lib/whatsapp-manager'

// GET /api/whatsapp/conversations/[chatId]/messages
export const GET = withAuth(async (req, { params }) => {
  const { chatId } = params
  const client = getClient(req.user.id)
  
  if (!client) {
    return error('WhatsApp not connected', 400)
  }

  try {
    const chat = await client.getChatById(chatId)
    const messages = await chat.fetchMessages({ limit: 50 })
    
    const mappedMessages = messages.map(msg => ({
      id: msg.id._serialized,
      body: msg.body,
      from: msg.from,
      to: msg.to,
      fromMe: msg.fromMe,
      timestamp: msg.timestamp,
      type: msg.type
    }))

    return ok(mappedMessages)
  } catch (err) {
    console.error('Error fetching messages:', err)
    return error('Failed to fetch messages', 500)
  }
})

// POST /api/whatsapp/conversations/[chatId]/messages
export const POST = withAuth(async (req, { params }) => {
  const { chatId } = params
  const { body } = await req.json()
  const client = getClient(req.user.id)
  
  if (!client) {
    return error('WhatsApp not connected', 400)
  }

  if (!body) {
    return error('Message body is required', 400)
  }

  try {
    const message = await client.sendMessage(chatId, body)
    return ok({
      id: message.id._serialized,
      body: message.body,
      fromMe: message.fromMe,
      timestamp: message.timestamp
    })
  } catch (err) {
    console.error('Error sending message:', err)
    return error('Failed to send message', 500)
  }
})
