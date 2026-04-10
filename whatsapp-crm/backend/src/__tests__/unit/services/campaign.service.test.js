import { describe, it, expect, vi } from 'vitest'
import { fakeCampaign, fakeUser } from '../../helpers/factories.js'

vi.mock('#models/campaign.model.js', () => ({
  default: {
    findOne: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    create: vi.fn(),
  },
}))

vi.mock('#services/whatsapp/sessionManager.js', () => ({
  getClient: vi.fn(),
  getStatus: vi.fn(),
}))

import Campaign from '#models/campaign.model.js'
import { getClient, getStatus } from '#services/whatsapp/sessionManager.js'
import { runCampaign, pauseCampaign, stopCampaign } from '#services/campaignEngine.js'

describe('CampaignEngine.runCampaign', () => {

  it('should throw error if campaign not found', async () => {
    Campaign.findOne.mockResolvedValue(null)

    await expect(
      runCampaign('fakeId', fakeUser._id)
    ).rejects.toThrow('Campaign not found')
  })

  it('should throw error if WhatsApp not connected', async () => {
    Campaign.findOne.mockResolvedValue(fakeCampaign)
    getClient.mockReturnValue(null)
    getStatus.mockReturnValue('disconnected')

    await expect(
      runCampaign(fakeCampaign._id, fakeUser._id)
    ).rejects.toThrow('WhatsApp is not connected')
  })

  it('should throw error if campaign already running', async () => {
    Campaign.findOne.mockResolvedValue({ ...fakeCampaign, status: 'running' })

    await expect(
      runCampaign(fakeCampaign._id, fakeUser._id)
    ).rejects.toThrow('Campaign is already running')
  })

})

describe('CampaignEngine.pauseCampaign', () => {

  it('should throw error if campaign is not running', async () => {
    Campaign.findOne.mockResolvedValue({ ...fakeCampaign, status: 'draft' })

    await expect(
      pauseCampaign(fakeCampaign._id, fakeUser._id)
    ).rejects.toThrow('Campaign is not running')
  })

})

describe('CampaignEngine.stopCampaign', () => {

  it('should throw error if campaign cannot be stopped', async () => {
    Campaign.findOne.mockResolvedValue({ ...fakeCampaign, status: 'completed' })

    await expect(
      stopCampaign(fakeCampaign._id, fakeUser._id)
    ).rejects.toThrow('Campaign cannot be stopped')
  })

})
