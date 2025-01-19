import "./globals.css";
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from "./providers";

const inter = Inter({ subsets: ['latin'] });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://racestats.pro';

export const metadata: Metadata = {
  title: 'RaceStats Pro',
  description: 'Your futuristic motorsports data companion',
  openGraph: {
    title: 'RaceStats Pro',
    description: 'Your futuristic motorsports data companion',
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'RaceStats Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RaceStats Pro',
    description: 'Your futuristic motorsports data companion',
    site: '@racestats',
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}