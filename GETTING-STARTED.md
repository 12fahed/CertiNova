# Getting Started with CertiNova

This guide will walk you through everything you need to get CertiNova running locally from scratch, and then show you how to use the platform from your first login to issuing and verifying certificates.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Cloning the Repository](#cloning-the-repository)
- [Backend Setup](#backend-setup)
  - [Install Dependencies](#install-dependencies)
  - [Configure Environment Variables](#configure-environment-variables)
  - [Start the Backend Server](#start-the-backend-server)
  - [Verify the Backend is Running](#verify-the-backend-is-running)
- [Frontend Setup](#frontend-setup)
  - [Install Dependencies](#install-dependencies-1)
  - [Configure Environment Variables](#configure-environment-variables-1)
  - [Start the Frontend Server](#start-the-frontend-server)
- [Using CertiNova](#using-certinova)
  - [Step 1 — Create an Account](#step-1--create-an-account)
  - [Step 2 — Create a Certificate Template](#step-2--create-a-certificate-template)
  - [Step 3 — Generate Certificates in Bulk](#step-3--generate-certificates-in-bulk)
  - [Step 4 — Verify a Certificate](#step-4--verify-a-certificate)
  - [Step 5 — Manage Your Certificates](#step-5--manage-your-certificates)
- [Troubleshooting](#troubleshooting)
- [Further Reading](#further-reading)

---

## Prerequisites

Before you begin, ensure the following tools are installed on your machine:

| Tool | Minimum Version | Purpose |
|---|---|---|
| Node.js | 22.x | JavaScript runtime for both servers |
| npm | 10.x (bundled with Node) | Package manager |
| MongoDB | 5.x | Database (local or Atlas cloud) |
| Git | Any recent version | Cloning the repository |

You will also need accounts at:

- **Cloudinary** — free tier is sufficient for development. Obtain your Cloud Name, API Key, and API Secret from the [Cloudinary console](https://cloudinary.com/console).
- **MongoDB Atlas** (optional) — if you prefer a cloud database instead of a local MongoDB instance.

---

## Cloning the Repository

```bash
git clone https://github.com/12fahed/CertiNova.git
cd CertiNova
```

The repository has two sub-projects:

```
CertiNova/
├── certinova-backend/    # Express.js REST API
└── certinova-frontend/   # Next.js web application
```

Both must be running simultaneously for the platform to work.

---

## Backend Setup

### Install Dependencies

```bash
cd certinova-backend
npm install
```

### Configure Environment Variables

The backend requires a `.env` file in the `certinova-backend/` directory. A template is provided at the repository root:

```bash
# From inside certinova-backend/
cp ../.env.example .env
```

Open `.env` and fill in each value:

```dotenv
# Server
PORT=5000
NODE_ENV=development

# MongoDB — use your local URI or an Atlas connection string
MONGODB_URI=mongodb://localhost:27017/certinova

# Cloudinary — found at https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend origin (used for CORS in development)
FRONTEND_URL=http://localhost:3000
```

> See [`certinova-backend/docs/configuration.md`](./certinova-backend/docs/configuration.md) for a full description of every variable.

### Start the Backend Server

```bash
# Development mode with hot-reload (recommended)
npm run dev

# Production mode
npm start
```

The server starts on `http://localhost:5000` by default.

### Verify the Backend is Running

Open a browser or use curl to hit the health check endpoint:

```bash
curl http://localhost:5000/api/health
```

You should receive:

```json
{
  "status": "OK",
  "message": "CertiNova Backend API is running",
  "environment": "development",
  "timestamp": "..."
}
```

If the server fails to start, check that:

- MongoDB is running and `MONGODB_URI` is correct.
- All three Cloudinary variables are set.
- Port 5000 is not already in use.

---

## Frontend Setup

Open a **new terminal** and keep the backend terminal running.

### Install Dependencies

```bash
cd certinova-frontend
npm install
```

### Configure Environment Variables

Create a `.env.local` file inside `certinova-frontend/`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

This tells the Next.js app where the backend API is running.

### Start the Frontend Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## Using CertiNova

### Step 1 — Create an Account

1. Navigate to `http://localhost:3000`.
2. Click **Sign Up** and fill in:
   - **Organisation Name** — the name that will appear on all certificates you issue
   - **Email Address**
   - **Password** (minimum 6 characters)
3. After registering, click **Log In** with the same credentials.

You will be taken to your organisation dashboard.

---

### Step 2 — Create a Certificate Template

A certificate template defines the background image and the position of dynamic text fields (recipient name, QR code, etc.).

1. Click **+ New Certificate** in the navbar.
2. Fill in the **Event Name** (e.g., "Annual Hackathon 2024") and the **Issuer Name** (the signing authority's name that appears on certificates).
3. Upload a **background image** for the certificate (PNG, JPG, or WEBP recommended). This is stored on Cloudinary.
4. You will enter the **drag-and-drop editor**. Drag fields from the panel onto the certificate canvas:

   | Field | Description |
   |---|---|
   | Recipient Name | Replaced with each individual recipient's name at generation time |
   | Organisation Name | Your organisation name — static across all certificates |
   | Rank | Optional rank or position (e.g., "1st Place", "Participant") |
   | Certificate Link | Prints the public verification URL directly on the certificate |
   | QR Code | A scannable QR linking to the public verification page |

5. For each field, configure typography:
   - Font family (choose from ~50 options)
   - Font weight (normal / bold)
   - Font style (normal / italic)
   - Text decoration (none / underline)
   - Text colour (hex colour picker)

6. Use **Live Preview** to see exactly how the certificate will look when rendered.
7. Click **Save** to store the template configuration.

---

### Step 3 — Generate Certificates in Bulk

1. Click **Send Certificates** in the navbar.
2. Select the certificate template (event) you just created.
3. Add recipients using one of two methods:

   **Manual entry:**
   - Click **Add Recipient** and enter Name (required), Email (optional), and Rank (optional) for each person.

   **CSV / Excel import:**
   - Prepare a spreadsheet with columns: `Name`, `Email` (optional), `Rank` (optional).
   - Click **Import CSV/Excel** and upload the file. Rows are parsed and populated automatically.

4. Set an **Encryption Password** — this password is used to encrypt all recipient data before it is stored in the database. You will need this password again to view recipient details in history. Choose something memorable but strong.

5. Click **Generate**. The platform will:
   - Render a personalised certificate image for each recipient client-side.
   - Assign a unique UUID to each certificate and register it for public verification.
   - Encrypt and store all recipient data in MongoDB.
   - Package all certificate images into a single `.zip` file and trigger a download.

6. A confetti animation confirms successful generation.

> The encryption password is never stored by the server. If you lose it, the encrypted recipient data cannot be recovered.

---

### Step 4 — Verify a Certificate

Every generated certificate has a unique UUID embedded in it (either printed as a URL or encoded in a QR code). Anyone — including recipients — can use this to verify the certificate's authenticity.

**Via URL:**

Share or visit the URL printed on the certificate:

```
http://localhost:3000/verify/{UUID}
```

The verification page performs a four-step check (UUID lookup, certificate lookup, config lookup, event lookup) and, on success, displays:

- Organisation name
- Issuer name
- Event name and date
- A rendered sample certificate image using the original template

No recipient PII is exposed — the sample certificate uses placeholder identity data.

**Via the verification modal:**

1. Click the **Verify** button in the navbar.
2. Enter the 32-character UUID across the 5 segmented input boxes, or paste the full UUID string — it auto-populates all segments.
3. Click **Verify**. The same step-by-step progress indicators and result display appear inline.

---

### Step 5 — Manage Your Certificates

**Dashboard views:**

| View | Description |
|---|---|
| Grid View | Card-based layout with thumbnail previews of each event |
| Table View | Compact list with quick-action buttons; click any row to open the Preview Pane on the right |

**Available actions per event:**

- **Edit** — reopen the drag-and-drop editor to update field positions or typography.
- **Download Sample** — download a preview certificate image rendered with placeholder data.
- **Delete** — permanently removes the event, its certificate configuration, all generated certificate batches, and all associated UUID verification records.

**Certificate History:**

- Click **View History** from the dashboard to browse all previous generation batches.
- Use the **Search & Filter** bar to find batches by event name, date, or recipient count.
- To view individual recipient details, enter the encryption password used at generation time. The data is decrypted client-side and displayed in a table.

---

## Troubleshooting

| Problem | Likely Cause | Fix |
|---|---|---|
| Backend fails to start | MongoDB not running | Start MongoDB locally: `mongod` |
| `ECONNREFUSED` on frontend | Backend not running or wrong port | Ensure `npm run dev` is running in `certinova-backend/` |
| Cloudinary upload fails | Missing or incorrect Cloudinary credentials | Double-check `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in `.env` |
| Cannot decrypt recipient data | Wrong password entered | Recipient data is encrypted with the password set at generation time — there is no recovery if the password is lost |
| CORS errors in browser | Frontend URL not in allowed origins | Set `FRONTEND_URL=http://localhost:3000` in `certinova-backend/.env` |
| `Certificate configuration already exists` API error | Duplicate config for the same event | Each event supports only one certificate config; use the edit flow instead of creating a new one |

---

## Further Reading

| Resource | Description |
|---|---|
| [`certinova-backend/README.md`](./certinova-backend/README.md) | Full backend documentation — tech stack, project structure, API overview |
| [`certinova-backend/docs/api-reference.md`](./certinova-backend/docs/api-reference.md) | Complete REST API reference with request/response schemas |
| [`certinova-backend/docs/data-models.md`](./certinova-backend/docs/data-models.md) | MongoDB schema definitions and entity relationship diagram |
| [`certinova-backend/docs/security.md`](./certinova-backend/docs/security.md) | Encryption architecture, CORS policy, and security considerations |
| [`certinova-backend/docs/configuration.md`](./certinova-backend/docs/configuration.md) | Environment variable reference |
| [`certinova-backend/docs/architecture.md`](./certinova-backend/docs/architecture.md) | System architecture and data flow diagrams |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | How to contribute to the project |
| [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) | Community standards and code of conduct |