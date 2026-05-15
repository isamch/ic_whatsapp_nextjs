const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient({
  errorFormat: 'pretty'
})

async function main() {
  console.log('🌱 Starting database seeding...')

  // 1. Cleanup existing data
  await prisma.campaignLog.deleteMany()
  await prisma.campaign.deleteMany()
  await prisma.template.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.contactList.deleteMany()
  await prisma.category.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.refreshToken.deleteMany()
  await prisma.whatsappSession.deleteMany()
  await prisma.user.deleteMany()

  // 2. Create Users
  const hashedPassword = await bcrypt.hash('@#isamchajia2003', 10)
  
  const admin = await prisma.user.create({
    data: {
      name: 'Isam Chajia',
      email: 'isamchajia@admin.com',
      password: hashedPassword,
      role: 'admin'
    }
  })

  const regularUser = await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'user'
    }
  })

  console.log('✅ Users created')

  // 3. Create Categories
  const cat1 = await prisma.category.create({
    data: { name: 'VIP Clients', userId: admin.id }
  })
  const cat2 = await prisma.category.create({
    data: { name: 'New Leads', userId: admin.id }
  })

  console.log('✅ Categories created')

  // 4. Create Contact Lists
  const list1 = await prisma.contactList.create({
    data: { name: 'E-commerce Owners', userId: admin.id, categoryId: cat1.id }
  })
  const list2 = await prisma.contactList.create({
    data: { name: 'Real Estate Agents', userId: admin.id, categoryId: cat2.id }
  })

  console.log('✅ Contact Lists created')

  // 5. Create Contacts
  const contactsData = [
    { name: 'Ahmed Ali', phone: '212600000001', contactListId: list1.id, isValid: true },
    { name: 'Sarah Mansour', phone: '212600000002', contactListId: list1.id, isValid: true },
    { name: 'Yassine Karim', phone: '212600000003', contactListId: list2.id, isValid: true },
    { name: 'Mouna Reda', phone: '212600000004', contactListId: list2.id, isValid: false },
    { name: 'Unknown Contact', phone: '212600000005', contactListId: list2.id, isValid: null },
  ]

  for (const contact of contactsData) {
    await prisma.contact.create({ data: contact })
  }

  console.log('✅ Contacts created')

  // 6. Create Templates
  const template1 = await prisma.template.create({
    data: {
      name: 'Welcome Message',
      body: 'Hello {{name}}, welcome to our platform! How can we help you today?',
      userId: admin.id
    }
  })
  const template2 = await prisma.template.create({
    data: {
      name: 'Flash Sale',
      body: 'Exclusive for you {{name}}! 50% discount on all services today. Don\'t miss out!',
      userId: admin.id
    }
  })

  console.log('✅ Templates created')

  // 7. Create Campaigns
  const campaign1 = await prisma.campaign.create({
    data: {
      name: 'Black Friday Blast',
      status: 'completed',
      userId: admin.id,
      templateId: template2.id,
      contactListId: list1.id,
      totalCount: 2,
      sentCount: 2,
      failedCount: 0
    }
  })

  const campaign2 = await prisma.campaign.create({
    data: {
      name: 'Winter Welcoming',
      status: 'running',
      userId: admin.id,
      templateId: template1.id,
      contactListId: list2.id,
      totalCount: 3,
      sentCount: 1,
      failedCount: 1
    }
  })

  console.log('✅ Campaigns created')

  // 8. Create Campaign Logs
  await prisma.campaignLog.createMany({
    data: [
      { campaignId: campaign1.id, contactId: 1, status: 'sent' },
      { campaignId: campaign1.id, contactId: 2, status: 'sent' },
      { campaignId: campaign2.id, contactId: 3, status: 'sent' },
      { campaignId: campaign2.id, contactId: 4, status: 'failed', error: 'Invalid number' },
    ]
  })

  console.log('✅ Campaign Logs created')

  // 9. Create Notifications
  await prisma.notification.createMany({
    data: [
      { userId: admin.id, message: 'System update scheduled for tonight.' },
      { userId: admin.id, message: 'Welcome to your new CRM dashboard!' },
      { userId: regularUser.id, message: 'Please connect your WhatsApp to start campaigns.' },
    ]
  })

  console.log('✅ Notifications created')
  console.log('🚀 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
