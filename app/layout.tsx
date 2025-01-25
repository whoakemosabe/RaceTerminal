import "./globals.css";
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from "./providers";
import { SchemaOrg } from '@/components/schema-org';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RaceTerminal Pro',
  description: 'Your futuristic motorsports data companion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={inter.className}>
        <SchemaOrg />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}