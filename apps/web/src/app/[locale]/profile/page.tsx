'use client';

/**
 * Profile page - Protected route
 */

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ApiClientError } from '@/lib/api-client';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, updateProfile, logout } = useAuth();
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/' + locale + '/auth/login');
    }
  }, [isAuthenticated, isLoading, router, locale]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setSuccessMessage(null);
    setIsUpdating(true);

    try {
      await updateProfile(formData);
      setSuccessMessage(t('auth.updateSuccess'));
    } catch (error) {
      if (error instanceof ApiClientError) {
        if (error.statusCode >= 500) {
          setGeneralError(t('auth.errors.serverError'));
        } else {
          setGeneralError(error.message);
        }
      } else {
        setGeneralError(t('auth.errors.networkError'));
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setSuccessMessage(null);
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {t('auth.profileTitle')}
            </h1>

            {generalError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{generalError}</p>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">{successMessage}</p>
              </div>
            )}

            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {t('auth.email')}
                  </p>
                  <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <p className="mt-1 text-sm text-gray-900">{user?.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="mt-1 text-sm text-gray-900">{user?.status}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  label={t('auth.firstName')}
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                />

                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  label={t('auth.lastName')}
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                />

                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  label={t('auth.phone')}
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                />
              </div>

              <div className="flex justify-between items-center pt-4">
                <Button
                  type="button"
                  variant="danger"
                  onClick={handleLogout}
                >
                  {t('auth.logout')}
                </Button>
                <Button
                  type="submit"
                  isLoading={isUpdating}
                  disabled={isUpdating}
                >
                  {t('auth.updateButton')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
