# CertiNova — Bulk Certificate Generation Platform

A comprehensive, secure, and user-friendly platform for creating, managing, and distributing certificates in bulk. CertiNova enables organizations to generate personalized certificates efficiently while maintaining data security through advanced encryption.

---

## 📖 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Dashboard](#-dashboard)
- [Certificate Design Studio](#-certificate-design-studio)
- [Bulk Certificate Generation](#-bulk-certificate-generation)
- [Certificate Verification](#-certificate-verification)
- [Security & Privacy](#-security--privacy)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [API Reference](#-api-reference)
- [Installation Guide](#-installation-guide)

---

## 🎯 Overview

CertiNova is a full-stack web application designed to streamline the certificate generation process for educational institutions, organizations, and event coordinators. The platform combines intuitive design with robust security features to handle bulk certificate creation while protecting sensitive recipient data.

### Problem Statement
Traditional certificate generation involves:
- Manual creation of individual certificates
- Time-consuming personalization processes
- Security concerns with recipient data storage
- Limited customization options
- Difficulty in managing large recipient lists

### Solution
CertiNova addresses these challenges by providing:
- **Automated Bulk Generation**: Generate hundreds of personalized certificates simultaneously
- **Advanced Security**: End-to-end AES-256 encryption for all recipient data
- **Visual Editor**: Drag-and-drop interface for certificate design
- **Smart Field Positioning**: Precise placement of dynamic content with live preview
- **URL-based Verification**: Public-facing verifiable certificate links
- **Modern UI/UX**: Intuitive, premium interface built with modern design principles

---

## ✨ Key Features

### 🎨 Certificate Design Studio
- **Visual Drag-and-Drop Editor** for precise placement of certificate fields
- **Custom Template Upload** — bring your own certificate background via image upload
- **Dynamic Field Types**: Recipient Name, Organisation Name, Rank/Position, Certificate Link, QR Code
- **Typography Controls**: Custom font family, weight, style, color per field
- **Live Preview Mode**: See your certificate rendered exactly as it will be generated
- **Edit Existing Templates**: Modify previously saved certificate configurations

### 📊 Dashboard
- **Grid View**: Card-based certificate overview with thumbnail previews  
- **Table View**: Compact list view with quick action buttons per row  
- **Preview Pane**: Windows File Explorer-style detail panel — click any event in table view to see the certificate preview and all actions on the right  
- **Statistics Cards**: Quick summary of total certificates, recipients, success rate, active events
- **One-click Actions**: Edit, Download Sample, and Delete directly from both views

### 🚀 Bulk Certificate Generation
- **Manual Recipient Entry**: Add recipients one by one with name, email, and rank
- **CSV/Excel Import**: Bulk-import recipient lists via spreadsheets
- **QR Code Embedding**: Auto-generates personalized QR codes linking to the certificate's verification URL
- **Certificate Link Field**: Embeds the unique verification URL directly on the certificate image
- **ZIP Download**: Download all generated certificates as a single `.zip` file
- **Individual Downloads**: Download specific recipient certificates directly
- **Confetti Celebration**: Visual feedback on successful bulk generation
- **Password-Protected Generation**: All recipient data encrypted before storage

### 🔍 Certificate Verification

#### URL-based Verification (`/verify/{UUID}`)
- **Public Shareable Links**: Every certificate has a unique URL in the format `{BASEURL}/verify/{UUID}`
- **No Login Required**: Fully public-facing, anyone can verify a certificate
- **Animated Verification Progress**: Step-by-step visual verification with real-time progress indicators
- **Split-pane Layout**: Verification details on the left; rendered certificate preview on the right
- **Sample Certificate Rendering**: Renders a visual sample certificate using the original template and field configuration (with placeholder identity to protect recipient privacy)
- **QR Code Support**: QR codes on generated certificates link directly to this verification URL
- **Certificate Preview Download**: Download the sample certificate image from the verification page

#### Modal Verification
- **UUID Input Modal**: Enter a certificate's UUID manually in 5 segmented input boxes
- **Paste Support**: Paste a full UUID (`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`) into any box and it auto-populates all segments
- **Auto-focus Progression**: Automatically advances to the next input segment on completion
- **Auto-population from URL**: Opening the modal with a pre-loaded UUID pre-fills the fields
- **Animated Step Progress**: Circular progress indicators for UUID Lookup, Certificate Validation, and Issuer Verification steps
- **Issuer & Event Details**: Displays organisation, issuer name, event name, and event date on success

### 📋 Certificate History
- **View History**: Browse an archive of all previously generated certificate batches
- **Search & Filter**: Find certificates by event name, date, or recipient count
- **Encrypted Recipient Access**: Decrypt recipient data with the original password to view names and emails
- **Metadata Display**: Shows total recipients, generation date, and batch details

---

## 🔐 Security & Privacy

CertiNova is built with a **Privacy-by-Design** philosophy:

### Recipient Data Encryption
- **AES-256-CBC Encryption**: All recipient personal data encrypted before database storage
- **PBKDF2 Key Derivation**: Password-based encryption with SHA-256 (10,000 iterations) and unique salts
- **IV Generation**: Unique initialization vectors for each encryption operation
- **Zero Plain-text Storage**: Recipient names, emails, and ranks are never stored in plain text

### Why We Render Sample Certificates for Verification
Since recipient data is encrypted and not accessible without the password, the public verification page renders the certificate layout using a **placeholder Indian identity** (e.g., "Aarav Sharma", "1st"). This demonstrates the certificate format and authenticity without exposing any private recipient information.

### User Authentication
- **bcrypt Password Hashing**: All user passwords hashed with salt rounds
- **Organisation-based Isolation**: Each organisation sees only their own events and certificates
- **Protected Routes**: Dashboard and sensitive pages require authentication

---

## 🛠 Technology Stack

### Backend (`certinova-backend`)
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 22+ | Runtime environment |
| Express.js | 5.1.0 | REST API framework |
| MongoDB | — | Document database |
| Mongoose | 8.17.1 | ODM / schema management |
| bcrypt | 6.0.0 | Password hashing |
| Multer | 2.0.2 | File upload handling |
| Cloudinary | — | Certificate image hosting |
| crypto (built-in) | — | AES-256 encryption |
| dotenv | — | Environment configuration |

### Frontend (`certinova-frontend`)
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15+ | React framework (App Router) |
| React | 19+ | UI library |
| TypeScript | 5 | Type-safe development |
| Tailwind CSS | 4 | Utility-first styling |
| Framer Motion | 11 | Animations & transitions |
| Radix UI | — | Accessible UI primitives |
| CryptoJS | 4.2.0 | Client-side encryption |
| qrcode | — | QR code generation |
| JSZip | — | Bulk ZIP file download |
| XLSX | — | Excel/CSV parsing |
| uuid | — | UUID generation per recipient |
| canvas-confetti | — | Celebration effect on generation |
| Lucide React | — | Icon library |

---

## 🏗 Architecture

### System Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (Next.js)     │◄──►│   (Express)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • React 19      │    │ • REST API      │    │ • Users         │
│ • App Router    │    │ • AES-256       │    │ • Events        │
│ • Canvas API    │    │ • File Upload   │    │ • CertConfigs   │
│ • CryptoJS      │    │ • Cloudinary    │    │ • GeneratedCerts│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Database Schema
```
Users
├── organisation     (String)
├── email            (String, unique)
├── password         (bcrypt hash)
└── timestamps

Events
├── organisation     (String)
├── organisationID   (ref: User)
├── eventName        (String)
├── issuerName       (String)
├── date             (Date)
└── timestamps

CertificateConfig
├── eventId          (ref: Event)
├── imagePath        (String — Cloudinary URL)
├── validFields      (Object — field positions & styles)
└── timestamps

GeneratedCertificate
├── certificateId    (ref: CertificateConfig)
├── noOfRecipient    (Number)
├── rank             (Boolean)
├── encryptedRecipients
│   ├── encryptedData (AES-256-CBC ciphertext)
│   ├── salt          (PBKDF2 salt)
│   └── iv            (initialization vector)
├── generatedBy      (ref: User)
└── timestamps

VerifyUUID
├── uuid             (String, unique)
├── certificateId    (ref: GeneratedCertificate)
├── isValid          (Boolean)
└── timestamps
```

---

## 📚 API Reference

### Authentication
```http
POST /api/auth/signup          # Register a new organisation
POST /api/auth/login           # Login and receive session token
```

### Events
```http
POST   /api/events/addEvent           # Create a new event
GET    /api/events/:organisationId    # List events for an organisation
DELETE /api/events/:eventId           # Delete an event and its config
```

### Certificate Configuration
```http
POST  /api/certificates/addCertificateConfig     # Save field layout
GET   /api/certificates/config/:eventId          # Fetch event's layout
PUT   /api/certificates/config/:configId         # Update layout
POST  /api/certificates/upload-template          # Upload background image
```

### Certificate Generation & Storage
```http
POST /api/certificates/storeGenerated            # Store encrypted batch
GET  /api/certificates/generated                 # List all batches (encrypted)
POST /api/certificates/generated/decrypt         # Decrypt with password
PATCH /api/certificates/update-recipient-count   # Update count
```

### Verification
```http
GET /api/certificates/verify/:uuid               # Simple UUID check
GET /api/certificates/verify-full/:uuid          # Full data for rendering sample cert
```

---

## 🚀 Installation Guide

### Prerequisites
- Node.js 22.x or higher
- npm
- MongoDB 5.x or higher

### Backend Setup
```bash
cd certinova-backend
npm install

# Configure environment
# Create a .env file with:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/certinova
# NODE_ENV=development
# CLOUDINARY_CLOUD_NAME=...
# CLOUDINARY_API_KEY=...
# CLOUDINARY_API_SECRET=...

npm run dev
```

### Frontend Setup
```bash
cd certinova-frontend
npm install

# Configure environment
# Create a .env.local file with:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

npm run dev
```

---

## 📋 Usage Guide

### 1. Account Setup
1. **Sign Up**: Create an organisation account with your name and email
2. **Log In**: Access your secure dashboard

### 2. Creating a Certificate Template
1. Click **+ New Certificate** in the navbar
2. Enter your **Event Name** and **Issuer Name**
3. Upload a custom background template image
4. Use the **drag-and-drop editor** to position dynamic fields:
   - `Recipient Name` — personalized per certificate
   - `Organisation Name` — your organisation name
   - `Rank` — optional rank/position field
   - `Certificate Link` — prints the verification URL
   - `QR Code` — a scannable QR linking to the public verification page
5. Customize fonts, colours, and styles per field
6. Save the template

### 3. Generating Certificates
1. Click **Send Certificates** in the navbar
2. Select the certificate template (event)
3. Add recipients via **manual entry** or **CSV/Excel import**
   - Fields: Name (required), Email (optional), Rank (optional)
4. Set a strong **encryption password** — this protects all recipient data
5. Click **Generate** — all certificates are rendered and a ZIP is downloaded
6. Each certificate gets a unique UUID stored in the verification database

### 4. Verifying a Certificate
- **Via URL**: Visit `{BASEURL}/verify/{UUID}` directly — a fully public page showing the verified certificate sample
- **Via Modal**: Open the verification modal from the navbar, enter the UUID manually or paste it in full
- The verification page shows organisation, issuer, event, date, and a rendered sample certificate image

### 5. Managing Certificates
- Use **Grid View** for visual card-based browsing
- Use **Table View** for a compact list — click any row to see the **Preview Pane** on the right
- Access **View History** to browse past generation batches
- **Download Sample** to get a preview certificate image for any template

---

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for efficient and secure certificate management**
