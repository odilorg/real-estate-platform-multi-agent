'use client';

/**
 * Sign-up page
 */

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ApiClientError } from '@/lib/api-client';

export default function SignupPage() {
  const { register } = useAuth();
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = t('auth.errors.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.errors.invalidEmail');
    }

    if (!formData.password) {
      newErrors.password = t('auth.errors.required');
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.errors.passwordTooShort');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      router.push('/' + locale);
    } catch (error) {
      if (error instanceof ApiClientError) {
        if (error.statusCode === 409) {
          setGeneralError(t('auth.errors.emailExists'));
        } else if (error.statusCode >= 500) {
          setGeneralError(t('auth.errors.serverError'));
        } else {
          setGeneralError(error.message);
        }
      } else {
        setGeneralError(t('auth.errors.networkError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('auth.signupTitle')}
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {generalError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{generalError}</p>
            </div>
          )}

          <div className="space-y-4">
            <Input
              id="email"
              name="email"
              type="email"
              label={t('auth.email')}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <Input
              id="password"
              name="password"
              type="password"
              label={t('auth.password')}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <Input
              id="firstName"
              name="firstName"
              type="text"
              label={t('auth.firstName')}
              value={formData.firstName}
              onChange={handleChange}
            />

            <Input
              id="lastName"
              name="lastName"
              type="text"
              label={t('auth.lastName')}
              value={formData.lastName}
              onChange={handleChange}
            />

            <Input
              id="phone"
              name="phone"
              type="tel"
              label={t('auth.phone')}
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {t('auth.signupButton')}
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">{t('auth.hasAccount')} </span>
            <Link
              href={'/' + locale + '/auth/login'}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              {t('auth.loginLink')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
