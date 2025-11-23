import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Uzbekistan Real Estate Platform',
  description: 'Find your perfect property in Uzbekistan',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
