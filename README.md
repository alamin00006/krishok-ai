# Krishok.ai

**Krishok.ai** is an agriculture support platform for farmers in Bangladesh. It combines a Bangla AI assistant, crop and disease guides, and account-based chat history in a web application.

## Project structure

```text
krishok-ai/
├── backend/   NestJS REST API, Prisma ORM, PostgreSQL
└── client/   Next.js web client
```

## Features

- Ask agriculture questions in Bangla, with optional crop photo uploads
- Guest questions with a server-enforced limit of five
- Create an account, sign in, and revisit saved conversations
- Browse crop guides, plant diseases, and treatment information
- Provide feedback on AI answers

## Architecture

```text
Next.js web client ── HTTP / REST ── NestJS API ── PostgreSQL (Prisma)
                                           ├── Gemini / OpenRouter (AI)
                                           └── Cloudflare R2 (uploaded images)
```

Prisma stores users, conversations, and questions. For AI responses, the backend uses Gemini when `GEMINI_API_KEY` is configured; otherwise it uses OpenRouter. When Gemini rate limits are reached, the backend can fall back to OpenRouter. Uploaded images are stored in an S3-compatible Cloudflare R2 bucket.

## Requirements

- Node.js (use a current LTS release) and npm
- PostgreSQL database
- An OpenRouter API key; a Gemini API key is optional
- Cloudflare R2 credentials and a public bucket URL for image uploads

## Run locally

### 1. Configure the backend

```powershell
cd D:\projects\krishok-ai\backend
Copy-Item .env.example .env
npm install
```

Edit `backend/.env` and set the database and service credentials. The backend listens on port **5000** by default (`src/main.ts`); set `PORT=5000` explicitly in `.env` for local development. `backend/.env.example` currently says `PORT=3000`, so update that value to match the web client's default API URL, or configure the client to use the port you choose.

Required configuration:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma |
| `OPEN_ROUTER_API_KEY` | OpenRouter access; used as the default AI provider and Gemini fallback |
| `R2_ACCOUNT_ID` | Cloudflare account ID for R2 |
| `R2_ACCESS_KEY_ID` | R2 access key |
| `R2_SECRET_ACCESS_KEY` | R2 secret key |
| `R2_BUCKET_NAME` | R2 bucket for question images |
| `R2_PUBLIC_URL` | Public base URL for uploaded images |

Optional AI and server settings:

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Enables Gemini as the primary AI provider |
| `GEMINI_MODEL` | Gemini model override |
| `OPENROUTER_MODELS` | Comma-separated OpenRouter text model fallback order |
| `OPENROUTER_SITE_URL` | Referer sent to OpenRouter |
| `OPENROUTER_APP_NAME` | Application title sent to OpenRouter |
| `CLIENT_URL` | Comma-separated allowed CORS origins |
| `PORT` | API listening port; defaults to `5000` |

Generate Prisma Client and apply local migrations, then start the API:

```powershell
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

The API is available at `http://localhost:5000` with the default configuration. Its root endpoint (`GET /`) returns a basic health greeting.

### 2. Run the web client

Open another terminal:

```powershell
cd D:\projects\krishok-ai\client
Copy-Item .env.example .env.local
npm install
npm run dev
```

`client/.env.example` points to `http://localhost:5000`. Visit `http://localhost:3000` in your browser. If you changed the backend port, update `NEXT_PUBLIC_API_URL` in `client/.env.local` to match.

## Useful commands

### Backend (`backend/`)

| Command | Description |
| --- | --- |
| `npm run start:dev` | Start NestJS in watch mode |
| `npm run build` | Compile the API |
| `npm run start:prod` | Run the compiled API |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |

### Web client (`client/`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build the web app |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## API overview

The web client consumes the REST API. Main route groups include:

- `/questions` — guest questions, question history, and answer feedback
- `/users` — registration, login, profile retrieval, and profile updates
- `/conversations` — create, list, retrieve, and send messages in conversations
- `/content` — crop and disease guide content

Image question and conversation-message requests use `multipart/form-data`. See the client API wrapper in `client/src/store/api.ts` and controllers in `backend/src/` for request details.

## Production notes

- Set `CLIENT_URL` to the exact web origin(s) allowed to call the API.
- Use a managed PostgreSQL database and apply schema migrations during deployment with `npx prisma migrate deploy`.
- Keep API keys, database credentials, and R2 secrets in the deployment environment; never commit `.env` files.
- Point `NEXT_PUBLIC_API_URL` to the deployed HTTPS API.
- Configure the R2 public URL and bucket access to serve uploaded images as intended.

## License

No repository-level license is currently specified.
