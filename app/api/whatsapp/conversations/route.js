import { withAuth } from '@/lib/withAuth'
import { ok, error } from '@/lib/response'
import { getClient } from '@/lib/whatsapp-manager'

export const GET = withAuth(async (req) => {
  const client = getClient(req.user.id)
  
  if (!client) {
    return error('WhatsApp not connected', 400)
  }

  try {
    const chats = await client.getChats()
    // Return only necessary data for the inbox list
    const mappedChats = chats.map(chat => ({
      id: chat.id._serialized,
      name: chat.name,
      unreadCount: chat.unreadCount,
      timestamp: chat.timestamp,
      lastMessage: chat.lastMessage ? {
        body: chat.lastMessage.body,
        fromMe: chat.lastMessage.fromMe,
        timestamp: chat.lastMessage.timestamp
      } : null
    }))

    return ok(mappedChats)
  } catch (err) {
    console.error('Error fetching chats:', err)
    return error('Failed to fetch conversations', 500)
  }
})
