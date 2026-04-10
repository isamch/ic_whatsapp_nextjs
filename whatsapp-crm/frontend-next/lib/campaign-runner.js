import prisma from './prisma'

const delay = (ms) => new Promise(res => setTimeout(res, ms))

export async function runCampaignJob(campaign, client) {
  const { id, template, contactList } = campaign
  const contacts = contactList.contacts

  for (const contact of contacts) {
    const current = await prisma.campaign.findUnique({ where: { id }, select: { status: true } })

    if (current.status === 'stopped') break
    if (current.status === 'paused') {
      await waitUntilResumed(id)
    }

    const message = template.body.replace(/\{\{(\w+)\}\}/g, (_, key) => contact[key] || '')

    try {
      await client.sendMessage(`${contact.phone}@c.us`, message)
      await prisma.campaignLog.create({ data: { campaignId: id, contactId: contact.id, status: 'sent' } })
      await prisma.campaign.update({ where: { id }, data: { sentCount: { increment: 1 } } })
    } catch (err) {
      await prisma.campaignLog.create({ data: { campaignId: id, contactId: contact.id, status: 'failed', error: err.message } })
      await prisma.campaign.update({ where: { id }, data: { failedCount: { increment: 1 } } })
    }

    await delay(2000) // 2s delay between messages
  }

  const final = await prisma.campaign.findUnique({ where: { id }, select: { status: true } })
  if (final.status === 'running') {
    await prisma.campaign.update({ where: { id }, data: { status: 'completed' } })
  }
}

async function waitUntilResumed(campaignId) {
  while (true) {
    await delay(3000)
    const c = await prisma.campaign.findUnique({ where: { id: campaignId }, select: { status: true } })
    if (c.status !== 'paused') break
  }
}
