/**
 * Listings API functions for listing operations
 */

import { api } from '../api-client';
import type {
  Listing,
  ListingImage,
  CreateListingDto,
  UpdateListingDto,
  ListingQueryDto,
  ListingResponse,
  ListingsResponse,
} from '@real-estate/shared';

/**
 * Get paginated list of listings with filters
 */
export async function getListings(params?: ListingQueryDto): Promise<ListingsResponse> {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(key, v.toString()));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });
  }

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/listings?${queryString}` : '/listings';
  
  return api.get<ListingsResponse>(endpoint);
}

/**
 * Get a single listing by ID
 */
export async function getListing(id: string): Promise<ListingResponse> {
  return api.get<ListingResponse>(`/listings/${id}`);
}

/**
 * Create a new listing
 */
export async function createListing(data: CreateListingDto): Promise<ListingResponse> {
  return api.post<ListingResponse>('/listings', data);
}

/**
 * Update an existing listing
 */
export async function updateListing(id: string, data: UpdateListingDto): Promise<ListingResponse> {
  return api.patch<ListingResponse>(`/listings/${id}`, data);
}

/**
 * Delete a listing
 */
export async function deleteListing(id: string): Promise<void> {
  return api.delete<void>(`/listings/${id}`);
}

/**
 * Upload a listing image
 */
export async function uploadListingImage(
  listingId: string,
  url: string,
  order: number
): Promise<ListingImage> {
  return api.post<ListingImage>(`/listings/${listingId}/images`, { url, order });
}

/**
 * Delete a listing image
 */
export async function deleteListingImage(imageId: string): Promise<void> {
  return api.delete<void>(`/listings/images/${imageId}`);
}
