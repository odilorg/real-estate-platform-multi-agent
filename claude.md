# Claude Project Guide – Real Estate Platform (Multi-Agent)

## 1. Project Overview

We are building a Cian-like real estate marketplace for Uzbekistan.

High-level goals:
- Let users browse, filter, and view real estate listings (sale/rent).
- Support owners/agents to create and manage listings.
- Provide an admin/moderation layer.
- Be API-first so the same backend can power:
  - Web app
  - Future mobile apps
  - Future Telegram bot

Non-goals for now:
- No exotic microservices yet. Start as a clean, modular monorepo.
- No third-party auth SaaS (no Clerk/Supabase Auth). Auth is self-hosted.

## 2. Tech Stack & Architecture

- **Frontend**
  - Next.js (TypeScript, App Router)
  - Tailwind CSS
  - Multilingual UI: Russian, Uzbek, English
  - Focus on SEO-friendly pages (city/category, listing detail) and map-based search.

- **Backend**
  - NestJS (TypeScript)
  - REST API (later we can add GraphQL if needed)
  - Auth with email/password, JWT + HTTP-only cookies for web
  - RBAC: USER, AGENT, ADMIN (more roles later)

- **Database & Search**
  - PostgreSQL via Prisma ORM
  - Initially basic filters & indexes in Postgres
  - Later phases: PostGIS, Meilisearch/OpenSearch for advanced search

- **Storage & Infra**
  - Image storage via S3-compatible bucket (provider TBD)
  - Redis later for caching, sessions, queues
  - Docker & docker-compose for local dev
  - CI for lint/test/build (GitHub Actions or similar)

## 3. Monorepo Layout

Target structure:

- `/apps/web`  
  Next.js frontend app.

- `/apps/api`  
  NestJS backend API.

- `/packages/shared`  
  Shared TypeScript code:
  - Types/interfaces for API payloads
  - DTO definitions (if shared)
  - Common utilities/constants

- `/infra`  
  Dockerfiles, docker-compose, CI configs, scripts.

- `/.claude/agents`  
  Custom subagent definitions:
  - `project-architect`
  - `backend-engineer`
  - `frontend-engineer`
  - `db-schema-designer`
  - `devops-engineer`
  - `code-reviewer`
  - `test-runner`
  (These are already created in this repo.)

## 4. Subagents & Responsibilities

Claude, you have these project-specific agents. Use them proactively.

- **project-architect**  
  - MUST be used when planning a new feature or phase.  
  - Responsibilities:
    - Understand current codebase (use Read/Grep/Glob).
    - Propose architecture and API contracts.
    - Break work into small tasks and assign them to other agents.
    - Keep web, backend, DB, and infra aligned.
  - Do not write a lot of code directly; focus on plans and contracts.

- **backend-engineer**  
  - Use for NestJS + Prisma work in `/apps/api` and schema-related logic.
  - Responsibilities:
    - Implement REST endpoints, controllers, services.
    - Use DTOs, validation, guards, RBAC.
    - Integrate with Prisma models defined by `db-schema-designer`.
    - Write backend unit/integration tests when appropriate.

- **frontend-engineer**  
  - Use for Next.js app work in `/apps/web`.
  - Responsibilities:
    - Build pages, layouts, components, forms, filters.
    - Handle data fetching and API integration.
    - Implement i18n (RU/UZ/EN) and basic SEO meta tags.

- **db-schema-designer**  
  - Use when designing or changing Prisma schema & migrations.
  - Responsibilities:
    - Maintain `schema.prisma` in a normalized, scalable way.
    - Consider indexes for common queries (city, price, rooms, status).
    - Plan for geolocation support (lat/lng) and future PostGIS.

- **devops-engineer**  
  - Use for Docker, docker-compose, and CI configuration in `/infra` or root.
  - Responsibilities:
    - Set up containerized dev environment.
    - Configure CI to run lint/test/build.
    - Document how to run project locally.

- **code-reviewer**  
  - Use AFTER non-trivial changes before merging.
  - Responsibilities:
    - Review diffs for correctness, security, and readability.
    - Point out missing validation, auth checks, or tests.
    - Suggest concrete improvements.

- **test-runner**  
  - Use to run tests and fix failing tests.
  - Responsibilities:
    - Run appropriate test commands.
    - Diagnose failures and fix either tests or implementation while preserving intent.

## 5. Multi-language & Future Clients

Design rules:

- All user-facing strings in the frontend must go through the i18n layer.
- Backend should not hardcode language-specific behavior.
- API responses should be language-agnostic or explicitly include localized fields.

Future clients:
- **Mobile apps** and **Telegram bot** must be able to consume the same REST APIs.
- Backend must not assume a browser; no UI logic in backend.

## 6. Phase Plan (High-Level)

Claude, treat these as phases. For each phase, start with `project-architect` to refine tasks, then orchestrate the other agents.

### Phase 1 – Monorepo & Skeleton

- Set up:
  - Root `package.json` with workspaces (`apps/*`, `packages/*`).
  - Basic `.gitignore`, `README.md`.
- Scaffold `/apps/api`:
  - NestJS app with `AppModule` and `/health` endpoint.
- Scaffold `/apps/web`:
  - Next.js app (App Router, TypeScript, Tailwind).
  - Simple homepage that confirms frontend is running.
- Minimal `/packages/shared` directory with placeholder.

### Phase 2 – Auth & Users

- Define Prisma schema for `User` and roles (USER, AGENT, ADMIN).
- Implement self-hosted auth:
  - Email + password registration & login.
  - Password hashing (bcrypt or argon2).
  - JWT-based auth with HTTP-only cookies.
- Frontend pages:
  - Sign up, login, profile.
- Protect basic routes that require auth.

### Phase 3 – Listings Core

- Design `Listing`, `ListingImage`, `Favorite` models.
- Implement CRUD for listings (with permissions).
- Filtering and pagination for listing catalog.
- Frontend:
  - Listing creation/edit form.
  - Catalog page with filters.
  - Listing detail page.

### Phase 4 – Search UX & Map

- Improve filter performance and indexing.
- Map + list combined UI.
- Better SEO for listing/city/category pages.

### Phase 5 – Admin & Moderation

- Admin-only views to:
  - Approve/reject listings.
  - Manage users and roles.
- Separate admin UI section.

Later phases:
- Promotions, saved searches, alerts, agencies, mobile apps, Telegram bot, advanced search.

## 7. How You Should Work, Claude

When I give you a high-level instruction like:
> "Implement Phase 1 according to CLAUDE.md. Use your subagents as needed."

You should:

1. Invoke `project-architect` first to:
   - Analyze current repo state.
   - Produce a concrete task list for this phase.
2. For each task, invoke the appropriate specialist:
   - `devops-engineer` for workspace/infra.
   - `backend-engineer` for NestJS work.
   - `frontend-engineer` for Next.js.
   - `db-schema-designer` when touching schema.
3. After significant changes:
   - Use `test-runner` to run tests (once they exist).
   - Use `code-reviewer` to review the diffs.
4. Keep me informed:
   - Summarize what changed.
   - Point out any decisions or tradeoffs.
   - Ask for confirmation only on major architectural changes.

Do **not**:
- Rewrite the overall architecture without a clear reason.
- Introduce new external SaaS without my explicit permission.
- Hardcode project-specific secrets into the codebase.
