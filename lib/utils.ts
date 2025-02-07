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
  'bahrain': ['Bahrain International Circuit', 'Sakhir', 'BHR', 'Bahrain GP'],
  'jeddah': ['Jeddah Corniche Circuit', 'Corniche', 'JED', 'Saudi Arabian GP'],
  'albert_park': ['Albert Park Circuit', 'Melbourne', 'MEL', 'Australian GP'],
  'suzuka': ['Suzuka International Racing Course', 'Figure 8', 'SUZ', 'Japanese GP'],
  'shanghai': ['Shanghai International Circuit', 'SIC', 'SHA', 'Chinese GP'],
  'miami': ['Miami International Autodrome', 'MIA Gardens', 'MIA', 'Miami GP'],
  'imola': ['Autodromo Enzo e Dino Ferrari', 'Imola', 'IMO', 'Emilia Romagna GP'],
  'monaco': ['Circuit de Monaco', 'Monte Carlo', 'MON', 'Monaco GP'],
  'catalunya': ['Circuit de Barcelona-Catalunya', 'Montmeló', 'CAT', 'Spanish GP'],
  'red_bull_ring': ['Red Bull Ring', 'Spielberg', 'RBR', 'Austrian GP'],
  'silverstone': ['Silverstone Circuit', 'Home of British Racing', 'SIL', 'British GP'],
  'hungaroring': ['Hungaroring', 'Budapest', 'HUN', 'Hungarian GP'],
  'spa': ['Circuit de Spa-Francorchamps', 'Ardennes', 'SPA', 'Belgian GP'],
  'zandvoort': ['CM.com Circuit Zandvoort', 'Circuit Zandvoort', 'ZAN', 'Dutch GP'],
  'monza': ['Autodromo Nazionale Monza', 'Temple of Speed', 'MON', 'Italian GP'],
  'marina_bay': ['Marina Bay Street Circuit', 'Lion City', 'SIN', 'Singapore GP'],
  'rodriguez': ['Autódromo Hermanos Rodríguez', 'Mexico City', 'MEX', 'Mexican GP'],
  'interlagos': ['Autódromo José Carlos Pace', 'Interlagos', 'INT', 'Brazilian GP'],
  'las_vegas': ['Las Vegas Strip Circuit', 'The Strip', 'LAS', 'Las Vegas GP'],
  'losail': ['Losail International Circuit', 'Qatar Circuit', 'QAT', 'Qatar GP'],
  'yas_marina': ['Yas Marina Circuit', 'Yas Island', 'YAS', 'Abu Dhabi GP']
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
  'bahrain': { length: 5.412, turns: 15, lapRecord: { time: '1:31.447', driver: 'Pedro de la Rosa', year: 2005 } },
  'jeddah': { length: 6.174, turns: 27, lapRecord: { time: '1:30.734', driver: 'Lewis Hamilton', year: 2021 } },
  'albert_park': { length: 5.278, turns: 14, lapRecord: { time: '1:20.235', driver: 'Charles Leclerc', year: 2022 } },
  'suzuka': { length: 5.807, turns: 18, lapRecord: { time: '1:30.983', driver: 'Lewis Hamilton', year: 2019 } },
  'shanghai': { length: 5.451, turns: 16, lapRecord: { time: '1:32.238', driver: 'Michael Schumacher', year: 2004 } },
  'miami': { length: 5.412, turns: 19, lapRecord: { time: '1:29.708', driver: 'Max Verstappen', year: 2023 } },
  'imola': { length: 4.909, turns: 19, lapRecord: { time: '1:15.484', driver: 'Lewis Hamilton', year: 2020 } },
  'monaco': { length: 3.337, turns: 19, lapRecord: { time: '1:12.909', driver: 'Lewis Hamilton', year: 2021 } },
  'catalunya': { length: 4.675, turns: 16, lapRecord: { time: '1:18.149', driver: 'Max Verstappen', year: 2021 } },
  'red_bull_ring': { length: 4.318, turns: 10, lapRecord: { time: '1:05.619', driver: 'Carlos Sainz', year: 2020 } },
  'silverstone': { length: 5.891, turns: 18, lapRecord: { time: '1:27.097', driver: 'Max Verstappen', year: 2020 } },
  'hungaroring': { length: 4.381, turns: 14, lapRecord: { time: '1:16.627', driver: 'Lewis Hamilton', year: 2020 } },
  'spa': { length: 7.004, turns: 19, lapRecord: { time: '1:46.286', driver: 'Valtteri Bottas', year: 2018 } },
  'zandvoort': { length: 4.259, turns: 14, lapRecord: { time: '1:11.097', driver: 'Lewis Hamilton', year: 2021 } },
  'monza': { length: 5.793, turns: 11, lapRecord: { time: '1:21.046', driver: 'Rubens Barrichello', year: 2004 } },
  'marina_bay': { length: 4.940, turns: 19, lapRecord: { time: '1:41.905', driver: 'Kevin Magnussen', year: 2018 } },
  'rodriguez': { length: 4.304, turns: 17, lapRecord: { time: '1:17.774', driver: 'Valtteri Bottas', year: 2021 } },
  'interlagos': { length: 4.309, turns: 15, lapRecord: { time: '1:10.540', driver: 'Valtteri Bottas', year: 2018 } },
  'las_vegas': { length: 6.201, turns: 17, lapRecord: { time: '1:35.490', driver: 'Oscar Piastri', year: 2023 } },
  'losail': { length: 5.419, turns: 16, lapRecord: { time: '1:24.319', driver: 'Max Verstappen', year: 2023 } },
  'yas_marina': { length: 5.281, turns: 16, lapRecord: { time: '1:26.103', driver: 'Max Verstappen', year: 2021 } }
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
  // Legendary Champions
  // Current Drivers (2024 Season)
  'albon': ['Alexander Albon', 'ALB', 'Alex', 'Mr. Nice Guy', 'Thai', 'albon'],
  'alonso': ['Fernando Alonso', 'ALO', 'El Plan', 'Magic Alonso', 'Spanish', 'alonso'],
  'bearman': ['Oliver Bearman', 'BEA', 'Ollie', 'British', 'bearman'],
  'bottas': ['Valtteri Bottas', 'BOT', 'Val', 'To whom it may concern', 'Finnish', 'bottas'],
  'gasly': ['Pierre Gasly', 'GAS', 'El Gasly', 'French', 'gasly'],
  'hamilton': ['Lewis Hamilton', 'HAM', 'King Lewis', 'The Hammer', 'British', 'hamilton'],
  'hulkenberg': ['Nico Hulkenberg', 'HUL', 'Hulk', 'The Hulk', 'German', 'hulkenberg'],
  'leclerc': ['Charles Leclerc', 'LEC', 'Sharl', 'The Monégasque', 'Monegasque', 'leclerc'],
  'magnussen': ['Kevin Magnussen', 'MAG', 'K-Mag', 'Viking', 'Danish', 'magnussen'],
  'max_verstappen': ['Max Verstappen', 'VER', 'Mad Max', 'Super Max', 'Dutch', 'verstappen'],
  'norris': ['Lando Norris', 'NOR', 'Last Lap Lando', 'British', 'norris'],
  'ocon': ['Esteban Ocon', 'OCO', 'The Resistance', 'French', 'ocon'],
  'perez': ['Sergio Perez', 'PER', 'Checo', 'Mexican Minister of Defense', 'Mexican', 'perez'],
  'piastri': ['Oscar Piastri', 'PIA', 'The Rookie', 'Australian', 'piastri'],
  'ricciardo': ['Daniel Ricciardo', 'RIC', 'Danny Ric', 'Honey Badger', 'Australian', 'ricciardo'],
  'russell': ['George Russell', 'RUS', 'Mr. Saturday', 'British', 'russell'],
  'sainz': ['Carlos Sainz', 'SAI', 'Smooth Operator', 'Spanish', 'sainz'],
  'sargeant': ['Logan Sargeant', 'SAR', 'The American', 'American', 'sargeant'],
  'stroll': ['Lance Stroll', 'STR', 'Mr. Fashion', 'Canadian', 'stroll'],
  'tsunoda': ['Yuki Tsunoda', 'TSU', 'Radio Yuki', 'Japanese', 'tsunoda'],
  'zhou': ['Zhou Guanyu', 'ZHO', 'Joe', 'Chinese', 'zhou'],

  // World Champions (Retired)
  'ascari': ['Alberto Ascari', 'ASC', 'The Milan Monza', 'Italian', '1952, 1953', 'ascari'],
  'brabham': ['Jack Brabham', 'BRA', 'Black Jack', 'Australian', '1959, 1960, 1966', 'brabham'],
  'button': ['Jenson Button', 'BUT', 'JB', 'British', '2009', 'button'],
  'clark': ['Jim Clark', 'CLA', 'The Flying Scotsman', 'British', '1963, 1965', 'clark'],
  'fangio': ['Juan Manuel Fangio', 'FAN', 'El Maestro', 'Argentine', '1951, 1954-1957', 'fangio'],
  'fittipaldi': ['Emerson Fittipaldi', 'FIT', 'Emmo', 'Brazilian', '1972, 1974', 'fittipaldi'],
  'hakkinen': ['Mika Hakkinen', 'HAK', 'The Flying Finn', 'Finnish', '1998, 1999', 'hakkinen'],
  'hill_d': ['Damon Hill', 'HIL', 'The Son of Mr. Monaco', 'British', '1996', 'hill'],
  'hill_g': ['Graham Hill', 'HIL', 'Mr. Monaco', 'British', '1962, 1968', 'hill'],
  'hunt': ['James Hunt', 'HUN', 'Hunt the Shunt', 'British', '1976', 'hunt'],
  'lauda': ['Niki Lauda', 'LAU', 'The Rat', 'Austrian', '1975, 1977, 1984', 'lauda'],
  'mansell': ['Nigel Mansell', 'MAN', 'Il Leone', 'British', '1992', 'mansell'],
  'piquet': ['Nelson Piquet', 'PIQ', 'The Brazilian', 'Brazilian', '1981, 1983, 1987', 'piquet'],
  'prost': ['Alain Prost', 'PRO', 'The Professor', 'French', '1985, 1986, 1989, 1993', 'prost'],
  'raikkonen': ['Kimi Raikkonen', 'RAI', 'Iceman', 'Finnish', '2007', 'raikkonen'],
  'rindt': ['Jochen Rindt', 'RIN', 'The First Posthumous Champion', 'Austrian', '1970', 'rindt'],
  'rosberg_k': ['Keke Rosberg', 'ROS', 'The Original Flying Finn', 'Finnish', '1982', 'rosberg'],
  'rosberg_n': ['Nico Rosberg', 'ROS', 'Britney', 'German', '2016', 'rosberg'],
  'michael_schumacher': ['Michael Schumacher', 'MSC', 'Schumi', 'German', '1994, 1995, 2000-2004', 'schumacher'],
  'senna': ['Ayrton Senna', 'SEN', 'Magic', 'Brazilian', '1988, 1990, 1991', 'senna'],
  'stewart': ['Jackie Stewart', 'STE', 'Flying Scot', 'British', '1969, 1971, 1973', 'stewart'],
  'vettel': ['Sebastian Vettel', 'VET', 'Baby Schumi', 'German', '2010-2013', 'vettel'],
  'villeneuve_j': ['Jacques Villeneuve', 'VIL', 'JV', 'Canadian', '1997', 'villeneuve'],

  // Notable Drivers (Non-Champions)
  'alesi': ['Jean Alesi', 'ALE', 'The Matador', 'French', 'alesi'],
  'andretti': ['Mario Andretti', 'AND', 'The American Champion', 'American', 'andretti'],
  'barrichello': ['Rubens Barrichello', 'BAR', 'Rubinho', 'Brazilian', 'barrichello'],
  'berger': ['Gerhard Berger', 'BER', 'The Austrian', 'Austrian', 'berger'],
  'brooks': ['Tony Brooks', 'BRO', 'The Racing Dentist', 'British', 'brooks'],
  'cevert': ['François Cevert', 'CEV', 'The French Prince', 'French', 'cevert'],
  'coulthard': ['David Coulthard', 'COU', 'DC', 'British', 'coulthard'],
  'gurney': ['Dan Gurney', 'GUR', 'The Big Eagle', 'American', 'gurney'],
  'ickx': ['Jacky Ickx', 'ICK', 'Monsieur Le Mans', 'Belgian', 'ickx'],
  'massa': ['Felipe Massa', 'MAS', 'The Little Brazilian', 'Brazilian', 'massa'],
  'montoya': ['Juan Pablo Montoya', 'MON', 'JPM', 'Colombian', 'montoya'],
  'moss': ['Stirling Moss', 'MOS', 'Mr Motor Racing', 'British', 'moss'],
  'peterson': ['Ronnie Peterson', 'PET', 'SuperSwede', 'Swedish', 'peterson'],
  'regazzoni': ['Clay Regazzoni', 'REG', 'Clay', 'Swiss', 'regazzoni'],
  'reutemann': ['Carlos Reutemann', 'REU', 'Lole', 'Argentine', 'reutemann'],
  'villeneuve_g': ['Gilles Villeneuve', 'VIL', 'The Artist', 'Canadian', 'villeneuve'],
  'webber': ['Mark Webber', 'WEB', 'Aussie Grit', 'Australian', 'webber']
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
    // First try exact matches
    if (nicknames.some(nick => nick.toLowerCase() === search)) {
      return driverId;
    }
    
    // Then try exact matches with the last name
    const lastName = nicknames[0].split(' ').pop()?.toLowerCase() || '';
    if (lastName === search) {
      return driverId;
    }
    
    // Finally try partial matches with the full name or code
    if (nicknames.some(nick => 
      nick.toLowerCase().startsWith(search) || 
      (nick.length === 3 && nick === nick.toUpperCase() && nick.toLowerCase().startsWith(search))
    )) {
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

// Team themes with their corresponding colors
export const teamThemes: Record<string, { primary: string; secondary: string; accent: string; border: string }> = {
  'red_bull': {
    primary: '217 100% 50%',
    secondary: '240 100% 47%',
    accent: '217 100% 50%',
    border: '240 100% 47%'
  },
  'mercedes': {
    primary: '174 100% 41%',
    secondary: '174 100% 41%',
    accent: '174 100% 41%',
    border: '174 100% 41%'
  },
  'ferrari': {
    primary: '0 100% 43%',
    secondary: '48 100% 50%',
    accent: '0 100% 43%',
    border: '0 100% 43%'
  },
  'mclaren': {
    primary: '32 100% 50%',
    secondary: '199 100% 40%',
    accent: '32 100% 50%',
    border: '32 100% 50%'
  },
  'aston_martin': {
    primary: '170 100% 22%',
    secondary: '170 100% 35%',
    accent: '170 100% 22%',
    border: '170 100% 22%'
  },
  'alpine': {
    primary: '203 100% 50%',
    secondary: '339 85% 55%',
    accent: '203 100% 50%',
    border: '203 100% 50%'
  },
  'williams': {
    primary: '217 100% 50%',
    secondary: '217 100% 65%',
    accent: '217 100% 50%',
    border: '217 100% 50%'
  },
  'alphatauri': {
    primary: '212 39% 27%',
    secondary: '212 39% 40%',
    accent: '212 39% 27%',
    border: '212 39% 27%'
  },
  'alfa': {
    primary: '0 100% 28%',
    secondary: '0 100% 40%',
    accent: '0 100% 28%',
    border: '0 100% 28%'
  },
  'haas': {
    primary: '0 0% 100%',
    secondary: '0 0% 80%',
    accent: '0 0% 100%',
    border: '0 0% 100%'
  }
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
