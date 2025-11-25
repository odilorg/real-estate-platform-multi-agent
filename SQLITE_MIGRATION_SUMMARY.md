# SQLite Migration Summary

## Date: 2025-11-24

## Overview
Successfully migrated the Real Estate Platform from PostgreSQL to SQLite for temporary development usage.

## Changes Made

### 1. Prisma Schema (`apps/api/prisma/schema.prisma`)

**Changed:**
- Provider: `postgresql` → `sqlite`
- Removed PostgreSQL-specific decorators (`@db.Decimal(12, 2)`)
- Converted all enums to String fields (SQLite limitation)
- Converted Json fields to String fields (SQLite limitation)
- Converted Decimal to Float

**Enum Conversions:**
```prisma
# Before (PostgreSQL)
enum UserRole {
  USER
  AGENT
  ADMIN
}
role UserRole @default(USER)

# After (SQLite)
role String @default("USER") // USER, AGENT, ADMIN
```

**JSON Field Conversions:**
```prisma
# Before (PostgreSQL)
title Json
description Json
features Json?

# After (SQLite)
title String // JSON: {"en": "...", "ru": "...", "uz": "..."}
description String // JSON: {"en": "...", "ru": "...", "uz": "..."}
features String? // JSON: ["feature1", "feature2", ...]
```

**Price Field Conversion:**
```prisma
# Before (PostgreSQL)
price Decimal @db.Decimal(12, 2)

# After (SQLite)
price Float
```

### 2. Environment Variables

**apps/api/.env:**
```env
DATABASE_URL=file:./prisma/dev.db
```

**apps/api/.env.example:**
```env
DATABASE_URL=file:./prisma/dev.db
```

### 3. Shared Package Types

**Created:** `packages/shared/src/types/enums.ts`
- Centralized enum definitions that were previously exported by Prisma
- Re-exports enums from `auth.types.ts` and `listing.types.ts`

**Enums Defined:**
- `UserRole`: USER, AGENT, ADMIN
- `UserStatus`: ACTIVE, SUSPENDED, PENDING_VERIFICATION
- `PropertyType`: APARTMENT, HOUSE, TOWNHOUSE, COMMERCIAL, LAND, GARAGE
- `DealType`: SALE, RENT, DAILY_RENT
- `ListingStatus`: DRAFT, PENDING, ACTIVE, SOLD, RENTED, ARCHIVED, REJECTED

**Updated:** `packages/shared/src/types/index.ts`
- Added `export * from './enums';`

### 4. API Code Updates

**Updated imports from `@prisma/client` to `@real-estate/shared`:**
- `apps/api/src/auth/decorators/roles.decorator.ts`
- `apps/api/src/auth/guards/roles.guard.ts`
- `apps/api/src/listings/dtos/create-listing.dto.ts`
- `apps/api/src/listings/dtos/query-listing.dto.ts`
- `apps/api/src/listings/dtos/update-status.dto.ts`
- `apps/api/src/listings/guards/listing-ownership.guard.ts`

### 5. Database Migration

**Removed:**
- Old PostgreSQL migrations:
  - `20251123235850_init_users_and_auth/`
  - `20251124003648_add_listings_phase3/`

**Created:**
- New SQLite migration: `20251124022213_init_sqlite/`

**Database File:**
- Location: `apps/api/prisma/dev.db`
- Size: 148 KB
- Tables: users, refresh_tokens, listings, listing_images, favorites

### 6. Documentation

**Created:**
- `SQLITE_USAGE.md` - Comprehensive guide for SQLite usage
- `SQLITE_MIGRATION_SUMMARY.md` - This file

## Build Status

✅ **SUCCESSFUL**

```bash
npm run build --workspace=apps/api
# Build completed without errors
```

## Testing Checklist

- [x] Prisma schema validates
- [x] Migration created successfully
- [x] Prisma Client generated
- [x] TypeScript compilation successful
- [x] Database file created
- [x] Enum types properly exported from shared package
- [ ] API server starts (not tested yet)
- [ ] Auth endpoints work (not tested yet)
- [ ] Listing endpoints work (not tested yet)

## How to Use

### Start Development

```bash
# No Docker needed!
cd /c/real-estate-platform-multi-agent

# Build
npm run build --workspace=apps/api

# Start API
npm run dev:api

# Start Web (in another terminal)
npm run dev:web
```

### View Database

```bash
# Using Prisma Studio
cd apps/api
npx prisma studio

# Database will open at http://localhost:5555
```

### Reset Database

```bash
cd apps/api

# Delete database
rm prisma/dev.db

# Recreate with migrations
npx prisma migrate dev
```

## Important Notes

### Application Layer Validation Required

Since SQLite doesn't support native enums, validation must happen in the application layer:

1. **DTOs use `@IsEnum()` decorator** - Ensures only valid enum values are accepted
2. **TypeScript enums provide type safety** - Compile-time checking
3. **Database stores as strings** - Runtime values are plain strings

### JSON Field Handling

JSON fields are stored as strings in SQLite:

```typescript
// When saving
const titleJson = JSON.stringify({ en: "Title", ru: "Название", uz: "Sarlavha" });
await prisma.listing.create({
  data: {
    title: titleJson,
    // ...
  }
});

// When reading
const listing = await prisma.listing.findUnique({ where: { id } });
const titleObj = JSON.parse(listing.title);
console.log(titleObj.en); // "Title"
```

### Type Compatibility

The shared package types (in `listing.types.ts`) define:
- `title: MultilingualText` (object)
- `price: number`

But the database stores:
- `title: string` (JSON string)
- `price: number` (Float)

The service layer will need to handle serialization/deserialization.

## Known Limitations

1. **No native enums** - Application layer validation required
2. **No native JSON type** - Must parse/stringify manually
3. **Single-writer database** - Fine for development, not for production
4. **Case sensitivity differences** - May differ from PostgreSQL
5. **Limited ALTER TABLE support** - Some schema changes need recreation

## Switching Back to PostgreSQL

When ready for production:

1. Update `schema.prisma` provider to `postgresql`
2. Convert String enum fields back to proper enums
3. Convert String JSON fields back to Json type
4. Update DATABASE_URL to PostgreSQL connection string
5. Create new migration: `npx prisma migrate dev --name switch_to_postgresql`

See `SQLITE_USAGE.md` for detailed instructions.

## Files Modified

**Configuration:**
- `apps/api/prisma/schema.prisma`
- `apps/api/.env`
- `apps/api/.env.example`

**Shared Package:**
- `packages/shared/src/types/enums.ts` (created)
- `packages/shared/src/types/index.ts`

**API Source:**
- `apps/api/src/auth/decorators/roles.decorator.ts`
- `apps/api/src/auth/guards/roles.guard.ts`
- `apps/api/src/listings/dtos/create-listing.dto.ts`
- `apps/api/src/listings/dtos/query-listing.dto.ts`
- `apps/api/src/listings/dtos/update-status.dto.ts`
- `apps/api/src/listings/guards/listing-ownership.guard.ts`

**Documentation:**
- `SQLITE_USAGE.md` (created)
- `SQLITE_MIGRATION_SUMMARY.md` (created)

## Next Steps

1. Start the API server: `npm run dev:api`
2. Test authentication endpoints
3. Test listing CRUD operations
4. Implement backend Phase 3 service/controller code
5. Build frontend for listings

## Conclusion

✅ Successfully migrated to SQLite for temporary development usage
✅ All TypeScript compilation errors resolved
✅ Database schema created with proper tables
✅ Type safety maintained through shared package enums
✅ Build passes successfully
✅ Ready for development and testing

---

**Migration completed by:** Claude Code
**Date:** 2025-11-24
**Status:** COMPLETE AND READY FOR USE
