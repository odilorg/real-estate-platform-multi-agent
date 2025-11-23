# Infrastructure Setup

This directory contains Docker configurations and infrastructure setup for the Real Estate Platform.

## Overview

The development environment uses Docker Compose to run the following services:

- **PostgreSQL 16**: Primary database for application data
- **Redis 7**: In-memory data store for caching and session management

## Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine + Docker Compose (Linux)
- Minimum 4GB RAM allocated to Docker
- Ports 5432 and 6379 available on your machine

## Getting Started

### Starting Docker Services

From the project root directory:

```bash
# Start all services in detached mode
docker-compose -f infra/docker-compose.dev.yml up -d

# View logs
docker-compose -f infra/docker-compose.dev.yml logs -f

# Check service status
docker-compose -f infra/docker-compose.dev.yml ps
```

Or from the infra directory:

```bash
cd infra

# Start all services
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Stopping Docker Services

```bash
# Stop all services (from project root)
docker-compose -f infra/docker-compose.dev.yml down

# Stop and remove volumes (WARNING: This deletes all data)
docker-compose -f infra/docker-compose.dev.yml down -v
```

### Managing Individual Services

```bash
# Start only Postgres
docker-compose -f infra/docker-compose.dev.yml up -d postgres

# Stop only Redis
docker-compose -f infra/docker-compose.dev.yml stop redis

# Restart a service
docker-compose -f infra/docker-compose.dev.yml restart postgres
```

## Connection Details

### PostgreSQL

- **Host**: localhost
- **Port**: 5432
- **Database**: real_estate_platform
- **Username**: postgres
- **Password**: password

**Connection String for Apps:**
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/real_estate_platform?schema=public
```

**Connect via psql:**
```bash
docker exec -it real-estate-postgres psql -U postgres -d real_estate_platform
```

### Redis

- **Host**: localhost
- **Port**: 6379
- **No password required** (development only)

**Connection String for Apps:**
```
REDIS_URL=redis://localhost:6379
```

**Connect via redis-cli:**
```bash
docker exec -it real-estate-redis redis-cli
```

## Data Persistence

Data is persisted in Docker volumes:

- `real-estate-postgres-data`: PostgreSQL database files
- `real-estate-redis-data`: Redis persistence files (AOF)

### Backup and Restore

**Backup PostgreSQL:**
```bash
docker exec real-estate-postgres pg_dump -U postgres real_estate_platform > backup.sql
```

**Restore PostgreSQL:**
```bash
cat backup.sql | docker exec -i real-estate-postgres psql -U postgres -d real_estate_platform
```

## Health Checks

Both services include health checks:

```bash
# Check health status
docker-compose -f infra/docker-compose.dev.yml ps

# View detailed health status
docker inspect real-estate-postgres --format='{{.State.Health.Status}}'
docker inspect real-estate-redis --format='{{.State.Health.Status}}'
```

## Troubleshooting

### Port Already in Use

If you get a "port already in use" error:

```bash
# Check what's using the port (Windows)
netstat -ano | findstr :5432
netstat -ano | findstr :6379

# Check what's using the port (Linux/Mac)
lsof -i :5432
lsof -i :6379
```

Stop the conflicting service or modify the port mapping in `docker-compose.dev.yml`.

### Container Won't Start

```bash
# View container logs
docker-compose -f infra/docker-compose.dev.yml logs postgres
docker-compose -f infra/docker-compose.dev.yml logs redis

# Remove and recreate containers
docker-compose -f infra/docker-compose.dev.yml down
docker-compose -f infra/docker-compose.dev.yml up -d
```

### Reset Everything

To completely reset the development environment:

```bash
# Stop and remove containers, networks, and volumes
docker-compose -f infra/docker-compose.dev.yml down -v

# Remove Docker images (optional)
docker rmi postgres:16-alpine redis:7-alpine

# Start fresh
docker-compose -f infra/docker-compose.dev.yml up -d
```

### Permission Issues (Linux)

If you encounter permission issues on Linux:

```bash
# Fix PostgreSQL data directory permissions
sudo chown -R 999:999 /path/to/postgres_data
```

## Production Deployment

For production deployments, refer to:

- `apps/api/Dockerfile` - Production Dockerfile for API
- `apps/web/Dockerfile` - Production Dockerfile for Web app

See the main README.md for deployment instructions.

## Network Configuration

All services run on the `real-estate-network` bridge network, allowing containers to communicate with each other using service names:

- From API container: `postgres://postgres:password@postgres:5432/real_estate_platform`
- From API container: `redis://redis:6379`

## Future Services

Additional services may be added in future phases:

- **Meilisearch/OpenSearch**: For advanced search capabilities
- **MinIO**: For object storage (images, documents)
- **NGINX**: For reverse proxy and load balancing
- **Prometheus/Grafana**: For monitoring and metrics

## References

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Redis Docker Image](https://hub.docker.com/_/redis)
