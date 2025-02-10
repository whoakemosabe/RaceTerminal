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