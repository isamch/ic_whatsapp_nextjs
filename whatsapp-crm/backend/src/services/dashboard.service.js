import Contact from '#models/contact.model.js'
import ContactList from '#models/contact-list.model.js'
import Campaign from '#models/campaign.model.js'
import Template from '#models/template.model.js'
import User from '#models/user.model.js'
import { getStatus } from './whatsapp/sessionManager.js'

export const getDashboardStats = async (userId) => {
  const [
    totalContacts,
    totalLists,
    totalTemplates,
    totalCampaigns,
    recentCampaigns,
    user,
  ] = await Promise.all([
    Contact.countDocuments({ userId }),
    ContactList.countDocuments({ userId }),
    Template.countDocuments({ userId }),
    Campaign.countDocuments({ userId }),
    Campaign.find({ userId }).sort({ createdAt: -1 }).limit(5).populate('templateId', 'name').populate('listId', 'name'),
    User.findById(userId),
  ])

  const whatsappStatus = getStatus(userId.toString())

  return {
    totalContacts,
    totalLists,
    totalTemplates,
    totalCampaigns,
    messageCount: user?.messageCount || 0,
    whatsappStatus,
    recentCampaigns,
  }
}
