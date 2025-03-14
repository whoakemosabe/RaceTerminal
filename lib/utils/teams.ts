import { teamColors } from '@/lib/data/team-colors';
import { calculateTeamStats } from './stats';
import { formatTeamComparison } from './formatting';

// Team nickname mappings
export const teamNicknames: Record<string, string[]> = {
  'red_bull': ['Red Bull Racing', 'RBR', 'redbull', 'Milton Keynes, UK', '2005', '7', 'British'],
  'mercedes': ['Mercedes-AMG Petronas', 'MER', 'mercs', 'Brackley, UK', '1954', '8', 'British'],
  'ferrari': ['Scuderia Ferrari', 'FER', 'SF', 'Maranello, Italy', '1950', '16', 'Italian'],
  'mclaren': ['McLaren F1 Team', 'MCL', 'papaya', 'Woking, UK', '1966', '8', 'British'],
  'aston_martin': ['Aston Martin F1 Team', 'AMR', 'aston', 'Silverstone, UK', '2021', '0', 'British'],
  'alpine': ['Alpine F1 Team', 'ALP', 'renault', 'Enstone, UK', '1986', '2', 'French'],
  'williams': ['Williams Racing', 'WIL', 'grove', 'Grove, UK', '1977', '9', 'British'],
  'alphatauri': ['Visa Cash App RB', 'RB', 'tauri', 'Faenza, Italy', '1985', '0', 'Italian'],
  'alfa': ['Alfa Romeo F1 Team', 'ALF', 'sauber', 'Hinwil, Switzerland', '1993', '0', 'Swiss'],
  'haas': ['Haas F1 Team', 'HAS', 'haas', 'Kannapolis, USA', '2016', '0', 'American']
};

// Team themes with their corresponding colors
export const teamThemes: Record<string, { primary: string; secondary: string; accent: string; border: string }> = {
  'red_bull': {
    primary: '217 92% 45%',      // Brand blue for entered commands
    secondary: '0 85% 45%',      // Red for shell prompt
    accent: '196 100% 50%',      // Cyan for accents
    border: '217 92% 45%'        // Blue for borders
  },
  'mercedes': {
    primary: '174 100% 41%',     // Brand color (entered commands)
    secondary: '180 85% 35%',    // Shell prompt color
    accent: '187 100% 42%',      // Accent color
    border: '174 100% 41%',      // Border color
    foreground: '210 40% 98%'    // General text color
  },
  'ferrari': {
    primary: '0 85% 45%',        // Brand color (entered commands)
    secondary: '15 80% 50%',     // Shell prompt color
    accent: '45 100% 50%',       // Accent color
    border: '0 85% 45%',         // Border color
    foreground: '210 40% 98%'    // General text color
  },
  'mclaren': {
    primary: '32 100% 50%',      // Brand color (entered commands)
    secondary: '25 90% 45%',     // Shell prompt color
    accent: '199 100% 45%',      // Accent color
    border: '32 100% 50%',       // Border color
    foreground: '210 40% 98%'    // General text color
  },
  'aston_martin': {
    primary: '170 100% 25%',     // Brand color (entered commands)
    secondary: '168 85% 30%',    // Shell prompt color
    accent: '144 70% 45%',       // Accent color
    border: '170 100% 25%',      // Border color
    foreground: '210 40% 98%'    // General text color
  },
  'alpine': {
    primary: '203 100% 50%',     // Brand color (entered commands)
    secondary: '200 85% 45%',    // Shell prompt color
    accent: '339 85% 55%',       // Accent color
    border: '203 100% 50%',      // Border color
    foreground: '210 40% 98%'    // General text color
  },
  'williams': {
    primary: '217 100% 50%',     // Brand color (entered commands)
    secondary: '220 85% 45%',    // Shell prompt color
    accent: '210 100% 65%',      // Accent color
    border: '217 100% 50%',      // Border color
    foreground: '210 40% 98%'    // General text color
  },
  'alphatauri': {
    primary: '212 39% 27%',      // Brand color (entered commands)
    secondary: '215 35% 35%',    // Shell prompt color
    accent: '200 45% 45%',       // Accent color
    border: '212 39% 27%',       // Border color
    foreground: '210 40% 98%'    // General text color
  },
  'alfa': {
    primary: '0 100% 45%',       // Vibrant red (entered commands)
    secondary: '350 90% 45%',    // Shell prompt color (brighter red)
    accent: '15 95% 50%',        // Accent color (bright orange)
    border: '0 100% 45%',        // Border color (vibrant red)
    foreground: '210 40% 98%'    // General text color
  },
  'haas': {
    primary: '0 0% 20%',         // Brand color (entered commands)
    secondary: '0 0% 35%',       // Shell prompt color
    accent: '0 0% 85%',          // Accent color
    border: '0 0% 20%',          // Border color
    foreground: '210 40% 98%'    // General text color
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
  
  // Handle empty search
  if (!search) return null;

  // Direct match with team ID
  if (teamNicknames[search]) {
    return search;
  }
  
  // Common variations and abbreviations
  const commonVariations: Record<string, string> = {
    'rb': 'red_bull',
    'rbr': 'red_bull',
    'redbull': 'red_bull',
    'merc': 'mercedes',
    'mercs': 'mercedes',
    'amg': 'mercedes',
    'sf': 'ferrari',
    'mclaren': 'mclaren',
    'mcl': 'mclaren',
    'amr': 'aston_martin',
    'aston': 'aston_martin',
    'alpine': 'alpine',
    'renault': 'alpine',
    'williams': 'williams',
    'alfa': 'alfa',
    'sauber': 'alfa',
    'haas': 'haas',
    'at': 'alphatauri',
    'tauri': 'alphatauri',
    'alpha': 'alphatauri'
  };

  // Check common variations first
  if (commonVariations[search]) {
    return commonVariations[search];
  }

  // Search through nicknames
  for (const [teamId, names] of Object.entries(teamNicknames)) {
    // Check each part of the team name
    const [fullName, code, nickname, location] = names;
    const nameParts = [
      fullName.toLowerCase(),
      code.toLowerCase(),
      nickname.toLowerCase(),
      location.toLowerCase(),
      teamId.replace(/_/g, ' ').toLowerCase()
    ];

    // Return on first match
    if (nameParts.some(part => part.includes(search) || search.includes(part))) {
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

// Re-export team comparison function
export { formatTeamComparison };