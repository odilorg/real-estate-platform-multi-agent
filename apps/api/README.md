# Real Estate Platform API

NestJS-based REST API for the real estate marketplace platform.

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL database

### Installation

```bash
# Install dependencies (from root)
npm install
```

### Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Development

```bash
# Start in watch mode
npm run dev

# Build
npm run build

# Start production
npm run start
```

### API Documentation

Once running, visit:
- API: http://localhost:3001
- Swagger docs: http://localhost:3001/api/docs

## Available Endpoints

- `GET /` - API root information
- `GET /health` - Health check

## Architecture

```
src/
├── main.ts           # Application entry point
├── app.module.ts     # Root module
├── app.controller.ts # Root controller
├── app.service.ts    # Root service
└── health/           # Health check module
    ├── health.controller.ts
    └── health.module.ts
```

## Tech Stack

- NestJS 10.x
- TypeScript 5.x
- Class Validator & Transformer
- Swagger/OpenAPI
