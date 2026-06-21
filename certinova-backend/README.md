# CertiNova Backend

> **REST API Server** for the CertiNova bulk certificate generation platform.  
> Built with Node.js, Express.js, MongoDB (Mongoose), and Cloudinary.

---

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [API Overview](#api-overview)
- [Security](#security)
- [Deployment](#deployment)

---

## Overview

The CertiNova backend is a **RESTful JSON API** that powers the entire certificate lifecycle:

1. **Authentication** — Organisation registration and login with bcrypt-hashed passwords.
2. **Event Management** — Create, retrieve, and delete certificate events with cascading data cleanup.
3. **Certificate Configuration** — Store drag-and-drop field layouts (position, font, colour) for certificate templates uploaded to Cloudinary.
4. **Bulk Certificate Generation** — Accept recipient lists, encrypt all PII with AES-256-CBC (PBKDF2 key derivation), and persist batches to MongoDB.
5. **Public Verification** — UUID-based certificate verification endpoints accessible without authentication, designed to confirm authenticity without exposing recipient data.
6. **Organisation Statistics** — Real-time aggregate counters for events created and total recipients served.

---

## Technology Stack

| Technology                | Version  | Purpose                                   |
| ------------------------- | -------- | ----------------------------------------- |
| Node.js                   | ≥ 18.0.0 | Runtime environment                       |
| Express.js                | 5.1.0    | REST API framework                        |
| MongoDB                   | —        | Document database                         |
| Mongoose                  | 8.17.1   | ODM / schema management                   |
| bcrypt                    | 6.0.0    | User password hashing                     |
| Multer                    | 2.0.2    | Multipart file upload handling            |
| multer-storage-cloudinary | 4.0.0    | Cloudinary storage adapter for Multer     |
| Cloudinary                | 1.41.3   | Certificate template image CDN            |
| crypto (Node built-in)    | —        | AES-256-CBC encryption for recipient data |
| dotenv                    | 16.3.1   | Environment variable loading              |
| nodemon                   | 3.1.10   | Development hot-reload                    |

The project uses **ES Modules** (`"type": "module"` in `package.json`).

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x (22.x recommended)
- **npm**
- **MongoDB** instance — local (`mongodb://localhost:27017`) or cloud (MongoDB Atlas)
- **Cloudinary** account (free tier is sufficient for development)

### Installation

```bash
# From the repository root
cd certinova-backend
npm install
```

### Environment Variables

Copy the example file and populate it:

```bash
cp ../.env.example .env
```

| Variable                | Required | Description                                                                            |
| ----------------------- | -------- | -------------------------------------------------------------------------------------- |
| `MONGODB_URI`           | Yes      | Full MongoDB connection string                                                         |
| `CLOUDINARY_CLOUD_NAME` | Yes      | Your Cloudinary cloud name                                                             |
| `CLOUDINARY_API_KEY`    | Yes      | Cloudinary API key                                                                     |
| `CLOUDINARY_API_SECRET` | Yes      | Cloudinary API secret                                                                  |
| `SMTP_HOST`             | Yes      | SMTP server host for sending emails                                                    |
| `SMTP_PORT`             | Yes      | SMTP server port (usually 587 or 465)                                                  |
| `SMTP_USER`             | Yes      | SMTP authentication username                                                           |
| `SMTP_PASSWORD`         | Yes      | SMTP authentication password                                                           |
| `EMAIL_FROM_ADDRESS`    | No       | From address for emails (defaults to SMTP_USER)                                        |
| `PORT`                  | No       | Server port (default: `5000`)                                                          |
| `NODE_ENV`              | No       | `development` \| `production` (default: `development`)                                 |
| `FRONTEND_URL`          | No       | Production frontend origin for CORS                                                    |
| `TRUST_PROXY`           | No       | Enable only behind a trusted reverse proxy (`true`, hop count, or trusted subnet list) |

See [`docs/configuration.md`](./docs/configuration.md) for full details.

### Running the Server

```bash
# Development (hot-reload via nodemon)
npm run dev

# Production
npm start
```

The server starts at `http://localhost:5000` (or the port specified in `.env`).

A health check is available at `GET /api/health`.

---

## Documentation

Detailed technical documentation is available in the [`docs/`](./docs/) directory:

| Document                                           | Description                                                      |
| -------------------------------------------------- | ---------------------------------------------------------------- |
| [`docs/architecture.md`](./docs/architecture.md)   | System architecture, directory structure, and data flow diagrams |
| [`docs/api-reference.md`](./docs/api-reference.md) | Full REST API reference with request/response schemas            |
| [`docs/data-models.md`](./docs/data-models.md)     | MongoDB schema definitions, indexes, and ER diagram              |
| [`docs/security.md`](./docs/security.md)           | Encryption strategy, CORS policy, and security considerations    |
| [`docs/configuration.md`](./docs/configuration.md) | Environment variable reference and setup guide                   |

---

## Project Structure

```
certinova-backend/
├── server.js                    # Entry point
├── package.json
│
├── api/
│   └── index.js                 # Vercel serverless adapter
│
├── middleware/
│   └── upload.js                # Cloudinary upload middleware (facade)
│
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── cloudinary.js        # Cloudinary config + Multer storage
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   └── certificateController.js
│   │
│   ├── middleware/
│   │   ├── appMiddleware.js     # CORS + logger
│   │   └── errorMiddleware.js   # Global error handler + 404
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── CertificateConfig.js
│   │   ├── GeneratedCertificate.js
│   │   ├── VerifyUUID.js
│   │   ├── Record.js
│   │   └── index.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── certificateRoutes.js
│   │   └── proxyRouter.js
│   │
│   └── utils/
│       ├── crypto.js            # AES-256-CBC encrypt/decrypt
│       └── validation.js        # validFields schema validation
│
└── test/
    └── cloudinary-test.js       # Startup credential smoke test
```

---

## API Overview

All endpoints are prefixed with `/api`. See [`docs/api-reference.md`](./docs/api-reference.md) for full documentation.

### Authentication — `/api/auth`

| Method | Path      | Description                         |
| ------ | --------- | ----------------------------------- |
| `POST` | `/signup` | Register a new organisation account |
| `POST` | `/login`  | Authenticate and retrieve user data |

### Events — `/api/events`

| Method   | Path               | Description                         |
| -------- | ------------------ | ----------------------------------- |
| `POST`   | `/addEvent`        | Create a new event                  |
| `GET`    | `/:organisationID` | List all events for an organisation |
| `DELETE` | `/:eventId`        | Delete event and all cascading data |

### Certificates — `/api/certificates`

| Method  | Path                        | Description                            |
| ------- | --------------------------- | -------------------------------------- |
| `POST`  | `/addCertificateConfig`     | Save field layout for a template       |
| `GET`   | `/config/:eventId`          | Retrieve template configuration        |
| `PUT`   | `/config/:configId`         | Update template configuration          |
| `POST`  | `/upload-template`          | Upload background image to Cloudinary  |
| `POST`  | `/storeGenerated`           | Store an encrypted recipient batch     |
| `GET`   | `/generated`                | List batches (encrypted, no PII)       |
| `POST`  | `/generated/decrypt`        | Decrypt and retrieve recipient data    |
| `GET`   | `/verify/:uuid`             | Public certificate verification        |
| `GET`   | `/verify-full/:uuid`        | Public verification with template data |
| `GET`   | `/generated/:id/uuids`      | List all UUIDs for a batch             |
| `GET`   | `/organization-stats/:name` | Organisation statistics                |
| `GET`   | `/all-organization-stats`   | Statistics for all organisations       |
| `PATCH` | `/update-recipient-count`   | Update recipient counter               |
| `POST`  | `/send-emails`              | Send certificates via email (SMTP)     |

---

## Security

CertiNova employs several layers of security:

- **AES-256-CBC encryption** with PBKDF2 key derivation (10,000 iterations) for all stored recipient PII.
- **bcrypt** (cost factor 12) for user password hashing.
- **Environment-aware CORS** policy — strict origin allowlist in production.
- **Zero plain-text PII** — recipient data is never stored unencrypted, never returned in any API response, and never logged.
- **Input validation** on all field layouts, ObjectIds, colours, emails, and font families before any database write.

See [`docs/security.md`](./docs/security.md) for the full security architecture.

---

## Deployment

The backend is deployed as a **Vercel Serverless Function** via `api/index.js`, which wraps the Express app as a serverless handler. The `vercel.json` in the repository root configures routing.

For production deployment:

1. Set all required environment variables in the Vercel dashboard.
2. Ensure `NODE_ENV=production` is set.
3. Update `FRONTEND_URL` to the actual deployed frontend origin.

---

**Part of the CertiNova project** — see the [root README](../README.md) for the full platform overview.
