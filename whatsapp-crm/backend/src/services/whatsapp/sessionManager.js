import pkg from 'whatsapp-web.js'
const { Client, LocalAuth } = pkg
import fs from 'fs'
import path from 'path'
import WhatsappSession from '#models/whatsapp-session.model.js'
import Contact from '#models/contact.model.js'

const clients   = new Map()
const qrCodes   = new Map()
const statuses  = new Map()
const chatsCache = new Map()  // userId → { chats: [], cachedAt: Date }

const CACHE_TTL = 60 * 1000  // 60 seconds

export const createClient = (userId) => {
  if (clients.has(userId)) return

  const client = new Client({
    authStrategy: new LocalAuth({ clientId: userId }),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] },
  })

  statuses.set(userId, 'qr_pending')

  client.on('qr', (qr) => {
    qrCodes.set(userId, qr)
    statuses.set(userId, 'qr_pending')
  })

  client.on('ready', async () => {
    statuses.set(userId, 'connected')
    qrCodes.delete(userId)
    // warm up cache on connect
    try {
      const chats = await client.getChats()
      chatsCache.set(userId, { chats, cachedAt: Date.now() })
    } catch {}
    await WhatsappSession.findOneAndUpdate(
      { userId },
      { status: 'connected', connectedAt: new Date() },
      { upsert: true } // create dak l row if not exist (the whatsappSession )
    )
  })

  client.on('auth_failure', async () => {
    statuses.set(userId, 'disconnected')
    clients.delete(userId)
    qrCodes.delete(userId)
    await WhatsappSession.findOneAndUpdate(
      { userId },
      { status: 'disconnected', disconnectedAt: new Date() },
      { upsert: true }
    )
  })

  client.on('disconnected', async () => {
    statuses.set(userId, 'disconnected')
    clients.delete(userId)
    qrCodes.delete(userId)
    chatsCache.delete(userId)  // clear cache on disconnect
    await WhatsappSession.findOneAndUpdate(
      { userId },
      { status: 'disconnected', disconnectedAt: new Date() },
      { upsert: true }
    )
  })

  client.initialize()
  clients.set(userId, client)
}

export const restoreAllSessions = async () => {
  const sessions = await WhatsappSession.find({ status: 'connected' })
  for (const session of sessions) {
    createClient(session.userId.toString())
  }
}

export const getClient = (userId) => clients.get(userId)

export const getQR = (userId) => qrCodes.get(userId)

export const getStatus = (userId) => statuses.get(userId) || 'disconnected'

export const validatePhones = async (userId, listId) => {
  const client = getClient(userId)
  if (!client || getStatus(userId) !== 'connected') {
    throw new Error('WhatsApp is not connected')
  }

  const contacts = await Contact.find({ userId, listId })

  let valid = 0, invalid = 0

  for (const contact of contacts) {
    try {
      const phone = contact.phone.replace(/^\+/, '') + '@c.us'
      const isRegistered = await client.isRegisteredUser(phone)
      contact.validationStatus = isRegistered ? 'valid' : 'invalid'
      await contact.save()
      isRegistered ? valid++ : invalid++
    } catch {
      invalid++
    }
  }

  return { total: contacts.length, valid, invalid }
}

export const getChats = async (userId) => {
  const client = clients.get(userId)
  if (!client) return []

  const cached = chatsCache.get(userId)
  const isValid = cached && (Date.now() - cached.cachedAt) < CACHE_TTL
  if (isValid) return cached.chats

  try {
    const chats = await client.getChats()
    chatsCache.set(userId, { chats, cachedAt: Date.now() })
    return chats
  } catch {
    // browser crashed or detached — clean up
    clients.delete(userId)
    chatsCache.delete(userId)
    statuses.set(userId, 'disconnected')
    await WhatsappSession.findOneAndUpdate(
      { userId },
      { status: 'disconnected', disconnectedAt: new Date() },
      { upsert: true }
    )
    return []
  }
}

export const destroyClient = async (userId) => {
  const client = clients.get(userId)
  if (client) {
    try {
      await client.logout()
    } catch (e) {
      try { await client.destroy() } catch (err) {}
    }

    clients.delete(userId)
    qrCodes.delete(userId)
    chatsCache.delete(userId)
    statuses.set(userId, 'disconnected')

    // Forcefully remove the auth folder to ensure a clean slate for next connection
    try {
      const authPath = path.join(process.cwd(), '.wwebjs_auth', `session-${userId}`)
      if (fs.existsSync(authPath)) {
        fs.rmSync(authPath, { recursive: true, force: true })
      }
    } catch (e) {
      console.error('Failed to remove auth folder:', e)
    }

    try {
      await WhatsappSession.findOneAndUpdate(
        { userId },
        { status: 'disconnected', disconnectedAt: new Date() },
        { upsert: true }
      )
    } catch (e) {}
  }
}
