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
npm run seed       # optional: populates demo data (skips if DB already has tasks)
npm run start:dev  # http://localhost:3001
```

This creates a `backend/pyramid.sqlite` file on first run — that's your database. It's gitignored, so each environment (yours, a grader's, production) starts fresh unless you run `npm run seed`.

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

The frontend works standalone too — if it can't reach the API it falls back to local seed data, so you can preview the UI even before the backend is running.

## Features implemented

- **Guest login** + Google login button (Google OAuth wired as a stub endpoint — see note below)
- **Tasks**: List view (grouped by status, collapsible) and Board/Kanban view (drag-and-drop between columns), Fields toggle to show/hide columns, search, Add Task
- **Task detail**: title/description editing, subtasks table, priority dropdown, comments, Details side panel
- **Projects**: list view matching the same table pattern as Tasks
- **Theme system**: Light/Dark mode + 6 accent colors (Amber, Blue, Pink, Rose, Emerald, Black), persisted via `localStorage` (Zustand `persist`)
- **Settings/Profile**: editable name, title, username, leave workspace
- **Responsive**: layouts collapse gracefully down to tablet/mobile widths using Tailwind breakpoints

## Known deviations from the Figma (documented per assignment instructions)

- **Google OAuth** is stubbed (`POST /auth/google` accepts a name/email and returns a session) rather than a full Google Identity Platform integration, since that requires a real OAuth client ID/secret tied to a specific deployed domain. To make it real: add `@nestjs/passport` + `passport-google-oauth20`, wire `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`, and swap the frontend button to redirect to the backend's `/auth/google` redirect endpoint.
- **Persistence**: uses SQLite (a file on disk) rather than Postgres/MongoDB, to keep the assessment runnable without provisioning an external database service. TypeORM makes this a small config change — in `backend/src/app.module.ts`, swap `type: "sqlite"` for `type: "postgres"` and add connection credentials; the entities, services, and controllers don't need to change.
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
