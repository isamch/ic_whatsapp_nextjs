import Campaign from '#models/campaign.model.js'
import CampaignLog from '#models/campaign-log.model.js'
import Contact from '#models/contact.model.js'
import Template from '#models/template.model.js'
import User from '#models/user.model.js'
import Notification from '#models/notification.model.js'
import { getClient, getStatus } from './whatsapp/sessionManager.js'

// Active campaign runners: campaignId → { timer, paused, stopped }
const runners = new Map()

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const substituteVariables = (body, contact) => {
  return body.replace(/\{\{(\w+)\}\}/g, (_, key) => contact[key] ?? contact.customFields?.[key] ?? `{{${key}}}`)
}

export const runCampaign = async (campaignId, userId) => {
  const campaign = await Campaign.findOne({ _id: campaignId, userId })
  if (!campaign) throw new Error('Campaign not found')
  if (['running', 'completed', 'stopped'].includes(campaign.status)) throw new Error(`Campaign is already ${campaign.status}`)

  const client = getClient(userId)
  if (!client || getStatus(userId) !== 'connected') throw new Error('WhatsApp is not connected')

  const template = await Template.findById(campaign.templateId)
  if (!template) throw new Error('Template not found')

  const contacts = await Contact.find({ userId, listId: campaign.listId })
  if (!contacts.length) throw new Error('No contacts in this list')

  // Get already-sent contacts to support resume
  const sentLogs = await CampaignLog.find({ campaignId }).select('contactId')
  const sentIds = new Set(sentLogs.map((l) => l.contactId.toString()))
  const remaining = contacts.filter((c) => !sentIds.has(c._id.toString()))

  await Campaign.findByIdAndUpdate(campaignId, {
    status: 'running',
    total: contacts.length,
    startedAt: campaign.startedAt || new Date(),
  })

  const delayMs = Math.floor(60000 / campaign.ratePerMinute)
  const state = { paused: false, stopped: false }
  runners.set(campaignId.toString(), state)

  // Run async without blocking
  ;(async () => {
    for (const contact of remaining) {
      if (state.stopped) break

      while (state.paused) {
        await sleep(1000)
        if (state.stopped) break
      }
      if (state.stopped) break

      const message = substituteVariables(template.body, contact)
      const phoneId = contact.phone.replace(/[^0-9]/g, '') + '@c.us'
      let logStatus = 'sent', logError = null

      try {
        await client.sendMessage(phoneId, message)
        await Campaign.findByIdAndUpdate(campaignId, { $inc: { sent: 1 } })
        await User.findByIdAndUpdate(userId, { $inc: { messageCount: 1 } })
      } catch (err) {
        logStatus = 'failed'
        logError = err.message
        await Campaign.findByIdAndUpdate(campaignId, { $inc: { failed: 1 } })
      }

      await CampaignLog.create({ campaignId, contactId: contact._id, phone: contact.phone, status: logStatus, error: logError })
      await sleep(delayMs)
    }

    const finalState = runners.get(campaignId.toString())
    if (finalState && !finalState.stopped) {
      await Campaign.findByIdAndUpdate(campaignId, { status: 'completed', completedAt: new Date() })
      await Notification.create({
        senderId:    null,
        recipientId: userId,
        subject:     `Campaign "${campaign.name}" completed`,
        body:        `Your campaign has finished. Sent: ${campaign.sent || 0}, Failed: ${campaign.failed || 0}, Total: ${campaign.total || 0}.`,
        isBroadcast: false,
        isSystem:    true,
      })
    }
    runners.delete(campaignId.toString())
  })()
}

export const pauseCampaign = async (campaignId, userId) => {
  const campaign = await Campaign.findOne({ _id: campaignId, userId })
  if (!campaign || campaign.status !== 'running') throw new Error('Campaign is not running')
  const state = runners.get(campaignId.toString())
  if (state) state.paused = true
  await Campaign.findByIdAndUpdate(campaignId, { status: 'paused' })
}

export const resumeCampaign = async (campaignId, userId) => {
  const campaign = await Campaign.findOne({ _id: campaignId, userId })
  if (!campaign || campaign.status !== 'paused') throw new Error('Campaign is not paused')
  const state = runners.get(campaignId.toString())
  if (state) {
    state.paused = false
    await Campaign.findByIdAndUpdate(campaignId, { status: 'running' })
  } else {
    // Runner died (server restart) — re-run from where we left off
    await runCampaign(campaignId, userId)
  }
}

export const stopCampaign = async (campaignId, userId) => {
  const campaign = await Campaign.findOne({ _id: campaignId, userId })
  if (!campaign || !['running', 'paused'].includes(campaign.status)) throw new Error('Campaign cannot be stopped')
  const state = runners.get(campaignId.toString())
  if (state) { state.stopped = true; state.paused = false }
  await Campaign.findByIdAndUpdate(campaignId, { status: 'stopped' })
}
