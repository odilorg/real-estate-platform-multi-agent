'use client';

/**
 * Listing Card component for displaying listing previews
 */

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { Listing } from '@real-estate/shared';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const params = useParams();
  const t = useTranslations();
  const locale = params.locale as 'en' | 'ru' | 'uz';

  const title = listing.title[locale] || listing.title.ru || listing.title.en || '';
  const description = listing.description[locale] || listing.description.ru || listing.description.en || '';
  
  const imageUrl = listing.images && listing.images.length > 0 
    ? listing.images[0].thumbnailUrl || listing.images[0].url 
    : '/placeholder-property.jpg';

  const formatPrice = (price: number, currency: string, dealType: string) => {
    const formattedPrice = new Intl.NumberFormat(locale, {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

    let suffix = '';
    if (dealType === 'RENT') {
      suffix = ` ${t('listings.perMonth')}`;
    } else if (dealType === 'DAILY_RENT') {
      suffix = ` ${t('listings.perDay')}`;
    }

    return `${formattedPrice} ${currency}${suffix}`;
  };

  return (
    <Link href={`/${locale}/listings/${listing.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        <div className="relative h-48 bg-gray-200">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-property.jpg';
            }}
          />
          <div className="absolute top-2 right-2">
            <span className="bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
              {t(`enums.dealType.${listing.dealType}`)}
            </span>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>

          <p className="text-sm text-gray-600 mb-2">
            {listing.city}
            {listing.district && `, ${listing.district}`}
          </p>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
            {description}
          </p>

          <div className="flex flex-wrap gap-3 text-sm text-gray-700 mb-3">
            {listing.area && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                {listing.area} {t('listings.sqm')}
              </span>
            )}
            {listing.rooms && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {listing.rooms} {t('listings.rooms')}
              </span>
            )}
            {listing.floor && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {listing.floor}/{listing.totalFloors}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="text-sm text-gray-600">
              {t(`enums.propertyType.${listing.propertyType}`)}
            </span>
            <span className="text-lg font-bold text-primary-600">
              {formatPrice(listing.price, listing.currency, listing.dealType)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
