# Real Estate Platform - Multi-Agent System

A modern, multi-tenant real estate platform with AI-powered features for property management, search, and analytics.

## Overview

This platform provides a comprehensive solution for real estate businesses including:

- **Multi-tenant Architecture**: Support for multiple agencies with isolated data
- **Property Management**: Advanced CRUD operations with media handling
- **AI-Powered Search**: Semantic search using natural language
- **Analytics Dashboard**: Real-time insights and reporting
- **Agent Collaboration**: Multi-agent system for coordinated development

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - UI component library
- **React Query** - Data fetching and caching

### Backend
- **NestJS** - Enterprise Node.js framework
- **PostgreSQL** - Primary database
- **Redis** - Caching and session management
- **Prisma** - Type-safe ORM
- **OpenSearch** - Full-text and semantic search

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Local development orchestration
- **GitHub Actions** - CI/CD pipeline

## Monorepo Structure

```
real-estate-platform-multi-agent/
├── apps/
│   ├── api/                 # NestJS backend application
│   └── web/                 # Next.js frontend application
├── packages/
│   └── shared/              # Shared types, utilities, and constants
├── infra/
│   ├── docker/              # Dockerfile configurations
│   └── docker-compose.yml   # Local development environment
├── .github/
│   └── workflows/           # CI/CD pipeline configurations
├── package.json             # Root package.json with workspaces
├── tsconfig.base.json       # Shared TypeScript configuration
├── .eslintrc.json           # ESLint configuration
├── .prettierrc.json         # Prettier configuration
└── claude.md                # AI agent collaboration guide
```

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker and Docker Compose (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd real-estate-platform-multi-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy example env files (once created by backend-agent)
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```

4. **Start local development environment**
   ```bash
   # Start Docker services (Postgres, Redis, OpenSearch)
   docker-compose up -d
   
   # Run database migrations
   npm run dev:api -- npm run db:migrate
   
   # Start development servers
   npm run dev:api    # API server on http://localhost:3000
   npm run dev:web    # Web app on http://localhost:3001
   ```

### Available Scripts

- `npm run dev:api` - Start API development server
- `npm run dev:web` - Start web development server
- `npm run build` - Build all workspaces
- `npm run lint` - Lint all workspaces
- `npm run format` - Format code with Prettier

## Development Workflow

This project uses a multi-agent development approach. See [claude.md](./claude.md) for detailed information about:

- Agent roles and responsibilities
- Development phases
- Collaboration protocols
- Testing and deployment guidelines

## Project Phases

### Phase 1: Foundation Setup (Current)
- Monorepo initialization
- Backend API scaffolding
- Frontend application setup
- Shared package configuration
- Docker and CI/CD setup

### Phase 2: Core Features
- Authentication and authorization
- Multi-tenancy implementation
- Property CRUD operations
- Basic search functionality

### Phase 3: Advanced Features
- AI-powered semantic search
- Media upload and processing
- Analytics dashboard
- Performance optimization

### Phase 4: Production Readiness
- Security hardening
- Monitoring and logging
- Documentation
- Deployment automation

## Contributing

Please refer to the [claude.md](./claude.md) file for agent-specific contribution guidelines and collaboration protocols.

## License

[License details to be added]

## Support

For questions or issues, please refer to the project documentation or contact the development team.
