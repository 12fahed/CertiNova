# Environment Configuration

CertiNova Backend is configured entirely through environment variables. No secrets or environment-specific values should ever be committed to source control.

---

## Required Environment Variables

| Variable                | Description                    | Example                                                 |
| ----------------------- | ------------------------------ | ------------------------------------------------------- |
| `MONGODB_URI`           | Full MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/certinova` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name     | `my-cloud`                                              |
| `CLOUDINARY_API_KEY`    | Cloudinary API key             | `123456789012345`                                       |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret          | `abcdefghijklmnopqrstuvwxyz`                            |

---

## Optional Environment Variables

| Variable       | Default                              | Description                                                     |
| -------------- | ------------------------------------ | --------------------------------------------------------------- |
| `PORT`         | `5000`                               | Port the Express server listens on                              |
| `NODE_ENV`     | `development`                        | Controls CORS policy, error verbosity, and stack trace exposure |
| `FRONTEND_URL` | `https://your-vercel-app.vercel.app` | Production CORS allowlist entry for the frontend origin         |

---

## Setup

1. **Copy the example file** from the repository root:

   ```bash
   cp ../.env.example .env
   ```

2. **Fill in each variable** in `.env`:

   ```dotenv
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/certinova

   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   FRONTEND_URL=http://localhost:3000
   ```

3. The `.env` file is listed in `.gitignore` and must **never** be committed to version control.

---

## Production Configuration (Vercel)

When deploying to Vercel, environment variables are configured through the Vercel dashboard under **Settings → Environment Variables**. Set all five required variables for the `Production` environment.

> [!CAUTION]
> Never log environment variables or include them in error responses. The backend only exposes detailed error messages when `NODE_ENV === 'development'`.

---

## Cloudinary Configuration Notes

- Template images are uploaded to the `certinova/certificate-templates/` folder in your Cloudinary account.
- Cloudinary is configured lazily — the SDK is initialised on the first upload request, not at server startup. This prevents configuration errors from blocking the server boot.
- A startup smoke test (`test/cloudinary-test.js`) validates that credentials are present and logs a warning if they are missing.
