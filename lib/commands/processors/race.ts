import { api } from '@/lib/api/client';
import { formatDriver, formatTime, formatDate, calculateCountdown, icons, findTeamId, getFlagUrl, findDriverId, formatDriverComparison, formatTeamComparison, getTeamColor, findTrackId, trackNicknames, getTrackDetails } from '@/lib/utils';
import { getTeamPrincipal, getTeamPowerUnit, getTeamRecords } from '@/lib/utils/teams';
import { teamNicknames } from '@/lib/utils/teams';
import { CommandFunction } from './index';
interface RaceCommands {
  [key: string]: CommandFunction;
}

export const raceCommands: RaceCommands = {
  '/track': async (args: string[], originalCommand: string) => {
    if (!args[0]) {
      const cmd = originalCommand === '/t' ? '/t' : '/track';
      return `❌ Error: Please provide a track name\nUsage: ${cmd} <name> (e.g., ${cmd} monza)\nTip: Use /list tracks to see all available tracks\nShortcuts: /t, /track`;
    }

    const trackId = findTrackId(args[0]);
    if (!trackId) {
      return `❌ Error: Track "${args[0]}" not found\nTry using:\n• Track name (e.g., monza, spa)\n• GP name (e.g., italian, belgian)\nShortcuts: /t, /track`;
    }
    
    const [name, nickname] = trackNicknames[trackId];
    const details = getTrackDetails(trackId);
    const country = name.includes('GP') ? 
      name.split(' ').pop()?.replace('GP', '').trim() : 
      nickname.split(' ').pop()?.replace('GP', '').trim();
    
    const flagUrl = country ? getFlagUrl(country) : '';
    const flag = flagUrl ? 
      `<img src="${flagUrl}" alt="${country} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
      '';
    
    return [
      `🏁 ${name} ${flag}`,
      `📍 Location: ${nickname}`,
      `📏 Length: ${details.length}km`,
      `↩️ Turns: ${details.turns}`,
      details.lapRecord ? [
        '⚡ Lap Record:',
        `  Time: ${details.lapRecord.time}`,
        `  Driver: ${details.lapRecord.driver}`,
        `  Year: ${details.lapRecord.year}`
      ].join('\n') : 'No lap record available'
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
        return '❌ Error: One or both teams not found. Use full team names (e.g., "Red Bull Racing", "Mercedes-AMG Petronas")';
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

  '/race': async (args: string[], originalCommand: string) => {
    if (!args[0]) {
      const cmd = originalCommand === '/r' ? '/r' : '/race';
      return `❌ Error: Please provide a year and round number\nUsage: ${cmd} <year> <round>\nExample: ${cmd} 2023 1\nShortcuts: /r, /race`;
    }
    
    const year = parseInt(args[0]);
    if (isNaN(year) || year < 1950 || year > new Date().getFullYear()) {
      return `❌ Error: Invalid year. Please use a year between 1950 and ${new Date().getFullYear()} (e.g., /race 2023)`;
    }

    if (!args[1]) {
      return `❌ Error: Please provide a round number (e.g., /race ${year} 1)`;
    }

    const round = parseInt(args[1]);
    if (isNaN(round) || round < 1) {
      return `❌ Error: Invalid round number. Please use a positive number (e.g., /race ${year} 1)`;
    }

    try {
      const data = await api.getRaceResults(year, round);
      if (!data || !data.Results || data.Results.length === 0) {
        return `❌ Error: No race results found for ${year} round ${round}. Please check the year and round number.`;
      }

      const separator = '═'.repeat(60);
      const header = [
        `🏁 ${data.raceName}`,
        `📅 ${data.date}${data.time ? ' ' + data.time : ''}`,
        `📍 ${data.Circuit.circuitName}, ${data.Circuit.Location.locality}, ${data.Circuit.Location.country}`,
        separator
      ].join('\n');

      const results = data.Results.map((result: any) => {
        const flagUrl = getFlagUrl(result.Driver.nationality);
        const flag = flagUrl ? 
          `<img src="${flagUrl}" alt="${result.Driver.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
          '';
        const teamColor = getTeamColor(result.Constructor.name);
        const hasFastestLap = result.FastestLap?.rank === "1";
        
        return [
          `P${result.position}`,
          `${result.Driver.givenName} ${result.Driver.familyName} ${flag}`,
          `<span style="color: ${teamColor}">${result.Constructor.name}</span>`,
          result.Time ? result.Time.time : result.status,
          `+${result.points} pts${hasFastestLap ? ' <span style="color: #9333EA">●</span>' : ''}`
        ].join(' | ');
      });

      return [
        header,
        ...results
      ].join('\n');
    } catch (error) {
      console.error('Error fetching race results:', error);
      if (error instanceof Error) {
        return `❌ Error: ${error.message}`;
      }
      return '❌ Error: Could not fetch race results. Please try again later.';
    }
  },

  '/qualifying': async (args: string[], originalCommand: string) => {
    if (!args[0] || !args[1]) {
      const cmd = originalCommand === '/q' ? '/q' : '/qualifying';
      return `❌ Error: Please provide year and round\nUsage: ${cmd} <year> <round>\nExample: ${cmd} 2023 1\nNote: Qualifying data is only available from 2003 onwards\nShortcuts: /q, /ql, /qualifying`;
    }
    
    const year = parseInt(args[0]);
    if (isNaN(year) || year < 2003 || year > new Date().getFullYear()) {
      return `❌ Error: Invalid year. Qualifying data is only available from 2003 to ${new Date().getFullYear()}`;
    }
    
    const round = parseInt(args[1]);
    if (isNaN(round) || round < 1 || round > 30) {
      return `❌ Error: Invalid round number. Please use a number between 1 and 30`;
    }
    
    try {
      const [raceData, qualifyingData] = await Promise.all([
        api.getRaceResults(year, round),
        api.getQualifyingResults(year, round)
      ]);

      if (!qualifyingData || qualifyingData.length === 0 || !raceData) {
        return `❌ Error: No qualifying results found for ${year} round ${round}.\n\nNote: Qualifying data is only available:\n• From 2003 onwards\n• For completed race weekends\n• When qualifying session was held`;
      }

      // Get race info for header
      const raceInfo = raceData.raceName || `Round ${round}`;

      const separator = '═'.repeat(60);
      const header = [
        `🏁 ${raceInfo} Qualifying`,
        `📅 ${raceData.date}${raceData.time ? ' ' + raceData.time : ''}`,
        `📍 ${raceData.Circuit.circuitName}, ${raceData.Circuit.Location.locality}, ${raceData.Circuit.Location.country}`,
        separator
      ].join('\n');

      // Helper function to convert lap time to milliseconds
      function timeToMs(time: string): number {
        if (!time || time === 'N/A') return Infinity;
        const [minutes, seconds] = time.split(':');
        return (parseInt(minutes || '0') * 60 + parseFloat(seconds)) * 1000;
      }

      // Find fastest times for each session
      const allTimes = {
        q1: qualifyingData.map(r => timeToMs(r.q1)),
        q2: qualifyingData.map(r => timeToMs(r.q2)),
        q3: qualifyingData.map(r => timeToMs(r.q3))
      };

      const fastestTimes = {
        q1: Math.min(...allTimes.q1),
        q2: Math.min(...allTimes.q2.filter(t => t !== Infinity)),
        q3: Math.min(...allTimes.q3.filter(t => t !== Infinity))
      };

      // Get constructor info for each driver
      const driverTeams = new Map(raceData.Results.map((r: any) => [
        `${r.Driver.givenName} ${r.Driver.familyName}`,
        r.Constructor
      ]));

      const results = qualifyingData.map(result => {
        // Get times in milliseconds
        const times = {
          q1: timeToMs(result.q1),
          q2: timeToMs(result.q2),
          q3: timeToMs(result.q3)
        };

        // Check if each time is the fastest
        const isFastest = {
          q1: times.q1 === fastestTimes.q1 && times.q1 !== Infinity,
          q2: times.q2 === fastestTimes.q2 && times.q2 !== Infinity,
          q3: times.q3 === fastestTimes.q3 && times.q3 !== Infinity
        };

        // Get driver's constructor info
        const constructor = driverTeams.get(result.driver);
        const teamColor = constructor ? getTeamColor(constructor.name) : '#666666';

        // Get nationality from race data
        const driverInfo = raceData.Results.find((r: any) => 
          `${r.Driver.givenName} ${r.Driver.familyName}` === result.driver
        )?.Driver;

        const flagUrl = driverInfo ? getFlagUrl(driverInfo.nationality) : '';
        const flag = flagUrl ? 
          `<img src="${flagUrl}" alt="${driverInfo.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
          '';

        // Format each session time with purple for fastest
        const formatTime = (time: string, isFastest: boolean) => {
          if (time === 'N/A') return time;
          return isFastest ? `<span style="color: rgb(147, 51, 234)">${time}</span>` : time;
        };

        return [
          `P${result.position}`,
          `${result.driver} ${flag}`,
          `<span style="color: ${teamColor}">${constructor?.name || 'Unknown Team'}</span>`,
          `Q1: ${formatTime(result.q1, isFastest.q1)} | Q2: ${formatTime(result.q2, isFastest.q2)} | Q3: ${formatTime(result.q3, isFastest.q3)}`
        ].join(' | ');
      });

      return [
        header,
        ...results
      ].join('\n');
    } catch (error) {
      console.error('Error fetching qualifying results:', error);
      return `❌ Error: No qualifying results found for ${year} round ${round}. Please check the year and round number.`;
    }
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
  },

  '/standings': async (args: string[]) => {
    try {
      const currentYear = new Date().getFullYear();
      // Always try previous year first since current season hasn't started
      const year = currentYear - 1;
      const data = await api.getDriverStandings(year);
      
      if (!data || data.length === 0) {
        return '❌ Error: Could not fetch driver standings';
      }

      const header = `🏆 ${year} FORMULA 1 DRIVERS CHAMPIONSHIP`;
      const separator = '═'.repeat(60);
      
      const standings = data.map(standing => {
        const flagUrl = getFlagUrl(standing.Driver.nationality);
        const flag = flagUrl ? 
          `<img src="${flagUrl}" alt="${standing.Driver.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
          '';
        const teamColor = getTeamColor(standing.Constructor.name);
        
        return [
          `P${standing.position}. ${standing.Driver.givenName} ${standing.Driver.familyName} ${flag}`,
          `Points: ${standing.points}`,
          `Team: <span style="color: ${teamColor}">${standing.Constructor.name}</span>`,
          ''
        ].join(' | ');
      });

      return [
        header,
        separator,
        ...standings
      ].join('\n');
    } catch (error) {
      console.error('Error fetching driver standings:', error);
      return '❌ Error: Could not fetch driver standings. Please try again later.';
    }
  },

  '/teams': async (args: string[]) => {
    try {
      const currentYear = new Date().getFullYear();
      // Always try previous year first since current season hasn't started
      const year = currentYear - 1;
      const data = await api.getConstructorStandings(year);
      
      if (!data || data.length === 0) {
        return '❌ Error: Could not fetch constructor standings';
      }

      const header = `🏎️ ${year} FORMULA 1 CONSTRUCTORS CHAMPIONSHIP`;
      const separator = '═'.repeat(60);
      
      const standings = data.map(standing => {
        const team = standing.Constructor;
        const flagUrl = getFlagUrl(team.nationality);
        const flag = flagUrl ? 
          `<img src="${flagUrl}" alt="${team.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
          '';
        const teamColor = getTeamColor(team.name);
        
        return [
          `P${standing.position}. <span style="color: ${teamColor}">${team.name}</span> ${flag}`,
          `Points: ${standing.points}`,
          `Wins: ${standing.wins}`
        ].join(' | ');
      });

      return [
        header,
        separator,
        ...standings
      ].join('\n');
    } catch (error) {
      console.error('Error fetching constructor standings:', error);
      return '❌ Error: Could not fetch constructor standings. Please try again later.';
    }
  },
};