# Database Schema Reference

## Entity Relationship Diagram (Text)

```
+------------------+
|      User        |
+------------------+
| id (PK)          |
| email (unique)   |
| passwordHash     |
| firstName        |
| lastName         |
| phone            |
| role             |
| status           |
| emailVerified    |
| createdAt        |
| updatedAt        |
+------------------+
        |
        | 1:N
        |
        v
+------------------+
| RefreshToken     |
+------------------+
| id (PK)          |
| token (unique)   |
| userId (FK)      |
| expiresAt        |
| createdAt        |
+------------------+
```

## Entities

### User
**Purpose:** Store user account information and authentication credentials

**Relationships:**
- Has many RefreshTokens (one user can have multiple active sessions)

**Key Fields:**
- `id`: UUID, primary key, auto-generated
- `email`: Unique identifier for authentication, indexed
- `passwordHash`: bcrypt hashed password (never store plain text)
- `role`: USER (default), AGENT, or ADMIN - defines permissions
- `status`: ACTIVE (default), SUSPENDED, or PENDING_VERIFICATION
- `emailVerified`: Boolean flag for email verification status

**Indexes:**
- Primary key on `id`
- Unique index on `email` (fast lookup for login)
- Index on `role` (filter users by role)
- Index on `status` (filter active/suspended users)

**Use Cases:**
- User registration and login
- Role-based access control (RBAC)
- User profile management
- Email verification flow
- Account suspension/activation

---

### RefreshToken
**Purpose:** Manage JWT refresh tokens for maintaining user sessions

**Relationships:**
- Belongs to one User (userId foreign key)
- Cascade delete: when user is deleted, all tokens are deleted

**Key Fields:**
- `id`: UUID, primary key, auto-generated
- `token`: Unique refresh token string, indexed
- `userId`: Foreign key to User table
- `expiresAt`: Timestamp for token expiration
- `createdAt`: Token creation timestamp

**Indexes:**
- Primary key on `id`
- Unique index on `token` (fast token validation)
- Index on `userId` (find all tokens for a user)
- Index on `expiresAt` (efficient cleanup of expired tokens)

**Use Cases:**
- JWT refresh token validation
- Logout (delete specific token)
- Logout all devices (delete all user tokens)
- Token expiration cleanup (scheduled job)
- Session management

---

## Enums

### UserRole
**Values:** USER | AGENT | ADMIN

**Usage:**
- USER: Regular users who browse and save listings
- AGENT: Real estate agents who create and manage listings
- ADMIN: Platform administrators with full access

**Future Consideration:**
May evolve into a more complex permission system with additional roles.

---

### UserStatus
**Values:** ACTIVE | SUSPENDED | PENDING_VERIFICATION

**Usage:**
- ACTIVE: Normal, verified user (can use all features)
- SUSPENDED: Temporarily blocked (violation, investigation)
- PENDING_VERIFICATION: Newly registered, awaiting email verification

**Workflow:**
1. User registers -> PENDING_VERIFICATION
2. User verifies email -> ACTIVE
3. Admin suspends user -> SUSPENDED
4. Admin reactivates user -> ACTIVE

---

## Data Types

| Field Type | PostgreSQL Type | TypeScript Type |
|------------|----------------|-----------------|
| String     | TEXT           | string          |
| Boolean    | BOOLEAN        | boolean         |
| DateTime   | TIMESTAMP(3)   | Date            |
| UUID       | TEXT           | string          |
| Enum       | ENUM           | string literal  |

---

## Constraints

### Foreign Keys
- `refresh_tokens.userId` -> `users.id` (ON DELETE CASCADE)

### Unique Constraints
- `users.email` - No duplicate emails
- `refresh_tokens.token` - No duplicate tokens

### Default Values
- `users.role` = USER
- `users.status` = ACTIVE
- `users.emailVerified` = false
- All `createdAt` fields = current timestamp
- `users.updatedAt` = current timestamp (auto-updated)

---

## Query Patterns

### Common Queries

**Find user by email (login):**
```typescript
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
});
```

**Create user with role:**
```typescript
const user = await prisma.user.create({
  data: {
    email: 'agent@example.com',
    passwordHash: hashedPassword,
    role: 'AGENT',
    firstName: 'John',
    lastName: 'Doe'
  }
});
```

**Validate refresh token:**
```typescript
const token = await prisma.refreshToken.findUnique({
  where: { token: refreshTokenString },
  include: { user: true }
});

if (!token || token.expiresAt < new Date()) {
  // Token invalid or expired
}
```

**Get all tokens for user (logout all):**
```typescript
await prisma.refreshToken.deleteMany({
  where: { userId: userId }
});
```

**Cleanup expired tokens (scheduled job):**
```typescript
await prisma.refreshToken.deleteMany({
  where: {
    expiresAt: { lt: new Date() }
  }
});
```

**Filter users by role:**
```typescript
const agents = await prisma.user.findMany({
  where: {
    role: 'AGENT',
    status: 'ACTIVE'
  }
});
```

---

## Future Expansion (Phase 3+)

When adding listing features, this schema will be extended with:

### New Models
- **Listing**: Property listings with multilingual support
- **ListingImage**: Property photos with ordering
- **Favorite**: Many-to-many between User and Listing
- **SavedSearch**: User search preferences with filter criteria
- **Agency**: Real estate agencies (agents belong to agencies)
- **ListingPromotion**: Featured listings with start/end dates

### Geographic Features
- PostGIS extension for spatial queries
- Add `location` field as POINT type in Listing
- Spatial indexes for map-based search
- Distance calculations for proximity search

### Multilingual Support
Option 1: Multiple columns in Listing
- title_ru, title_uz, title_en
- description_ru, description_uz, description_en

Option 2: Translation table
- ListingTranslation model with locale field
- More flexible, supports unlimited languages
- Normalized database design

---

## Performance Considerations

### Indexes
All critical query patterns are covered by indexes:
- Authentication: users.email (unique)
- Authorization: users.role, users.status
- Token validation: refresh_tokens.token (unique)
- User lookup: refresh_tokens.userId
- Token cleanup: refresh_tokens.expiresAt

### Cascade Delete
- Refresh tokens are automatically deleted when user is deleted
- Maintains referential integrity
- Prevents orphaned records

### UUID vs Sequential IDs
- UUIDs provide better security (non-predictable)
- Suitable for distributed systems
- Slightly larger storage (16 bytes vs 4 bytes)
- Trade-off: security and flexibility vs performance

### Future Optimization
- Consider partitioning refresh_tokens by expiresAt
- Add composite indexes if complex queries emerge
- Monitor slow queries and add indexes as needed

---

## Maintenance

### Regular Tasks
1. **Token Cleanup**: Run daily job to delete expired tokens
2. **User Audits**: Periodically review suspended users
3. **Index Monitoring**: Check query performance and add indexes
4. **Backup**: Regular database backups

### Schema Migrations
When modifying schema:
1. Update schema.prisma
2. Run `npx prisma migrate dev --name descriptive_name`
3. Test migration on staging environment
4. Apply to production with `npx prisma migrate deploy`

---

**Document Version:** 1.0
**Last Updated:** 2025-11-23
**Schema Version:** Phase 2 - Authentication & Users
