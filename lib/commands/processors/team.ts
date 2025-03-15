import { api } from '@/lib/api/client';
import { findTeamId, getFlagUrl, getTeamColor, getTeamPrincipal, getTeamPowerUnit, getTeamRecords, findDriverId, formatDriverComparison, formatTeamComparison } from '@/lib/utils';
import { teamNicknames } from '@/lib/utils/teams';
import { CommandFunction } from './index';

export const teamCommands = {
  '/team': async (args: string[]) => {
    if (!args[0]) {
      return `❌ Error: Please provide a team name\nUsage: /team <name> (e.g., /team ferrari)\nTip: Use /list teams to see all available teams\nShortcuts: /tm, /team`;
    }
    
    const teamId = findTeamId(args[0]);
    if (!teamId) {
      return `❌ Error: Team "${args[0]}" not found\nTry using:\n• Team name (e.g., ferrari)\n• Nickname (e.g., redbull)\nShortcuts: /tm, /team`;
    }
    
    const data = await api.getConstructorInfo(teamId);
    if (!data) {
      return `❌ Error: Could not fetch data for team "${args[0]}". Please try again later.`;
    }
    
    const flagUrl = getFlagUrl(data.nationality);
    const teamColor = getTeamColor(data.name);
    const [name, code, _, hq, established, championships] = teamNicknames[teamId];
    const teamPrincipal = getTeamPrincipal(teamId);
    const powerUnit = getTeamPowerUnit(teamId);
    const records = getTeamRecords(teamId);
    
    const separator = '═'.repeat(60);
    
    return [
      `🏎️ ${name.toUpperCase()}`,
      separator,
      `Team: <span style="color: ${teamColor}">${name}</span> | Code: ${code} | ${data.nationality} ${flagUrl ? `<img src="${flagUrl}" alt="${data.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : ''}`,
      `Base: ${hq} | Est: ${established} | Principal: ${teamPrincipal}`,
      `Power Unit: ${powerUnit} | Championships: ${championships}`,
      '',
      'Notable Records:',
      ...records.map(record => `• ${record}`),
      '',
      separator
    ].join('\n');
  },

  '/compare': async (args: string[], originalCommand: string) => {
    if (!args[0] || !args[1] || !args[2]) {
      const cmd = originalCommand === '/m' ? '/m' : '/compare';
      return `❌ Error: Please specify what to compare and provide two names\nUsage:\n• Compare drivers: ${cmd} driver <name1> <name2>\n  Example: ${cmd} driver verstappen hamilton\n  Shortcut: /md verstappen hamilton\n\n• Compare teams: ${cmd} team <name1> <name2>\n  Example: ${cmd} team redbull mercedes\n  Shortcut: /mt redbull mercedes`;
    }
    
    const type = args[0].toLowerCase();
    
    if (type === 'driver') {
      const [driver1Id, driver2Id] = [findDriverId(args[1]), findDriverId(args[2])];
      if (!driver1Id || !driver2Id) {
        return '❌ Error: One or both drivers not found. Use driver names or codes (e.g., verstappen, HAM)';
      }
      if (driver1Id === driver2Id) {
        return '❌ Error: Please select two different drivers to compare';
      }
      const data = await api.compareDrivers(driver1Id, driver2Id);
      return formatDriverComparison(data);
    } else if (type === 'team') {
      const [team1Id, team2Id] = [findTeamId(args[1]), findTeamId(args[2])];
      if (!team1Id || !team2Id) {
        return '❌ Error: One or both teams not found.)';
      }
      const data = await api.compareTeams(team1Id, team2Id);
      return formatTeamComparison(data);
    } else {
      return '❌ Error: Invalid comparison type. Use "driver" or "team" (e.g., /compare driver verstappen hamilton)';
    }
  }
};