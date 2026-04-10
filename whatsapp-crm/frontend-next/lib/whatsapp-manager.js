import { Client, LocalAuth } from 'whatsapp-web.js'

const clients = new Map()
const qrCodes = new Map()

export function getClient(userId) {
  return clients.get(userId) || null
}

export function getQR(userId) {
  return qrCodes.get(userId) || null
}

export function createClient(userId) {
  if (clients.has(userId)) return clients.get(userId)

  const client = new Client({
    authStrategy: new LocalAuth({ clientId: `user_${userId}` }),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
  })

  client.on('qr', (qr) => qrCodes.set(userId, qr))
  client.on('ready', () => {
    qrCodes.delete(userId)
    updateSessionStatus(userId, 'connected')
  })
  client.on('disconnected', () => {
    clients.delete(userId)
    updateSessionStatus(userId, 'disconnected')
  })

  client.initialize()
  clients.set(userId, client)
  return client
}

export async function destroyClient(userId) {
  const client = clients.get(userId)
  if (client) {
    await client.destroy()
    clients.delete(userId)
    qrCodes.delete(userId)
  }
}

async function updateSessionStatus(userId, status) {
  const { default: prisma } = await import('./prisma')
  await prisma.whatsappSession.upsert({
    where: { userId },
    update: { status },
    create: { userId, status }
  })
}
