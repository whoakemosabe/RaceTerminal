import { api } from '@/lib/api/client';
import { formatDriver, formatCircuit, formatWithTeamColor, formatTime, formatDate, getDriverNicknames, findDriverId, getFlagUrl, countryToCode, findTrackId, trackNicknames, formatDriverComparison, findTeamId, formatTeamComparison, icons, driverNumbers, calculateCountdown, getTrackDetails, driverNicknames, teamNicknames, getTeamColor, teamThemes } from '@/lib/utils';
import { commands } from '@/lib/commands';

// Command aliases mapping
export const commandAliases: Record<string, string> = {
  // Single letter shortcuts
  '/ls': '/list',
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
  '/md': '/compare driver',  // Compare drivers
  '/mt': '/compare team',    // Compare teams
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
  
  // Handle command aliases (both single-letter and multi-letter)
  
  // Handle multi-word aliases (like "/md verstappen hamilton")
  const aliasedCommand = commandAliases[inputCommand];
  if (aliasedCommand) {
    const aliasedParts = aliasedCommand.split(' ');
    inputCommand = aliasedParts[0];
    if (aliasedParts.length > 1) {
      // For multi-word aliases (like "/md" -> "/compare driver")
      // Insert the additional parts before user's args
      parts.splice(1, 0, ...aliasedParts.slice(1));
    }
  }
  
  const args = parts.slice(1).map(arg => arg.trim()).filter(Boolean);

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
          return `Username successfully changed to "${newUsername}"`;
        } catch (error) {
          console.error('Failed to save username:', error);
          return '❌ Error: Failed to save username. Please try again.';
        }

      case '/reset': {
        localStorage.removeItem('commandHistory');
        localStorage.removeItem('terminal_theme');
        window.location.reload();
        return 'Resetting terminal session...';
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
      
      case '/fontsize': {
        if (!args[0]) {
          return `❌ Error: Please specify a size or action\nUsage:\n• /fontsize <number> - Set specific size (e.g., /fontsize 14)\n• /fontsize + - Increase size\n• /fontsize - - Decrease size\n• /fontsize reset - Reset to default`;
        }

        const currentSize = parseInt(localStorage.getItem('terminal_font_size') || '14');
        let newSize = currentSize;

        if (args[0] === '+') {
          newSize = Math.min(currentSize + 1, 24);
        } else if (args[0] === '-') {
          newSize = Math.max(currentSize - 1, 10);
        } else if (args[0] === 'reset') {
          newSize = 14;
        } else {
          const size = parseInt(args[0]);
          if (isNaN(size) || size < 10 || size > 24) {
            return '❌ Error: Font size must be between 10 and 24';
          }
          newSize = size;
        }

        try {
          localStorage.setItem('terminal_font_size', newSize.toString());
          window.dispatchEvent(new CustomEvent('fontSizeChange', { detail: newSize }));
          return `Font size changed to ${newSize}px`;
        } catch (error) {
          console.error('Failed to save font size:', error);
          return '❌ Error: Failed to change font size. Please try again.';
        }
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
          'LISTS AND REFERENCES': [
            { command: '/list (/ls) <type>', description: 'List available drivers, teams, or tracks' },
            { command: '/list drivers', description: 'Show all available drivers' },
            { command: '/list teams', description: 'Show all available teams' },
            { command: '/list tracks', description: 'Show all available tracks' }
          ],
          'SYSTEM COMMANDS': [
            { command: '/help (/h)', description: 'Show this help message' },
            { command: '/clear (/cl)', description: 'Clear terminal history' },
            { command: '/reset (/rs)', description: 'Reset terminal session' },
            { command: '/user (/u) <name|reset>', description: 'Change username or reset to default' }
          ],
          'RACE INFORMATION': [
            { command: '/standings (/s)', description: 'View current driver standings' },
            { command: '/teams (/c)', description: 'View constructor standings' },
            { command: '/schedule (/sc)', description: 'View race schedule' },
            { command: '/next (/n)', description: 'Get next race information' },
            { command: '/last (/ls)', description: 'Get last race results' },
            { command: '/track (/t) <name>', description: 'Get circuit information' }
          ],
          'LIVE SESSION DATA': [
            { command: '/live (/l)', description: 'Get live timing data' },
            { command: '/telemetry <number>', description: 'Get car telemetry data' },
            { command: '/status (/st)', description: 'Get track status' },
            { command: '/weather (/w, /wx)', description: 'Get weather conditions' },
            { command: '/tires <number>', description: 'Get tire information' }
          ],
          'DRIVER & TEAM DATA': [
            { command: '/driver (/d) <name>', description: 'Get driver information' },
            { command: '/team (/tm) <name>', description: 'Get team information' },
            { command: '/compare (/m) <type> <name1> <name2>', description: 'Compare drivers or teams' },
            { command: '/compare driver (/md)', description: 'Compare two drivers' },
            { command: '/compare team (/mt)', description: 'Compare two teams' }
          ],
          'HISTORICAL DATA': [
            { command: '/race (/r) <year> [round]', description: 'Get race results' },
            { command: '/qualifying (/q) <year> <round>', description: 'Get qualifying results' },
            { command: '/sprint (/sp) <year> <round>', description: 'Get sprint results' },
            { command: '/pitstops (/p) <year> <round>', description: 'Get pit stop data' },
            { command: '/fastest (/f) <year> <round>', description: 'Get fastest laps' },
            { command: '/laps <year> <round> [driver]', description: 'Get lap times' }
          ]
        };

        const header = 'RaceTerminal Pro Commands';
        const separator = '='.repeat(header.length);
        
        const sections = Object.entries(categories).map(([category, cmds]) => {
          const header = `\n${category}\n${'-'.repeat(category.length)}\n`;
          const commandList = cmds.map(cmd => 
            `  ${cmd.command.padEnd(35)} ${cmd.description}`
          ).join('\n');
          return header + commandList;
        });

        const shortcuts = `\nKEYBOARD SHORTCUTS\n${'-'.repeat(17)}\n` +
          '  Alt+Enter     Toggle fullscreen terminal\n' +
          '  Tab           Auto-complete command\n' +
          '  Up/Down       Navigate command history\n' +
          '  Ctrl+L        Clear terminal\n' +
          '  Ctrl+C        Cancel command\n' +
          '  Esc           Close suggestions/fullscreen';

        return `${header}\n${separator}${sections.join('\n')}\n${shortcuts}`;
      }

      case '/list': {
        if (!args[0]) {
          return `❌ Error: Please specify what to list\nUsage: /list <type>\nAvailable types:\n• drivers - List all drivers\n• teams - List all teams\n• tracks - List all tracks\nShortcuts: /ls, /list`;
        }

        const type = args[0].toLowerCase();

        switch (type) {
          case 'drivers': {
            const currentDrivers = Object.entries(driverNicknames)
              .filter(([id]) => driverNumbers[id])
              .map(([id, nicknames]) => {
                const number = driverNumbers[id];
                const mainName = nicknames[0];
                const code = nicknames.find(n => n.length === 3 && n === n.toUpperCase()) || '';
                return { id, name: mainName, number, code };
              })
              .sort((a, b) => a.name.localeCompare(b.name));

            const legendaryDrivers = Object.entries(driverNicknames)
              .filter(([id]) => !driverNumbers[id])
              .map(([id, nicknames]) => {
                const mainName = nicknames[0];
                const code = nicknames.find(n => n.length === 3 && n === n.toUpperCase()) || '';
                return { id, name: mainName, code };
              })
              .sort((a, b) => a.name.localeCompare(b.name));

            return [
              '👤 Current F1 Drivers:',
              ...currentDrivers.map(d => `  #${d.number.padStart(2, '0')} | ${d.name} (${d.code})`),
              '',
              '🏆 Legendary Champions & Notable Drivers:',
              ...legendaryDrivers.map(d => `  ${d.name} (${d.code})`)
            ].join('\n');
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
              .map(([id, names]) => {
                const details = getTrackDetails(id);
                const mainName = names[0];
                const nickname = names.length > 1 ? names[1] : '';
                return `  ${mainName} (${nickname}) - ${details.length}km, ${details.turns} turns`;
              })
              .sort();

            return [
              '🏁 F1 Circuits:',
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