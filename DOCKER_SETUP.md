# Docker Infrastructure Setup - Complete Guide

This document provides comprehensive instructions for the Docker infrastructure created for the Real Estate Platform.

## Created Files

The following Docker infrastructure files have been created:

### 1. `/c/real-estate-platform-multi-agent/infra/docker-compose.dev.yml`
Docker Compose configuration for local development with PostgreSQL 16 and Redis 7.

### 2. `/c/real-estate-platform-multi-agent/infra/README.md`
Comprehensive documentation for Docker services including:
- How to start/stop services
- Connection strings
- Troubleshooting guides
- Data persistence information

### 3. `/c/real-estate-platform-multi-agent/apps/api/Dockerfile`
Multi-stage production Dockerfile for the NestJS API application.

### 4. `/c/real-estate-platform-multi-agent/apps/web/Dockerfile`
Multi-stage production Dockerfile for the Next.js web application.

### 5. `.dockerignore` files
Created for both API and Web apps to optimize Docker builds.

## Quick Start Guide

### Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine + Docker Compose (Linux)
- Node.js >= 18.0.0
- npm >= 9.0.0

### Step 1: Start Docker Services

From the project root:

```bash
docker-compose -f infra/docker-compose.dev.yml up -d
```

This starts:
- **PostgreSQL 16** on port 5432
- **Redis 7** on port 6379

### Step 2: Verify Services

```bash
# Check if services are running
docker-compose -f infra/docker-compose.dev.yml ps

# Check PostgreSQL
docker exec -it real-estate-postgres psql -U postgres -d real_estate_platform -c "SELECT version();"

# Check Redis
docker exec -it real-estate-redis redis-cli ping
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Configure Environment Variables

The API `.env.example` is already configured to connect to the Docker services:

```bash
# Copy if not already done
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

### Step 5: Start Development Servers

Open two terminals:

**Terminal 1 - API:**
```bash
npm run dev:api
```
API runs on: http://localhost:3001

**Terminal 2 - Web:**
```bash
npm run dev:web
```
Web runs on: http://localhost:3000

## Connection Details

### PostgreSQL

**From your local machine (host):**
```
Host: localhost
Port: 5432
Database: real_estate_platform
Username: postgres
Password: password

Connection String:
DATABASE_URL=postgresql://postgres:password@localhost:5432/real_estate_platform?schema=public
```

**From other Docker containers (same network):**
```
Host: postgres
Port: 5432

Connection String:
DATABASE_URL=postgresql://postgres:password@postgres:5432/real_estate_platform?schema=public
```

### Redis

**From your local machine (host):**
```
Host: localhost
Port: 6379
No authentication required (development only)

Connection String:
REDIS_URL=redis://localhost:6379
```

**From other Docker containers (same network):**
```
Host: redis
Port: 6379

Connection String:
REDIS_URL=redis://redis:6379
```

## Common Commands

### Start Services
```bash
docker-compose -f infra/docker-compose.dev.yml up -d
```

### Stop Services
```bash
docker-compose -f infra/docker-compose.dev.yml down
```

### View Logs
```bash
# All services
docker-compose -f infra/docker-compose.dev.yml logs -f

# Specific service
docker-compose -f infra/docker-compose.dev.yml logs -f postgres
docker-compose -f infra/docker-compose.dev.yml logs -f redis
```

### Restart a Service
```bash
docker-compose -f infra/docker-compose.dev.yml restart postgres
docker-compose -f infra/docker-compose.dev.yml restart redis
```

### Access PostgreSQL CLI
```bash
docker exec -it real-estate-postgres psql -U postgres -d real_estate_platform
```

### Access Redis CLI
```bash
docker exec -it real-estate-redis redis-cli
```

### Reset Everything (Careful - Deletes Data!)
```bash
docker-compose -f infra/docker-compose.dev.yml down -v
docker-compose -f infra/docker-compose.dev.yml up -d
```

## Production Dockerfiles

Production-ready Dockerfiles have been created for both applications:

### Building API Docker Image
```bash
# From project root
docker build -f apps/api/Dockerfile -t real-estate-api:latest .
```

### Building Web Docker Image
```bash
# From project root
docker build -f apps/web/Dockerfile -t real-estate-web:latest .
```

### Running Production Containers

**API:**
```bash
docker run -d \
  --name real-estate-api \
  -p 3001:3001 \
  -e DATABASE_URL="postgresql://..." \
  -e REDIS_URL="redis://..." \
  -e JWT_SECRET="..." \
  real-estate-api:latest
```

**Web:**
```bash
docker run -d \
  --name real-estate-web \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL="http://api:3001" \
  real-estate-web:latest
```

## Troubleshooting

### Port Already in Use

**Check what's using the port:**

Windows:
```bash
netstat -ano | findstr :5432
netstat -ano | findstr :6379
```

Linux/Mac:
```bash
lsof -i :5432
lsof -i :6379
```

**Solution:** Stop the conflicting service or modify the port in `docker-compose.dev.yml`.

### Container Won't Start

```bash
# View detailed logs
docker-compose -f infra/docker-compose.dev.yml logs postgres

# Remove and recreate
docker-compose -f infra/docker-compose.dev.yml down
docker-compose -f infra/docker-compose.dev.yml up -d
```

### Connection Refused

1. Check if service is running:
   ```bash
   docker-compose -f infra/docker-compose.dev.yml ps
   ```

2. Check if service is healthy:
   ```bash
   docker inspect real-estate-postgres --format='{{.State.Health.Status}}'
   docker inspect real-estate-redis --format='{{.State.Health.Status}}'
   ```

3. Check network connectivity:
   ```bash
   docker network inspect real-estate-network
   ```

### Data Persistence

Data is stored in Docker volumes:
- `real-estate-postgres-data`
- `real-estate-redis-data`

To backup data:
```bash
# Backup PostgreSQL
docker exec real-estate-postgres pg_dump -U postgres real_estate_platform > backup.sql

# Restore PostgreSQL
cat backup.sql | docker exec -i real-estate-postgres psql -U postgres -d real_estate_platform
```

## Docker Compose File Structure

The `docker-compose.dev.yml` includes:

- **Version**: 3.8
- **Services**:
  - `postgres`: PostgreSQL 16 with Alpine Linux
  - `redis`: Redis 7 with Alpine Linux
- **Volumes**: Named volumes for data persistence
- **Networks**: Custom bridge network for service isolation
- **Health Checks**: Automated health monitoring for both services

## Next Steps

1. **Add Prisma**: Set up Prisma ORM for database migrations
2. **Add OpenSearch**: For full-text and semantic search (Phase 2)
3. **Add MinIO**: For object storage (Phase 3)
4. **Add Monitoring**: Prometheus + Grafana (Phase 4)

## Reference Documentation

- [infra/README.md](./infra/README.md) - Detailed infrastructure documentation
- [apps/api/Dockerfile](./apps/api/Dockerfile) - API production Dockerfile
- [apps/web/Dockerfile](./apps/web/Dockerfile) - Web production Dockerfile
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Redis Docker Image](https://hub.docker.com/_/redis)

## Support

For questions or issues:
1. Check the [infra/README.md](./infra/README.md) for detailed troubleshooting
2. Review Docker logs using the commands above
3. Consult the project documentation

---

**Created by**: DevOps Agent
**Date**: 2025-11-23
**Phase**: Phase 1 - Foundation Setup (Tasks 5.1-5.2)
