# SQLite Configuration for Development

## Overview

This project is currently configured to use **SQLite** for temporary development usage instead of PostgreSQL. This simplifies local development by removing the need for Docker containers.

## Changes Made

### 1. Prisma Schema Updates
- **Provider**: Changed from `postgresql` to `sqlite`
- **Database URL**: Changed to `file:./dev.db`
- **Enums**: Converted to String fields (SQLite doesn't support native enums)
  - `UserRole` → String with values: "USER", "AGENT", "ADMIN"
  - `UserStatus` → String with values: "ACTIVE", "SUSPENDED", "PENDING_VERIFICATION"
  - `PropertyType` → String with values: "APARTMENT", "HOUSE", "TOWNHOUSE", "COMMERCIAL", "LAND", "GARAGE"
  - `DealType` → String with values: "SALE", "RENT", "DAILY_RENT"
  - `ListingStatus` → String with values: "DRAFT", "PENDING", "ACTIVE", "SOLD", "RENTED", "ARCHIVED", "REJECTED"

- **JSON Fields**: Converted to String fields (stored as JSON strings)
  - `title` → String (JSON format: `{"en": "...", "ru": "...", "uz": "..."}`)
  - `description` → String (JSON format: `{"en": "...", "ru": "...", "uz": "..."}`)
  - `features` → String (JSON format: `["feature1", "feature2", ...]`)

- **Decimal Fields**: Converted to Float
  - `price` → Float

### 2. Environment Variables
- **apps/api/.env**: `DATABASE_URL=file:./dev.db`
- **apps/api/.env.example**: Updated with SQLite configuration

### 3. Migration
- Created new SQLite migration: `20251124022213_init_sqlite`
- Database file location: `apps/api/dev.db`

## Development Workflow

### Starting Fresh

```bash
# Navigate to API directory
cd apps/api

# Delete the database (if you want to reset)
rm dev.db

# Create migration and database
npx prisma migrate dev

# Or just apply existing migrations
npx prisma migrate deploy
```

### Viewing the Database

```bash
# Using Prisma Studio (recommended)
cd apps/api
npx prisma studio

# Using SQLite CLI
sqlite3 apps/api/dev.db
```

### Running the Application

```bash
# No Docker needed!

# Install dependencies (if not done)
npm install

# Start API server
npm run dev:api

# Start web server (in another terminal)
npm run dev:web
```

## Application Layer Changes Needed

Since SQLite doesn't have native enum support, you'll need to ensure type safety at the application layer:

### 1. Create Enum Type Guards (TypeScript)

```typescript
// In packages/shared/src/types/enums.ts or similar

export enum UserRole {
  USER = 'USER',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN',
}

export enum PropertyType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  TOWNHOUSE = 'TOWNHOUSE',
  COMMERCIAL = 'COMMERCIAL',
  LAND = 'LAND',
  GARAGE = 'GARAGE',
}

// ... other enums
```

### 2. Validation in DTOs (NestJS)

```typescript
// Example in create-listing.dto.ts
import { IsEnum } from 'class-validator';
import { PropertyType, DealType } from '@real-estate/shared';

export class CreateListingDto {
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsEnum(DealType)
  dealType: DealType;

  // ...
}
```

### 3. JSON Parsing Helpers

```typescript
// For multilingual fields
export function parseMultilingualText(jsonString: string): { en?: string; ru?: string; uz?: string } {
  try {
    return JSON.parse(jsonString);
  } catch {
    return {};
  }
}

export function stringifyMultilingualText(data: { en?: string; ru?: string; uz?: string }): string {
  return JSON.stringify(data);
}
```

## Switching Back to PostgreSQL

When ready to move to production or use PostgreSQL:

1. **Update Prisma Schema**:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }

   // Convert String fields back to enums
   enum UserRole {
     USER
     AGENT
     ADMIN
   }

   // Convert String to Json
   title         Json
   description   Json
   features      Json?

   // Convert Float to Decimal with precision
   price         Decimal @db.Decimal(12, 2)
   ```

2. **Update Environment**:
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/real_estate_platform?schema=public
   ```

3. **Create New Migration**:
   ```bash
   npx prisma migrate dev --name switch_to_postgresql
   ```

4. **Start PostgreSQL**:
   ```bash
   docker-compose -f infra/docker-compose.dev.yml up -d postgres
   ```

## Limitations of SQLite

Be aware of these SQLite limitations for temporary usage:

1. **No Native Enums**: Must validate at application layer
2. **No Native JSON Type**: Use String and parse/stringify
3. **Limited Concurrency**: Single-writer database (fine for development)
4. **No ALTER TABLE Support**: Some schema changes require recreation
5. **Case Sensitivity**: Different from PostgreSQL in some cases
6. **No Full-Text Search**: Limited search capabilities compared to PostgreSQL

## Benefits for Development

- ✅ No Docker required
- ✅ Faster setup
- ✅ Single file database (easy to backup/reset)
- ✅ Built into Node.js ecosystem
- ✅ Perfect for testing and prototyping

## Database File Location

- **Path**: `apps/api/dev.db`
- **Gitignore**: Already added to `.gitignore`
- **Migrations**: Stored in `apps/api/prisma/migrations/`

## Troubleshooting

### Database Locked Error
```bash
# Close all connections
# Stop the dev server
# Delete and recreate
rm apps/api/dev.db
npx prisma migrate dev
```

### Migration Issues
```bash
# Reset migrations (development only!)
rm -rf apps/api/prisma/migrations
rm apps/api/dev.db
npx prisma migrate dev --name init
```

### Type Errors After Schema Change
```bash
# Regenerate Prisma Client
cd apps/api
npx prisma generate
```

---

**Note**: This SQLite configuration is for temporary development usage only. For production or multi-user development, switch to PostgreSQL using the instructions above.
