import { teamColors } from '@/lib/data/team-colors';

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
    primary: '240 100% 47%',
    secondary: '240 100% 47%',
    accent: '217 100% 50%', 
    border: '240 100% 47%'
  },
  'mercedes': {
    primary: '180 2% 91%',
    secondary: '174 100% 41%',
    accent: '174 100% 41%', 
    border: '174 100% 41%'
  },
  'ferrari': {
    primary: '0 0% 100%',
    secondary: '48 100% 50%',
    accent: '0 100% 43%', 
    border: '0 100% 43%'
  },
  'mclaren': {
    primary: '0 0% 100%',
    secondary: '199 100% 40%',
    accent: '32 100% 50%', 
    border: '32 100% 50%'
  },
  'aston_martin': {
    primary: '0 0% 100%',
    secondary: '170 100% 35%',
    accent: '170 100% 22%', 
    border: '170 100% 22%'
  },
  'alpine': {
    primary: '0 0% 100%',
    secondary: '339 85% 55%',
    accent: '203 100% 50%', 
    border: '203 100% 50%'
  },
  'williams': {
    primary: '0 0% 100%',
    secondary: '217 100% 65%',
    accent: '217 100% 50%', 
    border: '217 100% 50%'
  },
  'alphatauri': {
    primary: '0 0% 100%',
    secondary: '212 39% 40%',
    accent: '212 39% 27%', 
    border: '212 39% 27%'
  },
  'alfa': {
    primary: '0 0% 100%',
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

export function getTeamColor(team: string): string {
  // Normalize team name by removing extra spaces and making case-insensitive
  const normalizedTeam = team.trim().toLowerCase();
  
  // Find matching team name
  const match = Object.entries(teamColors).find(([key]) => 
    key.toLowerCase() === normalizedTeam
  );
  
  if (match) {
    return match[1];
  }
  
  // Try partial matches
  const partialMatch = Object.entries(teamColors).find(([key]) => 
    key.toLowerCase().includes(normalizedTeam) ||
    normalizedTeam.includes(key.toLowerCase())
  );
  
  return partialMatch ? partialMatch[1] : '#666666';
}

export function findTeamId(search: string): string | null {
  search = search.toLowerCase().trim();
  
  // Handle common variations
  if (search.includes('red bull') || search === 'redbull' || search === 'rb') {
    return 'red_bull';
  }
  if (search.includes('ferrari') || search.includes('scuderia')) {
    return 'ferrari';
  }
  if (search.includes('alphatauri') || search.includes('alpha tauri')) {
    return 'alphatauri';
  }
  
  // Direct match with team ID
  if (teamNicknames[search]) {
    return search;
  }
  
  // Search through nicknames
  for (const [teamId, names] of Object.entries(teamNicknames)) {
    // Check all variations
    if (names.some(name => 
      name.toLowerCase().includes(search) || 
      name.toLowerCase().replace(/\s+/g, '').includes(search)
    )) {
      return teamId;
    }
  }
  
  return null;
}

// Team technical directors
const teamTechnicalDirectors: Record<string, string> = {
  'red_bull': 'Pierre Waché',
  'mercedes': 'James Allison',
  'ferrari': 'Enrico Cardile',
  'mclaren': 'Peter Prodromou',
  'aston_martin': 'Dan Fallows',
  'alpine': 'Matt Harman',
  'williams': 'Pat Fry',
  'alphatauri': 'Jody Egginton',
  'alfa': 'James Key',
  'haas': 'Simone Resta'
};

// Team principals
const teamPrincipals: Record<string, string> = {
  'red_bull': 'Christian Horner',
  'mercedes': 'Toto Wolff',
  'ferrari': 'Frédéric Vasseur',
  'mclaren': 'Andrea Stella',
  'aston_martin': 'Mike Krack',
  'alpine': 'Bruno Famin',
  'williams': 'James Vowles',
  'alphatauri': 'Laurent Mekies',
  'alfa': 'Alessandro Alunni Bravi',
  'haas': 'Ayao Komatsu'
};

// Team power units
const teamPowerUnits: Record<string, string> = {
  'red_bull': 'Honda RBPT',
  'mercedes': 'Mercedes-AMG F1 M15',
  'ferrari': 'Ferrari 066/12',
  'mclaren': 'Mercedes-AMG F1 M15',
  'aston_martin': 'Mercedes-AMG F1 M15',
  'alpine': 'Renault E-Tech RE24',
  'williams': 'Mercedes-AMG F1 M15',
  'alphatauri': 'Honda RBPT',
  'alfa': 'Ferrari 066/12',
  'haas': 'Ferrari 066/12'
};

// Team notable records
const teamRecords: Record<string, string[]> = {
  'red_bull': [
    'Most wins in a season: 21 (2023)',
    'Highest win percentage in a season: 95.45% (2023)',
    'Most consecutive wins: 15 (2023)',
    'Most points in a season: 860 (2023)'
  ],
  'mercedes': [
    'Most consecutive constructor championships: 8 (2014-2021)',
    'Most consecutive driver & constructor doubles: 7 (2014-2020)',
    'Most pole positions in a season: 20 (2016)',
    'Most 1-2 finishes in a season: 12 (2015)'
  ],
  'ferrari': [
    'Most constructor championships: 16',
    'Most race wins: 243',
    'Most podium finishes: 798',
    'Longest-running F1 team (since 1950)'
  ],
  'mclaren': [
    'Second most constructor championships: 8',
    'Most consecutive race wins: 11 (1988)',
    'Most 1-2 finishes in a season: 10 (1988)',
    'Second most race wins: 183'
  ],
  'aston_martin': [
    'First podium as Aston Martin: 2023 Bahrain GP',
    'Best constructor championship finish: 5th (2023)',
    'Most podiums in a season: 8 (2023)'
  ],
  'alpine': [
    'First win as Alpine: 2021 Hungarian GP',
    'Best constructor championship finish as Alpine: 4th (2022)',
    'Multiple race wins as Renault F1 Team'
  ],
  'williams': [
    '9 constructor championships',
    '114 race wins',
    '313 podium finishes',
    'Most consecutive pole positions: 24 (1992-1993)'
  ],
  'alphatauri': [
    'First win: 2020 Italian GP (as AlphaTauri)',
    '2008 Italian GP victory (as Toro Rosso)',
    'Launched careers of multiple Red Bull drivers'
  ],
  'alfa': [
    'Multiple race wins in early F1 era',
    'First F1 constructor championship (1950)',
    'Notable technical innovations in early F1'
  ],
  'haas': [
    'First points on debut: 2016 Australian GP',
    'Best constructor championship finish: 5th (2018)',
    'First pole position: 2022 Brazilian GP'
  ]
};

export function getTeamTechnicalDirector(teamId: string): string {
  return teamTechnicalDirectors[teamId] || 'Information not available';
}

export function getTeamPrincipal(teamId: string): string {
  return teamPrincipals[teamId] || 'Information not available';
}

export function getTeamPowerUnit(teamId: string): string {
  return teamPowerUnits[teamId] || 'Information not available';
}

export function getTeamRecords(teamId: string): string[] {
  return teamRecords[teamId] || ['No notable records available'];
}