'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { api, ApiClientError } from '@/lib/api-client';
import { useAuth } from '@/contexts/AuthContext';

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
}

export default function HomePage() {
  const t = useTranslations();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.get<HealthResponse>('/health');
        setHealth(data);
      } catch (err) {
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError('Failed to fetch health status');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary-700">
            {t('home.title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-2">
            {t('home.subtitle')}
          </p>
          <p className="text-sm md:text-base text-gray-500">
            {t('home.description')}
          </p>
        </div>

        {!authLoading && (
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border border-gray-200 mb-8">
            {isAuthenticated ? (
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {t('home.welcomeBack')}, {user?.firstName || user?.email}!
                </h2>
                <p className="text-gray-600">Role: {user?.role}</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-700">{t('home.notLoggedIn')}</p>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border border-gray-200">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800">
            {t('home.healthCheck')}
          </h2>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <span className="ml-4 text-gray-600">{t('common.loading')}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {t('common.error')}
                  </h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {health && !loading && !error && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-green-800">
                    {t('common.backendStatus')}: {t('common.healthy')}
                  </h3>
                  <div className="mt-2 text-sm text-green-700 space-y-1">
                    <p>
                      <strong>Status:</strong> {health.status}
                    </p>
                    <p>
                      <strong>Timestamp:</strong>{' '}
                      {new Date(health.timestamp).toLocaleString()}
                    </p>
                    <p>
                      <strong>Uptime:</strong> {Math.floor(health.uptime)}s
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-xs md:text-sm text-gray-500">
          <p>A modern real estate marketplace for Uzbekistan</p>
        </div>
      </div>
    </main>
  );
}
