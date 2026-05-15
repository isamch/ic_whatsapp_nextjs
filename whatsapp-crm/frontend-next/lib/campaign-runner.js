import { db } from './db'
import { campaigns, campaignLogs } from './db/schema'
import { eq, sql } from 'drizzle-orm'

const delay = (ms) => new Promise(res => setTimeout(res, ms))

export async function runCampaignJob(campaign, client) {
  const { id, template, contactList } = campaign
  const contacts = contactList.contacts

  for (const contact of contacts) {
    const [current] = await db.select({ status: campaigns.status })
      .from(campaigns)
      .where(eq(campaigns.id, id))

    if (!current || current.status === 'stopped') break
    if (current.status === 'paused') {
      await waitUntilResumed(id)
    }

    const message = template.body.replace(/\{\{(\w+)\}\}/g, (_, key) => contact[key] || '')

    try {
      await client.sendMessage(`${contact.phone}@c.us`, message)
      await db.insert(campaignLogs).values({ 
        campaignId: id, 
        contactId: contact.id, 
        status: 'sent' 
      })
      await db.update(campaigns)
        .set({ sentCount: sql`${campaigns.sentCount} + 1` })
        .where(eq(campaigns.id, id))
    } catch (err) {
      await db.insert(campaignLogs).values({ 
        campaignId: id, 
        contactId: contact.id, 
        status: 'failed', 
        error: err.message 
      })
      await db.update(campaigns)
        .set({ failedCount: sql`${campaigns.failedCount} + 1` })
        .where(eq(campaigns.id, id))
    }

    await delay(2000) // 2s delay between messages
  }

  const [final] = await db.select({ status: campaigns.status })
    .from(campaigns)
    .where(eq(campaigns.id, id))
    
  if (final && final.status === 'running') {
    await db.update(campaigns)
      .set({ status: 'completed' })
      .where(eq(campaigns.id, id))
  }
}

async function waitUntilResumed(campaignId) {
  while (true) {
    await delay(3000)
    const [c] = await db.select({ status: campaigns.status })
      .from(campaigns)
      .where(eq(campaigns.id, campaignId))
    if (!c || c.status !== 'paused') break
  }
}
