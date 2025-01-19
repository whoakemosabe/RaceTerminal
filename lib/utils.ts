import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const countryToCode: Record<string, string> = {
  'British': 'GB',
  'Dutch': 'NL',
  'Spanish': 'ES',
  'Mexican': 'MX',
  'Monegasque': 'MC',
  'Finnish': 'FI',
  'Australian': 'AU',
  'German': 'DE',
  'French': 'FR',
  'Canadian': 'CA',
  'Japanese': 'JP',
  'Thai': 'TH',
  'Danish': 'DK',
  'Italian': 'IT',
  'Chinese': 'CN',
  'American': 'US',
  'Brazilian': 'BR',
  'Austrian': 'AT',
  'Belgian': 'BE',
  'Swiss': 'CH',
  'Polish': 'PL',
  'Russian': 'RU',
  'New Zealander': 'NZ',
  // Add circuit countries
  'Abu Dhabi': 'AE',
  'Australia': 'AU',
  'Austria': 'AT',
  'Azerbaijan': 'AZ',
  'Bahrain': 'BH',
  'Belgium': 'BE',
  'Brazil': 'BR',
  'Canada': 'CA',
  'China': 'CN',
  'France': 'FR',
  'Germany': 'DE',
  'Hungary': 'HU',
  'Italy': 'IT',
  'Japan': 'JP',
  'Mexico': 'MX',
  'Monaco': 'MC',
  'Netherlands': 'NL',
  'Portugal': 'PT',
  'Qatar': 'QA',
  'Saudi Arabia': 'SA',
  'Singapore': 'SG',
  'Spain': 'ES',
  'Turkey': 'TR',
  'United Arab Emirates': 'AE',
  'United States': 'US',
  'United Kingdom': 'GB',
  'Vietnam': 'VN'
};

// Driver nickname mappings
export const driverNicknames: Record<string, string[]> = {
  'hamilton': ['King Lewis', 'HAM', 'The Hammer'],
  'max_verstappen': ['Mad Max', 'Super Max', 'VER'],
  'leclerc': ['Sharl', 'LEC', 'The Monégasque'],
  'perez': ['Checo', 'PER', 'Mexican Minister of Defense'],
  'russell': ['Mr. Saturday', 'RUS', 'George'],
  'norris': ['Lando', 'NOR', 'Last Lap Lando'],
  'sainz': ['Smooth Operator', 'SAI', 'Carlos'],
  'alonso': ['El Plan', 'ALO', 'Magic Alonso'],
  'stroll': ['Lance', 'STR', 'Mr. Fashion'],
  'ocon': ['Esteban', 'OCO', 'The Resistance'],
  'gasly': ['Pierre', 'GAS', 'El Gasly'],
  'albon': ['Alex', 'ALB', 'Mr. Nice Guy'],
  'bottas': ['Val', 'BOT', 'To whom it may concern'],
  'tsunoda': ['Yuki', 'TSU', 'Radio Yuki'],
  'zhou': ['Guanyu', 'ZHO', 'Joe'],
  'magnussen': ['K-Mag', 'MAG', 'Viking'],
  'hulkenberg': ['Hulk', 'HUL', 'The Hulk'],
  'ricciardo': ['Danny Ric', 'RIC', 'Honey Badger'],
  'piastri': ['Oscar', 'PIA', 'The Rookie'],
  'sargeant': ['Logan', 'SAR', 'The American']
};

export function getDriverNicknames(driverId: string): string[] {
  return driverNicknames[driverId.toLowerCase()] || [];
}

// Reverse lookup map for finding driver IDs
export function findDriverId(search: string): string | null {
  search = search.toLowerCase();
  
  // Direct match with driver ID
  if (driverNicknames[search]) {
    return search;
  }
  
  // Search through nicknames
  for (const [driverId, nicknames] of Object.entries(driverNicknames)) {
    if (nicknames.some(nick => nick.toLowerCase() === search)) {
      return driverId;
    }
  }
  
  return null;
}

const teamColors: Record<string, string> = {
  'Mercedes': '#00D2BE',
  'Red Bull': '#0600EF',
  'Ferrari': '#DC0000',
  'McLaren': '#FF8700',
  'Aston Martin': '#006F62',
  'Alpine': '#0090FF',
  'AlphaTauri': '#2B4562',
  'Alfa Romeo': '#900000',
  'Haas F1 Team': '#FFFFFF',
  'Williams': '#005AFF',
};

export function getTeamColor(team: string): string {
  return teamColors[team] || '#666666';
}

export function getFlagUrl(nationality: string): string {
  const countryCode = countryToCode[nationality];
  if (!countryCode) return '';
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
}

export function formatDriver(text: string, nationality: string): string {
  if (!text || !nationality) return 'Unknown Driver';
  const flagUrl = getFlagUrl(nationality);
  const flag = flagUrl ? ` <img src="${flagUrl}" alt="${nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:16px;">` : '';
  return `${text || 'Unknown'} [${nationality}${flag}]`;
}

export function formatCircuit(name: string, country: string): string {
  if (!name || !country) return 'Unknown Circuit';
  const flagUrl = getFlagUrl(country);
  const flag = flagUrl ? ` <img src="${flagUrl}" alt="${country} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:16px;">` : '';
  return `${name || 'Unknown Circuit'} [${country}${flag}]`;
}

export function formatWithTeamColor(text: string, team: string): string {
  const color = getTeamColor(team);
  return `${text} (${team})`;
}

export function formatTime(time: string): string {
  return time;
}

export function formatLapTime(time: string): string {
  return time;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}