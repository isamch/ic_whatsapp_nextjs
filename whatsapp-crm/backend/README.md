# icmern

> ⚡ Production-ready Express.js starter — MongoDB, JWT, RBAC, Joi validation, CLI generator

[![npm version](https://img.shields.io/npm/v/icmern)](https://www.npmjs.com/package/icmern)
[![license](https://img.shields.io/npm/l/icmern)](LICENSE)
[![node](https://img.shields.io/node/v/icmern)](https://nodejs.org)

---

## Features

- 🔐 **JWT Authentication** — access token + refresh token rotation
- 🛡️ **RBAC** — roles & permissions system with per-user overrides
- ✅ **Joi Validation** — centralized validate middleware with custom messages
- 🗄️ **MongoDB** — Mongoose with lean queries and pagination
- 📧 **Email** — Nodemailer with HTML templates
- 🔒 **Security** — Helmet, CORS, rate limiting
- 📖 **Swagger** — optional API docs at `/api-docs`
- ⚡ **CLI Generator** — scaffold full resources instantly

---

## Quick Start

```bash
# scaffold a new project
npx create-icmern-app my-app
cd my-app

# install dependencies
npm install

# configure environment
cp .env.example .env

# seed default roles
npm run seed:roles

# start dev server
npm run dev
```

---

## CLI

```bash
# generate a full resource (controller + service + model + routes + validations)
icmern create full <name>

# generate individual files
icmern create controller <name>
icmern create service    <name>
icmern create model      <name>
icmern create route      <name>
icmern create validation <name>
icmern create permission <name>
```

---

## Project Structure

```
src/
├── config/           # morgan, logger, swagger, rate-limit, database
├── controllers/      # request handlers
├── middlewares/      # auth, permissions, validate, error
├── models/           # mongoose schemas
├── permissions/      # permission constants per resource
├── routes/
│   ├── api/          # REST API routes
│   └── web/          # web routes
├── services/         # business logic
├── templates/        # email HTML templates
├── utils/            # api-response, app-error, async-handler, jwt, hashing...
└── validations/      # Joi schemas per resource
scripts/
└── seed-roles.js     # seed default roles & permissions
```

---

## Environment Variables

```env
# App
NODE_ENV=development
PORT=3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/myapp

# JWT
JWT_ACCESS_SECRET=your_access_secret_key_min_32_characters_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret_key_min_32_characters_here
JWT_REFRESH_EXPIRES_IN=7d

# HMAC
HMAC_VERIFICATION_CODE_SECRET=your_hmac_secret_key_here

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Swagger (optional)
SWAGGER_ENABLED=true

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM_NAME=My App
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/refresh-token` | Refresh access token |
| POST | `/api/v1/auth/logout` | Logout |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users` | List users (paginated) |
| GET | `/api/v1/users/:id` | Get user |
| POST | `/api/v1/users` | Create user |
| PATCH | `/api/v1/users/:id` | Update user |
| DELETE | `/api/v1/users/:id` | Delete user |

### Roles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/roles` | List roles |
| GET | `/api/v1/roles/:id` | Get role |
| POST | `/api/v1/roles` | Create role |
| PATCH | `/api/v1/roles/:id` | Update role |
| DELETE | `/api/v1/roles/:id` | Delete role |
| POST | `/api/v1/roles/:id/permissions` | Add permissions to role |
| DELETE | `/api/v1/roles/:id/permissions` | Remove permissions from role |

### User Permission Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/users/:id/roles` | Assign roles to user |
| DELETE | `/api/v1/users/:id/roles` | Revoke roles from user |
| POST | `/api/v1/users/:id/extra-permissions` | Add extra permissions |
| DELETE | `/api/v1/users/:id/extra-permissions` | Remove extra permissions |
| POST | `/api/v1/users/:id/revoked-permissions` | Revoke specific permissions |
| DELETE | `/api/v1/users/:id/revoked-permissions` | Un-revoke permissions |

---

## RBAC System

Permissions are resolved per request:

```
resolvedPermissions = (role permissions) + extraPermissions - revokedPermissions
```

Permission format: `resource:action` — e.g. `users:read`, `posts:delete`

Default roles seeded by `npm run seed:roles`:

| Role | Permissions |
|------|-------------|
| `admin` | all permissions |
| `moderator` | read users, read/update/delete posts |
| `user` | read users, read/create posts |

---

## Response Format

```json
// success
{ "status": "success", "message": "...", "data": { } }

// error
{ "status": "error", "message": "...", "details": [ ] }
```

---

## Scripts

```bash
npm run dev          # start with nodemon
npm start            # start with node
npm run seed:roles   # seed default roles & permissions
npm run lint         # eslint
npm run format       # prettier
```

---

## Requirements

- Node.js 18+
- MongoDB

---

## License

ISC © [Isam Chajia](https://github.com/isamch)
