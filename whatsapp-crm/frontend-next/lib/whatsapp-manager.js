import { Client, LocalAuth } from 'whatsapp-web.js'

const clients = global._whatsapp_clients || new Map()
const qrCodes = global._whatsapp_qrcodes || new Map()

if (process.env.NODE_ENV !== 'production') {
  global._whatsapp_clients = clients
  global._whatsapp_qrcodes = qrCodes
}

export function getClient(userId) {
  return clients.get(userId) || null
}

export function getQR(userId) {
  return qrCodes.get(userId) || null
}

export async function getStatus(userId) {
  const client = clients.get(userId)
  if (!client) return null
  try {
    const state = await client.getState()
    return state
  } catch {
    return 'INITIALIZING'
  }
}

export function createClient(userId) {
  if (clients.has(userId)) {
    console.log(`[WhatsApp] Returning existing client for user: ${userId}`)
    return clients.get(userId)
  }

  console.log(`[WhatsApp] Creating NEW client for user: ${userId}`)
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: `user_${userId}` }),
    puppeteer: { 
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ] 
    }
  })

  client.on('qr', (qr) => {
    console.log(`[WhatsApp] QR Generated for user: ${userId}`)
    qrCodes.set(userId, qr)
    updateSessionStatus(userId, 'qr_pending')
  })

  client.on('authenticated', () => {
    console.log(`[WhatsApp] AUTHENTICATED for user: ${userId}`)
  })

  client.on('ready', () => {
    console.log(`[WhatsApp] Client READY for user: ${userId}`)
    qrCodes.delete(userId)
    updateSessionStatus(userId, 'connected')
    autoSyncContacts(userId, client).catch(err => {
      console.error(`[WhatsApp] Auto-sync failed for user ${userId}:`, err)
    })
  })

  client.on('auth_failure', (msg) => {
    console.error(`[WhatsApp] AUTH FAILURE for ${userId}:`, msg)
    qrCodes.delete(userId)
    clients.delete(userId)
    updateSessionStatus(userId, 'disconnected')
  })

  client.on('change_state', (state) => {
    console.log(`[WhatsApp] State change for ${userId}:`, state)
  })

  client.on('disconnected', (reason) => {
    console.log(`[WhatsApp] Client DISCONNECTED: ${reason}`)
    clients.delete(userId)
    updateSessionStatus(userId, 'disconnected')
  })

  console.log(`[WhatsApp] Initializing client for ${userId}...`)
  client.initialize().catch(err => {
    console.error(`[WhatsApp] Initialization ERROR for ${userId}:`, err)
    clients.delete(userId)
    qrCodes.delete(userId)
    updateSessionStatus(userId, 'disconnected')
  })

  clients.set(userId, client)
  return client
}

export async function destroyClient(userId) {
  const client = clients.get(userId)
  if (client) {
    try {
      await client.destroy()
    } catch (err) {
      console.error(`[WhatsApp] Error destroying client for ${userId}:`, err)
    }
    clients.delete(userId)
    qrCodes.delete(userId)
  }

  // Also delete the auth folder to force a fresh login if requested
  const fs = await import('fs/promises')
  const path = await import('path')
  const sessionPath = path.join(process.cwd(), '.wwebjs_auth', `session-user_${userId}`)
  
  try {
    await fs.rm(sessionPath, { recursive: true, force: true })
    console.log(`[WhatsApp] Deleted session folder for user: ${userId}`)
  } catch (err) {
    console.error(`[WhatsApp] Failed to delete session folder for ${userId}:`, err)
  }

  await updateSessionStatus(userId, 'disconnected')
}

async function updateSessionStatus(userId, status) {
  const { db } = await import('./db')
  const { whatsappSessions } = await import('./db/schema')
  const { eq } = await import('drizzle-orm')

  await db.insert(whatsappSessions)
    .values({ userId, status })
    .onConflictDoUpdate({
      target: whatsappSessions.userId,
      set: { status, updatedAt: new Date().toISOString() }
    })
}

async function autoSyncContacts(userId, client) {
  console.log(`[WhatsApp] Auto-syncing contacts for user: ${userId}`)
  const { db } = await import('./db')
  const { whatsappContacts } = await import('./db/schema')
  const { eq, and, or, sql, like } = await import('drizzle-orm')

  const rawContacts = await client.getContacts()
  const validContacts = rawContacts.filter(c => 
    c.isMyContact && c.isUser && !c.isGroup && 
    c.number && c.number.length <= 13 && !c.number.startsWith('10')
  )

  if (validContacts.length === 0) return

  // Unique by number
  const uniqueMap = new Map()
  validContacts.forEach(c => {
    if (!uniqueMap.has(c.number)) uniqueMap.set(c.number, c)
  })
  const uniqueToSync = Array.from(uniqueMap.values())

  // Get existing
  const existing = await db.query.whatsappContacts.findMany({
    where: eq(whatsappContacts.userId, userId),
    columns: { phone: true }
  })
  const existingPhones = new Set(existing.map(e => e.phone))

  // Prepare insert
  const toInsert = uniqueToSync
    .filter(c => !existingPhones.has(c.number))
    .map(c => ({
      name: c.name || c.pushname || c.number,
      phone: c.number,
      userId: userId
    }))

  if (toInsert.length > 0) {
    await db.insert(whatsappContacts).values(toInsert)
    console.log(`[WhatsApp] Auto-synced ${toInsert.length} new contacts for user: ${userId}`)
  }

  // Cleanup
  await db.delete(whatsappContacts).where(
    and(
      eq(whatsappContacts.userId, userId),
      or(
        sql`length(${whatsappContacts.phone}) > 13`,
        like(whatsappContacts.phone, '10%')
      )
    )
  )
}
