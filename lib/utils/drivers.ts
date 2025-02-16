import { countryToCode } from '@/lib/utils/countries';
import { getFlagUrl } from '@/lib/utils/formatting';

// Driver nickname mappings
export const driverNicknames: Record<string, string[]> = {
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
  'sainz_sr': ['Carlos Sainz Sr.', 'SAI', 'El Matador', 'Spanish', 'sainz_sr'],
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
  'bruce_mclaren': ['Bruce McLaren', 'MCL', 'The Boss', 'New Zealander', 'bruce', 'mclaren'],
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
  'webber': ['Mark Webber', 'WEB', 'Aussie Grit', 'Australian', 'webber'],
  
  // Historical Drivers
  'bandini': ['Lorenzo Bandini', 'BAN', 'Il Bello', 'Italian', 'bandini'],
  'bonnier': ['Jo Bonnier', 'BON', 'The Flying Swede', 'Swedish', 'bonnier'],
  'depailler': ['Patrick Depailler', 'DEP', 'Le Motard', 'French', 'depailler'],
  'de_angelis': ['Elio de Angelis', 'DEA', 'Il Principe', 'Italian', 'de_angelis'],
  'ginther': ['Richie Ginther', 'GIN', 'The Californian', 'American', 'ginther'],
  'gonzalez': ['José Froilán González', 'GON', 'El Cabezón', 'Argentine', 'gonzalez'],
  'hawthorn': ['Mike Hawthorn', 'HAW', 'Le Papillon', 'British', '1958', 'hawthorn'],
  'ireland': ['Innes Ireland', 'IRE', 'The Soldier', 'British', 'ireland'],
  'rodriguez_p': ['Pedro Rodríguez', 'ROD', 'El Niño', 'Mexican', 'rodriguez'],
  'rodriguez_r': ['Ricardo Rodríguez', 'ROD', 'El Pequeño', 'Mexican', 'rodriguez'],
  'siffert': ['Jo Siffert', 'SIF', 'Seppi', 'Swiss', 'siffert'],
  'surtees': ['John Surtees', 'SUR', 'Il Grande John', 'British', '1964', 'surtees'],
  'trintignant': ['Maurice Trintignant', 'TRI', 'Pétoulet', 'French', 'trintignant'],
  'von_trips': ['Wolfgang von Trips', 'TRI', 'Taffy', 'German', 'von_trips'],
  'watson': ['John Watson', 'WAT', 'Wattie', 'British', 'watson'],
  'tambay': ['Patrick Tambay', 'TAM', 'Le Professeur', 'French', 'tambay'],
  'patrese': ['Riccardo Patrese', 'PAT', 'The Veteran', 'Italian', 'patrese'],
  'arnoux': ['René Arnoux', 'ARN', 'Le Petit', 'French', 'arnoux'],
  'jabouille': ['Jean-Pierre Jabouille', 'JAB', 'Le Grand', 'French', 'jabouille']
};
// Driver numbers
export const driverNumbers: Record<string, string> = {
  // Current Drivers
  'albon': '23',           // Williams
  'alonso': '14',          // Aston Martin
  'bearman': '38',         // Ferrari (reserve)
  'bottas': '77',          // Alfa Romeo
  'gasly': '10',           // Alpine
  'hamilton': '44',        // Mercedes
  'hulkenberg': '27',      // Haas
  'leclerc': '16',         // Ferrari
  'magnussen': '20',       // Haas
  'max_verstappen': '1',   // Red Bull
  'norris': '4',           // McLaren
  'ocon': '31',           // Alpine
  'perez': '11',          // Red Bull
  'piastri': '81',        // McLaren
  'ricciardo': '3',       // AlphaTauri
  'russell': '63',        // Mercedes
  'sainz': '55',          // Ferrari
  'sargeant': '2',        // Williams
  'stroll': '18',         // Aston Martin
  'tsunoda': '22',        // AlphaTauri
  'zhou': '24',           // Alfa Romeo
  
  // World Champions (Retired)
  'ascari': '1',           // Ferrari champion number
  'brabham': '1',          // Cooper/Brabham champion
  'button': '22',          // Brawn GP champion
  'clark': '1',            // Lotus champion
  'fangio': '1',           // Multiple teams champion
  'fittipaldi': '1',       // Lotus/McLaren champion
  'hakkinen': '1',         // McLaren champion
  'hill_d': '0',           // Williams champion
  'hill_g': '5',           // BRM/Lotus champion
  'hunt': '11',            // McLaren champion
  'lauda': '1',            // Ferrari/McLaren champion
  'mansell': '5',          // Williams champion
  'piquet': '1',           // Brabham/Williams champion
  'prost': '1',            // McLaren/Williams champion
  'raikkonen': '7',        // Ferrari champion
  'rindt': '22',           // Lotus posthumous champion
  'rosberg_k': '6',        // Williams champion
  'rosberg_n': '6',        // Mercedes champion
  'michael_schumacher': '1', // Ferrari legend
  'senna': '12',           // McLaren legend
  'stewart': '1',          // Tyrrell champion
  'vettel': '5',           // Red Bull champion
  'villeneuve_j': '27',    // Williams champion
  
  // Notable Drivers (Non-Champions)
  'alesi': '27',           // Ferrari iconic number
  'andretti': '2',         // Lotus/Ferrari
  'barrichello': '11',     // Ferrari/Brawn
  'berger': '28',          // Ferrari/McLaren iconic number
  'brooks': '24',          // Vanwall/Ferrari
  'cevert': '4',           // Tyrrell iconic number
  'coulthard': '14',       // McLaren/Red Bull
  'gurney': '48',          // Eagle/McLaren/Brabham
  'ickx': '26',            // Ferrari/Brabham
  'massa': '19',           // Ferrari/Williams
  'montoya': '6',          // Williams/McLaren
  'moss': '7',             // Mercedes/Maserati
  'peterson': '2',         // Lotus/March
  'regazzoni': '11',       // Ferrari/Williams iconic number
  'reutemann': '15',       // Ferrari/Williams
  'villeneuve_g': '27',    // Ferrari legend
  'webber': '2',           // Red Bull veteran

  // Additional Historical Drivers
  'bandini': '18',         // Ferrari
  'bonnier': '6',          // BRM/Cooper/McLaren
  'depailler': '7',        // Tyrrell/Ligier iconic number
  'ginther': '12',         // Honda/Ferrari/BRM
  'gonzalez': '1',         // Ferrari/Maserati champion number
  'hawthorn': '1',         // Ferrari champion
  'ireland': '17',         // Lotus/BRM
  'bruce_mclaren': '1',    // Cooper/McLaren founder
  'rodriguez_p': '15',     // BRM/Ferrari
  'rodriguez_r': '8',      // Ferrari
  'siffert': '14',         // March/BRM iconic number
  'surtees': '1',          // Ferrari champion
  'trintignant': '46',     // BRM/Cooper/Bugatti
  'von_trips': '3',        // Ferrari
  'watson': '1',           // McLaren/Brabham/Penske
  'tambay': '27',          // Ferrari
  'patrese': '11',         // Williams/Brabham iconic number
  'arnoux': '28',          // Ferrari/Renault
  'jabouille': '15'        // Renault pioneer
};

export function getDriverNicknames(driverId: string): string[] {
  return driverNicknames[driverId.toLowerCase()] || [];
}

// Find driver by number
export function findDriverByNumber(number: string): string | null {
  // Normalize search number by removing leading zeros and spaces
  const searchNumber = number.trim().replace(/^0+/, '') || '0';
  
  // Search through driver numbers
  const driverByNumber = Object.entries(driverNumbers)
    .find(([_, driverNumber]) => driverNumber === searchNumber);
  
  if (driverByNumber) {
    return driverByNumber[0];
  }
  
  return null;
}

// Reverse lookup map for finding driver IDs
export function findDriverId(search: string): string | null {
  if (!search) {
    return null;
  }

  search = search.toLowerCase();
  search = search.trim();
  // Search priority:
  // 1. Driver number
  // 2. Exact full name match
  // 3. Driver code match
  // 4. Last name match
  // 5. Nickname match
  // 6. First name match (if unique)
  // 7. Partial name match

  // Check driver number
  if (/^\d+$/.test(search)) {
    // Normalize search number by removing leading zeros and spaces
    const searchNumber = search.replace(/^0+/, '') || '0';
    
    // Search through driver numbers
    const driverByNumber = Object.entries(driverNumbers)
      .find(([_, driverNumber]) => driverNumber === searchNumber);
    
    if (driverByNumber) {
      const [driverId] = driverByNumber;
      if (driverNicknames[driverId]) {
        return driverByNumber[0];
      }
    }
  }

  // Handle special cases
  if (search === 'hill') {
    return 'hill_d'; // Default to Damon Hill
  } else if (search === 'schumacher' || search === 'schumi') {
    return 'michael_schumacher';
  }

  // Process search terms
  const searchParts = search.split(' ').filter(Boolean);
  const searchTerm = searchParts.join(' ');

  // Normalize search term
  const normalizedSearch = search.replace(/[_\s-]+/g, '').toLowerCase();

  // Search through all drivers
  for (const [driverId, properties] of Object.entries(driverNicknames)) {
    const [fullName, code, ...rest] = properties;
    const nameParts = fullName.toLowerCase().split(' ');
    const [firstName, lastName] = nameParts;
    const normalizedId = driverId.replace(/[_\s-]+/g, '').toLowerCase();
    const normalizedLastName = lastName.replace(/[_\s-]+/g, '').toLowerCase();

    // 2. Exact full name match
    if (fullName.toLowerCase() === searchTerm) return driverId;

    // 3. Driver code match (exact 3-letter code)
    if (code.length === 3 && code === code.toUpperCase() && code.toLowerCase() === search) {
      return driverId;
    }

    // 4. Last name match
    if (normalizedLastName === normalizedSearch) return driverId;

    // 5. Nickname match (excluding special entries)
    const nicknames = rest.filter(p => 
      !p.includes(',') && // Not championship years
      !countryToCode[p] && // Not nationality
      p !== driverId && // Not ID
      p.length !== 3 // Not driver code
    );
    if (nicknames.some(nick => 
      nick.toLowerCase().replace(/[_\s-]+/g, '') === normalizedSearch
    )) return driverId;

    // 6. ID match
    if (normalizedId === normalizedSearch) return driverId;

    // 6. First name match (if unique)
    if (firstName === search) {
      const sameFirstName = Object.values(driverNicknames)
        .filter(props => props[0].toLowerCase().split(' ')[0] === search);
      if (sameFirstName.length === 1) return driverId;
    }

    // 7. Multi-word partial match
    if (searchParts.length > 1) {
      // For multi-word searches, check if all search parts match in order
      let nameStr = fullName.toLowerCase();
      let allPartsMatch = true;
      let lastIndex = -1;
      
      for (const part of searchParts) {
        const index = nameStr.indexOf(part, lastIndex + 1);
        if (index === -1 || (lastIndex !== -1 && index <= lastIndex)) {
          allPartsMatch = false;
          break;
        }
        lastIndex = index;
      }
      
      if (allPartsMatch) {
        return driverId;
      }
    }
  }

  return null;
}