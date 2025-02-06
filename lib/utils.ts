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

// Track details mapping
interface TrackDetails {
  length: number;
  turns: number;
  lapRecord?: {
    time: string;
    driver: string;
    year: number;
  };
}

const trackDetails: Record<string, TrackDetails> = {
  'monza': { length: 5.793, turns: 11, lapRecord: { time: '1:21.046', driver: 'Rubens Barrichello', year: 2004 } },
  'spa': { length: 7.004, turns: 19, lapRecord: { time: '1:46.286', driver: 'Valtteri Bottas', year: 2018 } },
  'monaco': { length: 3.337, turns: 19, lapRecord: { time: '1:12.909', driver: 'Lewis Hamilton', year: 2021 } },
  'silverstone': { length: 5.891, turns: 18, lapRecord: { time: '1:27.097', driver: 'Max Verstappen', year: 2020 } },
  'albert_park': { length: 5.278, turns: 14, lapRecord: { time: '1:20.235', driver: 'Charles Leclerc', year: 2022 } },
  'red_bull_ring': { length: 4.318, turns: 10, lapRecord: { time: '1:05.619', driver: 'Carlos Sainz', year: 2020 } },
  'baku': { length: 6.003, turns: 20, lapRecord: { time: '1:43.009', driver: 'Charles Leclerc', year: 2019 } },
  'suzuka': { length: 5.807, turns: 18, lapRecord: { time: '1:30.983', driver: 'Lewis Hamilton', year: 2019 } },
  'interlagos': { length: 4.309, turns: 15, lapRecord: { time: '1:10.540', driver: 'Valtteri Bottas', year: 2018 } },
  'yas_marina': { length: 5.281, turns: 16, lapRecord: { time: '1:26.103', driver: 'Max Verstappen', year: 2021 } },
  'marina_bay': { length: 4.940, turns: 19, lapRecord: { time: '1:41.905', driver: 'Kevin Magnussen', year: 2018 } },
  'jeddah': { length: 6.174, turns: 27, lapRecord: { time: '1:30.734', driver: 'Lewis Hamilton', year: 2021 } },
  'miami': { length: 5.412, turns: 19, lapRecord: { time: '1:29.708', driver: 'Max Verstappen', year: 2023 } },
  'las_vegas': { length: 6.201, turns: 17, lapRecord: { time: '1:35.490', driver: 'Oscar Piastri', year: 2023 } },
  'losail': { length: 5.419, turns: 16, lapRecord: { time: '1:24.319', driver: 'Max Verstappen', year: 2023 } },
  'shanghai': { length: 5.451, turns: 16, lapRecord: { time: '1:32.238', driver: 'Michael Schumacher', year: 2004 } },
  'hungaroring': { length: 4.381, turns: 14, lapRecord: { time: '1:16.627', driver: 'Lewis Hamilton', year: 2020 } },
  'zandvoort': { length: 4.259, turns: 14, lapRecord: { time: '1:11.097', driver: 'Lewis Hamilton', year: 2021 } },
  'rodriguez': { length: 4.304, turns: 17, lapRecord: { time: '1:17.774', driver: 'Valtteri Bottas', year: 2021 } },
  'imola': { length: 4.909, turns: 19, lapRecord: { time: '1:15.484', driver: 'Lewis Hamilton', year: 2020 } },
  'catalunya': { length: 4.675, turns: 16, lapRecord: { time: '1:18.149', driver: 'Max Verstappen', year: 2021 } },
  'ricard': { length: 5.842, turns: 15, lapRecord: { time: '1:32.740', driver: 'Sebastian Vettel', year: 2019 } }
};

export function getTrackDetails(trackId: string): TrackDetails {
  return trackDetails[trackId] || { length: 0, turns: 0 };
}

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
  // Current Drivers
  'hamilton': ['Lewis Hamilton', 'King Lewis', 'HAM', 'The Hammer', 'lewis', '44'],
  'max_verstappen': ['Max Verstappen', 'Mad Max', 'Super Max', 'VER', 'max', 'verstappen', '1'],
  'leclerc': ['Charles Leclerc', 'Sharl', 'LEC', 'The Monégasque', 'charles', '16'],
  'perez': ['Sergio Perez', 'Checo', 'PER', 'Mexican Minister of Defense', 'sergio', '11'],
  'russell': ['George Russell', 'Mr. Saturday', 'RUS', 'George', '63'],
  'norris': ['Lando Norris', 'NOR', 'Last Lap Lando', 'lando', '4'],
  'sainz': ['Carlos Sainz', 'Smooth Operator', 'SAI', 'Carlos', '55'],
  'alonso': ['Fernando Alonso', 'El Plan', 'ALO', 'Magic Alonso', 'fernando', '14'],
  'stroll': ['Lance Stroll', 'STR', 'Mr. Fashion', 'lance', '18'],
  'ocon': ['Esteban Ocon', 'OCO', 'The Resistance', 'esteban', '31'],
  'gasly': ['Pierre Gasly', 'GAS', 'El Gasly', 'pierre', '10'],
  'albon': ['Alexander Albon', 'Alex', 'ALB', 'Mr. Nice Guy', '23'],
  'bottas': ['Valtteri Bottas', 'Val', 'BOT', 'To whom it may concern', 'valtteri', '77'],
  'tsunoda': ['Yuki Tsunoda', 'TSU', 'Radio Yuki', 'yuki', '22'],
  'zhou': ['Zhou Guanyu', 'ZHO', 'Joe', 'guanyu', '24'],
  'magnussen': ['Kevin Magnussen', 'K-Mag', 'MAG', 'Viking', 'kevin', '20'],
  'hulkenberg': ['Nico Hulkenberg', 'Hulk', 'HUL', 'The Hulk', 'nico', '27'],
  'ricciardo': ['Daniel Ricciardo', 'Danny Ric', 'RIC', 'Honey Badger', 'daniel', '3'],
  'piastri': ['Oscar Piastri', 'PIA', 'The Rookie', 'oscar', '81'],
  'sargeant': ['Logan Sargeant', 'SAR', 'The American', 'logan', '2'],
  // Legendary Champions
  'senna': ['Ayrton Senna', 'SEN', 'Magic', 'The Master of Monaco', 'The Rain Master', 'ayrton'],
  'prost': ['Alain Prost', 'PRO', 'The Professor', 'Le Professeur', 'alain'],
  'michael_schumacher': ['Michael Schumacher', 'MSC', 'Schumi', 'The Red Baron', 'michael'],
  'fangio': ['juan_manuel_fangio', 'Juan Manuel Fangio', 'FAN', 'El Maestro', 'The Maestro'],
  'clark': ['Jim Clark', 'CLA', 'The Flying Scotsman'],
  'lauda': ['Niki Lauda', 'LAU', 'The Rat', 'King Rat'],
  'stewart': ['Jackie Stewart', 'STE', 'Flying Scot', 'JYS'],
  'hill_g': ['Graham Hill', 'HIL', 'Mr. Monaco'],
  'hill_d': ['Damon Hill', 'HIL', 'The Son of Mr. Monaco'],
  'mansell': ['Nigel Mansell', 'MAN', 'Il Leone', 'Red 5'],
  'piquet': ['Nelson Piquet', 'PIQ', 'The Brazilian'],
  'brabham': ['Jack Brabham', 'BRA', 'Black Jack'],
  'fittipaldi': ['Emerson Fittipaldi', 'FIT', 'Emmo'],
  'ascari': ['Alberto Ascari', 'ASC', 'The Milan Monza'],
  'hakkinen': ['Mika Hakkinen', 'HAK', 'The Flying Finn'],
  'raikkonen': ['Kimi Raikkonen', 'RAI', 'Iceman', 'The Ice Man'],
  'button': ['Jenson Button', 'BUT', 'JB', 'The Smooth Operator'],
  'rosberg_k': ['Keke Rosberg', 'ROS', 'The Original Flying Finn'],
  'rosberg_n': ['Nico Rosberg', 'ROS', 'Britney'],
  'vettel': ['Sebastian Vettel', 'VET', 'Baby Schumi', 'The Finger'],
  // Notable Drivers
  'moss': ['Stirling Moss', 'MOS', 'Mr Motor Racing'],
  'rindt': ['Jochen Rindt', 'RIN', 'The First Posthumous Champion'],
  'peterson': ['Ronnie Peterson', 'PET', 'SuperSwede'],
  'villeneuve_g': ['Gilles Villeneuve', 'VIL', 'The Artist'],
  'villeneuve_j': ['Jacques Villeneuve', 'VIL', 'JV'],
  'andretti': ['Mario Andretti', 'AND', 'The American Champion'],
  'hunt': ['James Hunt', 'HUN', 'Hunt the Shunt'],
  'cevert': ['François Cevert', 'CEV', 'The French Prince'],
  'regazzoni': ['Clay Regazzoni', 'REG', 'Clay'],
  'ickx': ['Jacky Ickx', 'ICK', 'Monsieur Le Mans'],
  'gurney': ['Dan Gurney', 'GUR', 'The Big Eagle'],
  'brooks': ['Tony Brooks', 'BRO', 'The Racing Dentist'],
  'collins': ['Peter Collins', 'COL', 'The Boy Wonder'],
  'hawthorne': ['Mike Hawthorn', 'HAW', 'Le Papillon'],
  'massa': ['Felipe Massa', 'MAS', 'The Little Brazilian']
};

// Driver number mapping
export const driverNumbers: Record<string, string> = {
  // Current Drivers
  'hamilton': '44',
  'max_verstappen': '1',
  'leclerc': '16',
  'perez': '11',
  'russell': '63',
  'norris': '4',
  'sainz': '55',
  'alonso': '14',
  'stroll': '18',
  'ocon': '31',
  'gasly': '10',
  'albon': '23',
  'bottas': '77',
  'tsunoda': '22',
  'zhou': '24',
  'magnussen': '20',
  'hulkenberg': '27',
  'ricciardo': '3',
  'piastri': '81',
  'sargeant': '2',
  // Historic Champions
  'senna': '12',
  'prost': '1',
  'michael_schumacher': '1',
  'fangio': '1',
  'clark': '1',
  'lauda': '1',
  'stewart': '1',
  'hill_g': '5',
  'hill_d': '0',
  'mansell': '5',
  'piquet': '1',
  'brabham': '1',
  'fittipaldi': '1',
  'ascari': '1',
  'hakkinen': '1',
  'raikkonen': '7',
  'button': '22',
  'rosberg_k': '6',
  'rosberg_n': '6',
  'vettel': '5'
};

export function getDriverNicknames(driverId: string): string[] {
  return driverNicknames[driverId.toLowerCase()] || [];
}

// Reverse lookup map for finding driver IDs
export function findDriverId(search: string): string | null {
  search = search.toLowerCase();
  search = search.trim();

  // Handle special cases for common search terms
  if (search === 'schumi' || search === 'schumacher') {
    return 'michael_schumacher';
  }
  
  // Direct match with driver ID
  if (driverNicknames[search]) {
    return search;
  }
  
  // Search through nicknames
  for (const [driverId, nicknames] of Object.entries(driverNicknames)) {
    // Check exact matches first
    const exactMatch = nicknames.some(nick => 
      nick.toLowerCase() === search || 
      nick.toLowerCase().replace(/[^a-z0-9]/g, '') === search.replace(/[^a-z0-9]/g, '')
    );
    
    if (exactMatch) {
      return driverId;
    }
    
    // Then check partial matches
    const partialMatch = nicknames.some(nick => 
      nick.toLowerCase().includes(search) ||
      nick.toLowerCase().replace(/[^a-z0-9]/g, '').includes(search.replace(/[^a-z0-9]/g, ''))
    );
    
    if (partialMatch) {
      return driverId;
    }
  }
  
  return null;
}

const teamColors: Record<string, string> = {
  'Mercedes': '#00D2BE',
  'Red Bull': '#0600EF',
  'Red Bull Racing': '#0600EF',
  'Ferrari': '#DC0000',
  'Scuderia Ferrari': '#DC0000',
  'McLaren': '#FF8700',
  'McLaren F1 Team': '#FF8700',
  'Aston Martin': '#006F62',
  'Aston Martin F1 Team': '#006F62',
  'Alpine': '#0090FF',
  'Alpine F1 Team': '#0090FF',
  'AlphaTauri': '#2B4562',
  'Scuderia AlphaTauri': '#2B4562',
  'Alfa Romeo': '#900000',
  'Alfa Romeo F1 Team': '#900000',
  'Haas F1 Team': '#FFFFFF',
  'Williams': '#005AFF',
  'Williams Racing': '#005AFF'
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
  return `${text} [${nationality}${flag}]`;
}

export function formatCircuit(name: string, country: string): string {
  if (!name || !country) return 'Unknown Circuit';
  const flagUrl = getFlagUrl(country);
  const flag = flagUrl ? ` <img src="${flagUrl}" alt="${country} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:16px;">` : '';
  return `${name || 'Unknown Circuit'} [${country}${flag}]`;
}

export function formatWithTeamColor(text: string, team: string): string {
  const color = getTeamColor(team);
  return `${text} <span style="color: ${color}">${team}</span>`;
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
  
  if (!driver1?.Races || !driver2?.Races || driver1.Races.length === 0 || driver2.Races.length === 0) {
    return '❌ Error: Could not fetch career comparison data for one or both drivers';
  }

  // Get driver info from first race result that has driver data
  const driver1Info = driver1.Races[0]?.Results?.[0]?.Driver;
  const driver2Info = driver2.Races[0]?.Results?.[0]?.Driver;
  
  if (!driver1Info || !driver2Info) {
    return '❌ Error: Could not fetch driver information';
  }

  const driver1Name = `${driver1Info.givenName} ${driver1Info.familyName}`;
  const driver2Name = `${driver2Info.givenName} ${driver2Info.familyName}`;
  const driver1Nationality = driver1Info.nationality;
  const driver2Nationality = driver2Info.nationality;
  
  const stats1 = calculateDriverStats(driver1.Races);
  const stats2 = calculateDriverStats(driver2.Races);
  
  const totalRaces1 = driver1.totalRaces || 0;
  const totalRaces2 = driver2.totalRaces || 0;
  const poles1 = driver1.poles || 0;
  const poles2 = driver2.poles || 0;
  const fastestLaps1 = driver1.fastestLaps || 0;
  const fastestLaps2 = driver2.fastestLaps || 0;
  
  const flag1 = getFlagUrl(driver1Nationality);
  const flag2 = getFlagUrl(driver2Nationality);
  
  const flagImg1 = flag1 ? `<img src="${flag1}" alt="${driver1Nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:16px;">` : '';
  const flagImg2 = flag2 ? `<img src="${flag2}" alt="${driver2Nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:16px;">` : '';
  
  const maxNameLength = Math.max(driver1Name.length, driver2Name.length);
  const padding = 5;
  const sideWidth = maxNameLength + padding;
  const separator = '\n' + '═'.repeat(sideWidth) + ' 🏁 CAREER STATS 🏁 ' + '═'.repeat(sideWidth) + '\n';
  
  return [
    '🏆 DRIVER HEAD-TO-HEAD COMPARISON 🏆',
    separator,
    `${flagImg1} ${driver1Name}${' '.repeat(Math.max(0, sideWidth - driver1Name.length))}     ${flagImg2} ${driver2Name}`,
    `👑 Championships: ${driver1.championships}${' '.repeat(Math.max(0, sideWidth - driver1.championships.toString().length - 15))}     👑 Championships: ${driver2.championships}`,
    `🏎️ Races: ${totalRaces1}${' '.repeat(Math.max(0, sideWidth - totalRaces1.toString().length - 8))}     🏎️ Races: ${totalRaces2}`,
    `🏆 Race Wins: ${stats1.wins}${' '.repeat(Math.max(0, sideWidth - stats1.wins.toString().length - 12))}     🏆 Race Wins: ${stats2.wins}`,
    `🥇 Podiums: ${stats1.podiums}${' '.repeat(Math.max(0, sideWidth - stats1.podiums.toString().length - 10))}     🥇 Podiums: ${stats2.podiums}`,
    `🎯 Pole Positions: ${poles1}${' '.repeat(Math.max(0, sideWidth - poles1.toString().length - 16))}     🎯 Pole Positions: ${poles2}`,
    `⚡ Fastest Laps: ${fastestLaps1}${' '.repeat(Math.max(0, sideWidth - fastestLaps1.toString().length - 15))}     ⚡ Fastest Laps: ${fastestLaps2}`,
    `💫 Points: ${stats1.points}${' '.repeat(Math.max(0, sideWidth - stats1.points.toString().length - 9))}     💫 Points: ${stats2.points}`,
    `🔥 Best Finish: P${stats1.bestFinish}${' '.repeat(Math.max(0, sideWidth - stats1.bestFinish.toString().length - 14))}     🔥 Best Finish: P${stats2.bestFinish}`,
    `🌟 Points/Race: ${(stats1.points / totalRaces1).toFixed(1)}${' '.repeat(Math.max(0, sideWidth - (stats1.points / totalRaces1).toFixed(1).length - 14))}     🌟 Points/Race: ${(stats2.points / totalRaces2).toFixed(1)}`,
    `🌟 Win Rate: ${((stats1.wins / totalRaces1) * 100).toFixed(1)}%${' '.repeat(Math.max(0, sideWidth - ((stats1.wins / totalRaces1) * 100).toFixed(1).length - 11))}     🌟 Win Rate: ${((stats2.wins / totalRaces2) * 100).toFixed(1)}%`,
    `🎯 Podium Rate: ${((stats1.podiums / totalRaces1) * 100).toFixed(1)}%${' '.repeat(Math.max(0, sideWidth - ((stats1.podiums / totalRaces1) * 100).toFixed(1).length - 14))}     🎯 Podium Rate: ${((stats2.podiums / totalRaces2) * 100).toFixed(1)}%`,
    `🎖️ Pole Rate: ${((poles1 / totalRaces1) * 100).toFixed(1)}%${' '.repeat(Math.max(0, sideWidth - ((poles1 / totalRaces1) * 100).toFixed(1).length - 12))}     🎖️ Pole Rate: ${((poles2 / totalRaces2) * 100).toFixed(1)}%`,
    separator
  ].join('\n');
}

function calculateTeamStats(results: any[]) {
  // Filter out invalid results
  const validResults = results.filter(r => r.Results?.[0]);
  
  return {
    wins: validResults.filter((r: any) => r.Results?.[0]?.position === "1").length,
    podiums: validResults.filter((r: any) => {
      const pos = parseInt(r.Results?.[0]?.position);
      return !isNaN(pos) && pos <= 3;
    }).length,
    points: validResults.reduce((acc: number, r: any) => {
      const points = parseFloat(r.Results?.[0]?.points || '0');
      return acc + (isNaN(points) ? 0 : points);
    }, 0),
    bestFinish: Math.min(...validResults.map((r: any) => {
      const pos = parseInt(r.Results?.[0]?.position);
      return !isNaN(pos) ? pos : Infinity;
    })),
    fastestLaps: validResults.filter((r: any) => 
      r.Results?.[0]?.FastestLap?.rank === "1"
    ).length
  };
}

function calculateDriverStats(results: any[]) {
  // Filter out races where the driver didn't participate or was disqualified
  const validResults = results.filter(race => 
    race.Results?.[0] && race.Results[0].position !== undefined
  );

  return {
    wins: validResults.filter((race: any) => 
      race.Results[0].position === "1" || race.Results[0].position === 1
    ).length,
    podiums: validResults.filter((r: any) => {
      const pos = parseInt(r.Results?.[0]?.position);
      return !isNaN(pos) && pos <= 3;
    }).length,
    points: validResults.reduce((acc: number, race: any) => {
      const points = parseFloat(race.Results[0].points || '0');
      return acc + (isNaN(points) ? 0 : points);
    }, 0
    ),
    bestFinish: Math.min(...validResults.map((r: any) => {
      const pos = parseInt(r.Results?.[0]?.position);
      return !isNaN(pos) ? pos : Infinity;
    }))
  };
}

// Team nickname mappings
export const teamNicknames: Record<string, string[]> = {
  'red_bull': ['Red Bull Racing', 'RBR', 'redbull', 'Milton Keynes, UK', '2005', '6', 'British'],
  'mercedes': ['Mercedes-AMG Petronas', 'MER', 'mercs', 'Brackley, UK', '1954', '8', 'British'],
  'ferrari': ['Scuderia Ferrari', 'FER', 'SF', 'Maranello, Italy', '1950', '16', 'Italian'],
  'mclaren': ['McLaren F1 Team', 'MCL', 'papaya', 'Woking, UK', '1966', '8', 'British'],
  'aston_martin': ['Aston Martin F1 Team', 'AMR', 'aston', 'Silverstone, UK', '2021', '0', 'British'],
  'alpine': ['Alpine F1 Team', 'ALP', 'renault', 'Enstone, UK', '1986', '2', 'French'],
  'williams': ['Williams Racing', 'WIL', 'grove', 'Grove, UK', '1977', '9', 'British'],
  'alphatauri': ['Scuderia AlphaTauri', 'ALT', 'tauri', 'Faenza, Italy', '1985', '0', 'Italian'],
  'alfa': ['Alfa Romeo F1 Team', 'ALF', 'sauber', 'Hinwil, Switzerland', '1993', '0', 'Swiss'],
  'haas': ['Haas F1 Team', 'HAS', 'haas', 'Kannapolis, USA', '2016', '0', 'American']
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
  
  if (!team1?.Races || !team2?.Races) {
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
  
  const team1Nationality = team1.Races[0]?.Constructor?.nationality || 'Unknown';
  const team2Nationality = team2.Races[0]?.Constructor?.nationality || 'Unknown';
  
  const flag1 = getFlagUrl(team1Nationality);
  const flag2 = getFlagUrl(team2Nationality);
  
  const flagImg1 = flag1 ? `<img src="${flag1}" alt="${team1Nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:16px;">` : '';
  const flagImg2 = flag2 ? `<img src="${flag2}" alt="${team2Nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:16px;">` : '';
  
  const maxNameLength = Math.max(team1Name.length, team2Name.length);
  const padding = 5;
  const sideWidth = maxNameLength + padding;
  const separator = '\n' + '═'.repeat(sideWidth) + ' 🏁 TEAM STATS 🏁 ' + '═'.repeat(sideWidth) + '\n';
  
  const coloredTeam1 = `<span style="color: ${getTeamColor(team1Name)}">${team1Name}</span>`;
  const coloredTeam2 = `<span style="color: ${getTeamColor(team2Name)}">${team2Name}</span>`;
  
  return [
    '🏎️ TEAM HEAD-TO-HEAD COMPARISON 🏎️',
    separator,
    `${flagImg1} ${coloredTeam1}${' '.repeat(Math.max(0, sideWidth - team1Name.length))}     ${flagImg2} ${coloredTeam2}`,
    `👑 Championships: ${team1.championships}${' '.repeat(Math.max(0, sideWidth - team1.championships.toString().length - 15))}     👑 Championships: ${team2.championships}`,
    `🏎️ Races: ${team1.totalRaces}${' '.repeat(Math.max(0, sideWidth - team1.totalRaces.toString().length - 8))}     🏎️ Races: ${team2.totalRaces}`,
    `🏆 Race Wins: ${stats1.wins}${' '.repeat(Math.max(0, sideWidth - stats1.wins.toString().length - 12))}     🏆 Race Wins: ${stats2.wins}`,
    `🥇 Podiums: ${stats1.podiums}${' '.repeat(Math.max(0, sideWidth - stats1.podiums.toString().length - 10))}     🥇 Podiums: ${stats2.podiums}`,
    `🎯 Pole Positions: ${team1.poles}${' '.repeat(Math.max(0, sideWidth - team1.poles.toString().length - 16))}     🎯 Pole Positions: ${team2.poles}`,
    `⚡ Fastest Laps: ${team1.fastestLaps}${' '.repeat(Math.max(0, sideWidth - team1.fastestLaps.toString().length - 15))}     ⚡ Fastest Laps: ${team2.fastestLaps}`,
    `💫 Points: ${stats1.points}${' '.repeat(Math.max(0, sideWidth - stats1.points.toString().length - 9))}     💫 Points: ${stats2.points}`,
    `🔥 Best Finish: P${stats1.bestFinish}${' '.repeat(Math.max(0, sideWidth - stats1.bestFinish.toString().length - 14))}     🔥 Best Finish: P${stats2.bestFinish}`,
    `📊 Points/Race: ${(stats1.points / team1.totalRaces).toFixed(1)}${' '.repeat(Math.max(0, sideWidth - (stats1.points / team1.totalRaces).toFixed(1).length - 14))}     📊 Points/Race: ${(stats2.points / team2.totalRaces).toFixed(1)}`,
    `🌟 Win Rate: ${((stats1.wins / team1.totalRaces) * 100).toFixed(1)}%${' '.repeat(Math.max(0, sideWidth - ((stats1.wins / team1.totalRaces) * 100).toFixed(1).length - 11))}     🌟 Win Rate: ${((stats2.wins / team2.totalRaces) * 100).toFixed(1)}%`,
    `🎯 Podium Rate: ${((stats1.podiums / team1.totalRaces) * 100).toFixed(1)}%${' '.repeat(Math.max(0, sideWidth - ((stats1.podiums / team1.totalRaces) * 100).toFixed(1).length - 14))}     🎯 Podium Rate: ${((stats2.podiums / team2.totalRaces) * 100).toFixed(1)}%`,
    `🎖️ Pole Rate: ${((team1.poles / team1.totalRaces) * 100).toFixed(1)}%${' '.repeat(Math.max(0, sideWidth - ((team1.poles / team1.totalRaces) * 100).toFixed(1).length - 12))}     🎖️ Pole Rate: ${((team2.poles / team2.totalRaces) * 100).toFixed(1)}%`,
    separator.replace('VS', '🏁')
  ].join('\n');
}