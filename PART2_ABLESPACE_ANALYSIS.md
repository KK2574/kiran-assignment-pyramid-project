# Pyramid — Task Management System

A full-stack task management app built for the Full Stack Developer assessment, implemented from the provided Figma design.

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Zustand
- **Backend**: NestJS, TypeScript, TypeORM. **SQLite is the primary database** for this project — simple, file-based, zero setup for anyone running it locally. In the deployed production build, TypeORM transparently swaps to Postgres only because Render's free hosting tier doesn't persist local files across restarts; the schema, entities, and application code are identical either way. See [Database](#database) below.

## Project structure

```
pyramid/
├── frontend/     Next.js app (App Router)
└── backend/      NestJS API
```

## Running locally

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run seed        # optional: populates demo data (skips if DB already has tasks)
npm run start:dev   # http://localhost:3001
```

This creates a `backend/pyramid.sqlite` file on first run — that's your local database. It's gitignored, so each local environment starts fresh unless you run `npm run seed`. Note: the app also auto-seeds the same demo data on boot if it detects an empty database (see `SeedService`), so this step is mainly useful if you want to re-seed explicitly or run it outside the app lifecycle. (Production uses Postgres instead of this file — see [Database](#database) under Deployment.)

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

The frontend works standalone too — if it can't reach the API it falls back to local seed data, so you can preview the UI even before the backend is running.

## Google OAuth setup (required for "Login with Google")

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Create an OAuth 2.0 Client ID (Web application)
3. Add authorized redirect URIs:
   - `http://localhost:3001/auth/google/callback` (local dev)
   - `https://your-backend-domain.com/auth/google/callback` (production, add after deploying)
4. Copy the Client ID and Client Secret into `backend/.env`:
   ```
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
   FRONTEND_URL=http://localhost:3000
   JWT_SECRET=some-long-random-string
   ```

**How the flow works:** clicking "Login with Google" is a real link to `GET /auth/google` on the backend, which redirects the browser to Google's consent screen (via Passport's `GoogleStrategy`). Google redirects back to `GET /auth/google/callback`, the backend verifies the profile, signs a JWT, and redirects to the frontend's `/auth/callback?token=...&name=...&email=...`, which stores the session and sends the user to `/tasks`.

## Features implemented

- **Guest login** + **Google OAuth login** (full Passport.js flow — real redirect to Google's consent screen, JWT issuance, and callback handling; see setup steps below)
- **Tasks**: List view (grouped by status, collapsible) and Board/Kanban view (drag-and-drop between columns), Fields toggle to show/hide columns, search, Add Task
- **Task detail**: title/description editing, subtasks table, priority dropdown, comments, Details side panel
- **Projects**: list view matching the same table pattern as Tasks
- **Theme system**: Light/Dark mode + 6 accent colors (Amber, Blue, Pink, Rose, Emerald, Black), persisted via `localStorage` (Zustand `persist`)
- **Settings/Profile**: editable name, title, username, leave workspace
- **Responsive**: layouts collapse gracefully down to tablet/mobile widths using Tailwind breakpoints

## Known deviations from the Figma (documented per assignment instructions)

- **Persistence**: `backend/src/app.module.ts` uses SQLite for local dev (zero setup) and automatically switches to Postgres in production if a `DATABASE_URL` env var is present (e.g. Render's managed Postgres). This matters more than it might sound: Render's free *Web Service* disk is **ephemeral** — a SQLite file there gets wiped on every restart/redeploy/cold-start, silently re-seeding the DB with brand-new random IDs and 404ing every task the frontend still had a reference to. Postgres avoids that entirely. See [Database](#database) below for setup.
- **Accent color naming**: the "Blue" theme swatch in the Figma is rendered here as `#7c3aed` (a purple), to match the actual hex value shown in the design rather than the literal label — see the comment in `frontend/lib/theme-store.ts`.
- Some fine-grained interaction details (subtask drag-reordering, full rich-text description editor) are simplified to plain inputs/textareas given the assessment time window.

## Deployment

**Database**
1. On Render, create a new **PostgreSQL** instance (free tier is fine) in the same region as your backend
2. Copy its **Internal Database URL** (looks like `postgresql://user:pass@host/dbname`)
3. Add it to your backend service's env vars as `DATABASE_URL`
4. That's it — `app.module.ts` detects `DATABASE_URL` and switches from SQLite to Postgres automatically, no code changes needed. On first boot, `SeedService` will populate it with demo data (same as it does locally).
5. Skipping this step isn't fatal — the app falls back to SQLite — but on Render's free Web Service tier that file is wiped on every restart, which will cause 404s on any task/project id the frontend is still holding from before the restart. Postgres persists properly across restarts.

**Frontend (Vercel)**
1. Push this repo to GitHub
2. Import the repo in Vercel, set root directory to `frontend`
3. Add env var `NEXT_PUBLIC_API_URL` = your deployed backend URL
4. Deploy
5. Note your **production** Vercel URL specifically (Settings → Domains) — every push can also generate a new throwaway preview URL, and only the stable production one should be used below and submitted as your live link

**Backend (Render/Railway)**
1. New Web Service, root directory `backend`
2. Build command: `npm install && npm run build`
3. Start command: `npm run start:prod`
4. Add env var `CORS_ORIGIN` = your deployed frontend URL (comma-separate multiple origins if you need to support more than one, e.g. a production URL and a preview URL)
5. Add env var `DATABASE_URL` from the Database step above

## Part 2 — AbleSpace Product Analysis

Screen recording: [https://drive.google.com/file/d/1y__oe711-rmB8t9oWR_pBAaO52_3Q20C/view?usp=drive_link](https://drive.google.com/file/d/1y__oe711-rmB8t9oWR_pBAaO52_3Q20C/view?usp=drive_link)

See `PART2_ABLESPACE_ANALYSIS.md` in this repo for a written companion covering the same Caseload → Take Data workflow and UX observations.