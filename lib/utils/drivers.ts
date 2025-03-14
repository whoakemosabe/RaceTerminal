import { countryToCode } from './countries';
import { getFlagUrl } from './formatting';
import { driverNicknames, driverBirthdays } from '@/lib/data/drivers';
import { driverNumbers } from '@/lib/data/driver-numbers';

// Export all driver-related data and functions
export { driverNicknames, driverBirthdays, driverNumbers };

export function getDriverNicknames(driverId: string): string[] {
  return driverNicknames[driverId.toLowerCase()] || [];
}

// Find driver by number
export function findDriverByNumber(number: string): string | null {
  // Normalize search number by removing leading zeros and spaces
  const searchNumber = number.trim().replace(/^0+/, '') || '0';
  
  // Search through driver numbers
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