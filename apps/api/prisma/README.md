# Prisma Database Setup

This directory contains the Prisma schema and migrations for the real estate platform.

## Schema Overview

The initial schema includes:

### User Model
- Authentication and user management
- Supports three roles: USER, AGENT, ADMIN
- Three statuses: ACTIVE, SUSPENDED, PENDING_VERIFICATION
- Email verification tracking
- Timestamps for created/updated

### RefreshToken Model
- JWT refresh token management
- Automatic cascade deletion when user is deleted
- Token expiration tracking

## Running Migrations

### Prerequisites
1. Ensure PostgreSQL is running (via Docker or local installation)
2. Verify DATABASE_URL in .env file is correct

### Start PostgreSQL with Docker
```bash
# From project root
docker-compose -f infra/docker-compose.dev.yml up -d postgres

# Wait for PostgreSQL to be ready
docker-compose -f infra/docker-compose.dev.yml logs -f postgres
```

### Apply Migrations
```bash
# From apps/api directory
cd apps/api

# Apply all pending migrations
npx prisma migrate deploy

# Or run in dev mode (creates migration if schema changed)
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

## Database Indexes

The schema includes the following indexes for optimal query performance:

### users table
- `email` - Unique index for authentication lookups
- `role` - Index for role-based queries
- `status` - Index for filtering by user status

### refresh_tokens table
- `token` - Unique index for token validation
- `userId` - Index for user-token relationship queries
- `expiresAt` - Index for token expiration cleanup

## Useful Commands

```bash
# Open Prisma Studio (GUI for database)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Check migration status
npx prisma migrate status

# Format schema file
npx prisma format
```

## Future Enhancements

When implementing listing features (Phase 3), the schema will be extended with:
- Listing model (property listings)
- ListingImage model (property photos)
- Favorite model (saved listings)
- SavedSearch model (user search preferences)
- ListingPromotion model (featured listings)
- Agency model (real estate agencies)

Geographic features using PostGIS will be added for map-based search.
