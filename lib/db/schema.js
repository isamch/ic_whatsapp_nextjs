import { pgTable, serial, text, integer, boolean, timestamp, uniqueIndex, unique } from 'drizzle-orm/pg-core';
import { sql, relations } from 'drizzle-orm';

export const users = pgTable('User', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull().default('user'),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(whatsappSessions),
  refreshTokens: many(refreshTokens),
  campaigns: many(campaigns),
  notifications: many(notifications),
}));

export const refreshTokens = pgTable('RefreshToken', {
  id: serial('id').primaryKey(),
  token: text('token').notNull().unique(),
  userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const whatsappSessions = pgTable('WhatsappSession', {
  id: serial('id').primaryKey(),
  userId: integer('userId').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('disconnected'),
  qrCode: text('qrCode'),
  phoneNumber: text('phoneNumber'),
  lastConnected: timestamp('lastConnected'),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const whatsappSessionsRelations = relations(whatsappSessions, ({ one }) => ({
  user: one(users, { fields: [whatsappSessions.userId], references: [users.id] }),
}));

export const categories = pgTable('Category', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const contactLists = pgTable('ContactList', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  categoryId: integer('categoryId').references(() => categories.id, { onDelete: 'set null' }),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const contactListsRelations = relations(contactLists, ({ one, many }) => ({
  user: one(users, { fields: [contactLists.userId], references: [users.id] }),
  category: one(categories, { fields: [contactLists.categoryId], references: [categories.id] }),
  contacts: many(contacts),
}));

export const contacts = pgTable('Contact', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  notes: text('notes'),
  isValid: boolean('isValid').notNull().default(true),
  contactListId: integer('contactListId').notNull().references(() => contactLists.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const contactsRelations = relations(contacts, ({ one }) => ({
  contactList: one(contactLists, { fields: [contacts.contactListId], references: [contactLists.id] }),
}));

export const whatsappContacts = pgTable('WhatsAppContact', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').defaultNow(),
}, (t) => ({
  unq: unique().on(t.userId, t.phone)
}));

export const templates = pgTable('Template', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  content: text('content').notNull(),
  type: text('type').notNull().default('text'),
  userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const campaigns = pgTable('Campaign', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  status: text('status').notNull().default('draft'), // draft, scheduled, running, completed, paused
  templateId: integer('templateId').notNull().references(() => templates.id, { onDelete: 'cascade' }),
  contactListId: integer('contactListId').notNull().references(() => contactLists.id, { onDelete: 'cascade' }),
  userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  scheduledAt: timestamp('scheduledAt'),
  sentCount: integer('sentCount').notNull().default(0),
  failedCount: integer('failedCount').notNull().default(0),
  totalCount: integer('totalCount').notNull().default(0),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const campaignsRelations = relations(campaigns, ({ one }) => ({
  user: one(users, { fields: [campaigns.userId], references: [users.id] }),
  template: one(templates, { fields: [campaigns.templateId], references: [templates.id] }),
  contactList: one(contactLists, { fields: [campaigns.contactListId], references: [contactLists.id] }),
}));

export const campaignLogs = pgTable('CampaignLog', {
  id: serial('id').primaryKey(),
  campaignId: integer('campaignId').notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  contactId: integer('contactId').notNull().references(() => contacts.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('pending'), // pending, sent, failed
  error: text('error'),
  sentAt: timestamp('sentAt').defaultNow(),
});

export const campaignLogsRelations = relations(campaignLogs, ({ one }) => ({
  campaign: one(campaigns, { fields: [campaignLogs.campaignId], references: [campaigns.id] }),
  contact: one(contacts, { fields: [campaignLogs.contactId], references: [contacts.id] }),
}));

export const notifications = pgTable('Notification', {
  id: serial('id').primaryKey(),
  userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  subject: text('subject'),
  message: text('message').notNull(),
  type: text('type').notNull().default('private'), // private, broadcast, system, alert, success
  isRead: boolean('isRead').notNull().default(false),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));
