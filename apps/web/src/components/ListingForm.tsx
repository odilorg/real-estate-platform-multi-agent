'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyType, DealType, Listing, CreateListingDto, UpdateListingDto } from '@real-estate/shared';
import { createListing, updateListing } from '@/lib/api/listings';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Select } from './ui/Select';
import { Textarea } from './ui/Textarea';
import { useTranslations } from 'next-intl';

interface ListingFormProps {
  listing?: Listing;
  onSuccess?: (listing: Listing) => void;
}

type LanguageTab = 'en' | 'ru' | 'uz';

export default function ListingForm({ listing, onSuccess }: ListingFormProps) {
  const t = useTranslations('listings');
  const router = useRouter();
  const isEdit = !!listing;

  const [activeTab, setActiveTab] = useState<LanguageTab>('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    propertyType: listing?.propertyType || PropertyType.APARTMENT,
    dealType: listing?.dealType || DealType.SALE,
    title: {
      en: listing?.title?.en || '',
      ru: listing?.title?.ru || '',
      uz: listing?.title?.uz || '',
    },
    description: {
      en: listing?.description?.en || '',
      ru: listing?.description?.ru || '',
      uz: listing?.description?.uz || '',
    },
    city: listing?.city || '',
    district: listing?.district || '',
    address: listing?.address || '',
    price: listing?.price || 0,
    currency: listing?.currency || 'UZS',
    area: listing?.area || undefined,
    rooms: listing?.rooms || undefined,
    bedrooms: listing?.bedrooms || undefined,
    bathrooms: listing?.bathrooms || undefined,
    floor: listing?.floor || undefined,
    totalFloors: listing?.totalFloors || undefined,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title.en && !formData.title.ru && !formData.title.uz) {
        throw new Error('Title is required in at least one language');
      }
      if (!formData.description.en && !formData.description.ru && !formData.description.uz) {
        throw new Error('Description is required in at least one language');
      }
      if (!formData.city) {
        throw new Error('City is required');
      }
      if (formData.price <= 0) {
        throw new Error('Price must be greater than 0');
      }

      const payload: CreateListingDto | UpdateListingDto = {
        propertyType: formData.propertyType,
        dealType: formData.dealType,
        title: formData.title,
        description: formData.description,
        city: formData.city,
        district: formData.district || undefined,
        address: formData.address || undefined,
        price: formData.price,
        currency: formData.currency,
        area: formData.area || undefined,
        rooms: formData.rooms || undefined,
        bedrooms: formData.bedrooms || undefined,
        bathrooms: formData.bathrooms || undefined,
        floor: formData.floor || undefined,
        totalFloors: formData.totalFloors || undefined,
      };

      let result: Listing;
      if (isEdit) {
        result = await updateListing(listing.id, payload);
      } else {
        result = await createListing(payload as CreateListingDto);
      }

      if (onSuccess) {
        onSuccess(result);
      } else {
        router.push(`/listings/${result.id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Property Type and Deal Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="propertyType">{t('propertyType')} *</Label>
          <Select
            id="propertyType"
            value={formData.propertyType}
            onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as PropertyType })}
            required
          >
            <option value={PropertyType.APARTMENT}>{t('enums.propertyType.APARTMENT')}</option>
            <option value={PropertyType.HOUSE}>{t('enums.propertyType.HOUSE')}</option>
            <option value={PropertyType.TOWNHOUSE}>{t('enums.propertyType.TOWNHOUSE')}</option>
            <option value={PropertyType.COMMERCIAL}>{t('enums.propertyType.COMMERCIAL')}</option>
            <option value={PropertyType.LAND}>{t('enums.propertyType.LAND')}</option>
            <option value={PropertyType.GARAGE}>{t('enums.propertyType.GARAGE')}</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="dealType">{t('dealType')} *</Label>
          <Select
            id="dealType"
            value={formData.dealType}
            onChange={(e) => setFormData({ ...formData, dealType: e.target.value as DealType })}
            required
          >
            <option value={DealType.SALE}>{t('enums.dealType.SALE')}</option>
            <option value={DealType.RENT}>{t('enums.dealType.RENT')}</option>
            <option value={DealType.DAILY_RENT}>{t('enums.dealType.DAILY_RENT')}</option>
          </Select>
        </div>
      </div>

      {/* Language Tabs for Title and Description */}
      <div className="border rounded-lg p-4">
        <div className="flex space-x-2 mb-4 border-b">
          {(['en', 'ru', 'uz'] as LanguageTab[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveTab(lang)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === lang
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor={`title-${activeTab}`}>{t('title')} ({activeTab.toUpperCase()}) *</Label>
            <Input
              id={`title-${activeTab}`}
              value={formData.title[activeTab]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: { ...formData.title, [activeTab]: e.target.value },
                })
              }
              placeholder={t('titlePlaceholder')}
            />
          </div>

          <div>
            <Label htmlFor={`description-${activeTab}`}>{t('description')} ({activeTab.toUpperCase()}) *</Label>
            <Textarea
              id={`description-${activeTab}`}
              value={formData.description[activeTab]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: { ...formData.description, [activeTab]: e.target.value },
                })
              }
              placeholder={t('descriptionPlaceholder')}
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t('location')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">{t('city')} *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="district">{t('district')}</Label>
            <Input
              id="district"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="address">{t('address')}</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
      </div>

      {/* Price */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="price">{t('price')} *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
        <div>
          <Label htmlFor="currency">{t('currency')}</Label>
          <Input
            id="currency"
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
          />
        </div>
      </div>

      {/* Property Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t('propertyDetails')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="area">{t('area')}</Label>
            <Input
              id="area"
              type="number"
              min="0"
              step="0.1"
              value={formData.area || ''}
              onChange={(e) => setFormData({ ...formData, area: parseFloat(e.target.value) || undefined })}
            />
          </div>
          <div>
            <Label htmlFor="rooms">{t('rooms')}</Label>
            <Input
              id="rooms"
              type="number"
              min="0"
              value={formData.rooms || ''}
              onChange={(e) => setFormData({ ...formData, rooms: parseInt(e.target.value) || undefined })}
            />
          </div>
          <div>
            <Label htmlFor="bedrooms">{t('bedrooms')}</Label>
            <Input
              id="bedrooms"
              type="number"
              min="0"
              value={formData.bedrooms || ''}
              onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || undefined })}
            />
          </div>
          <div>
            <Label htmlFor="bathrooms">{t('bathrooms')}</Label>
            <Input
              id="bathrooms"
              type="number"
              min="0"
              value={formData.bathrooms || ''}
              onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || undefined })}
            />
          </div>
          <div>
            <Label htmlFor="floor">{t('floor')}</Label>
            <Input
              id="floor"
              type="number"
              min="0"
              value={formData.floor || ''}
              onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) || undefined })}
            />
          </div>
          <div>
            <Label htmlFor="totalFloors">{t('totalFloors')}</Label>
            <Input
              id="totalFloors"
              type="number"
              min="0"
              value={formData.totalFloors || ''}
              onChange={(e) => setFormData({ ...formData, totalFloors: parseInt(e.target.value) || undefined })}
            />
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? t('saving') : isEdit ? t('updateListing') : t('createListing')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          {t('cancel')}
        </Button>
      </div>
    </form>
  );
}
