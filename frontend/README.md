# Frontend — AI Research Agent UI

Angular 19 (standalone components, signals) single-page app for the AI Research Agent. Lets a user enter a topic, watches the agent search the web in real time via SSE, and renders the final markdown research report.

## Tech Stack

- **Angular 19** — standalone components, signals (`signal`, `computed`, `input`, `output`)
- **SCSS** — component-scoped styling
- **Server-Sent Events (SSE)** — live streaming of agent activity from the backend
- **Inter** font

## Project Structure

```
frontend/src/app/
├── app.ts / app.html / app.scss       # Root component — layout & state orchestration
├── components/
│   ├── search-box/                    # Topic input, research/stop/clear actions, suggested topics
│   ├── agent-activity/                # Live feed of agent search events + progress
│   ├── report-panel/                  # Final report display (markdown, copy, PDF download)
│   └── search-history/                # Recent searches (persisted to localStorage)
├── pipes/
│   ├── markdown.pipe.ts               # Renders markdown report as sanitized HTML
│   ├── event-label.pipe.ts            # Maps SSE event types to display labels
│   └── event-dot-class.pipe.ts        # Maps SSE event types to status-dot styling
├── services/
│   └── research.service.ts            # Calls the backend SSE endpoint
├── interfaces/
│   └── history-item.ts                # Shape of a saved search history entry
├── constants/
│   └── app.constants.ts               # All UI labels, config values, suggested topics
└── environments/
    ├── environment.ts                 # Dev config (local backend URL)
    └── environment.production.ts      # Prod config (deployed backend URL)
```

## Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure the backend URL

For local development, `src/environments/environment.ts` already points at `http://127.0.0.1:8000/research` (the default local backend).

For production builds, update `src/environments/environment.production.ts` with your deployed backend URL (see backend README for deployment).

### 3. Run the dev server

```bash
ng serve
```

Open `http://localhost:4200/`. Make sure the backend is running at `http://127.0.0.1:8000` (see `../backend/README.md`).

## Building for Production

```bash
ng build
```

This uses the `production` configuration, which swaps in `environment.production.ts` (via `fileReplacements` in `angular.json`) and outputs optimized files to `dist/`.

## Running Unit Tests

```bash
ng test
```

## How It Works

1. The user enters a topic in the search box (or picks a suggested topic).
2. `research.service.ts` opens an SSE connection to the backend `/research` endpoint.
3. As the agent searches the web, `agent-activity` shows live status updates (queries, results, "Writing report..." once searching is done).
4. When the agent finishes, `report-panel` renders the final markdown report, with options to copy it or download it as a PDF.
5. Each completed search is saved to `search-history` (persisted in `localStorage`).

## Deployment (Vercel / Netlify)

1. Update `src/environments/environment.production.ts` with your deployed backend URL.
2. Push to GitHub.
3. On Vercel/Netlify, create a new project from the repo, set the project root to `frontend/`.
4. Build command: `ng build`
5. Output directory: `dist/frontend/browser`
6. Deploy — make sure the backend's `CORS_ORIGINS` env var includes this frontend's deployed URL.
