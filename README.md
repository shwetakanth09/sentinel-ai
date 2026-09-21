# SENTINEL AI — Criminal Network Intelligence Platform

AI-assisted investigation workspace for exploring connected entities, events and
relationships in a criminal-network knowledge graph.

> ## ⚠️ ALL DATA IS FICTIONAL — READ THIS FIRST
>
> **Every record in this application is synthetic and fictional. It was written by hand
> for a software engineering exercise (Smart India Hackathon 2026 prototype).**
>
> - The people, names, aliases, ages, phone numbers, vehicle registrations, organizations,
>   locations, FIR references, events and alerts are **invented**. They are **not real
>   individuals, and do not describe any real person, group, or criminal activity.**
> - The entity IDs (e.g. `PERSON-1042`, `PHONE-8870`) are arbitrary labels, **not** police,
>   government, or case numbers.
> - No real criminal, personal, financial, telecommunications, surveillance, or law
>   enforcement data was used, collected, scraped, or processed at any point.
> - Names were chosen to be generic and are not intended to refer to any living person.
>   Any resemblance to real persons or organizations is coincidental.
> - The risk indicators, "AI findings", and pattern alerts are **deterministic demo logic**,
>   not real intelligence, and must never be used to make decisions about real people.
> - This is a **portfolio / demonstration project**, not an operational product, and it is
>   **not affiliated with or endorsed by any police, government, or security agency.**

---

## Live Demo

A temporary public demo is exposed through a Cloudflare quick tunnel while the local
server is running:

- **URL:** https://colin-detailed-temporary-layer.trycloudflare.com
- **Email:** `admin@sentinel.local`
- **Password:** `admin123`

> The URL above is a **temporary quick tunnel**. It only works while the machine and
> tunnel process are running, and it changes every time the tunnel is restarted.
> To run it yourself permanently, see [Getting Started](#getting-started).

## Features

- **Dashboard** — case KPIs, live network graph, AI insight summary, recent detections.
- **Network Explorer** — interactive relationship graph (Cytoscape + cose-bilkent) with
  entity search, type/cluster/risk filters, and a details panel.
- **Entity profiles** — per-entity overview, risk breakdown, connections, timeline,
  evidence, and network metrics (degree / betweenness centrality).
- **Alerts** — pattern alerts with acknowledge/dismiss actions.
- **Timeline** — chronological investigation events with entity filtering.
- **Data Sources** — ingestion pipeline view and source processing status.
- **NLP / Document Analysis** — unstructured text to extracted entities/relationships,
  which can be merged into the graph.
- **AI Assistant** — grounded Q&A over the graph with evidence citations.
- **Reports** — generate a case summary, export JSON, and print/export PDF.
- **Authentication** — register/login with server-side sessions and protected routes.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS, custom component set |
| Graph | Cytoscape.js + cytoscape-cose-bilkent |
| Database | SQLite via `better-sqlite3` |
| Auth | Custom scrypt password hashing + DB-backed session cookies |
| Route protection | `src/proxy.ts` (Next.js 16 middleware convention) |

## Architecture

```
src/
├─ app/
│  ├─ api/                 REST endpoints (state, auth, entities, relationships,
│  │                       alerts, cases, data-sources, system/reset)
│  ├─ login/ register/     Auth pages
│  └─ <routes>/            Dashboard, explorer, entities, alerts, timeline, ...
├─ components/             UI, layout, providers, feature components
├─ data/                   Synthetic seed dataset (the fictional source records)
├─ lib/
│  ├─ db.ts                SQLite schema, seeding, queries, mutations
│  ├─ auth.ts              Password hashing, sessions, cookie helpers
│  ├─ graph-analytics.ts   Data-driven centrality and clustering helpers
│  └─ ai-assistant.ts      Deterministic, grounded answer generation
├─ types/                  Shared TypeScript types
└─ proxy.ts                Auth gate for protected routes
```

- On first boot the SQLite file is created at `data/sentinel.db` (WAL mode) and **seeded
  from the fictional files in `src/data/`**.
- The client fetches live state from `/api/state` through `AppProvider`; UI mutations
  (acknowledge alert, add/edit entity, add/remove relationship, update case status)
  call the REST API and update local state.
- The database file is git-ignored — it is recreated automatically and contains no real
  data.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Default administrator (created automatically on first boot):

```
Email:    admin@sentinel.local
Password: admin123
```

Change this immediately in any shared or public environment.

### Production

```bash
npm run build
npm start
```

### Environment variables (optional)

| Variable | Purpose | Default |
| --- | --- | --- |
| `SENTINEL_ADMIN_EMAIL` | Seed admin email | `admin@sentinel.local` |
| `SENTINEL_ADMIN_PASSWORD` | Seed admin password | `admin123` |

### Reset the dataset

Delete `data/` and restart; the database is recreated and reseeded from the fictional
seed files. (An admin-only `POST /api/system/reset` endpoint also exists.)

## API overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/state` | Full dataset (entities, relationships, events, alerts, cases, sources, documents) |
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Sign in (sets session cookie) |
| `POST` | `/api/auth/logout` | Sign out |
| `GET` | `/api/auth/session` | Current user |
| `PATCH` | `/api/alerts/[id]` | Acknowledge / dismiss alert |
| `POST` | `/api/entities` | Create entity |
| `PATCH`/`DELETE` | `/api/entities/[id]` | Update / delete entity |
| `POST` | `/api/relationships` | Create relationship |
| `DELETE` | `/api/relationships/[id]` | Delete relationship |
| `PATCH` | `/api/cases/[id]` | Update case status |
| `PATCH` | `/api/data-sources/[id]` | Update source processing state |
| `POST` | `/api/system/reset` | Reseed database (admin only) |

## Ethical and legal notice

This project exists to demonstrate full-stack engineering, graph visualisation, and
grounded "explainable" analysis patterns. It is deliberately built so that **it cannot
be mistaken for, or used as, a real surveillance or intelligence system**:

- No real or personal data is present, and the app ships with no ingestion of external
  data.
- The data is fictional, but the project remains a **demonstration**; do not present its
  output as real findings.
- If you reuse this codebase, **keep and strengthen these disclaimers**, and never seed it
  with real personal data.

## License

Released for educational and portfolio use. See the repository for details.
