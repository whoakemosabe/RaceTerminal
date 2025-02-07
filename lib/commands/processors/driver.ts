import { api } from '@/lib/api/client';
import { findDriverId, formatDriver, driverNumbers, getDriverNicknames, getFlagUrl, formatDate } from '@/lib/utils';

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
    
    const data = await api.getDriverInfo(driverId);
    if (!data) {
      return `❌ Error: Could not fetch data for driver "${args[0]}". Please try again later.`;
    }
    
    const driverNumber = driverNumbers[data.driverId] || data.permanentNumber || 'N/A';
    const nicknames = getDriverNicknames(data.driverId);
    const age = Math.floor((new Date().getTime() - new Date(data.dateOfBirth).getTime()) / 31557600000);
    const flagUrl = getFlagUrl(data.nationality);
    
    return [
      `👤 ${data.givenName} ${data.familyName}`,
      `🏷️ Code: ${data.code || 'N/A'}`,
      `#️⃣ Number: ${driverNumber}`,
      `🌟 Nicknames: ${nicknames.join(' | ')}`,
      `🌍 Nationality: ${data.nationality} ${flagUrl ? `<img src="${flagUrl}" alt="${data.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : ''}`,
      `🎂 Born: ${formatDate(data.dateOfBirth)}`,
      `📅 Age: ${age} years old`
    ].join('\n');
  }
};