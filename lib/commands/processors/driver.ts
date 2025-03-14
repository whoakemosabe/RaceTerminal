import { api } from '@/lib/api/client';
import { findDriverId, getFlagUrl, formatDate } from '@/lib/utils';
import { driverNicknames } from '@/lib/data/drivers';
import { driverBirthdays } from '@/lib/data/drivers';
import { driverNumbers } from '@/lib/data/driver-numbers';
import { countryToCode } from '@/lib/utils/countries';

export const driverCommands = {
  '/driver': async (args: string[], originalCommand: string) => {
    if (!args[0]) {
      const cmd = originalCommand === '/d' ? '/d' : '/driver';
      return `❌ Error: Please provide a driver name\nUsage: ${cmd} <name> (e.g., ${cmd} hamilton)\nTip: Use /list drivers to see all available drivers\nShortcuts: /d, /driver`;
    }

    const searchTerm = args[0].toLowerCase();
    const driverId = findDriverId(searchTerm);
    if (!driverId) {
      return `❌ Error: Driver "${args[0]}" not found\nTry using:\n• Driver's last name (e.g., hamilton)\n• Driver code (e.g., HAM)\n• Driver number (e.g., 44)\nShortcuts: /d, /driver`;
    }

    // Get driver data from local storage
    const driverData = driverNicknames[driverId];
    const birthday = driverBirthdays[driverId];
    
    if (!driverData || !birthday) {
      return `❌ Error: Could not find data for driver "${args[0]}". Please try again later.`;
    }

    const [name, code, ...rest] = driverData;
    const nationality = rest.find(item => countryToCode[item]) || '';
    const number = driverNumbers[driverId] || 'N/A';
    const championshipYears = rest.find(item => item.includes(',') && /\d{4}/.test(item)) || '';
    const championshipCount = championshipYears ? (championshipYears.match(/\d{4}/g) || []).length : 0;
    const age = Math.floor((new Date().getTime() - new Date(birthday).getTime()) / 31557600000);
    const flagUrl = getFlagUrl(nationality);

    // Get nicknames (filtering out metadata)
    const nicknames = rest.filter(item => 
      !countryToCode[item] && 
      !item.includes(',') && 
      item !== driverId &&
      item !== name &&
      item.length > 1
    );

    return [
      `👤 ${name}`,
      `🏷️ Code: ${code}`,
      `#️⃣ Number: ${number}`,
      nicknames.length > 0 ? `🌟 Nicknames: ${nicknames.join(' | ')}` : '',
      `🌍 Nationality: ${nationality} ${flagUrl ? `<img src="${flagUrl}" alt="${nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : ''}`,
      `🎂 Born: ${formatDate(birthday)}`,
      `📅 Age: ${age} years old`,
      championshipYears ? `👑 Championships: ${championshipCount} (${championshipYears})` : ''
    ].filter(Boolean).join('\n');
  }
};