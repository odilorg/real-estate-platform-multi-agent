/**
 * API Version
 */
export const API_VERSION = 'v1';

/**
 * Placeholder constants for future use
 */

// Default pagination values
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

// Currency codes
export const CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
  RUB: 'RUB',
} as const;

// User roles
export const USER_ROLES = {
  USER: 'USER',
  AGENT: 'AGENT',
  ADMIN: 'ADMIN',
} as const;

// Listing statuses
export const LISTING_STATUS = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ARCHIVED: 'ARCHIVED',
} as const;

// Property types
export const PROPERTY_TYPES = {
  APARTMENT: 'APARTMENT',
  HOUSE: 'HOUSE',
  COMMERCIAL: 'COMMERCIAL',
  LAND: 'LAND',
} as const;

// Deal types
export const DEAL_TYPES = {
  SALE: 'SALE',
  RENT: 'RENT',
} as const;
