export const currentUser = {
  id: 'u1',
  username: 'Admin Owner',
  email: 'admin@whatsappcrm.com',
  role: 'admin',
  isActive: true,
  createdAt: '2025-01-15T10:00:00Z',
  lastLoginAt: '2026-03-18T08:30:00Z',
  avatarUrl: 'https://i.pravatar.cc/150?u=admin',
}

export const mockUsers = [
  currentUser,
  { id: 'u2', username: 'Sarah Jenkins', email: 'sarah@example.com', role: 'user', isActive: true, createdAt: '2025-02-20T14:20:00Z', lastLoginAt: '2026-03-17T09:15:00Z' },
  { id: 'u3', username: 'Mike Ross', email: 'mike@example.com', role: 'user', isActive: true, createdAt: '2025-03-10T11:45:00Z', lastLoginAt: '2026-03-18T10:05:00Z' },
  { id: 'u4', username: 'Elena Gilbert', email: 'elena@example.com', role: 'user', isActive: false, createdAt: '2025-04-05T16:30:00Z', lastLoginAt: '2025-12-01T08:20:00Z' },
  { id: 'u5', username: 'David Chen', email: 'david@example.com', role: 'user', isActive: true, createdAt: '2025-05-12T09:10:00Z', lastLoginAt: '2026-03-16T14:40:00Z' },
  { id: 'u6', username: 'Rachel Green', email: 'rachel@example.com', role: 'user', isActive: true, createdAt: '2025-06-22T13:25:00Z', lastLoginAt: '2026-03-18T11:30:00Z' },
  { id: 'u7', username: 'Tom Hardy', email: 'tom@example.com', role: 'user', isActive: true, createdAt: '2025-07-30T10:50:00Z', lastLoginAt: '2026-03-15T16:10:00Z' },
  { id: 'u8', username: 'Nina Dobrev', email: 'nina@example.com', role: 'user', isActive: false, createdAt: '2025-08-15T15:15:00Z', lastLoginAt: '2026-01-20T09:45:00Z' },
]

export const mockSession = {
  id: 's1',
  userId: 'u1',
  status: 'connected',
  connectedAt: '2026-03-18T08:35:00Z',
  phoneNumber: '+1 (555) 123-4567',
}

export const mockCategories = [
  { id: 'cat1', userId: 'u1', name: 'Customers' },
  { id: 'cat2', userId: 'u1', name: 'Leads' },
  { id: 'cat3', userId: 'u1', name: 'Partners' },
  { id: 'cat4', userId: 'u1', name: 'VIPs' },
  { id: 'cat5', userId: 'u1', name: 'Internal Team' },
]

export const mockContactLists = [
  { id: 'list1', userId: 'u1', categoryId: 'cat1', name: 'Active Subscribers 2026', createdAt: '2026-01-10T00:00:00Z', updatedAt: '2026-03-10T00:00:00Z', contactCount: 1250 },
  { id: 'list2', userId: 'u1', categoryId: 'cat1', name: 'Churned Customers', createdAt: '2026-01-15T00:00:00Z', updatedAt: '2026-02-20T00:00:00Z', contactCount: 340 },
  { id: 'list3', userId: 'u1', categoryId: 'cat2', name: 'Webinar Attendees (March)', createdAt: '2026-03-05T00:00:00Z', updatedAt: '2026-03-06T00:00:00Z', contactCount: 850 },
  { id: 'list4', userId: 'u1', categoryId: 'cat2', name: 'Website Opt-ins', createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-03-18T00:00:00Z', contactCount: 2100 },
  { id: 'list5', userId: 'u1', categoryId: 'cat4', name: 'Enterprise Clients', createdAt: '2025-11-10T00:00:00Z', updatedAt: '2026-01-05T00:00:00Z', contactCount: 45 },
]

export const mockContacts = [
  { id: 'c1', listId: 'list1', name: 'Alice Johnson', phoneNumber: '+15550001111', notes: 'Premium tier', validationStatus: 'valid', createdAt: '2026-01-10T10:00:00Z' },
  { id: 'c2', listId: 'list1', name: 'Bob Smith', phoneNumber: '+15550002222', notes: '', validationStatus: 'valid', createdAt: '2026-01-10T10:05:00Z' },
  { id: 'c3', listId: 'list1', name: 'Charlie Davis', phoneNumber: '+15550003333', notes: 'Requires follow up', validationStatus: 'invalid', createdAt: '2026-01-11T11:00:00Z' },
  { id: 'c4', listId: 'list1', name: 'Diana Prince', phoneNumber: '+15550004444', notes: '', validationStatus: 'unknown', createdAt: '2026-01-12T09:30:00Z' },
  { id: 'c5', listId: 'list1', name: 'Evan Wright', phoneNumber: '+15550005555', notes: 'VIP', validationStatus: 'valid', createdAt: '2026-01-12T14:20:00Z' },
]

export const mockTemplates = [
  { id: 't1', userId: 'u1', name: 'Welcome Message', body: 'Hi {{name}}, welcome to our platform! We are thrilled to have you on board. Let us know if you have any questions.', variables: ['name'], createdAt: '2026-01-20T00:00:00Z', updatedAt: '2026-01-20T00:00:00Z' },
  { id: 't2', userId: 'u1', name: 'Webinar Reminder', body: 'Hello {{name}}, just a quick reminder that our webinar "{{topic}}" starts in 1 hour. Join here: {{link}}', variables: ['name', 'topic', 'link'], createdAt: '2026-02-15T00:00:00Z', updatedAt: '2026-02-15T00:00:00Z' },
  { id: 't3', userId: 'u1', name: 'Promo Offer', body: 'Hey {{name}}! We have a special {{discount}} discount just for you. Use code {{code}} at checkout. Valid until Friday!', variables: ['name', 'discount', 'code'], createdAt: '2026-03-01T00:00:00Z', updatedAt: '2026-03-05T00:00:00Z' },
  { id: 't4', userId: 'u1', name: 'Feedback Request', body: 'Hi {{name}}, how was your recent experience with us? Reply with a number from 1 to 5 (5 being excellent).', variables: ['name'], createdAt: '2026-03-10T00:00:00Z', updatedAt: '2026-03-10T00:00:00Z' },
  { id: 't5', userId: 'u1', name: 'Account Update', body: 'Dear {{name}}, your account has been updated successfully. Your new plan is {{plan}}.', variables: ['name', 'plan'], createdAt: '2026-03-12T00:00:00Z', updatedAt: '2026-03-12T00:00:00Z' },
  { id: 't6', userId: 'u1', name: 'Holiday Greeting', body: 'Happy Holidays {{name}}! Wishing you and your family the best from the team at {{company}}.', variables: ['name', 'company'], createdAt: '2025-12-20T00:00:00Z', updatedAt: '2025-12-20T00:00:00Z' },
]

export const mockCampaigns = [
  { id: 'camp1', userId: 'u1', name: 'March Webinar Invites', templateId: 't2', listId: 'list3', status: 'completed', startedAt: '2026-03-10T10:00:00Z', completedAt: '2026-03-10T11:30:00Z', totalContacts: 850, sentCount: 842, failedCount: 8, ratePerMinute: 10 },
  { id: 'camp2', userId: 'u1', name: 'Spring Promo Blast', templateId: 't3', listId: 'list1', status: 'running', startedAt: '2026-03-18T09:00:00Z', totalContacts: 1250, sentCount: 450, failedCount: 12, ratePerMinute: 15 },
  { id: 'camp3', userId: 'u1', name: 'VIP Feedback', templateId: 't4', listId: 'list5', status: 'scheduled', scheduledAt: '2026-03-20T14:00:00Z', totalContacts: 45, sentCount: 0, failedCount: 0, ratePerMinute: 5 },
  { id: 'camp4', userId: 'u1', name: 'Churn Recovery', templateId: 't3', listId: 'list2', status: 'paused', startedAt: '2026-03-17T10:00:00Z', totalContacts: 340, sentCount: 120, failedCount: 5, ratePerMinute: 10 },
  { id: 'camp5', userId: 'u1', name: 'Holiday 2025', templateId: 't6', listId: 'list1', status: 'stopped', startedAt: '2025-12-24T09:00:00Z', completedAt: '2025-12-24T09:45:00Z', totalContacts: 1200, sentCount: 300, failedCount: 20, ratePerMinute: 20 },
  { id: 'camp6', userId: 'u1', name: 'Welcome Series Q1', templateId: 't1', listId: 'list4', status: 'completed', startedAt: '2026-02-01T10:00:00Z', completedAt: '2026-02-01T14:00:00Z', totalContacts: 2100, sentCount: 2050, failedCount: 50, ratePerMinute: 10 },
]

export const mockNotifications = [
  { id: 'n1', senderId: 'u1', recipientId: 'u1', subject: 'Platform Update v1.2', body: 'We have just released version 1.2 with new CSV import features. Check out the contacts page to see it in action.', isRead: false, createdAt: '2026-03-18T08:00:00Z' },
  { id: 'n2', senderId: 'u1', recipientId: 'u1', subject: 'Campaign Completed', body: 'Your campaign "March Webinar Invites" has finished sending. 842 messages sent, 8 failed.', isRead: true, createdAt: '2026-03-10T11:35:00Z' },
  { id: 'n3', senderId: 'u1', recipientId: 'u1', subject: 'WhatsApp Disconnected', body: 'Your WhatsApp session was disconnected. Please navigate to the dashboard to scan the QR code again.', isRead: true, createdAt: '2026-03-05T14:20:00Z' },
  { id: 'n4', senderId: 'u1', recipientId: 'u1', subject: 'Scheduled Maintenance', body: 'The platform will undergo scheduled maintenance on Sunday at 2 AM UTC. Expected downtime is 30 minutes.', isRead: false, createdAt: '2026-03-17T09:00:00Z' },
]

export const mockConversations = [
  { id: 'conv1', contactName: 'Alice Johnson', phoneNumber: '+15550001111', lastMessage: 'Thanks for the info!', lastMessageAt: '2026-03-18T10:45:00Z', unreadCount: 2, isOnline: true, avatarUrl: 'https://i.pravatar.cc/150?u=alice' },
  { id: 'conv2', contactName: 'Bob Smith', phoneNumber: '+15550002222', lastMessage: 'Can we schedule a call?', lastMessageAt: '2026-03-18T09:30:00Z', unreadCount: 0, isOnline: false, avatarUrl: 'https://i.pravatar.cc/150?u=bob' },
  { id: 'conv3', contactName: '+1 (555) 999-8888', phoneNumber: '+15559998888', lastMessage: 'I am interested in the premium plan.', lastMessageAt: '2026-03-17T16:20:00Z', unreadCount: 1, isOnline: true },
  { id: 'conv4', contactName: 'Diana Prince', phoneNumber: '+15550004444', lastMessage: 'See you tomorrow.', lastMessageAt: '2026-03-17T14:10:00Z', unreadCount: 0, isOnline: false, avatarUrl: 'https://i.pravatar.cc/150?u=diana' },
  { id: 'conv5', contactName: 'Evan Wright', phoneNumber: '+15550005555', lastMessage: 'Got it, thanks.', lastMessageAt: '2026-03-16T11:05:00Z', unreadCount: 0, isOnline: false },
  { id: 'conv6', contactName: 'Fiona Gallagher', phoneNumber: '+15550006666', lastMessage: 'Please send the invoice.', lastMessageAt: '2026-03-15T09:00:00Z', unreadCount: 0, isOnline: false, avatarUrl: 'https://i.pravatar.cc/150?u=fiona' },
  { id: 'conv7', contactName: 'George Miller', phoneNumber: '+15550007777', lastMessage: 'Perfect.', lastMessageAt: '2026-03-14T15:30:00Z', unreadCount: 0, isOnline: false },
  { id: 'conv8', contactName: 'Hannah Abbott', phoneNumber: '+15550008888', lastMessage: 'I will check and revert.', lastMessageAt: '2026-03-13T10:15:00Z', unreadCount: 0, isOnline: false, avatarUrl: 'https://i.pravatar.cc/150?u=hannah' },
]

export const mockChatMessages = {
  conv1: [
    { id: 'm1', conversationId: 'conv1', text: 'Hi Alice, just following up on our last conversation.', timestamp: '2026-03-18T10:00:00Z', isSentByMe: true, status: 'read' },
    { id: 'm2', conversationId: 'conv1', text: 'Did you get a chance to review the proposal?', timestamp: '2026-03-18T10:01:00Z', isSentByMe: true, status: 'read' },
    { id: 'm3', conversationId: 'conv1', text: 'Hi! Yes I did.', timestamp: '2026-03-18T10:44:00Z', isSentByMe: false, status: 'delivered' },
    { id: 'm4', conversationId: 'conv1', text: 'Thanks for the info!', timestamp: '2026-03-18T10:45:00Z', isSentByMe: false, status: 'delivered' },
  ],
  conv2: [
    { id: 'm5', conversationId: 'conv2', text: 'Hello Bob, your account is ready.', timestamp: '2026-03-18T09:00:00Z', isSentByMe: true, status: 'read' },
    { id: 'm6', conversationId: 'conv2', text: 'Great, thank you.', timestamp: '2026-03-18T09:15:00Z', isSentByMe: false, status: 'delivered' },
    { id: 'm7', conversationId: 'conv2', text: 'Can we schedule a call?', timestamp: '2026-03-18T09:30:00Z', isSentByMe: false, status: 'delivered' },
  ],
  conv3: [
    { id: 'm8', conversationId: 'conv3', text: 'Welcome to our service! How can we help you today?', timestamp: '2026-03-17T16:00:00Z', isSentByMe: true, status: 'read' },
    { id: 'm9', conversationId: 'conv3', text: 'I am interested in the premium plan.', timestamp: '2026-03-17T16:20:00Z', isSentByMe: false, status: 'delivered' },
  ],
}
