'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ListingForm from '@/components/ListingForm';
import { getListing } from '@/lib/api/listings';
import { Listing } from '@real-estate/shared';
import { useTranslations } from 'next-intl';

export default function EditListingPage() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const t = useTranslations('listings');

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (isAuthenticated && id) {
      fetchListing();
    }
  }, [isAuthenticated, authLoading, id]);

  async function fetchListing() {
    try {
      const data = await getListing(id);

      // Check ownership
      if (data.ownerId !== user?.id) {
        setError('You do not have permission to edit this listing');
        return;
      }

      setListing(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load listing');
    } finally {
      setLoading(false);
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div>Listing not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('editListing')}</h1>
      <ListingForm
        listing={listing}
        onSuccess={() => router.push(`/listings/${id}`)}
      />
    </div>
  );
}
