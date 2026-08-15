# Pyramid — Task Management System

A full-stack task management app built for the Full Stack Developer assessment, implemented from the provided Figma design.

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Zustand
- **Backend**: NestJS, TypeScript, TypeORM + SQLite (file-based, persists across restarts)

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

This creates a `backend/pyramid.sqlite` file on first run — that's your database. It's gitignored, so each environment (yours, a grader's, production) starts fresh unless you run `npm run seed`. Note: the app also auto-seeds the same demo data on boot if it detects an empty database (see `SeedService`), so this step is mainly useful if you want to re-seed explicitly or run it outside the app lifecycle.

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

- **Persistence**: uses SQLite (a file on disk) rather than Postgres/MongoDB, to keep the assessment runnable without provisioning an external database service. TypeORM makes this a small config change — in `backend/src/app.module.ts`, swap `type: "sqlite"` for `type: "postgres"` and add connection credentials; the entities, services, and controllers don't need to change.
- **Accent color naming**: the "Blue" theme swatch in the Figma is rendered here as `#7c3aed` (a purple), to match the actual hex value shown in the design rather than the literal label — see the comment in `frontend/lib/theme-store.ts`.
- Some fine-grained interaction details (subtask drag-reordering, full rich-text description editor) are simplified to plain inputs/textareas given the assessment time window.

## Deployment

**Frontend (Vercel)**
1. Push this repo to GitHub
2. Import the repo in Vercel, set root directory to `frontend`
3. Add env var `NEXT_PUBLIC_API_URL` = your deployed backend URL
4. Deploy

**Backend (Render/Railway)**
1. New Web Service, root directory `backend`
2. Build command: `npm install && npm run build`
3. Start command: `npm run start:prod`
4. Add env var `CORS_ORIGIN` = your deployed frontend URL

## Part 2 — AbleSpace Product Analysis

See `PART2_ABLESPACE_ANALYSIS.md` in this repo for the write-up on the Caseload → Take Data workflow.