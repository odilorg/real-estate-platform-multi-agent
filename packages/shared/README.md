# @real-estate/shared

Shared TypeScript package containing common types and constants for the real estate platform monorepo.

## Package Structure

```
packages/shared/
├── src/
│   ├── index.ts              # Main export file
│   ├── types/
│   │   └── index.ts          # Type definitions
│   └── constants/
│       └── index.ts          # Constant definitions
├── dist/                     # Build output (generated)
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

## Installation

This package is part of the monorepo workspace. Other packages can reference it using:

```json
{
  "dependencies": {
    "@real-estate/shared": "*"
  }
}
```

## Usage

```typescript
import { HealthResponse, API_VERSION, USER_ROLES } from '@real-estate/shared';

// Use types
const response: HealthResponse = {
  status: 'ok',
  timestamp: new Date().toISOString()
};

// Use constants
console.log(API_VERSION); // 'v1'
console.log(USER_ROLES.ADMIN); // 'ADMIN'
```

## Available Types

- `HealthResponse` - Health check response type
- `UserBase` - Base user entity type
- `ListingBase` - Base listing entity type
- `ApiResponse<T>` - Generic API response wrapper
- `PaginationParams` - Pagination query parameters
- `PaginatedResponse<T>` - Paginated API response

## Available Constants

- `API_VERSION` - Current API version ('v1')
- `DEFAULT_PAGE`, `DEFAULT_LIMIT`, `MAX_LIMIT` - Pagination defaults
- `CURRENCIES` - Supported currency codes
- `USER_ROLES` - User role constants
- `LISTING_STATUS` - Listing status values
- `PROPERTY_TYPES` - Property type categories
- `DEAL_TYPES` - Deal type values (SALE/RENT)

## Development

```bash
# Build the package
npm run build --workspace=packages/shared

# Watch mode for development
npm run dev --workspace=packages/shared

# Clean build output
npm run clean --workspace=packages/shared
```

## Build Output

The package compiles to CommonJS modules with:
- JavaScript files (`.js`)
- TypeScript declaration files (`.d.ts`)
- Source maps (`.js.map`, `.d.ts.map`)
- Incremental build info (`.tsbuildinfo`)
