/**
 * Enum definitions for the application
 *
 * Note: These are TypeScript enums that map to string values in the SQLite database.
 * The database stores these as plain strings, and validation happens at the application layer.
 *
 * This file re-exports all enums from their respective type files for convenience.
 */

// Re-export user enums from auth.types
export { UserRole, UserStatus } from './auth.types';

// Re-export listing enums from listing.types
export { PropertyType, DealType, ListingStatus } from './listing.types';
