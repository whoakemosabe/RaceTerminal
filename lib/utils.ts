import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Common icons used throughout the application
export const icons = {
  car: '🏎️',
  flag: '🏁',
  activity: '📊',
  calendar: '📅',
  trophy: '🏆',
  clock: '⏱️',
  mapPin: '📍',
  tool: '🔧'
};

// Track nickname mappings
export const trackNicknames: Record<string, string[]> = {
  'monza': ['Temple of Speed', 'Italian GP', 'MON', 'Autodromo Nazionale Monza', 'Royal Park'],
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
  
  // Special case for Monza variations
  if (['autodromo', 'nazionale', 'royal park', 'temple'].some(term => search.includes(term))) {
    return 'monza';
  }
  
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
  
  if (!driver1?.Races || !driver2?.Races) {
    return 'Error: Could not fetch comparison data for one or both drivers';
  }

  // Get driver info from first race result that has driver data
  const driver1Info = driver1.Races.find((race: any) => race.Driver)?.Driver;
  const driver2Info = driver2.Races.find((race: any) => race.Driver)?.Driver;

  if (!driver1Info || !driver2Info) {
    return 'Error: Could not fetch driver information';
  }

  const driver1Name = `${driver1Info.givenName} ${driver1Info.familyName}`;
  const driver2Name = `${driver2Info.givenName} ${driver2Info.familyName}`;
  const driver1Nationality = driver1Info.nationality;
  const driver2Nationality = driver2Info.nationality;
  
  const stats1 = calculateDriverStats(driver1.Races);
  const stats2 = calculateDriverStats(driver2.Races);
  
  const flag1 = getFlagUrl(driver1Nationality);
  const flag2 = getFlagUrl(driver2Nationality);
  
  const flagImg1 = flag1 ? `<img src="${flag1}" alt="${driver1Nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:16px;">` : '';
  const flagImg2 = flag2 ? `<img src="${flag2}" alt="${driver2Nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:16px;">` : '';
  
  const maxNameLength = Math.max(driver1Name.length, driver2Name.length);
  const padding = 5; // Extra padding for visual spacing
  const sideWidth = maxNameLength + padding;
  const separator = '\n' + '─'.repeat(sideWidth) + ' VS ' + '─'.repeat(sideWidth) + '\n';
  
  const formatSide = (text: string, align: 'left' | 'right' = 'left') => {
    const spaces = ' '.repeat(sideWidth - text.length);
    return align === 'left' ? text + spaces : spaces + text;
  };
  
  return [
    '👤 DRIVER HEAD-TO-HEAD COMPARISON',
    separator,
    `${flagImg1} ${formatSide(driver1Name)}     ${flagImg2} ${formatSide(driver2Name)}`,
    `🏆 ${formatSide(`Wins: ${stats1.wins}`)}     🏆 ${formatSide(`Wins: ${stats2.wins}`)}`,
    `🥇 ${formatSide(`Podiums: ${stats1.podiums}`)}     🥇 ${formatSide(`Podiums: ${stats2.podiums}`)}`,
    `📊 ${formatSide(`Points: ${stats1.points}`)}     📊 ${formatSide(`Points: ${stats2.points}`)}`,
    `🔥 ${formatSide(`Best: P${stats1.bestFinish}`)}     🔥 ${formatSide(`Best: P${stats2.bestFinish}`)}`,
    `⚡ ${formatSide(`Fast Laps: ${stats1.fastestLaps}`)}     ⚡ ${formatSide(`Fast Laps: ${stats2.fastestLaps}`)}`,
    separator.replace('VS', '🏁')
  ].join('\n');
}

function calculateDriverStats(results: any[]) {
  return {
    wins: results.filter((r: any) => r.position === "1" || r.position === 1).length,
    podiums: results.filter((r: any) => {
      const pos = parseInt(r.position);
      return !isNaN(pos) && pos <= 3;
    }).length,
    points: results.reduce((acc: number, r: any) => acc + parseInt(r.points || '0'), 0),
    bestFinish: Math.min(...results.map((r: any) => {
      const pos = parseInt(r.position);
      return !isNaN(pos) ? pos : Infinity;
    })),
    fastestLaps: results.filter((r: any) => r.FastestLap?.rank === "1").length
  };
}

// Team nickname mappings
export const teamNicknames: Record<string, string[]> = {
  'red_bull': ['Red Bull', 'RBR', 'redbull'],
  'mercedes': ['Mercedes', 'Merc', 'mercs'],
  'ferrari': ['Ferrari', 'Scuderia', 'SF'],
  'mclaren': ['McLaren', 'MCL', 'papaya'],
  'aston_martin': ['Aston Martin', 'AMR', 'aston'],
  'alpine': ['Alpine', 'ALP', 'renault'],
  'williams': ['Williams', 'WIL', 'grove'],
  'alphatauri': ['AlphaTauri', 'AT', 'tauri'],
  'alfa': ['Alfa Romeo', 'ALF', 'sauber'],
  'haas': ['Haas F1 Team', 'HAS', 'haas']
};

export function findTeamId(search: string): string | null {
  search = search.toLowerCase().trim();
  
  // Direct match with team ID
  if (teamNicknames[search]) {
    return search;
  }
  
  // Search through nicknames
  for (const [teamId, nicknames] of Object.entries(teamNicknames)) {
    if (nicknames.some(nick => nick.toLowerCase() === search) || 
        teamId.replace('_', '').toLowerCase() === search) {
      return teamId;
    }
  }
  
  return null;
}

export function formatTeamComparison(data: any): string {
  const { team1, team2 } = data;
  
  if (!team1?.Races || !team2?.Races || team1.Races.length === 0 || team2.Races.length === 0) {
    return 'Error: Could not fetch comparison data for one or both teams';
  }

  const team1Name = team1.constructorId ? 
    teamNicknames[team1.constructorId]?.[0] || team1.Races[0]?.Constructor?.name || 'Unknown Team' :
    team1.Races[0]?.Constructor?.name || 'Unknown Team';

  const team2Name = team2.constructorId ? 
    teamNicknames[team2.constructorId]?.[0] || team2.Races[0]?.Constructor?.name || 'Unknown Team' :
    team2.Races[0]?.Constructor?.name || 'Unknown Team';
  
  const stats1 = calculateTeamStats(team1.Races);
  const stats2 = calculateTeamStats(team2.Races);
  
  const team1Nationality = team1.Races[0]?.Constructor?.nationality;
  const team2Nationality = team2.Races[0]?.Constructor?.nationality;
  
  const flag1 = getFlagUrl(team1Nationality);
  const flag2 = getFlagUrl(team2Nationality);
  
  const flagImg1 = flag1 ? `<img src="${flag1}" alt="${team1Nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:16px;">` : '';
  const flagImg2 = flag2 ? `<img src="${flag2}" alt="${team2Nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:16px;">` : '';
  
  const separator = '\n' + '─'.repeat(40) + ' VS ' + '─'.repeat(40) + '\n';
  
  const coloredTeam1 = `<span style="color: ${getTeamColor(team1Name)}">${team1Name}</span>`;
  const coloredTeam2 = `<span style="color: ${getTeamColor(team2Name)}">${team2Name}</span>`;
  
  return [
    '🏎️ CONSTRUCTOR HEAD-TO-HEAD COMPARISON',
    separator,
    `${flagImg1} ${coloredTeam1}${' '.repeat(Math.max(0, 40 - team1Name.length))}     ${flagImg2} ${coloredTeam2}`,
    `🏆 Wins: ${stats1.wins}${' '.repeat(Math.max(0, 33 - stats1.wins.toString().length))}     🏆 Wins: ${stats2.wins}`,
    `🥇 Podiums: ${stats1.podiums}${' '.repeat(Math.max(0, 30 - stats1.podiums.toString().length))}     🥇 Podiums: ${stats2.podiums}`,
    `📊 Points: ${stats1.points}${' '.repeat(Math.max(0, 31 - stats1.points.toString().length))}     📊 Points: ${stats2.points}`,
    `🔥 Best: P${stats1.bestFinish}${' '.repeat(Math.max(0, 32 - stats1.bestFinish.toString().length))}     🔥 Best: P${stats2.bestFinish}`,
    `⚡ Fast Laps: ${stats1.fastestLaps}${' '.repeat(Math.max(0, 27 - stats1.fastestLaps.toString().length))}     ⚡ Fast Laps: ${stats2.fastestLaps}`,
    separator.replace('VS', '🏁')
  ].join('\n');
}

function calculateTeamStats(results: any[]) {
  return {
    wins: results.filter((r: any) => r.position === "1").length,
    podiums: results.filter((r: any) => parseInt(r.position) <= 3).length,
    points: results.reduce((acc: number, r: any) => acc + parseInt(r.points || '0'), 0),
    bestFinish: Math.min(...results.map((r: any) => parseInt(r.position))),
    fastestLaps: results.filter((r: any) => r.FastestLap?.rank === "1").length
  };
}