import { countryToCode } from './countries'; 
import { getFlagUrl } from './formatting';

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
  'webber': ['Mark Webber', 'WEB', 'Aussie Grit', 'Australian', 'webber'],
  
  // Historical Drivers
  'bandini': ['Lorenzo Bandini', 'BAN', 'Il Bello', 'Italian', 'bandini'],
  'bonnier': ['Jo Bonnier', 'BON', 'The Flying Swede', 'Swedish', 'bonnier'],
  'depailler': ['Patrick Depailler', 'DEP', 'Le Motard', 'French', 'depailler'],
  'ginther': ['Richie Ginther', 'GIN', 'The Californian', 'American', 'ginther'],
  'gonzalez': ['José Froilán González', 'GON', 'El Cabezón', 'Argentine', 'gonzalez'],
  'hawthorn': ['Mike Hawthorn', 'HAW', 'Le Papillon', 'British', '1958', 'hawthorn'],
  'ireland': ['Innes Ireland', 'IRE', 'The Soldier', 'British', 'ireland'],
  'bruce_mclaren': ['Bruce McLaren', 'MCL', 'The Boss', 'New Zealander', 'mclaren', 'bruce'],
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
  'berger': '28',          // Ferrari/McLaren
  'brooks': '24',          // Vanwall/Ferrari
  'cevert': '3',           // Tyrrell
  'coulthard': '14',       // McLaren/Red Bull
  'gurney': '36',          // Eagle/McLaren
  'ickx': '26',            // Ferrari/Brabham
  'massa': '19',           // Ferrari/Williams
  'montoya': '6',          // Williams/McLaren
  'moss': '7',             // Mercedes/Maserati
  'peterson': '2',         // Lotus/March
  'regazzoni': '4',        // Ferrari/Williams
  'reutemann': '15',       // Ferrari/Williams
  'villeneuve_g': '27',    // Ferrari legend
  'webber': '2',           // Red Bull veteran

  // Additional Historical Drivers
  'bandini': '18',         // Ferrari
  'bonnier': '7',          // BRM/Cooper
  'depailler': '16',       // Tyrrell/Ligier
  'ginther': '14',         // Honda/Ferrari
  'gonzalez': '10',        // Ferrari/Maserati
  'hawthorn': '1',         // Ferrari champion
  'ireland': '8',          // Lotus/BRM
  'bruce_mclaren': '1',    // Cooper/McLaren founder
  'rodriguez_p': '15',     // BRM/Ferrari
  'rodriguez_r': '9',      // Ferrari
  'siffert': '16',         // March/BRM
  'surtees': '1',          // Ferrari champion
  'trintignant': '4',      // BRM/Cooper
  'von_trips': '3',        // Ferrari
  'watson': '2',           // McLaren/Brabham
  'tambay': '27',          // Ferrari
  'patrese': '6',          // Williams/Brabham
  'arnoux': '28',          // Ferrari/Renault
  'jabouille': '15'        // Renault pioneer
};

export function getDriverNicknames(driverId: string): string[] {
  return driverNicknames[driverId.toLowerCase()] || [];
}

// Find driver by number
export function findDriverByNumber(number: string): string | null {
  // Remove leading zeros and spaces
  const searchNumber = number.trim().replace(/^0+/, '');
  
  // Search through driver numbers
  for (const [driverId, driverNumber] of Object.entries(driverNumbers)) {
    if (driverNumber === searchNumber) {
      return driverId;
    }
  }
  
  return null;
}

// Reverse lookup map for finding driver IDs
export function findDriverId(search: string): string | null {
  search = search.toLowerCase();
  search = search.trim();

  // Check if search is a driver number
  if (/^\d+$/.test(search)) {
    for (const [driverId, number] of Object.entries(driverNumbers)) {
      if (number === search) {
        return driverId;
      }
    }
  }


  // Split search into parts (for handling multi-word searches)
  const searchParts = search.split(' ').filter(Boolean);

  // Handle exact matches first
  for (const [driverId, properties] of Object.entries(driverNicknames)) {
    // Exact match with full name
    const fullName = properties[0].toLowerCase();
    if (fullName === search) {
      return driverId;
    }
    
    // Multi-word exact match
    if (searchParts.length > 1) {
      const nameParts = fullName.split(' ');
      const searchString = searchParts.join(' ');
      if (fullName.includes(searchString)) {
        return driverId;
      }
    }
    
    // Exact match with driver code or nickname
    for (const prop of properties) {
      if (prop.toLowerCase() === search) {
        return driverId;
      }
    }
  }

  // Handle exact matches first
  for (const [driverId, properties] of Object.entries(driverNicknames)) {
    // Exact match with full name
    const fullName = properties[0].toLowerCase();
    if (fullName === search) {
      return driverId;
    }
    
    // Multi-word search match
    if (searchParts.length > 1) {
      const nameParts = fullName.split(' ');
      if (searchParts.every(part => 
        nameParts.some(namePart => namePart === part)
      )) {
        return driverId;
      }
    }
    
    // Exact match with driver code
    const code = properties.find(p => p.length === 3 && p === p.toUpperCase());
    if (code?.toLowerCase() === search) {
      return driverId;
    }
  }

  // Handle special cases for Schumacher
  if (search === 'schumi' || search === 'schumacher') {
    return 'michael_schumacher';
  }

  // Handle special case for McLaren
  if (search === 'mclaren' || search === 'bruce') {
    return 'bruce_mclaren';
  }

  // Direct match with driver ID
  if (driverNicknames[search]) {
    return search;
  }

  // Search through entries with more specific matching
  for (const [driverId, properties] of Object.entries(driverNicknames)) {
    // Check full name parts (first name, last name)
    const fullName = properties[0].toLowerCase();
    
    // For multi-word searches, require all parts to match
    if (searchParts.length > 1) {
      const searchString = searchParts.join(' ');
      if (fullName.includes(searchString)) {
        return driverId;
      }
      continue;
    }
    
    // Single word search - check exact matches first
    const nameParts = fullName.split(' ');
    const lastName = nameParts[nameParts.length - 1];
    const firstName = nameParts[0];
    
    if (lastName.toLowerCase() === search || firstName.toLowerCase() === search) {
      return driverId;
    }

    // Check nicknames (excluding special entries)
    const nicknames = properties.filter(p => 
      !p.includes(',') && // Not championship years
      !countryToCode[p] && // Not nationality
      p !== driverId && // Not ID
      p !== properties[0] && // Not full name
      p.length !== 3 // Not driver code
    );

    // Exact match with nickname
    if (nicknames.some(nick => nick.toLowerCase() === search)) {
      return driverId;
    }
  }

  // If no exact matches found, try partial matches
  for (const [driverId, properties] of Object.entries(driverNicknames)) {
    const fullName = properties[0].toLowerCase();
    const nameParts = fullName.split(' ');
    
    // For multi-word searches, require all parts to match partially
    if (searchParts.length > 1) {
      const searchString = searchParts.join(' ');
      if (fullName.includes(searchString)) {
        return driverId;
      }
      continue;
    }
    
    // For single word searches, check exact word matches first
    if (nameParts.some(part => part.toLowerCase() === search)) {
      return driverId;
    }
  }

  return null;
}