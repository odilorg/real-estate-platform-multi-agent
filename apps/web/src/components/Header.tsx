'use client';

/**
 * Header component with navigation, auth status, and language switcher
 */

import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { Button } from './ui/Button';

export function Header() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const t = useTranslations();
  const params = useParams();
  const pathname = usePathname();
  const currentLocale = params.locale as string;

  const locales = [
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Русский' },
    { code: 'uz', name: "O'zbekcha" },
  ];

  const getLocalizedPath = (locale: string) => {
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '');
    return `/${locale}${pathWithoutLocale || ''}`;
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href={`/${currentLocale}`} className="flex items-center">
              <span className="text-xl font-bold text-primary-600">
                {t('common.appName')}
              </span>
            </Link>
          </div>

          {/* Navigation and Auth */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative">
              <select
                value={currentLocale}
                onChange={(e) => {
                  const newLocale = e.target.value;
                  window.location.href = getLocalizedPath(newLocale);
                }}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {locales.map((locale) => (
                  <option key={locale.code} value={locale.code}>
                    {locale.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Auth Buttons */}
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 hidden sm:inline">
                      {user?.firstName || user?.email}
                    </span>
                    <Link href={`/${currentLocale}/profile`}>
                      <Button variant="ghost" size="sm">
                        {t('auth.profile')}
                      </Button>
                    </Link>
                    <Button variant="secondary" size="sm" onClick={handleLogout}>
                      {t('auth.logout')}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href={`/${currentLocale}/auth/login`}>
                      <Button variant="ghost" size="sm">
                        {t('auth.login')}
                      </Button>
                    </Link>
                    <Link href={`/${currentLocale}/auth/signup`}>
                      <Button variant="primary" size="sm">
                        {t('auth.signup')}
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
