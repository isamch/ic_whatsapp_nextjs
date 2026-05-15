# Tasks

## ✅ Completed

### Phase 1 — Setup
- [x] Install packages: prisma, @prisma/client, jsonwebtoken, bcryptjs, whatsapp-web.js, qrcode
- [x] Prisma init with SQLite
- [x] prisma/schema.prisma — all tables defined
- [x] npx prisma migrate dev --name init — DB created

### Phase 2 — Core Libs
- [x] lib/prisma.js — Prisma singleton
- [x] lib/jwt.js — signAccessToken, signRefreshToken, verify
- [x] lib/response.js — ok, created, error helpers
- [x] lib/withAuth.js — auth middleware for API routes
- [x] lib/whatsapp-manager.js — WhatsApp client singleton per user
- [x] lib/campaign-runner.js — campaign job with pause/stop support

### Phase 3 — API Routes
- [x] POST /api/auth/register
- [x] POST /api/auth/login
- [x] POST /api/auth/logout
- [x] POST /api/auth/refresh-token
- [x] GET/POST /api/categories
- [x] PATCH/DELETE /api/categories/[id]
- [x] GET/POST /api/contact-lists
- [x] PATCH/DELETE /api/contact-lists/[id]
- [x] GET/POST /api/contacts
- [x] PATCH/DELETE /api/contacts/[id]
- [x] POST /api/contacts/validate
- [x] DELETE /api/contacts/clear-invalid
- [x] POST /api/contacts/import
- [x] GET/POST /api/templates
- [x] PATCH/DELETE /api/templates/[id]
- [x] GET/POST /api/campaigns
- [x] GET/PATCH/DELETE /api/campaigns/[id]
- [x] GET /api/campaigns/[id]/logs
- [x] POST /api/campaigns/[id]/run
- [x] POST /api/campaigns/[id]/pause
- [x] POST /api/campaigns/[id]/resume
- [x] POST /api/campaigns/[id]/stop
- [x] GET /api/notifications/inbox
- [x] GET /api/notifications/unread-count
- [x] PATCH/DELETE /api/notifications/[id]/read
- [x] PATCH /api/notifications/read-all
- [x] GET/POST /api/users (admin)
- [x] GET/PATCH/DELETE /api/users/[id] (admin)
- [x] PATCH /api/users/[id]/toggle-status (admin)
- [x] PATCH /api/settings/profile
- [x] PATCH /api/settings/password
- [x] POST /api/whatsapp/connect
- [x] GET /api/whatsapp/qr
- [x] GET /api/whatsapp/status
- [x] POST /api/whatsapp/disconnect
- [x] GET /api/whatsapp/conversations
- [x] GET/POST /api/whatsapp/conversations/[chatId]/messages
- [x] GET /api/stats
- [x] POST /api/notifications/send

### Phase 4 — Frontend lib update
- [x] lib/api.js — BASE_URL changed to /api
- [x] lib/auth-api.js — BASE_URL changed to /api

## 🔲 Next
- [x] conversations API routes (inbox, send message)
- [x] admin notifications send route
- [x] dashboard stats route
- [x] Test campaign routes (List, Details, Logs) - Fixed field mapping and rendering issues
- [x] Fix global WhatsApp status parsing in AppContext
- [x] Fix default contact status to Pending (was Valid)
- [x] Fix campaign validation (templateId/listId were expecting 24-char hex)
- [x] Fix campaign field mismatch (listId vs contactListId)
- [x] Fix campaign control buttons visibility (pending vs draft)
- [x] Implement CRM-based Conversations page with Search and Pagination
- [x] Add "Sync from WhatsApp" feature to import contacts into DB
- [x] Implement Pagination (Load More) for Contacts list (Removed per user request)
- [x] Create dedicated WhatsAppContact table (Schema + Migration)
- [x] Update WhatsApp Sync to use dedicated table and userId
- [x] Fix: Restore missing WhatsappSession columns in Prisma schema
- [x] Database Cleanup: Wiped all tables except User for a fresh start
- [x] Automatic Sync: Auto-sync on page load and on WhatsApp connection
- [x] Admin: Added "All WH Contacts" to view all users' contacts
- [x] Fix: Admin Users page keys and role handling
- [x] Feature: Multi-type Notifications (System, Alert, etc.)
- [x] Fix: Admin single-user notification dispatch
- [x] Admin: Restructured WH Contacts to User-based drill-down
- [ ] Test other routes with npm run dev
