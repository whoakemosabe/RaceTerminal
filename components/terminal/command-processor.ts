import { api } from '@/lib/api/client';
import { formatDriver, formatCircuit, formatWithTeamColor, formatTime, formatDate, getDriverNicknames, findDriverId, getFlagUrl, countryToCode, findTrackId, trackNicknames, formatDriverComparison, findTeamId, formatTeamComparison, icons, driverNumbers, calculateCountdown, getTrackDetails, driverNicknames, teamNicknames, getTeamColor, teamThemes } from '@/lib/utils';
import { commands } from '@/lib/commands';

// Command aliases mapping
export const commandAliases: Record<string, string> = {
  // Single letter shortcuts
  '/ls': '/list',
  '/d': '/driver',
  '/t': '/track',
  '/s': '/standings',
  '/c': '/clear',
  '/q': '/qualifying',
  '/r': '/race',
  '/n': '/next',
  '/l': '/live',
  '/w': '/weather',
  '/h': '/help',
  '/p': '/pitstops',
  '/f': '/fastest',
  '/u': '/user',
  '/m': '/compare',

  // Multi-letter shortcuts
  '/md': '/compare driver',
  '/mt': '/compare team',
  '/st': '/standings',
  '/cs': '/teams',          // Constructor standings
  '/ps': '/pitstops',
  '/fl': '/fastest',
  '/ql': '/qualifying',
  '/nx': '/next',
  '/la': '/last',
  '/cl': '/clear',
  '/rs': '/reset',
  '/sc': '/schedule',
  '/sp': '/sprint',
  '/tr': '/track',
  '/tm': '/team',
  '/wx': '/weather'
};

import { LOCALSTORAGE_USERNAME_KEY, DEFAULT_USERNAME } from '@/lib/constants';

async function handleTrackCommand(args: string[]) {
  const searchTerm = args.join(' ').toLowerCase();
  const trackId = findTrackId(searchTerm);
  
  if (!trackId) {
    return `❌ Error: Track "${args.join(' ')}" not found. Try using the track name (e.g., monza), nickname (e.g., temple of speed), or location (e.g., italian gp)`;
  }
  
  const data = await api.getTrackInfo(trackId);
  if (!data) {
    return `❌ Error: Could not fetch data for track "${args.join(' ')}". Please try again later.`;
  }
  
  const flagUrl = getFlagUrl(data.Location.country);
  const nicknames = trackNicknames[trackId] || [];
  const trackDetails = getTrackDetails(trackId);
  
  return [
    `🏁 ${data.circuitName}`,
    `📍 Location: ${data.Location.locality}, ${data.Location.country} ${flagUrl ? `<img src="${flagUrl}" alt="${data.Location.country} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : ''}`,
    `🗺️ Coordinates: ${data.Location.lat}, ${data.Location.long}`,
    `📏 Track Length: ${trackDetails.length} km`,
    `↩️ Turns: ${trackDetails.turns}`,
    trackDetails.lapRecord ? `⚡ Lap Record: ${trackDetails.lapRecord.time} (${trackDetails.lapRecord.driver}, ${trackDetails.lapRecord.year})` : null,
    nicknames.length > 0 ? `✨ Known as: ${nicknames.join(' | ')}` : null
  ].filter(Boolean).join('\n');
}

export async function processCommand(cmd: string) {
  const parts = cmd.split(' ');
  let inputCommand = parts[0].toLowerCase();
  const originalCommand = inputCommand;
  const args = parts.slice(1).map(arg => arg.trim()).filter(Boolean);
  
  // Handle aliases
  const aliasedCommand = commandAliases[inputCommand];
  if (aliasedCommand) {
    const aliasedParts = aliasedCommand.split(' ');
    inputCommand = aliasedParts[0];
    if (aliasedParts.length > 1) {
      args.unshift(...aliasedParts.slice(1));
    }
  }

  try {
    switch (inputCommand) {
      case '/user':
      case '/username':
        if (!args[0]) {
          const cmd = originalCommand === '/u' ? '/u' : '/user';
          return `❌ Error: Please provide a username or "reset" (e.g., ${cmd} max or ${cmd} reset)`;
        }
        
        const newUsername = args[0].trim();

        // Handle reset command
        if (newUsername.toLowerCase() === 'reset') {
          try {
            localStorage.setItem(LOCALSTORAGE_USERNAME_KEY, DEFAULT_USERNAME);
            window.dispatchEvent(new CustomEvent('usernameChange', { detail: DEFAULT_USERNAME }));
            return `Username reset to "${DEFAULT_USERNAME}"`;
          } catch (error) {
            console.error('Failed to reset username:', error);
            return '❌ Error: Failed to reset username. Please try again.';
          }
        }

        if (newUsername.length < 2 || newUsername.length > 20) {
          return '❌ Error: Username must be between 2 and 20 characters';
        }
        
        if (!/^[a-zA-Z0-9_-]+$/.test(newUsername)) {
          return '❌ Error: Username can only contain letters, numbers, underscores, and hyphens';
        }
        
        try {
          localStorage.setItem(LOCALSTORAGE_USERNAME_KEY, newUsername);
          window.dispatchEvent(new CustomEvent('usernameChange', { detail: newUsername }));
          // Add a small delay to ensure the username is set before showing welcome
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('showWelcome'));
          }, 100);
          return `Username successfully changed to "${newUsername}"`;
        } catch (error) {
          console.error('Failed to save username:', error);
          return '❌ Error: Failed to save username. Please try again.';
        }

      case '/reset': {
        localStorage.removeItem('commandHistory');
        localStorage.removeItem('terminal_theme');
        return null;
      }

      case '/driver': {
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

      case '/standings': {
        const data = await api.getDriverStandings();
        if (!data || data.length === 0) {
          return '❌ Error: No standings data available';
        }
        const standings = data.slice(0, 5).map((standing: DriverStanding) => {
          const driverName = `${standing.Driver?.givenName || ''} ${standing.Driver?.familyName || ''}`.trim() || 'Unknown Driver';
          const nationality = standing.Driver?.nationality || 'Unknown';
          const constructorName = standing.Constructor?.name || 'Unknown Team';
          const position = standing.position || '?';
          const points = standing.points || '0';
          
          return [
            `🏆 Position: P${position}`,
            `👤 Driver: ${formatDriver(driverName, nationality)}`,
            `🏎️ Team: ${constructorName}`,
            `📊 Points: ${points}`
          ].join('\n');
        });
        return `📊 Championship Standings:\n\n${standings.join('\n\n')}`;
      }

      case '/schedule': {
        const data = await api.getRaceSchedule();
        if (!data || data.length === 0) {
          return '❌ Error: No race schedule data available';
        }
        const races = data.slice(0, 5).map((race: any) => [
          `🏁 Round ${race.round}: ${race.raceName}`,
          `🌍 Location: ${race.Circuit.Location.locality}, ${race.country}`,
          `📅 Date: ${formatDate(race.date)}`,
          `⏰ Time: ${race.time || 'TBA'}`
        ].join('\n'));
        return `📅 Upcoming Races:\n\n${races.join('\n\n')}`;
      }

      case '/t':
      case '/track': {
        if (!args[0]) {
          const cmd = originalCommand === '/t' ? '/t' : '/track';
          return `❌ Error: Please provide a track name\nUsage: ${cmd} <name>\nYou can use:\n• Track name (e.g., monza)\n• Nickname (e.g., temple of speed)\n• Location (e.g., italian gp)\nTip: Use /list tracks to see all available tracks\nShortcuts: /t, /track`;
        }
        return await handleTrackCommand(args);
      }

      case '/team': {
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
      }

      case '/compare': {
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
      }

      case '/teams': {
        const data = await api.getConstructorStandings();
        if (!data || data.length === 0) {
          return '❌ Error: No team standings available for the current season yet.';
        }
        return data.map(standing => {
          const flagUrl = getFlagUrl(standing.Constructor.nationality);
          const flag = flagUrl ? 
            `<img src="${flagUrl}" alt="${standing.Constructor.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
            '';
          const teamColor = getTeamColor(standing.Constructor.name);
          const teamName = `<span style="color: ${teamColor}">${standing.Constructor.name}</span>`;
          return [
            `${icons.trophy} P${standing.position} | ${teamName} ${flag} | ${icons.activity} ${standing.points} pts | ${icons.car} Wins: ${standing.wins}`
          ].join('');
        }).join('\n');
      }

      case '/next': {
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
      }

      case '/last': {
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

      case '/weather': {
        try {
          const data = await api.getTrackWeather();
          if (!data || !data.status) {
            return '❌ Error: Weather information is only available during race weekends (Practice, Qualifying, or Race). Please try again during a session.';
          }
          
          const statusMap: Record<string, string> = {
            '1': '🟢 Track Clear',
            '2': '🟡 Yellow Flag',
            '3': '🟣 SC Deployed',
            '4': '🔴 Red Flag',
            '5': '⚫ Session Ended',
            '6': '🟠 VSC Deployed'
          };
          
          const conditions = [
            `${icons.flag} Track Status: ${statusMap[data.status] || 'Unknown'}`,
            `${icons.activity} Air Temp: ${data.air_temperature || 'N/A'}°C`,
            `${icons.activity} Track Temp: ${data.track_temperature || 'N/A'}°C`,
            `${icons.activity} Humidity: ${data.humidity || 'N/A'}%`,
            `${icons.activity} Pressure: ${data.pressure || 'N/A'} hPa`,
            `${icons.activity} Wind Speed: ${data.wind_speed || 'N/A'} km/h`,
            `${icons.activity} Wind Direction: ${data.wind_direction || 'N/A'}°`,
            `${icons.activity} Rainfall: ${data.rainfall ? 'Yes' : 'No'}`,
            `${icons.clock} Updated: ${new Date(data.timestamp).toLocaleTimeString()}`
          ].join('\n');
          
          return conditions;
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          console.error('Weather data error:', errorMessage);
          return 'Error: Unable to fetch weather data. The service might be unavailable during non-race periods.';
        }
      }

      case '/tires': {
        if (!args[0]) {
          return '❌ Error: Please provide a driver number (e.g., /tires 44)';
        }
        const data = await api.getDriverTires(args[0]);
        if (!data) {
          return '❌ Error: Tire data is only available during active sessions';
        }
        return `${icons.car} Car #${args[0]} Tires:\n` +
               `🛞 Current: ${data.compound}\n` +
               `⏱️ Age: ${data.laps} laps\n` +
               `📊 Wear: ${data.wear}%`;
      }

      case '/telemetry': {
        if (!args[0]) {
          return '❌ Error: Please provide a driver number (e.g., /telemetry 44)';
        }
        const data = await api.getDriverTelemetry(args[0]);
        if (!data) {
          return '❌ Error: Telemetry data is only available during active sessions';
        }
        return [
          `🏎️ Car #${args[0]} Telemetry:`,
          `⚡ Speed: ${data.speed || 'N/A'} km/h`,
          `🔄 RPM: ${data.rpm || 'N/A'}`,
          `🎮 Throttle: ${data.throttle || 'N/A'}%`,
          `🛑 Brake: ${data.brake || 'N/A'}%`,
          `⚙️ Gear: ${data.gear || 'N/A'}`,
          `🌡️ Engine Temp: ${data.engine_temperature || 'N/A'}°C`,
          `⏱️ Updated: ${new Date(data.timestamp).toLocaleTimeString()}`
        ].join('\n');
      }

      case '/status': {
        const data = await api.getTrackStatus();
        if (!data) {
          return '❌ Error: Track status is only available during active sessions';
        }
        
        const statusMap: Record<string, string> = {
          '1': '🟢 Track Clear',
          '2': '🟡 Yellow Flag',
          '3': '🟣 Safety Car Deployed',
          '4': '🔴 Red Flag',
          '5': '⚫ Session Ended',
          '6': '🟠 Virtual Safety Car Deployed'
        };
        
        return [
          `🏁 Track Status: ${statusMap[data.status] || 'Unknown'}`,
          `⏱️ Updated: ${new Date(data.timestamp).toLocaleTimeString()}`
        ].join('\n');
      }

      case '/live': {
        const data = await api.getLiveTimings();
        if (!data || data.length === 0) {
          return '❌ Error: Live timing data is only available during active sessions';
        }
        
        return data.map(timing => [
          `P${timing.position} | Car #${timing.driver}`,
          `⏱️ Last Lap: ${timing.lastLapTime || 'N/A'}`,
          `S1: ${timing.sector1 || 'N/A'} | S2: ${timing.sector2 || 'N/A'} | S3: ${timing.sector3 || 'N/A'}`,
          `🚀 Speed Trap: ${timing.speed || 'N/A'} km/h`
        ].join(' | ')).join('\n');
      }

      case '/fastest': {
        if (!args[0] || !args[1]) {
          const cmd = originalCommand === '/f' ? '/f' : '/fastest';
          return `❌ Error: Please provide year and round\nUsage: ${cmd} <year> <round>\nExample: ${cmd} 2023 1\nShortcuts: /f, /fl, /fastest`;
        }
        
        const year = parseInt(args[0]);
        const round = parseInt(args[1]);
        
        if (isNaN(year) || year < 1950 || year > new Date().getFullYear()) {
          return `❌ Error: Invalid year. Please use a year between 1950 and ${new Date().getFullYear()}`;
        }
        
        if (isNaN(round) || round < 1 || round > 30) {
          return '❌ Error: Invalid round number. Please use a number between 1 and 30';
        }
        
        const data = await api.getFastestLaps(parseInt(args[0]), parseInt(args[1]));
        if (!data || data.length === 0) {
          return '❌ Error: No fastest lap data available for this race';
        }
        
        return data.slice(0, 5).map(lap =>
          `⚡ ${lap.Driver.givenName} ${lap.Driver.familyName} | ` +
          `🏎️ Lap ${lap.FastestLap?.lap || 'N/A'} | ` +
          `⏱️ Time: ${lap.FastestLap?.Time?.time || 'N/A'} | ` +
          `🚀 Speed: ${lap.FastestLap?.AverageSpeed?.speed || 'N/A'} km/h`
        ).join('\n');
      }

      case '/sprint': {
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
      }

      case '/clear': {
        window.dispatchEvent(new CustomEvent('clearTerminal'));
        return '🧹 Terminal history cleared';
      }

      case '/qualifying': {
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
      }

      case '/race': {
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
          `${icons.trophy} P${result.position} | ${formatDriver(`${result.Driver.givenName} ${result.Driver.familyName}`, result.Driver.nationality)} | ${formatWithTeamColor('', result.Constructor.name)} | ${icons.clock} ${result.Time?.time || result.status || 'No time'}`
        ).join('\n');
      }

      case '/pitstops': {
        if (!args[0] || !args[1]) {
          const cmd = originalCommand === '/p' ? '/p' : '/pitstops';
          return `❌ Error: Please provide both year and round number\nUsage: ${cmd} <year> <round>\nExample: ${cmd} 2023 1\nShortcuts: /p, /ps, /pitstops`;
        }
        
        const year = parseInt(args[0]);
        if (isNaN(year) || year < 1950 || year > new Date().getFullYear()) {
          return `❌ Error: Invalid year. Please use a year between 1950 and ${new Date().getFullYear()} (e.g., /pitstops 2023 1)`;
        }
        
        const round = parseInt(args[1]);
        if (isNaN(round) || round < 1 || round > 30) {
          return `❌ Error: Invalid round number. Please use a number between 1 and 30 (e.g., /pitstops ${year} 1)`;
        }
        
        const data = await api.getPitStops(year, round);
        if (!data || data.length === 0) {
          return `❌ Error: No pit stop data found for ${year} round ${round}. Please check the year and round number.`;
        }
        return data.slice(0, 5).map((stop: any) => 
          `🔧 ${stop.driver} | 🏎️ Lap ${stop.lap} | ⏱️ ${stop.duration}s`).join('\n');
      }

      case '/help': {
        const categories = {
          '🔍 ESSENTIAL COMMANDS': [
            { command: '/help', aliases: '/h', description: 'Show this help message' },
            { command: '/list', aliases: '/ls', description: 'List all drivers, teams, or tracks' },
            { command: '/clear', aliases: '/c', description: 'Clear terminal history' },
            { command: '/reset', aliases: '/rs', description: 'Reset terminal session' }
          ],
          '⚙️ CUSTOMIZATION': [
            { command: '/user', aliases: '/u', args: '<name|reset>', description: 'Change username or reset to default' },
            { command: '/theme', args: '<team|default>', description: 'Change terminal theme to team colors' },
            { command: '/fontsize', args: '<size|+|-|reset>', description: 'Adjust terminal text size' }
          ],
          '🏆 CURRENT SEASON': [
            { command: '/standings', aliases: '/s', description: 'Driver championship standings' },
            { command: '/teams', aliases: '/cs', description: 'Constructor championship standings' },
            { command: '/schedule', aliases: '/sc', description: 'Full season race calendar' },
            { command: '/next', aliases: '/n, /nx', description: 'Next race info and countdown' },
            { command: '/last', aliases: '/la', description: 'Last race results' }
          ],
          '📊 LIVE SESSION DATA': [
            { command: '/live', aliases: '/l', description: 'Real-time timing and scoring' },
            { command: '/telemetry', args: '<number>', description: 'Live car telemetry data' },
            { command: '/status', aliases: '/st', description: 'Track status and flags' },
            { command: '/weather', aliases: '/w, /wx', description: 'Track weather conditions' },
            { command: '/tires', args: '<number>', description: 'Tire compound and wear data' }
          ],
          '🏎️ INFORMATION': [
            { command: '/driver', aliases: '/d', args: '<name>', description: 'Driver details and stats' },
            { command: '/team', aliases: '/tm', args: '<name>', description: 'Team history and info' },
            { command: '/track', aliases: '/t', args: '<name>', description: 'Circuit details and records' },
            { command: '/compare driver', aliases: '/md', args: '<name1> <name2>', description: 'Compare drivers' },
            { command: '/compare team', aliases: '/mt', args: '<name1> <name2>', description: 'Compare teams' }
          ],
          '📅 HISTORICAL DATA': [
            { command: '/race', aliases: '/r', args: '<year> [round]', description: 'Historical race results' },
            { command: '/qualifying', aliases: '/q', args: '<year> <round>', description: 'Qualifying results' },
            { command: '/sprint', aliases: '/sp', args: '<year> <round>', description: 'Sprint race results' },
            { command: '/pitstops', aliases: '/p', args: '<year> <round>', description: 'Pit stop data' },
            { command: '/fastest', aliases: '/f, /fl', args: '<year> <round>', description: 'Fastest laps' }
          ]
        };

        const header = '🏎️  RACETERMINAL PRO COMMAND REFERENCE  🏁';
        const separator = '═'.repeat(50);
        
        const sections = Object.entries(categories).map(([category, cmds]) => {
          const header = `\n${category}\n${'─'.repeat(50)}\n`;
          const commandList = cmds.map(cmd => 
            `  ${cmd.command}${cmd.args ? ' ' + cmd.args : ''}` +
            `${cmd.aliases ? '\n    ↳ Aliases: ' + cmd.aliases : ''}` +
            `\n    ↳ ${cmd.description}\n`
          ).join('\n');
          return header + commandList;
        });

        const shortcuts = `\n⌨️  KEYBOARD SHORTCUTS\n${'─'.repeat(50)}\n` +
          '  Alt + Enter    Toggle fullscreen terminal\n' +
          '  Tab            Auto-complete command\n' +
          '  ↑/↓            Navigate command history\n' +
          '  Ctrl + L       Clear terminal\n' +
          '  Ctrl + C       Cancel command\n' +
          '  Esc            Close suggestions/fullscreen';

        const tips = `\n💡 TIPS\n${'─'.repeat(50)}\n` +
          '  • Use Tab to auto-complete commands and arguments\n' +
          '  • Commands are case-insensitive\n' +
          '  • Most commands have shorter aliases (shown in parentheses)\n' +
          '  • Use /list to see all available drivers, teams, and tracks\n' +
          '  • Type /theme to customize terminal colors';
        return `${header}\n${separator}${sections.join('\n')}\n${shortcuts}\n${tips}`;
      }

      case '/theme': {
        if (!args[0]) {
          const teamList = Object.entries(teamNicknames)
            .map(([id, names]) => {
              const teamName = names[0];
              const teamColor = getTeamColor(teamName);
              return `• <span style="color: ${teamColor}">${teamName}</span>`;
            })
            .join('\n');
          
          return `❌ Error: Please provide a team name\nUsage: /theme <team> (e.g., /theme ferrari)\n\nAvailable themes:\n${teamList}\n\nOr use "/theme default" to reset to original theme`;
        }

        if (args[0].toLowerCase() === 'default') {
          document.documentElement.style.setProperty('--primary', '186 100% 50%');
          document.documentElement.style.setProperty('--secondary', '288 100% 73%');
          document.documentElement.style.setProperty('--accent', '288 100% 73%');
          document.documentElement.style.setProperty('--border', '186 100% 50%');
          localStorage.removeItem('terminal_theme');
          return '🎨 Terminal theme reset to default colors!';
        }

        const teamId = findTeamId(args[0]);
        if (!teamId) {
          return `❌ Error: Team "${args[0]}" not found. Try using the team name (e.g., ferrari, mercedes)`;
        }

        const theme = teamThemes[teamId];
        if (!theme) {
          return `❌ Error: No theme available for ${teamNicknames[teamId][0]}`;
        }

        try {
          document.documentElement.style.setProperty('--primary', theme.primary);
          document.documentElement.style.setProperty('--secondary', theme.secondary);
          document.documentElement.style.setProperty('--accent', theme.accent);
          document.documentElement.style.setProperty('--border', theme.border);
          
          localStorage.setItem('terminal_theme', teamId);
          
          return `🎨 Terminal theme changed to ${teamNicknames[teamId][0]} colors!`;
        } catch (error) {
          console.error('Failed to set theme:', error);
          return '❌ Error: Failed to apply theme. Please try again.';
        }
      }

      case '/retro': {
        if (args.length > 0) {
          return '❌ Error: /retro is a simple toggle command and does not accept any arguments';
        }

        const currentState = localStorage.getItem('retro_text_enabled');
        const newState = currentState === 'true' ? 'false' : 'true';
        
        try {
          localStorage.setItem('retro_text_enabled', newState);
          document.documentElement.classList.remove('retro-text-enabled', 'retro-text-disabled');
          document.documentElement.classList.add(newState === 'true' ? 'retro-text-enabled' : 'retro-text-disabled');
          
          return newState === 'true' 
            ? '✨ Retro text effect enabled!'
            : '✨ Retro text effect disabled. Terminal text will be normal.';
        } catch (error) {
          console.error('Failed to toggle retro effect:', error);
          return '❌ Error: Failed to toggle retro effect. Please try again.';
        }
      }

      case '/list': {
        if (!args[0]) {
          return `❌ Error: Please specify what to list\nUsage: /list <type>\nAvailable types:\n• drivers - List all drivers\n• teams - List all teams\n• tracks - List all tracks\nShortcuts: /ls, /list`;
        }

        const type = args[0].toLowerCase();

        switch (type) {
          case 'drivers': {
            // Get current drivers
            const currentDrivers = Object.entries(driverNicknames)
              .filter(([id]) => [
                'albon', 'alonso', 'bearman', 'bottas', 'gasly', 'hamilton',
                'hulkenberg', 'leclerc', 'magnussen', 'max_verstappen', 'norris',
                'ocon', 'perez', 'piastri', 'ricciardo', 'russell', 'sainz',
                'sargeant', 'stroll', 'tsunoda', 'zhou'
              ].includes(id))
              .map(([id, nicknames]) => {
                const name = nicknames[0];
                const code = nicknames.find(n => n.length === 3 && n === n.toUpperCase()) || '';
                const nationality = nicknames.find(n => countryToCode[n]) || '';
                const number = driverNumbers[id] || '';
                // Add team information
                const team = (() => {
                  switch(id) {
                    case 'max_verstappen':
                    case 'perez':
                      return 'Red Bull Racing';
                    case 'hamilton':
                    case 'russell':
                      return 'Mercedes-AMG Petronas';
                    case 'leclerc':
                    case 'sainz':
                    case 'bearman':
                      return 'Scuderia Ferrari';
                    case 'norris':
                    case 'piastri':
                      return 'McLaren F1 Team';
                    case 'alonso':
                    case 'stroll':
                      return 'Aston Martin F1 Team';
                    case 'ocon':
                    case 'gasly':
                      return 'Alpine F1 Team';
                    case 'albon':
                    case 'sargeant':
                      return 'Williams Racing';
                    case 'ricciardo':
                    case 'tsunoda':
                      return 'AlphaTauri';
                    case 'bottas':
                    case 'zhou':
                      return 'Alfa Romeo F1 Team';
                    case 'hulkenberg':
                    case 'magnussen':
                      return 'Haas F1 Team';
                    default:
                      return 'Unknown Team';
                  }
                })();
                return { id, name, code, nationality, number, team };
              })
              .sort((a, b) => a.name.localeCompare(b.name));

            // Get retired world champions
            const retiredChampions = Object.entries(driverNicknames)
              .filter(([id, nicknames]) => nicknames.length >= 5 && nicknames[4]?.includes(','))
              .map(([id, nicknames]) => ({
                id,
                name: nicknames[0],
                code: nicknames.find(n => n.length === 3 && n === n.toUpperCase()) || '',
                nationality: nicknames.find(n => countryToCode[n]) || '',
                championships: nicknames[4]
              }))
              .sort((a, b) => a.name.localeCompare(b.name));

            // Get notable non-champion drivers
            const notableDrivers = Object.entries(driverNicknames)
              .filter(([id, nicknames]) => {
                // Not a current driver and not a champion
                return !currentDrivers.some(d => d.id === id) && 
                       !retiredChampions.some(d => d.id === id);
              })
              .map(([id, nicknames]) => ({
                id,
                name: nicknames[0],
                code: nicknames.find(n => n.length === 3 && n === n.toUpperCase()) || '',
                nationality: nicknames.find(n => countryToCode[n]) || ''
              }))
              .sort((a, b) => a.name.localeCompare(b.name));

            // Format sections
            const currentSection = [
              '🏎️ Current F1 Drivers (2024 Season)',
              '═'.repeat(60),
              ...currentDrivers.map(d => {
                const flagUrl = getFlagUrl(d.nationality);
                const flag = flagUrl ? 
                  `<img src="${flagUrl}" alt="${d.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
                  '';
                const teamColor = getTeamColor(d.team);
                return `  #${d.number.padStart(2, '0')} | ${d.name} (${d.code}) ${flag} | <span style="color: ${teamColor}">${d.team}</span>`;
              })
            ];

            const championsSection = [
              '',
              '👑 World Champions',
              '═'.repeat(60),
              ...retiredChampions.map(d => {
                const flagUrl = getFlagUrl(d.nationality);
                const flag = flagUrl ? 
                  `<img src="${flagUrl}" alt="${d.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
                  '';
                return `  ${d.name} (${d.code}) ${flag} | 🏆 ${d.championships}`;
              })
            ];

            const notableSection = [
              '',
              '🌟 Notable Drivers',
              '═'.repeat(60),
              ...notableDrivers.map(d => {
                const flagUrl = getFlagUrl(d.nationality);
                const flag = flagUrl ? 
                  `<img src="${flagUrl}" alt="${d.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
                  '';
                return `  ${d.name} (${d.code}) ${flag}`;
              })
            ];

            return [...currentSection, ...championsSection, ...notableSection].join('\n');
          }

          case 'teams': {
            const teams = Object.entries(teamNicknames)
              .map(([id, names]) => {
                const mainName = names[0];
                const code = names.find(n => n.length === 3 && n === n.toUpperCase()) || '';
                const hq = names[3];
                const established = names[4];
                const championships = names[5];
                const nationality = names[6];
                const color = getTeamColor(mainName);
                const flagUrl = getFlagUrl(nationality);
                const flag = flagUrl ? 
                  `<img src="${flagUrl}" alt="${nationality} flag" style="display:inline-block;vertical-align:middle;margin:0 2px;height:13px;width:25px;object-fit:cover;">` : 
                  '';
                
                return `${flag} <span style="color: ${color}">${mainName}</span> (${code}) | 📍 ${hq} | 📅 ${established} | 🏆 ${championships}`;
              })
              .sort();

            return [
              '🏎️ Current F1 Teams:',
              ...teams
            ].join('\n');
          }

          case 'tracks': {
            const tracks = Object.entries(trackNicknames)
              .map(([id, [name, nickname, code, ...rest]]) => {
                const details = getTrackDetails(id);
                const country = name.includes('GP') ? 
                  name.split(' ').pop()?.replace('GP', '').trim() : 
                  nickname.split(' ').pop()?.replace('GP', '').trim();
                
                const flagUrl = country ? getFlagUrl(country) : '';
                const flag = flagUrl ? 
                  `<img src="${flagUrl}" alt="${country} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
                  '';
                
                const lapRecord = details.lapRecord ? 
                  `${details.lapRecord.time} (${details.lapRecord.driver}, ${details.lapRecord.year})` : 
                  'No record';
                
                return [
                  `  ${flag} ${name}`,
                  `    ${icons.mapPin} ${nickname} | ${icons.car} ${code}`,
                  `    📏 Length: ${details.length}km | ↩️ Turns: ${details.turns}`,
                  `    ⚡ Lap Record: ${lapRecord}`
                ].join('\n');
              })
              .sort();

            return [
              '🏁 Formula 1 Grand Prix Circuits',
              '═'.repeat(60),
              '',
              ...tracks
            ].join('\n');
          }

          default:
            return `❌ Error: Invalid list type "${type}"\nAvailable types: drivers, teams, tracks`;
        }
      }

      default:
        return `❌ Error: Unknown command: ${originalCommand}\nType /help or /h to see all available commands and shortcuts.`;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Command error:', errorMessage);
    return '❌ Error: The service is temporarily unavailable. Please try again later.';
  }
}