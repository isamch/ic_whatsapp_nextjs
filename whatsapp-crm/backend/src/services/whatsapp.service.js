import QRCode from 'qrcode'
import * as sessionManager from './whatsapp/sessionManager.js'

export const connect = async (userId) => {
  sessionManager.createClient(userId.toString())
  return { message: 'WhatsApp client initializing' }
}

export const getQR = async (userId) => {
  const qr = sessionManager.getQR(userId.toString())
  if (!qr) return null
  return QRCode.toDataURL(qr)
}

export const getStatus = (userId) => {
  return sessionManager.getStatus(userId.toString())
}

export const getProfile = async (userId) => {
  const client = sessionManager.getClient(userId.toString())
  if (!client || sessionManager.getStatus(userId.toString()) !== 'connected') return null

  const info = client.info
  return {
    name:   info.pushname,
    number: info.wid.user,
  }
}

export const disconnect = async (userId) => {
  await sessionManager.destroyClient(userId.toString())
}

export const getConversations = async (userId) => {
  const client = sessionManager.getClient(userId.toString())
  if (!client || sessionManager.getStatus(userId.toString()) !== 'connected') return []

  const allChats = await sessionManager.getChats(userId.toString())

  return Promise.all(
    allChats.map(async (chat) => ({
      id:              chat.id._serialized,
      name:            chat.name,
      lastMessage:     chat.lastMessage?.body || '',
      lastMessageTime: chat.lastMessage?.timestamp ? new Date(chat.lastMessage.timestamp * 1000) : null,
      unreadCount:     chat.unreadCount,
      isGroup:         chat.isGroup,
    }))
  )
}

export const getMessages = async (userId, chatId, { limit = 50 } = {}) => {
  const client = sessionManager.getClient(userId.toString())
  if (!client || sessionManager.getStatus(userId.toString()) !== 'connected') return { data: [] }

  const chat = await client.getChatById(chatId)
  const all  = await chat.fetchMessages({ limit })

  return {
    data: all.map(m => ({
      id:        m.id._serialized,
      body:      m.body,
      fromMe:    m.fromMe,
      timestamp: new Date(m.timestamp * 1000),
      author:    m.author || null,
    }))
  }
}

export const sendMessage = async (userId, chatId, body) => {
  const client = sessionManager.getClient(userId.toString())
  if (!client || sessionManager.getStatus(userId.toString()) !== 'connected')
    throw new Error('WhatsApp is not connected')

  const msg = await client.sendMessage(chatId, body)
  return {
    id:        msg.id._serialized,
    body:      msg.body,
    fromMe:    true,
    timestamp: new Date(msg.timestamp * 1000),
  }
}
