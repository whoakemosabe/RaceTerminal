import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Track nickname mappings
export const trackNicknames: Record<string, string[]> = {
  'monza': ['Temple of Speed', 'Italian GP', 'MON'],
  'spa': ['Spa-Francorchamps', 'Belgian GP', 'SPA'],
  'monaco': ['Monte Carlo', 'Streets of Monaco', 'MOC'],
  'silverstone': ['Home of British Racing', 'British GP', 'SIL'],
  'albert_park': ['Melbourne', 'Australian GP', 'ALB'],
  'red_bull_ring': ['Spielberg', 'Austrian GP', 'RBR'],
  'baku': ['Azerbaijan GP', 'Streets of Baku', 'BAK'],
  'suzuka': ['Figure 8', 'Japanese GP', 'SUZ'],
  'interlagos': ['Sao Paulo', 'Brazilian GP', 'INT'],
  'yas_marina': ['Abu Dhabi', 'Yas Island', 'YAS'],
  'marina_bay': ['Singapore', 'Night Race', 'MAR'],
  'jeddah': ['Saudi Arabian GP', 'Corniche Circuit', 'JED'],
  'miami': ['Miami Gardens', 'Miami GP', 'MIA'],
  'las_vegas': ['Strip Circuit', 'Vegas GP', 'LAS'],
  'losail': ['Qatar GP', 'Losail Circuit', 'LOS'],
  'shanghai': ['Chinese GP', 'SHA'],
  'hungaroring': ['Budapest', 'Hungarian GP', 'HUN'],
  'zandvoort': ['Dutch GP', 'ZAN'],
  'rodriguez': ['Mexico City', 'Mexican GP', 'ROD'],
  'imola': ['Emilia Romagna', 'San Marino', 'IMO'],
  'catalunya': ['Barcelona', 'Spanish GP', 'CAT'],
  'ricard': ['Paul Ricard', 'French GP', 'RIC']
};

// Find track ID from search term
export function findTrackId(search: string): string | null {
  search = search.toLowerCase().trim();
  
  // Direct match with track ID
  if (trackNicknames[search]) {
    return search;
  }
  
  // Search through nicknames
  for (const [trackId, nicknames] of Object.entries(trackNicknames)) {
    // Check exact matches first
    if (nicknames.some(nick => nick.toLowerCase() === search) || 
        trackId.replace('_', '').toLowerCase() === search) {
      return trackId;
    }
    
    // Then check partial matches
    if (nicknames.some(nick => nick.toLowerCase().includes(search)) || 
        trackId.replace('_', '').toLowerCase().includes(search)) {
      return trackId;
    }
  }
  
  return null;
}

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
  search = search.trim();
  
  // Direct match with driver ID
  if (driverNicknames[search]) {
    return search;
  }
  
  // Search through nicknames and normalize search
  for (const [driverId, nicknames] of Object.entries(driverNicknames)) {
    // Check exact matches first
    if (nicknames.some(nick => nick.toLowerCase() === search) || 
        driverId.replace('_', '').toLowerCase() === search) {
      return driverId;
    }
    
    // Then check partial matches
    if (nicknames.some(nick => nick.toLowerCase().includes(search)) || 
        driverId.replace('_', '').toLowerCase().includes(search)) {
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

export function calculateCountdown(raceDate: Date): string {
  const now = new Date();
  const diff = raceDate.getTime() - now.getTime();
  
  if (diff < 0) return 'Race completed';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${days}d ${hours}h ${minutes}m`;
}

export function formatDriverComparison(data: any): string {
  const { driver1, driver2 } = data;
  const stats1 = calculateDriverStats(driver1);
  const stats2 = calculateDriverStats(driver2);
  
  return `Head-to-Head Comparison:\n` +
         `${driver1.driverName}:\n` +
         `  Wins: ${stats1.wins}\n` +
         `  Podiums: ${stats1.podiums}\n` +
         `  Points: ${stats1.points}\n\n` +
         `${driver2.driverName}:\n` +
         `  Wins: ${stats2.wins}\n` +
         `  Podiums: ${stats2.podiums}\n` +
         `  Points: ${stats2.points}`;
}

function calculateDriverStats(data: any) {
  const results = data.Races || [];
  return {
    wins: results.filter((r: any) => r.position === '1').length,
    podiums: results.filter((r: any) => parseInt(r.position) <= 3).length,
    points: results.reduce((acc: number, r: any) => acc + parseInt(r.points || '0'), 0)
  };
}