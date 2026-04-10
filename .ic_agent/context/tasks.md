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

### Phase 4 — Frontend lib update
- [x] lib/api.js — BASE_URL changed to /api
- [x] lib/auth-api.js — BASE_URL changed to /api

## 🔲 Next
- [ ] conversations API routes (inbox, send message)
- [ ] admin notifications send route
- [ ] dashboard stats route
- [ ] Test all routes with npm run dev
