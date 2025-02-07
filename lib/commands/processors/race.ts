import { api } from '@/lib/api/client';
import { formatDriver, formatTime, formatDate, calculateCountdown, icons, findTeamId, getFlagUrl, findDriverId, formatDriverComparison, formatTeamComparison } from '@/lib/utils';

export const raceCommands = {
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
      const data = await api.compareDrivers(driver1Id, driver2Id);
      return formatDriverComparison(data);
    } else if (type === 'team') {
      const [team1Id, team2Id] = [findTeamId(args[1]), findTeamId(args[2])];
      if (!team1Id || !team2Id) {
        return '❌ Error: One or both teams not found. Use team names or abbreviations (e.g., redbull, mercedes)';
      }
      const data = await api.compareTeams(team1Id, team2Id);
      return formatTeamComparison(data);
    } else {
      return '❌ Error: Invalid comparison type. Use "driver" or "team" (e.g., /compare driver verstappen hamilton)';
    }
  },

  '/team': async (args: string[]) => {
    if (!args[0]) {
      return `❌ Error: Please provide a team name\nUsage: /team <name> (e.g., /team ferrari)\nTip: Use /list teams to see all available teams\nShortcuts: /tm, /team`;
    }
    
    const teamId = findTeamId(args[0]);
    if (!teamId) {
      return `❌ Error: Team "${args[0]}" not found\nTry using:\n• Team name (e.g., ferrari, mercedes)\n• Nickname (e.g., redbull, mercs)\nShortcuts: /tm, /team`;
    }
    
    const data = await api.getConstructorInfo(teamId);
    if (!data) {
      return `❌ Error: Could not fetch data for team "${args[0]}". Please try again later.`;
    }
    
    const flagUrl = getFlagUrl(data.nationality);
    return [
      `🏎️ ${data.name}`,
      `🌍 Nationality: ${data.nationality} ${flagUrl ? `<img src="${flagUrl}" alt="${data.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : ''}`,
      `📅 First Entry: ${data.firstEntry || 'N/A'}`,
      `🏆 Championships: ${data.championships || '0'}`
    ].join('\n');
  },

  '/race': async (args: string[], originalCommand: string) => {
    if (!args[0]) {
      const cmd = originalCommand === '/r' ? '/r' : '/race';
      return `❌ Error: Please provide a year and optionally a round number\nUsage: ${cmd} <year> [round]\nExamples:\n• ${cmd} 2023\n• ${cmd} 2023 1\nShortcuts: /r, /race`;
    }
    
    const year = parseInt(args[0]);
    if (isNaN(year) || year < 1950 || year > new Date().getFullYear()) {
      return `❌ Error: Invalid year. Please use a year between 1950 and ${new Date().getFullYear()} (e.g., /race 2023)`;
    }

    const round = args[1] ? parseInt(args[1]) : undefined;
    if (args[1] && (isNaN(round!) || round! < 1)) {
      return '❌ Error: Invalid round number. Please use a number between 1 and 30 (e.g., /race 2023 1)';
    }

    const data = await api.getRaceResults(year, round);
    if (!data || data.length === 0) {
      return `❌ Error: No race results found for ${year}${round ? ` round ${round}` : ''}. Please check the year and round number.`;
    }

    return data.slice(0, 5).map((result: any) =>
      `${icons.trophy} P${result.position} | ${formatDriver(`${result.Driver.givenName} ${result.Driver.familyName}`, result.Driver.nationality)} | ${formatTime(result.Time?.time || result.status || 'No time')}`
    ).join('\n');
  },

  '/qualifying': async (args: string[], originalCommand: string) => {
    if (!args[0] || !args[1]) {
      const cmd = originalCommand === '/q' ? '/q' : '/qualifying';
      return `❌ Error: Please provide both year and round number\nUsage: ${cmd} <year> <round>\nExample: ${cmd} 2023 1\nShortcuts: /q, /ql, /qualifying`;
    }
    
    const year = parseInt(args[0]);
    if (isNaN(year) || year < 1950 || year > new Date().getFullYear()) {
      return `❌ Error: Invalid year. Please use a year between 1950 and ${new Date().getFullYear()}`;
    }
    
    const round = parseInt(args[1]);
    if (isNaN(round) || round < 1 || round > 30) {
      return `❌ Error: Invalid round number. Please use a number between 1 and 30`;
    }
    
    const data = await api.getQualifyingResults(year, round);
    if (!data || data.length === 0) {
      return `❌ Error: No qualifying results found for ${year} round ${round}. Please check the year and round number.`;
    }

    const results = data.slice(0, 5).map((result: any) => [
      `🏆 Position: P${result.position}`,
      `👤 Driver: ${result.driver}`,
      `⚡ Q1: ${result.q1 || 'N/A'}`,
      `⚡ Q2: ${result.q2 || 'N/A'}`,
      `⚡ Q3: ${result.q3 || 'N/A'}`
    ].join('\n'));

    return `🏁 Qualifying Results:\n\n${results.join('\n\n')}`;
  },

  '/sprint': async (args: string[]) => {
    if (!args[0] || !args[1]) {
      return `❌ Error: Please provide year and round\nUsage: /sprint <year> <round>\nExample: /sprint 2023 1\nShortcuts: /sp, /sprint`;
    }

    const data = await api.getSprintResults(parseInt(args[0]), parseInt(args[1]));
    if (!data || data.length === 0) {
      return '❌ Error: No sprint race results available';
    }

    return data.slice(0, 5).map(result =>
      `🏃 P${result.position} | 👤 ${formatDriver(result.Driver.givenName + ' ' + result.Driver.familyName, result.Driver.nationality)} | ⏱️ ${formatTime(result.Time?.time || result.status)}`
    ).join('\n');
  },

  '/next': async () => {
    const data = await api.getNextRace();
    if (!data) {
      return '❌ Error: No upcoming race information available';
    }

    const countdown = calculateCountdown(new Date(data.date));
    return [
      `🏁 Next Race: ${data.raceName}`,
      `🏎️ Circuit: ${data.Circuit.circuitName}`,
      `📍 Location: ${data.Circuit.Location.locality}, ${data.Circuit.Location.country}`,
      `📅 Date: ${formatDate(data.date)}`,
      `⏰ Time: ${data.time || 'TBA'}`,
      `⏳ Countdown: ${countdown}`
    ].join('\n');
  },

  '/last': async () => {
    const data = await api.getLastRaceResults();
    if (!data) {
      return '❌ Error: No results available for the last race';
    }

    const results = data.Results.slice(0, 5).map(result => [
      `🏆 Position: P${result.position}`,
      `👤 Driver: ${formatDriver(result.Driver.givenName + ' ' + result.Driver.familyName, result.Driver.nationality)}`,
      `🏎️ Team: ${result.Constructor.name}`,
      `⏱️ Time: ${formatTime(result.Time?.time || result.status)}`
    ].join('\n'));

    return `🏁 ${data.raceName} Results:\n\n${results.join('\n\n')}`;
  }
};