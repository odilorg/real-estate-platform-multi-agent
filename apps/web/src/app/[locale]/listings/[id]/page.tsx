'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import * as listingsApi from '@/lib/api/listings';
import type { Listing } from '@real-estate/shared';
import Link from 'next/link';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const { user } = useAuth();
  const locale = params.locale as 'en' | 'ru' | 'uz';
  const listingId = params.id as string;
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadListing();
  }, [listingId]);

  const loadListing = async () => {
    try {
      setIsLoading(true);
      const response = await listingsApi.getListing(listingId);
      if (response.success && response.data) {
        setListing(response.data.listing);
      } else {
        setError(response.error || 'Listing not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load listing');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t('listings.confirmDelete'))) return;
    
    try {
      await listingsApi.deleteListing(listingId);
      alert(t('listings.deleteSuccess'));
      router.push(`/${locale}/my-listings`);
    } catch (err: any) {
      alert(err.message || 'Failed to delete listing');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const title = listing.title[locale] || listing.title.ru || listing.title.en || '';
  const description = listing.description[locale] || listing.description.ru || listing.description.en || '';
  const isOwner = user && user.id === listing.ownerId;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}/listings`} className="text-primary-600 hover:underline mb-4 inline-block">
          ← {t('listings.backToListings')}
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {listing.images && listing.images.length > 0 && (
            <div className="relative h-96 bg-gray-200">
              <img
                src={listing.images[0].url}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                <p className="text-gray-600">{listing.city}{listing.district && `, ${listing.district}`}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary-600">{listing.price} {listing.currency}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  {t(`enums.dealType.${listing.dealType}`)}
                </span>
              </div>
            </div>

            {isOwner && (
              <div className="flex gap-2 mb-6">
                <Link href={`/${locale}/listings/${listing.id}/edit`}>
                  <Button variant="primary" size="sm">{t('listings.edit')}</Button>
                </Link>
                <Button variant="danger" size="sm" onClick={handleDelete}>{t('listings.delete')}</Button>
              </div>
            )}

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">{t('listings.description')}</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {listing.area && (
                <div>
                  <p className="text-sm text-gray-600">{t('listings.area')}</p>
                  <p className="text-lg font-semibold">{listing.area} {t('listings.sqm')}</p>
                </div>
              )}
              {listing.rooms && (
                <div>
                  <p className="text-sm text-gray-600">{t('listings.rooms')}</p>
                  <p className="text-lg font-semibold">{listing.rooms}</p>
                </div>
              )}
              {listing.floor && (
                <div>
                  <p className="text-sm text-gray-600">{t('listings.floor')}</p>
                  <p className="text-lg font-semibold">{listing.floor}/{listing.totalFloors}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">{t('listings.propertyType')}</p>
                <p className="text-lg font-semibold">{t(`enums.propertyType.${listing.propertyType}`)}</p>
              </div>
            </div>

            {listing.owner && (
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold mb-4">{t('listings.ownerContact')}</h2>
                <p className="text-gray-700">{listing.owner.firstName} {listing.owner.lastName}</p>
                <p className="text-gray-700">{listing.owner.phone}</p>
                <p className="text-gray-700">{listing.owner.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
