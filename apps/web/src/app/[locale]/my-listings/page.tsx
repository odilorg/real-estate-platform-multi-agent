'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getListings, deleteListing } from '@/lib/api/listings';
import { Listing } from '@real-estate/shared';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function MyListingsPage() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const t = useTranslations('listings');

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (isAuthenticated && user) {
      fetchMyListings();
    }
  }, [isAuthenticated, authLoading, user]);

  async function fetchMyListings() {
    try {
      const response = await getListings({ ownerId: user!.id });
      setListings(response.data);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t('confirmDelete'))) return;

    try {
      await deleteListing(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      alert('Failed to delete listing');
    }
  }

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('myListings')}</h1>
        <Button asChild>
          <Link href="/listings/new">{t('createListing')}</Link>
        </Button>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4 text-lg">{t('noListings')}</p>
          <Button asChild>
            <Link href="/listings/new">{t('createFirstListing')}</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => {
            const title = listing.title?.en || listing.title?.ru || listing.title?.uz || 'Untitled';

            return (
              <div
                key={listing.id}
                className="border rounded-lg p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        listing.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : listing.status === 'DRAFT'
                          ? 'bg-gray-100 text-gray-700'
                          : listing.status === 'SOLD' || listing.status === 'RENTED'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {t(`enums.listingStatus.${listing.status}`)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-semibold text-gray-900">
                      {listing.price} {listing.currency}
                    </p>
                    <p>
                      {listing.city}
                      {listing.district && `, ${listing.district}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t('views')}: {listing.viewCount} | {t('created')}: {new Date(listing.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/listings/${listing.id}`}>{t('view')}</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/listings/${listing.id}/edit`}>{t('edit')}</Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(listing.id)}
                  >
                    {t('delete')}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
