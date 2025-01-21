import { api } from '@/lib/api/client';
import { formatDriver, formatCircuit, formatWithTeamColor, formatTime, formatDate, getDriverNicknames, findDriverId, getFlagUrl, countryToCode, findTrackId } from '@/lib/utils';
import { commands } from '@/lib/commands';
import { DriverStanding } from '@/lib/api/types';
import { LOCALSTORAGE_USERNAME_KEY, DEFAULT_USERNAME } from '@/lib/constants';

const icons = {
  car: '🏎️',
  flag: '🏁',
  activity: '📊',
  calendar: '📅',
  trophy: '🏆',
  clock: '⏱️',
  mapPin: '📍',
  tool: '🔧'
};


export async function processCommand(cmd: string) {
  const parts = cmd.split(' ');
  const command = parts[0].toLowerCase();
  const args = parts.slice(1).map(arg => arg.trim()).filter(Boolean);

  try {
    switch (command) {
      case '/username': {
        if (!args[0]) {
          return 'Error: Please provide a username or "reset" (e.g., /username max or /username reset)';
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
          // Dispatch custom event for same-window updates
          window.dispatchEvent(new CustomEvent('usernameChange', { detail: newUsername }));
          return `Username successfully changed to "${newUsername}"`;
        } catch (error) {
          console.error('Failed to save username:', error);
          return 'Error: Failed to save username. Please try again.';
        }
      }

      case '/driver': {
        if (!args[0]) return 'Error: Please provide a driver name (e.g., /driver hamilton)';
        const searchTerm = args[0].toLowerCase();
        const driverId = findDriverId(searchTerm);
        if (!driverId) {
          return `Error: Driver "${args[0]}" not found. Try using the driver's last name (e.g., hamilton) or their code (e.g., HAM)`;
        }
        
        const data = await api.getDriverInfo(driverId);
        if (!data) {
          return `Error: Could not fetch data for driver "${args[0]}". Please try again later.`;
        }
        
        const nicknames = getDriverNicknames(data.driverId);
        const age = Math.floor((new Date().getTime() - new Date(data.dateOfBirth).getTime()) / 31557600000);
        const flagUrl = getFlagUrl(data.nationality);
        return `👤 ${data.givenName} ${data.familyName} | [${data.code || 'N/A'}] | [#️ ${data.permanentNumber || 'N/A'}] [${nicknames.join(' | ')}] | [${flagUrl ? `<img src="${flagUrl}" alt="${data.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : ''} ${data.nationality}] | [🎂 ${formatDate(data.dateOfBirth)} - 📅 ${age} years old]`;
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
          return 'Error: Please provide a track name (e.g., /track monza). You can use the circuit name, location, or common nicknames.';
        }
        return await handleTrackCommand(args);
      }

      case '/team': {
        if (!args[0]) {
          return 'Error: Please provide a team name (e.g., /team ferrari)';
        }
        const data = await api.getConstructorInfo(args[0].toLowerCase());
        if (!data) {
          return `Error: Team "${args[0]}" not found. Try using the team name (e.g., ferrari, mercedes)`;
        }
        const flagUrl = getFlagUrl(data.nationality);
        return `${icons.car} ${data.name} | [${flagUrl ? `<img src="${flagUrl}" alt="${data.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : ''} ${data.nationality}] | First Entry: ${data.firstEntry || 'N/A'} | Championships: ${data.championships || '0'}`;
      }

      case '/compare': {
        if (!args[0] || !args[1]) {
          return 'Error: Please provide two drivers to compare (e.g., /compare verstappen hamilton)';
        }
        const [driver1Id, driver2Id] = [findDriverId(args[0]), findDriverId(args[1])];
        if (!driver1Id || !driver2Id) {
          return 'Error: One or both drivers not found. Use driver names or codes (e.g., verstappen, HAM)';
        }
        const data = await api.compareDrivers(driver1Id, driver2Id);
        return formatDriverComparison(data);
      }

      case '/constructors': {
        const data = await api.getConstructorStandings();
        if (!data || data.length === 0) {
          return 'Error: No constructor standings available';
        }
        return data.slice(0, 5).map(standing => 
          `P${standing.position} | ${standing.Constructor.name} | ${standing.points} pts | Wins: ${standing.wins}`
        ).join('\n');
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
          return 'Error: Weather information is only available during race weekends';
        }
        return `${icons.mapPin} Track Weather:\n` +
               `🌡️ Temperature: ${data.airTemp}°C\n` +
               `💧 Humidity: ${data.humidity}%\n` +
               `💨 Wind: ${data.windSpeed} km/h\n` +
               `☔ Rain: ${data.rainChance}%`;
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
          return 'Error: Please provide year and round (e.g., /fastest 2023 1)';
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
        localStorage.removeItem('commandHistory');
        return 'Terminal history cleared';
      }

      case '/help': {
        
        const searchTerm = args.join(' ').toLowerCase();
        const circuitId = findTrackId(searchTerm);
        
        if (!circuitId) {
          return `Error: Track "${args.join(' ')}" not found. Try using the track name (e.g., monza), nickname (e.g., temple of speed), or location (e.g., italian gp)`;
        }
        
        const data = await api.getTrackInfo(circuitId);
        if (!data) {
          return `Error: Could not fetch data for track "${args.join(' ')}". Please try again later.`;
        }
        
        const flagUrl = getFlagUrl(data.Location.country);
        const flagImg = flagUrl ? ` <img src="${flagUrl}" alt="${data.Location.country} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:16px;">` : '';
        return `${icons.flag} ${data.circuitName} | [${icons.mapPin} ${data.Location.locality}, ${flagImg} ${data.Location.country}] | [🌍 ${data.Location.lat}°N, ${data.Location.long}°E]`;
      }

      case '/live': {
        const data = await api.getLiveTimings();
        if (!data || data.length === 0) {
          return 'No live timing data available. Live timing is only accessible during active race sessions (Practice, Qualifying, or Race). Please try again during a session.';
        }
        return data.map(timing => 
          `P${timing.position} | Car #${timing.driver} | ${icons.clock} Last Lap: ${timing.lastLapTime || 'N/A'} | S1: ${timing.sector1 || 'N/A'} | S2: ${timing.sector2 || 'N/A'} | S3: ${timing.sector3 || 'N/A'} | ${icons.car} ${timing.speed || 'N/A'} km/h`
        ).join('\n');
      }

      case '/telemetry': {
        if (!args[0]) return 'Error: Please provide a driver number (e.g., /telemetry 44)';
        const driverNumber = args[0];
        if (!driverNumber.match(/^\d+$/)) {
          return 'Error: Invalid driver number. Please use the driver\'s car number (e.g., /telemetry 44 for Hamilton, 1 for Verstappen)';
        }
        
        const data = await api.getDriverTelemetry(driverNumber);
        if (!data) {
          return 'No telemetry data available. Telemetry is only accessible during active race sessions (Practice, Qualifying, or Race). Please try again during a session, or verify the driver number is correct.';
        }
        
        return `Car #${driverNumber} Telemetry:\n` +
               `${icons.car} Speed: ${data.speed || 'N/A'} km/h\n` +
               `🔄 RPM: ${data.rpm || 'N/A'}\n` +
               `🎮 Throttle: ${data.throttle || 'N/A'}%\n` +
               `🛑 Brake: ${data.brake || 'N/A'}%\n` +
               `⚙️ Gear: ${data.gear || 'N/A'}\n` +
               `🌡️ Engine Temp: ${data.engine_temperature || 'N/A'}°C`;
      }

      case '/status': {
        const data = await api.getTrackStatus();
        if (!data) {
          return 'No track status data available. Track status information is only accessible during active race weekends (Practice, Qualifying, or Race). Please try again during a session.';
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

      case '/race': {
        if (!args[0]) {
          return 'Error: Please provide a year and optionally a round number (e.g., /race 2023 or /race 2023 1)';
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

      case '/qualifying': {
        if (!args[0] || !args[1]) {
          return 'Error: Please provide both year and round number (e.g., /qualifying 2023 1)';
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

      case '/laps': {
        if (!args[0] || !args[1]) {
          return 'Error: Please provide year and round (e.g., /laps 2023 1 or /laps 2023 1 HAM)';
        }
        
        const year = parseInt(args[0]);
        if (isNaN(year) || year < 1950 || year > new Date().getFullYear()) {
          return `Error: Invalid year. Please use a year between 1950 and ${new Date().getFullYear()} (e.g., /laps 2023 1)`;
        }
        
        const round = parseInt(args[1]);
        if (isNaN(round) || round < 1 || round > 30) {
          return `Error: Invalid round number. Please use a number between 1 and 30 (e.g., /laps ${year} 1)`;
        }

        const driverId = args[2];
        if (driverId && !findDriverId(driverId) && !driverId.match(/^[A-Za-z]{3}$/)) {
          return 'Error: Invalid driver code. Please use a 3-letter code (e.g., HAM) or driver name (e.g., hamilton)';
        }

        const data = await api.getLapTimes(year, round, driverId);
        if (!data || data.length === 0) {
          return `Error: No lap times found for ${year} round ${round}${driverId ? ` driver ${driverId}` : ''}`;
        }
        
        return data.slice(0, 5).map((lap: any) =>
          `${icons.clock} Lap ${lap.lap.padStart(2, '0')} | ${lap.driver} | ${formatTime(lap.time)}`
        ).join('\n');
      }

      case '/pitstops': {
        if (!args[0] || !args[1]) {
          return 'Error: Please provide both year and round number (e.g., /pitstops 2023 1)';
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
        // Group commands by source
        const groupedCommands = commands.reduce((acc, cmd) => {
          if (!acc[cmd.source]) {
            acc[cmd.source] = [];
          }
          acc[cmd.source].push(cmd);
          return acc;
        }, {} as Record<string, typeof commands>);

        // Format each group
        const sections = Object.entries(groupedCommands).map(([source, cmds]) => {
          const header = `\n${source} Commands:\n${'-'.repeat(source.length + 9)}\n`;
          const commandList = cmds.map(cmd => {
            const commandPart = cmd.command.padEnd(25);
            return `  ${icons.tool} ${commandPart} ${cmd.description}`;
          }).join('\n');
          return header + commandList;
        });

        const header = 'Available Commands';
        const separator = '='.repeat(header.length);
        
        const shortcuts = `\nKeyboard Shortcuts:\n${'-'.repeat(17)}\n` +
          '  ↑/↓        Navigate command history\n' +
          '  Tab        Auto-complete command\n' +
          '  Ctrl+L     Clear terminal\n' +
          '  Ctrl+C     Cancel command';

        return `${header}\n${separator}${sections.join('\n')}\n${shortcuts}`;
      }

      default:
        return `Error: Unknown command: ${command}. Type /help to see available commands.`;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Command error:', errorMessage);
    return 'Error: The service is temporarily unavailable. Please try again later.';
  }
}