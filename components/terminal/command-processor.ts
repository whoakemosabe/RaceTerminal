import { api } from '@/lib/api/client';
import { formatDriver, formatCircuit, formatWithTeamColor, formatTime, formatDate, getDriverNicknames, findDriverId, getFlagUrl, countryToCode, findTrackId, trackNicknames, formatDriverComparison, findTeamId, formatTeamComparison, icons, driverNumbers } from '@/lib/utils';
import { commands } from '@/lib/commands';

// Command aliases mapping
export const commandAliases: Record<string, string> = {
  '/d': '/driver',
  '/t': '/track',
  '/s': '/standings',
  '/c': '/constructors',
  '/q': '/qualifying',
  '/r': '/race',
  '/n': '/next',
  '/l': '/live',
  '/w': '/weather',
  '/h': '/help',
  '/p': '/pitstops',
  '/f': '/fastest',
  '/u': '/user',
  '/m': '/compare'
};

import { LOCALSTORAGE_USERNAME_KEY, DEFAULT_USERNAME } from '@/lib/constants';

export async function processCommand(cmd: string) {
  const parts = cmd.split(' ');
  let inputCommand = parts[0].toLowerCase();
  const originalCommand = inputCommand;
  inputCommand = commandAliases[inputCommand] || inputCommand;
  const args = parts.slice(1).map(arg => arg.trim()).filter(Boolean);

  try {
    switch (inputCommand) {
      case '/user':
      case '/username': {
        if (!args[0]) {
          const cmd = originalCommand === '/u' ? '/u' : '/user';
          return `Error: Please provide a username or "reset" (e.g., ${cmd} max or ${cmd} reset)`;
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
            return 'Error: Failed to reset username. Please try again.';
          }
        }

        if (newUsername.length < 2 || newUsername.length > 20) {
          return 'Error: Username must be between 2 and 20 characters';
        }
        
        if (!/^[a-zA-Z0-9_-]+$/.test(newUsername)) {
          return 'Error: Username can only contain letters, numbers, underscores, and hyphens';
        }
        
        try {
          localStorage.setItem(LOCALSTORAGE_USERNAME_KEY, newUsername);
          window.dispatchEvent(new CustomEvent('usernameChange', { detail: newUsername }));
          return `Username successfully changed to "${newUsername}"`;
        } catch (error) {
          console.error('Failed to save username:', error);
          return 'Error: Failed to save username. Please try again.';
        }
      }

      case '/reset': {
        localStorage.removeItem('commandHistory');
        window.location.reload();
        return 'Resetting terminal session...';
      }

      case '/driver': {
        if (!args[0]) {
          const cmd = originalCommand === '/d' ? '/d' : '/driver';
          return `Error: Please provide a driver name (e.g., ${cmd} hamilton)`;
        }
        const searchTerm = args[0].toLowerCase();
        const driverId = findDriverId(searchTerm);
        if (!driverId) {
          return `Error: Driver "${args[0]}" not found. Try using the driver's last name (e.g., hamilton) or their code (e.g., HAM)`;
        }
        
        const data = await api.getDriverInfo(driverId);
        if (!data) {
          return `Error: Could not fetch data for driver "${args[0]}". Please try again later.`;
        }
        
        const driverNumber = driverNumbers[data.driverId] || data.permanentNumber || 'N/A';
        
        const nicknames = getDriverNicknames(data.driverId);
        const age = Math.floor((new Date().getTime() - new Date(data.dateOfBirth).getTime()) / 31557600000);
        const flagUrl = getFlagUrl(data.nationality);
        return `👤 ${data.givenName} ${data.familyName} | [${data.code || 'N/A'}] | [#️ ${driverNumber}] [${nicknames.join(' | ')}] | [${flagUrl ? `<img src="${flagUrl}" alt="${data.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : ''} ${data.nationality}] | [🎂 ${formatDate(data.dateOfBirth)} - 📅 ${age} years old]`;
      }

      case '/standings': {
        const data = await api.getDriverStandings();
        if (!data || data.length === 0) {
          return 'Error: No standings data available. Please try again later.';
        }
        return data.slice(0, 5).map((standing: DriverStanding) => {
          const driverName = `${standing.Driver?.givenName || ''} ${standing.Driver?.familyName || ''}`.trim() || 'Unknown Driver';
          const nationality = standing.Driver?.nationality || 'Unknown';
          const constructorName = standing.Constructor?.name || 'Unknown Team';
          const position = standing.position || '?';
          const points = standing.points || '0';
          
          return `P${position} | ${formatDriver(driverName, nationality)} (${constructorName}) | ${points} pts`;
        }).join(' • ');
      }

      case '/schedule': {
        const data = await api.getRaceSchedule();
        if (!data || data.length === 0) {
          return 'Error: No race schedule data available. Please try again later.';
        }
        return data.slice(0, 5).map((race: any) => 
          `R${race.round} | ${formatDriver(race.raceName, race.country)} | ${formatDate(race.date)}`
        ).join(' • ');
      }

      case '/t':
      case '/track': {
        if (!args[0]) {
          const cmd = originalCommand === '/t' ? '/t' : '/track';
          return `Error: Please provide a track name (e.g., ${cmd} monza). You can use the track name, nickname (e.g., temple of speed), or location (e.g., italian gp)`;
        }
        return await handleTrackCommand(args);
      }

      case '/team': {
        if (!args[0]) {
          return 'Error: Please provide a team name (e.g., /team ferrari)';
        }
        const teamId = findTeamId(args[0]);
        if (!teamId) {
          return `Error: Team "${args[0]}" not found. Try using the team name (e.g., ferrari, mercedes) or nickname (e.g., redbull, mercs)`;
        }
        const data = await api.getConstructorInfo(teamId);
        if (!data) {
          return `Error: Could not fetch data for team "${args[0]}". Please try again later.`;
        }
        const flagUrl = getFlagUrl(data.nationality);
        return `${icons.car} ${data.name} | [${flagUrl ? `<img src="${flagUrl}" alt="${data.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : ''} ${data.nationality}] | First Entry: ${data.firstEntry || 'N/A'} | Championships: ${data.championships || '0'}`;
      }

      case '/compare': {
        if (!args[0] || !args[1] || !args[2]) {
          const cmd = originalCommand === '/m' ? '/m' : '/compare';
          return 'Error: Please specify what to compare and provide two names\n' +
                 'Usage:\n' +
                 `  • Compare drivers: ${cmd} driver verstappen hamilton\n` +
                 `  • Compare teams: ${cmd} team redbull mercedes`;
        }
        
        const type = args[0].toLowerCase();
        
        if (type === 'driver') {
          const [driver1Id, driver2Id] = [findDriverId(args[1]), findDriverId(args[2])];
          if (!driver1Id || !driver2Id) {
            return 'Error: One or both drivers not found. Use driver names or codes (e.g., verstappen, HAM)';
          }
          const data = await api.compareDrivers(driver1Id, driver2Id);
          return formatDriverComparison(data);
        } else if (type === 'team') {
          const [team1Id, team2Id] = [findTeamId(args[1]), findTeamId(args[2])];
          if (!team1Id || !team2Id) {
            return 'Error: One or both teams not found. Use team names or abbreviations (e.g., redbull, mercedes)';
          }
          const data = await api.compareTeams(team1Id, team2Id);
          return formatTeamComparison(data);
        } else {
          return 'Error: Invalid comparison type. Use "driver" or "team" (e.g., /compare driver verstappen hamilton)';
        }
      }

      case '/teams': {
        const data = await api.getConstructorStandings();
        if (!data || data.length === 0) {
          return 'No team standings available for the current season yet.';
        }
        return data.slice(0, 5).map(standing => {
          const flagUrl = getFlagUrl(standing.Constructor.nationality);
          const flag = flagUrl ? 
            `<img src="${flagUrl}" alt="${standing.Constructor.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
            '';
          const teamColor = getTeamColor(standing.Constructor.name);
          const teamName = `<span style="color: ${teamColor}">${standing.Constructor.name}</span>`;
          return [
            `${icons.trophy} P${standing.position}`,
            teamName,
            flag,
            `${icons.activity} ${standing.points} pts`,
            `${icons.car} Wins: ${standing.wins}`
          ].join(' | ');
        }).join('\n');
      }

      case '/next': {
        const data = await api.getNextRace();
        if (!data) {
          return 'Error: No upcoming race information available';
        }
        const countdown = calculateCountdown(new Date(data.date));
        return `${icons.calendar} Next Race: ${data.raceName}\n` +
               `${icons.flag} Circuit: ${data.Circuit.circuitName}\n` +
               `${icons.clock} Date: ${formatDate(data.date)}\n` +
               `⏳ Countdown: ${countdown}`;
      }

      case '/last': {
        const data = await api.getLastRaceResults();
        if (!data) {
          return 'Error: No results available for the last race';
        }
        return `${icons.flag} ${data.raceName} Results:\n` +
               data.Results.slice(0, 5).map(result =>
                 `P${result.position} | ${formatDriver(result.Driver.givenName + ' ' + result.Driver.familyName, result.Driver.nationality)} | ${formatTime(result.Time?.time || result.status)}`
               ).join('\n');
      }

      case '/weather': {
        const data = await api.getTrackWeather();
        if (!data) {
          return 'Error: Weather information is only available during race weekends (Practice, Qualifying, or Race). Please try again during a session.';
        }
        
        const statusMap: Record<string, string> = {
          '1': '🟢 Track Clear',
          '2': '🟡 Yellow Flag',
          '3': '🟣 SC Deployed',
          '4': '🔴 Red Flag',
          '5': '⚫ Session Ended',
          '6': '🟠 VSC Deployed'
        };
        
        return `Track Status: ${statusMap[data.status] || 'Unknown'}\n` +
               `Message: ${data.message || 'No additional information'}\n` +
               `Updated: ${new Date(data.timestamp).toLocaleTimeString()}`;
      }

      case '/tires': {
        if (!args[0]) {
          return 'Error: Please provide a driver number (e.g., /tires 44)';
        }
        const data = await api.getDriverTires(args[0]);
        if (!data) {
          return 'Error: Tire data is only available during active sessions';
        }
        return `${icons.car} Car #${args[0]} Tires:\n` +
               `🔄 Current: ${data.compound}\n` +
               `⏱️ Age: ${data.laps} laps\n` +
               `📊 Wear: ${data.wear}%`;
      }

      case '/fastest': {
        if (!args[0] || !args[1]) {
          const cmd = originalCommand === '/f' ? '/f' : '/fastest';
          return `Error: Please provide year and round (e.g., ${cmd} 2023 1)`;
        }
        const data = await api.getFastestLaps(parseInt(args[0]), parseInt(args[1]));
        if (!data || data.length === 0) {
          return 'Error: No fastest lap data available for this race';
        }
        return data.slice(0, 5).map(lap =>
          `${icons.clock} ${lap.driver} | Lap ${lap.lap} | ${formatTime(lap.time)} | Avg Speed: ${lap.avgSpeed} km/h`
        ).join('\n');
      }

      case '/sprint': {
        if (!args[0] || !args[1]) {
          return 'Error: Please provide year and round (e.g., /sprint 2023 1)';
        }
        const data = await api.getSprintResults(parseInt(args[0]), parseInt(args[1]));
        if (!data || data.length === 0) {
          return 'Error: No sprint race results available';
        }
        return data.slice(0, 5).map(result =>
          `P${result.position} | ${formatDriver(result.Driver.givenName + ' ' + result.Driver.familyName, result.Driver.nationality)} | ${formatTime(result.Time?.time || result.status)}`
        ).join('\n');
      }

      case '/clear': {
        window.dispatchEvent(new CustomEvent('clearTerminal'));
        return 'Terminal history cleared';
      }

      case '/qualifying': {
        if (!args[0] || !args[1]) {
          const cmd = originalCommand === '/q' ? '/q' : '/qualifying';
          return `Error: Please provide both year and round number (e.g., ${cmd} 2023 1)`;
        }
        
        const year = parseInt(args[0]);
        if (isNaN(year) || year < 1950 || year > new Date().getFullYear()) {
          return `Error: Invalid year. Please use a year between 1950 and ${new Date().getFullYear()} (e.g., /qualifying 2023 1)`;
        }
        
        const round = parseInt(args[1]);
        if (isNaN(round) || round < 1 || round > 30) {
          return `Error: Invalid round number. Please use a number between 1 and 30 (e.g., /qualifying ${year} 1)`;
        }
        
        const data = await api.getQualifyingResults(year, round);
        if (!data || data.length === 0) {
          return `Error: No qualifying results found for ${year} round ${round}. Please check the year and round number.`;
        }
        return data.slice(0, 5).map((result: any) => 
          `${result.position}. ${result.driver} - Q3: ${result.q3 || 'N/A'}`).join(' • ');
      }

      case '/race': {
        if (!args[0]) {
          const cmd = originalCommand === '/r' ? '/r' : '/race';
          return `Error: Please provide a year and optionally a round number (e.g., ${cmd} 2023 or ${cmd} 2023 1)`;
        }
        
        const year = parseInt(args[0]);
        if (isNaN(year) || year < 1950 || year > new Date().getFullYear()) {
          return `Error: Invalid year. Please use a year between 1950 and ${new Date().getFullYear()} (e.g., /race 2023)`;
        }
        const round = args[1] ? parseInt(args[1]) : undefined;
        if (args[1] && (isNaN(round!) || round! < 1)) {
          return 'Error: Invalid round number. Please use a number between 1 and 30 (e.g., /race 2023 1)';
        }
        const data = await api.getRaceResults(year, round);
        if (!data || data.length === 0) {
          return `Error: No race results found for ${year}${round ? ` round ${round}` : ''}. Please check the year and round number.`;
        }
        return data.slice(0, 5).map((result: any) =>
          `${icons.trophy} P${result.position} | ${formatDriver(`${result.Driver.givenName} ${result.Driver.familyName}`, result.Driver.nationality)} | ${formatWithTeamColor('', result.Constructor.name)} | ${icons.clock} ${result.Time?.time || result.status || 'No time'}`
        ).join('\n');
      }

      case '/pitstops': {
        if (!args[0] || !args[1]) {
          const cmd = originalCommand === '/p' ? '/p' : '/pitstops';
          return `Error: Please provide both year and round number (e.g., ${cmd} 2023 1)`;
        }
        
        const year = parseInt(args[0]);
        if (isNaN(year) || year < 1950 || year > new Date().getFullYear()) {
          return `Error: Invalid year. Please use a year between 1950 and ${new Date().getFullYear()} (e.g., /pitstops 2023 1)`;
        }
        
        const round = parseInt(args[1]);
        if (isNaN(round) || round < 1 || round > 30) {
          return `Error: Invalid round number. Please use a number between 1 and 30 (e.g., /pitstops ${year} 1)`;
        }
        
        const data = await api.getPitStops(year, round);
        if (!data || data.length === 0) {
          return `Error: No pit stop data found for ${year} round ${round}. Please check the year and round number.`;
        }
        return data.slice(0, 5).map((stop: any) => 
          `${stop.driver} - Lap ${stop.lap}: ${stop.duration}s`).join(' • ');
      }

      case '/help': {
        const categories = {
          'Quick Access': commands.filter(cmd => cmd.command.includes('(/') || cmd.command === '/help'),
          'Race Information': commands.filter(cmd => 
            ['standings', 'schedule', 'next', 'last', 'track'].some(term => cmd.command.includes(term))
          ),
          'Live Data': commands.filter(cmd => 
            ['live', 'telemetry', 'status', 'weather', 'tires'].some(term => cmd.command.includes(term))
          ),
          'Historical Data': commands.filter(cmd => 
            ['race', 'qualifying', 'laps', 'pitstops', 'fastest', 'sprint'].some(term => cmd.command.includes(term))
          ),
          'System': commands.filter(cmd => 
            ['reset', 'user', 'clear'].some(term => cmd.command.includes(term))
          )
        };

        const header = '🚥 RaceTerminal Pro Commands';
        const separator = '═'.repeat(header.length);
        
        const sections = Object.entries(categories).map(([category, cmds]) => {
          const header = `\n${category}:\n${'-'.repeat(category.length + 1)}\n`;
          const commandList = cmds.map(cmd => {
            // Extract shortcut if exists
            const [fullCmd, shortcut] = cmd.command.split('(');
            const mainCommand = fullCmd.trim();
            const shortcutText = shortcut ? ` ${shortcut.replace(')', '')}` : '';
            
            // Format command with proper padding
            const commandPart = (mainCommand + shortcutText).padEnd(30);
            return `  ${icons.tool} ${commandPart} │ ${cmd.description}`;
          }).join('\n');
          return header + commandList;
        });

        const shortcuts = `\n⌨️  Keyboard Shortcuts:\n${'-'.repeat(19)}\n` +
          '  ↑/↓    │ Navigate command history\n' +
          '  Tab    │ Auto-complete command\n' +
          '  Ctrl+L │ Clear terminal\n' +
          '  Ctrl+C │ Cancel command';

        return `${header}\n${separator}${sections.join('\n')}\n${shortcuts}`;
      }

      default:
        return `Error: Unknown command: ${originalCommand}. Type /help to see available commands.`;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Command error:', errorMessage);
    return 'Error: The service is temporarily unavailable. Please try again later.';
  }
}