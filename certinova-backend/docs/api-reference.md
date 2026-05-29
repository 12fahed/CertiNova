# API Reference

All endpoints are prefixed with `/api`. The base URL in development is `http://localhost:5000`.

---

## Response Envelope

Every response conforms to this envelope structure:

```json
{
  "success": true | false,
  "message": "Human-readable status description",
  "data": { ... }
}
```

On error responses, the `data` field is omitted and an `errors` array may be included for validation failures.

---

## Health Check

### `GET /api/health`

Returns the API server status. Used for deployment health probes.

**Response `200`**

```json
{
  "status": "OK",
  "message": "CertiNova Backend API is running",
  "environment": "production",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Authentication

### `POST /api/auth/signup`

Register a new organisation account.

**Request Body**

| Field          | Type     | Required | Constraints          |
| -------------- | -------- | -------- | -------------------- |
| `organisation` | `string` | Yes      | 2–100 characters     |
| `email`        | `string` | Yes      | Valid email, unique  |
| `password`     | `string` | Yes      | Minimum 6 characters |

**Response `201`**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "64a1...",
      "organisation": "Acme Corp",
      "email": "admin@acme.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Codes**

| Status | Condition                                            |
| ------ | ---------------------------------------------------- |
| `400`  | Missing fields, validation error, or duplicate email |
| `500`  | Internal server error                                |

---

### `POST /api/auth/login`

Authenticate an existing user.

**Request Body**

| Field      | Type     | Required |
| ---------- | -------- | -------- |
| `email`    | `string` | Yes      |
| `password` | `string` | Yes      |

**Response `200`**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64a1...",
      "organisation": "Acme Corp",
      "email": "admin@acme.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Codes**

| Status | Condition                 |
| ------ | ------------------------- |
| `400`  | Missing email or password |
| `401`  | Invalid credentials       |
| `500`  | Internal server error     |

---

## Events

### `POST /api/events/addEvent`

Create a new certificate event for an organisation.

**Request Body**

| Field            | Type     | Required | Constraints                           |
| ---------------- | -------- | -------- | ------------------------------------- |
| `organisation`   | `string` | Yes      | Organisation display name             |
| `organisationID` | `string` | Yes      | Valid MongoDB ObjectId                |
| `eventName`      | `string` | Yes      | 2–200 characters                      |
| `issuerName`     | `string` | Yes      | 2–100 characters                      |
| `date`           | `string` | No       | ISO 8601 date string; defaults to now |

**Response `201`**

```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "event": {
      "id": "64b2...",
      "organisation": "Acme Corp",
      "eventName": "Annual Hackathon 2024",
      "issuerName": "Jane Doe",
      "date": "2024-03-15T00:00:00.000Z",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

**Side Effect**: Increments `eventsCreated` counter in the organisation's `Record` document (upserted if absent).

---

### `GET /api/events/:organisationID`

Retrieve all events belonging to an organisation, each enriched with its associated `CertificateConfig` (if present).

**Path Parameter**: `organisationID` — MongoDB ObjectId of the user.

**Response `200`**

```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "...",
        "eventName": "Annual Hackathon 2024",
        "issuerName": "Jane Doe",
        "date": "...",
        "certificateConfig": {
          "id": "...",
          "imagePath": "https://res.cloudinary.com/...",
          "validFields": { ... }
        }
      }
    ],
    "count": 1
  }
}
```

---

### `DELETE /api/events/:eventId`

Delete an event and **all** cascading data: `CertificateConfig`, `GeneratedCertificate`, and `VerifyUUID` documents.

**Path Parameter**: `eventId` — MongoDB ObjectId of the event.

**Response `200`**

```json
{
  "success": true,
  "message": "Event \"Annual Hackathon 2024\" and all related data have been successfully deleted",
  "data": {
    "deletedEvent": { "id": "...", "eventName": "...", "issuerName": "..." },
    "deletedCertificateConfig": true,
    "deletedGeneratedCertificatesCount": 5,
    "deletedVerifyUUIDsCount": 47,
    "deletedTemplateFile": false
  }
}
```

> [!WARNING]
> This operation is **irreversible**. All generated certificate records and UUID verifications for the event are permanently deleted.

---

## Certificate Configuration

### `POST /api/certificates/addCertificateConfig`

Save the field layout for a certificate template. Only one configuration per event is allowed.

**Request Body**

| Field         | Type     | Required                                                    |
| ------------- | -------- | ----------------------------------------------------------- |
| `eventId`     | `string` | Yes — MongoDB ObjectId                                      |
| `imagePath`   | `string` | Yes — Cloudinary URL of the background template             |
| `validFields` | `object` | Yes — Field definitions (see [Field Object](#field-object)) |

**Response `201`**

```json
{
  "success": true,
  "message": "Certificate configuration created successfully",
  "data": {
    "certificateConfig": {
      "id": "...",
      "eventId": { "eventName": "...", "organisation": "...", "issuerName": "..." },
      "imagePath": "https://res.cloudinary.com/...",
      "validFields": { ... },
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

#### Field Object

Each key in `validFields` is an optional field name from the allowed set:

| Field Name         | Description                                       |
| ------------------ | ------------------------------------------------- |
| `recipientName`    | Dynamic recipient name placed on the certificate  |
| `organisationName` | The issuing organisation's name                   |
| `certificateLink`  | Printed URL of the public verification page       |
| `certificateQR`    | QR code image linking to the verification URL     |
| `rank`             | Optional rank / position awarded to the recipient |

Each field value is an object:

| Property         | Type     | Required | Description                                                    |
| ---------------- | -------- | -------- | -------------------------------------------------------------- |
| `x`              | `number` | Yes      | Horizontal position (>= 0) in pixels                           |
| `y`              | `number` | Yes      | Vertical position (>= 0) in pixels                             |
| `width`          | `number` | Yes      | Field bounding-box width (> 0)                                 |
| `height`         | `number` | Yes      | Field bounding-box height (> 0)                                |
| `fontFamily`     | `string` | No       | One of ~50 supported font families; defaults to `"Inter"`      |
| `fontWeight`     | `string` | No       | `"normal"` \| `"bold"`; defaults to `"normal"`                 |
| `fontStyle`      | `string` | No       | `"normal"` \| `"italic"`; defaults to `"normal"`               |
| `textDecoration` | `string` | No       | `"none"` \| `"underline"`; defaults to `"none"`                |
| `color`          | `string` | No       | Hex colour code (`#RRGGBB` or `#RGB`); defaults to `"#000000"` |

---

### `GET /api/certificates/config/:eventId`

Retrieve the certificate configuration for a specific event.

**Path Parameter**: `eventId`

**Response `200`** — Returns the full `certificateConfig` object (see above).

---

### `PUT /api/certificates/config/:configId`

Update an existing certificate configuration. Only provided fields are updated.

**Path Parameter**: `configId`

**Request Body** — Any subset of `{ imagePath, validFields }`.

**Response `200`** — Returns the updated `certificateConfig` object.

---

### `POST /api/certificates/upload-template`

Upload a certificate background image to Cloudinary.

**Content-Type**: `multipart/form-data`

| Form Field    | Type   | Constraints                                                  |
| ------------- | ------ | ------------------------------------------------------------ |
| `certificate` | `file` | Image files only (jpg, jpeg, png, gif, bmp, webp); max 10 MB |

**Response `200`**

```json
{
  "success": true,
  "message": "Certificate template uploaded successfully to Cloudinary",
  "data": {
    "filename": "template-1700000000-background",
    "originalName": "background.png",
    "path": "https://res.cloudinary.com/...",
    "fullUrl": "https://res.cloudinary.com/...",
    "size": 204800,
    "mimetype": "image/png",
    "publicId": "certinova/certificate-templates/template-...",
    "cloudinaryUrl": "https://res.cloudinary.com/..."
  }
}
```

---

## Certificate Generation & Storage

### `POST /api/certificates/storeGenerated`

Store an encrypted batch of generated certificates. Called by the frontend after rendering all certificate images client-side.

**Request Body**

| Field           | Type     | Required | Constraints                                  |
| --------------- | -------- | -------- | -------------------------------------------- |
| `certificateId` | `string` | Yes      | MongoDB ObjectId of the `CertificateConfig`  |
| `recipients`    | `array`  | Yes      | Non-empty array of recipient objects         |
| `generatedBy`   | `string` | Yes      | MongoDB ObjectId of the logged-in user       |
| `password`      | `string` | Yes      | Minimum 6 characters; used as encryption key |

**Recipient Object**

| Field   | Type     | Required | Description                                              |
| ------- | -------- | -------- | -------------------------------------------------------- |
| `name`  | `string` | Yes      | Recipient's full name                                    |
| `email` | `string` | No       | Valid email address                                      |
| `rank`  | `string` | No       | Only stored if the certificate config has a `rank` field |
| `uuid`  | `string` | No       | Client-generated UUID v4 for this certificate            |

**Response `201`**

```json
{
  "success": true,
  "message": "Generated certificate data stored securely with encryption",
  "data": {
    "id": "...",
    "certificateId": "...",
    "noOfRecipient": 50,
    "rank": false,
    "date": "...",
    "encrypted": true
  }
}
```

> [!NOTE]
> The encrypted recipient payload is **never returned** in any API response. Decryption requires the original password via the `/generated/decrypt` endpoint.

---

### `GET /api/certificates/generated`

Retrieve paginated generated certificate batches (without decrypting recipient data).

**Query Parameters**

| Parameter     | Type     | Default  | Description                                                                       |
| ------------- | -------- | -------- | --------------------------------------------------------------------------------- |
| `page`        | `number` | `1`      | Page number                                                                       |
| `limit`       | `number` | `10`     | Items per page                                                                    |
| `filter`      | `string` | `"all"`  | `"all"` \| `"recent"` \| `"high-recipients"` \| `"with-rank"` \| `"without-rank"` |
| `sortBy`      | `string` | `"date"` | `"date"` \| `"recipients"` \| `"certificateId"`                                   |
| `sortOrder`   | `string` | `"desc"` | `"asc"` \| `"desc"`                                                               |
| `generatedBy` | `string` | —        | Filter by user ObjectId                                                           |

> [!NOTE]
> The `search` parameter returns an empty result set with `requiresDecryption: true` since recipient data is encrypted and cannot be searched without a password.

---

### `POST /api/certificates/generated/decrypt`

Decrypt and retrieve certificate batches with full recipient data.

**Request Body** — All query parameters above, **plus**:

| Field      | Type     | Required                  |
| ---------- | -------- | ------------------------- |
| `password` | `string` | Yes — Decryption password |

Certificates that fail to decrypt with the provided password are silently skipped and reported in the `decryption.failed` counter.

**Response `200`**

```json
{
  "success": true,
  "data": {
    "certificates": [
      {
        "id": "...",
        "recipients": [
          { "name": "Alice", "email": "alice@example.com", "uuid": "...", "rank": "1st" }
        ],
        "noOfRecipient": 1,
        "encrypted": false
      }
    ],
    "pagination": { ... },
    "decryption": { "successful": 5, "failed": 0 }
  }
}
```

---

### `PATCH /api/certificates/update-recipient-count`

Manually increment the organisation's `recipientCount` statistic in the `Record` collection.

**Request Body**

| Field            | Type     | Required |
| ---------------- | -------- | -------- |
| `orgName`        | `string` | Yes      |
| `recipientCount` | `number` | Yes      |

---

## UUID Verification (Public)

### `GET /api/certificates/verify/:uuid`

Verify a certificate UUID. Returns event metadata. **No authentication required.**

**Path Parameter**: `uuid` — The UUID string assigned to a recipient certificate.

**Response `200` (verified)**

```json
{
  "success": true,
  "verified": true,
  "step": "complete",
  "data": {
    "uuid": "...",
    "organisation": "Acme Corp",
    "issuerName": "Jane Doe",
    "eventName": "Annual Hackathon 2024",
    "eventDate": "2024-03-15T00:00:00.000Z",
    "certificateGeneratedDate": "...",
    "certificateId": "...",
    "verificationId": "...",
    "isValid": true,
    "verifiedAt": "..."
  }
}
```

**Step Progression on Error** — The `step` field indicates which verification stage failed:

| `step`               | Meaning                              |
| -------------------- | ------------------------------------ |
| `validation`         | UUID parameter missing               |
| `uuid_lookup`        | UUID not found in database           |
| `certificate_lookup` | Generated certificate record missing |
| `config_lookup`      | Certificate configuration missing    |
| `event_lookup`       | Event record missing                 |
| `complete`           | All steps passed                     |

---

### `GET /api/certificates/verify-full/:uuid`

Extended verification that also returns template data, enabling the frontend to render a **sample certificate image**. **No authentication required.**

**Response `200`**

Same as `verify/:uuid` response, plus:

```json
{
  "data": {
    "certificateConfig": {
      "imagePath": "https://res.cloudinary.com/...",
      "validFields": { ... }
    }
  }
}
```

---

### `GET /api/certificates/generated/:id/uuids`

Retrieve all UUID verification records for a specific generated certificate batch.

**Path Parameter**: `id` — MongoDB ObjectId of the `GeneratedCertificate`.

**Response `200`**

```json
{
  "success": true,
  "data": {
    "certificateId": "...",
    "totalUUIDs": 50,
    "uuids": [{ "uuid": "...", "verificationId": "...", "createdAt": "..." }]
  }
}
```

---

## Organisation Statistics

### `GET /api/certificates/organization-stats/:organizationName`

Retrieve aggregate statistics for a specific organisation.

**Response `200`**

```json
{
  "success": true,
  "data": {
    "organisationName": "Acme Corp",
    "recipientCount": 1240,
    "eventsCreated": 15,
    "lastUpdated": "...",
    "createdAt": "..."
  }
}
```

---

### `GET /api/certificates/all-organization-stats`

Retrieve aggregate statistics for **all** organisations, sorted by `recipientCount` descending.

**Response `200`**

```json
{
  "success": true,
  "data": {
    "organizations": [ ... ],
    "totalOrganizations": 42,
    "totalRecipients": 15000,
    "totalEvents": 300
  }
}
```
