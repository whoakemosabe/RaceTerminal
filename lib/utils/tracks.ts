// Track-related utilities
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