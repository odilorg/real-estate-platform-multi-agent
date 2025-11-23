/**
 * Listing-related types for the real estate platform
 * These types match the Prisma schema and are shared across all applications
 */

// Enums
export enum PropertyType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  TOWNHOUSE = 'TOWNHOUSE',
  COMMERCIAL = 'COMMERCIAL',
  LAND = 'LAND',
  GARAGE = 'GARAGE',
}

export enum DealType {
  SALE = 'SALE',
  RENT = 'RENT',
  DAILY_RENT = 'DAILY_RENT',
}

export enum ListingStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  RENTED = 'RENTED',
  ARCHIVED = 'ARCHIVED',
  REJECTED = 'REJECTED',
}

// Multilingual text
export interface MultilingualText {
  ru: string;
  uz?: string;
  en?: string;
}

// Entities
export interface ListingImage {
  id: string;
  listingId: string;
  url: string;
  thumbnailUrl: string | null;
  caption: string | null;
  order: number;
  createdAt: string;
}

export interface Listing {
  id: string;
  ownerId: string;
  propertyType: PropertyType;
  dealType: DealType;
  status: ListingStatus;
  title: MultilingualText;
  description: MultilingualText;
  city: string;
  district: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  price: number;
  currency: string;
  area: number | null;
  rooms: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  floor: number | null;
  totalFloors: number | null;
  features: Record<string, any> | null;
  viewCount: number;
  favoriteCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  images?: ListingImage[];
  owner?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    email: string;
  };
  isFavorited?: boolean;
}

export interface Favorite {
  id: string;
  userId: string;
  listingId: string;
  createdAt: string;
  listing?: Listing;
}

// DTOs
export interface CreateListingDto {
  propertyType: PropertyType;
  dealType: DealType;
  title: MultilingualText;
  description: MultilingualText;
  city: string;
  district?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  price: number;
  currency?: string;
  area?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  totalFloors?: number;
  features?: Record<string, any>;
}

export interface UpdateListingDto {
  propertyType?: PropertyType;
  dealType?: DealType;
  title?: MultilingualText;
  description?: MultilingualText;
  city?: string;
  district?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  price?: number;
  currency?: string;
  area?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  totalFloors?: number;
  features?: Record<string, any>;
}

export interface ListingQueryDto {
  page?: number;
  limit?: number;
  city?: string;
  propertyType?: PropertyType;
  dealType?: DealType;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number[];
  minArea?: number;
  maxArea?: number;
  status?: ListingStatus;
  sortBy?: 'createdAt' | 'price' | 'area' | 'publishedAt';
  sortOrder?: 'asc' | 'desc';
}

// Responses
export interface ListingResponse {
  success: boolean;
  data?: {
    listing: Listing;
  };
  error?: string;
  message?: string;
}

export interface ListingsResponse {
  success: boolean;
  data?: {
    listings: Listing[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  error?: string;
  message?: string;
}

export interface FavoriteResponse {
  success: boolean;
  data?: {
    favorite: Favorite;
  };
  error?: string;
  message?: string;
}

export interface FavoritesResponse {
  success: boolean;
  data?: {
    favorites: Favorite[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  error?: string;
  message?: string;
}
