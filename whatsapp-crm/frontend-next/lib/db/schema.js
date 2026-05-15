import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// 1. Users Table
export const users = sqliteTable('User', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull().default('user'),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
});

// 2. Refresh Tokens
export const refreshTokens = sqliteTable('RefreshToken', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  token: text('token').notNull().unique(),
  userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: text('expiresAt').notNull(),
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
});

// 3. WhatsApp Sessions
export const whatsappSessions = sqliteTable('WhatsappSession', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('userId').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('disconnected'),
  qrCode: text('qrCode'),
  phoneNumber: text('phoneNumber'),
  lastConnected: text('lastConnected'),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
});

// 4. Categories
export const categories = sqliteTable('Category', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
});

// 5. Contact Lists
export const contactLists = sqliteTable('ContactList', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  categoryId: integer('categoryId').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
});

// 6. Contacts
export const contacts = sqliteTable('Contact', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name'),
  phone: text('phone').notNull(),
  notes: text('notes'),
  isValid: integer('isValid', { mode: 'boolean' }),
  contactListId: integer('contactListId').notNull().references(() => contactLists.id, { onDelete: 'cascade' }),
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
});

// 7. Templates
export const templates = sqliteTable('Template', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  body: text('body').notNull(),
  userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
});

// 8. Campaigns
export const campaigns = sqliteTable('Campaign', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  status: text('status').notNull().default('pending'), // 'pending', 'running', 'paused', 'completed'
  userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  templateId: integer('templateId').notNull().references(() => templates.id),
  contactListId: integer('contactListId').notNull().references(() => contactLists.id),
  totalCount: integer('totalCount').notNull().default(0),
  sentCount: integer('sentCount').notNull().default(0),
  failedCount: integer('failedCount').notNull().default(0),
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
});

// 9. Campaign Logs
export const campaignLogs = sqliteTable('CampaignLog', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  campaignId: integer('campaignId').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  contactId: integer('contactId').notNull().references(() => contacts.id, { onDelete: 'cascade' }),
  status: text('status').notNull(), // 'sent', 'failed'
  error: text('error'),
  sentAt: text('sentAt').default(sql`CURRENT_TIMESTAMP`),
});

// 10. Notifications
export const notifications = sqliteTable('Notification', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  subject: text('subject'),
  message: text('message').notNull(),
  type: text('type').notNull().default('private'), // 'private', 'broadcast', 'system', 'alert', 'success'
  isRead: integer('isRead', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
});
// 11. WhatsApp Contacts
export const whatsappContacts = sqliteTable('WhatsAppContact', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
});

// Relations
import { relations } from 'drizzle-orm';

export const usersRelations = relations(users, ({ one, many }) => ({
  refreshTokens: many(refreshTokens),
  whatsappSession: one(whatsappSessions, {
    fields: [users.id],
    references: [whatsappSessions.userId],
  }),
  categories: many(categories),
  contactLists: many(contactLists),
  templates: many(templates),
  campaigns: many(campaigns),
  notifications: many(notifications),
  whatsappContacts: many(whatsappContacts),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

export const whatsappSessionsRelations = relations(whatsappSessions, ({ one }) => ({
  user: one(users, {
    fields: [whatsappSessions.userId],
    references: [users.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  contactLists: many(contactLists),
}));

export const contactListsRelations = relations(contactLists, ({ one, many }) => ({
  user: one(users, {
    fields: [contactLists.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [contactLists.categoryId],
    references: [categories.id],
  }),
  contacts: many(contacts),
  campaigns: many(campaigns),
}));

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  contactList: one(contactLists, {
    fields: [contacts.contactListId],
    references: [contactLists.id],
  }),
  logs: many(campaignLogs),
}));

export const templatesRelations = relations(templates, ({ one, many }) => ({
  user: one(users, {
    fields: [templates.userId],
    references: [users.id],
  }),
  campaigns: many(campaigns),
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  user: one(users, {
    fields: [campaigns.userId],
    references: [users.id],
  }),
  template: one(templates, {
    fields: [campaigns.templateId],
    references: [templates.id],
  }),
  contactList: one(contactLists, {
    fields: [campaigns.contactListId],
    references: [contactLists.id],
  }),
  logs: many(campaignLogs),
}));

export const campaignLogsRelations = relations(campaignLogs, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [campaignLogs.campaignId],
    references: [campaigns.id],
  }),
  contact: one(contacts, {
    fields: [campaignLogs.contactId],
    references: [contacts.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));
export const whatsappContactsRelations = relations(whatsappContacts, ({ one }) => ({
  user: one(users, {
    fields: [whatsappContacts.userId],
    references: [users.id],
  }),
}));
