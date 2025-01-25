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
  'sargeant': '2'
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
    // Check if either driver is a historic driver
    const isHistoric1 = Object.keys(driverNicknames).includes(driver1?.driverId);
    const isHistoric2 = Object.keys(driverNicknames).includes(driver2?.driverId);
    
    if (isHistoric1 || isHistoric2) {
      return `Note: One or both drivers are historic champions. Full comparison data is limited for drivers from different eras.`;
    } else {
      return 'Error: Could not fetch comparison data for one or both drivers';
    }
  }

  // Get driver info from first race result that has driver data
  const driver1Info = driver1.Races.find((race: any) => race.Driver)?.Driver;
  const driver2Info = driver2.Races.find((race: any) => race.Driver)?.Driver;
  
  // Handle historic drivers that might not have recent race data
  if (!driver1Info || !driver2Info) {
    const historic1 = driverNicknames[driver1.driverId]?.[0];
    const historic2 = driverNicknames[driver2.driverId]?.[0];
    if (historic1 || historic2) {
      return `Note: One or both drivers (${historic1 || driver1.driverId}, ${historic2 || driver2.driverId}) are historic champions. Full comparison data is limited for drivers from different eras.`;
    }
  }

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