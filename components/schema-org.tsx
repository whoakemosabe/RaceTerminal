'use client'

import { useEffect, useState } from 'react';

interface SchemaOrgProps {
  raceData?: any;
}

export function SchemaOrg({ raceData }: SchemaOrgProps) {
  const [mounted, setMounted] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://racestats.pro';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const applicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'RaceStats Pro',
    'applicationCategory': 'SportsApplication',
    'operatingSystem': 'Web',
    'description': 'A futuristic motorsports data companion providing real-time Formula 1 statistics and race information',
    'url': baseUrl,
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'author': {
      '@type': 'Organization',
      'name': 'RaceStats Pro',
      'url': baseUrl
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '5',
      'ratingCount': '1',
      'bestRating': '5',
      'worstRating': '1'
    }
  };

  const raceSchema = raceData ? {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    'name': raceData.raceName,
    'startDate': raceData.date,
    'location': {
      '@type': 'Place',
      'name': raceData.Circuit?.circuitName,
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': raceData.Circuit?.Location?.country
      }
    },
    'sport': 'Formula 1 Racing',
    'competitor': {
      '@type': 'SportsOrganization',
      'name': 'Formula 1 Teams'
    }
  } : null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([applicationSchema, ...(raceSchema ? [raceSchema] : [])])
      }}
    />
  );
}