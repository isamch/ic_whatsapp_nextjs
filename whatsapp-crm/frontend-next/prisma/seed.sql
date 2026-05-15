-- Disable foreign key checks for cleanup
PRAGMA foreign_keys = OFF;

-- Cleanup existing data
DELETE FROM "CampaignLog";
DELETE FROM "Campaign";
DELETE FROM "Template";
DELETE FROM "Contact";
DELETE FROM "ContactList";
DELETE FROM "Category";
DELETE FROM "Notification";
DELETE FROM "RefreshToken";
DELETE FROM "WhatsappSession";
DELETE FROM "User";

-- Reset autoincrement
DELETE FROM sqlite_sequence;

-- 1. Create Users
-- Admin: isamchajia@admin.com / @#isamchajia2003
-- Hash generated using bcryptjs (salt rounds 10)
INSERT INTO "User" ("id", "name", "email", "password", "role", "isActive", "createdAt", "updatedAt") 
VALUES (1, 'Isam Chajia', 'isamchajia@admin.com', '$2b$10$OVuQPViuRZGZYLw8Ghv.feFA81tDPCQY/iKAXi69xuZl0b41sbole', 'admin', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Demo User
INSERT INTO "User" ("id", "name", "email", "password", "role", "isActive", "createdAt", "updatedAt") 
VALUES (2, 'Demo User', 'user@example.com', '$2b$10$OVuQPViuRZGZYLw8Ghv.feFA81tDPCQY/iKAXi69xuZl0b41sbole', 'user', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 2. Create Categories
INSERT INTO "Category" ("id", "name", "userId", "createdAt") VALUES (1, 'VIP Clients', 1, CURRENT_TIMESTAMP);
INSERT INTO "Category" ("id", "name", "userId", "createdAt") VALUES (2, 'New Leads', 1, CURRENT_TIMESTAMP);

-- 3. Create Contact Lists
INSERT INTO "ContactList" ("id", "name", "userId", "categoryId", "createdAt") VALUES (1, 'E-commerce Owners', 1, 1, CURRENT_TIMESTAMP);
INSERT INTO "ContactList" ("id", "name", "userId", "categoryId", "createdAt") VALUES (2, 'Real Estate Agents', 1, 2, CURRENT_TIMESTAMP);

-- 4. Create Contacts
INSERT INTO "Contact" ("id", "name", "phone", "notes", "isValid", "contactListId", "createdAt") VALUES (1, 'Ahmed Ali', '212600000001', 'Test note', 1, 1, CURRENT_TIMESTAMP);
INSERT INTO "Contact" ("id", "name", "phone", "notes", "isValid", "contactListId", "createdAt") VALUES (2, 'Sarah Mansour', '212600000002', NULL, 1, 1, CURRENT_TIMESTAMP);
INSERT INTO "Contact" ("id", "name", "phone", "notes", "isValid", "contactListId", "createdAt") VALUES (3, 'Yassine Karim', '212600000003', NULL, 1, 2, CURRENT_TIMESTAMP);
INSERT INTO "Contact" ("id", "name", "phone", "notes", "isValid", "contactListId", "createdAt") VALUES (4, 'Mouna Reda', '212600000004', NULL, 0, 2, CURRENT_TIMESTAMP);

-- 5. Create Templates
INSERT INTO "Template" ("id", "name", "body", "userId", "createdAt", "updatedAt") VALUES (1, 'Welcome Message', 'Hello {{name}}, welcome to our platform!', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "Template" ("id", "name", "body", "userId", "createdAt", "updatedAt") VALUES (2, 'Flash Sale', 'Exclusive for you {{name}}! 50% discount.', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 6. Create Campaigns
INSERT INTO "Campaign" ("id", "name", "status", "userId", "templateId", "contactListId", "totalCount", "sentCount", "failedCount", "createdAt", "updatedAt") 
VALUES (1, 'Black Friday Blast', 'completed', 1, 2, 1, 2, 2, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO "Campaign" ("id", "name", "status", "userId", "templateId", "contactListId", "totalCount", "sentCount", "failedCount", "createdAt", "updatedAt") 
VALUES (2, 'Winter Welcoming', 'running', 1, 1, 2, 3, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 7. Create Campaign Logs
INSERT INTO "CampaignLog" ("id", "campaignId", "contactId", "status", "error", "sentAt") VALUES (1, 1, 1, 'sent', NULL, CURRENT_TIMESTAMP);
INSERT INTO "CampaignLog" ("id", "campaignId", "contactId", "status", "error", "sentAt") VALUES (2, 1, 2, 'sent', NULL, CURRENT_TIMESTAMP);
INSERT INTO "CampaignLog" ("id", "campaignId", "contactId", "status", "error", "sentAt") VALUES (3, 2, 3, 'sent', NULL, CURRENT_TIMESTAMP);
INSERT INTO "CampaignLog" ("id", "campaignId", "contactId", "status", "error", "sentAt") VALUES (4, 2, 4, 'failed', 'Invalid number', CURRENT_TIMESTAMP);

-- 8. Create Notifications
INSERT INTO "Notification" ("id", "userId", "message", "isRead", "createdAt") VALUES (1, 1, 'Welcome to your new CRM dashboard!', 0, CURRENT_TIMESTAMP);
INSERT INTO "Notification" ("id", "userId", "message", "isRead", "createdAt") VALUES (2, 2, 'Please connect your WhatsApp.', 0, CURRENT_TIMESTAMP);

-- Re-enable foreign key checks
PRAGMA foreign_keys = ON;
