'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ListingCard } from '@/components/ListingCard';
import { Button } from '@/components/ui/Button';
import * as listingsApi from '@/lib/api/listings';
import type { Listing } from '@real-estate/shared';

export default function ListingsPage() {
  const t = useTranslations();
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const response = await listingsApi.getListings({ status: 'ACTIVE', limit: 12 });
      if (response.success && response.data) {
        setListings(response.data.listings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('listings.title')}</h1>
        
        {isLoading && <div className="text-center py-12"><p>{t('common.loading')}</p></div>}
        
        {!isLoading && listings.length === 0 && (
          <div className="text-center py-12"><p>{t('listings.noListings')}</p></div>
        )}
        
        {!isLoading && listings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
