import { api } from '@/lib/api/client';
import { formatDriver, formatCircuit, formatWithTeamColor, formatTime, formatDate, getDriverNicknames, findDriverId, getFlagUrl, countryToCode } from '@/lib/utils';
import { commands } from '@/lib/commands';

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
      case '/driver': {
        if (!args[0]) return 'Error: Please provide a driver name (e.g., /driver hamilton)';
        const searchTerm = args[0].toLowerCase();
        const driverId = findDriverId(searchTerm) || searchTerm;
        const data = await api.getDriverInfo(driverId);
        if (!data) return 'Error: Driver not found';
        const nicknames = getDriverNicknames(data.driverId);
        const age = Math.floor((new Date().getTime() - new Date(data.dateOfBirth).getTime()) / 31557600000);
        const flagUrl = getFlagUrl(data.nationality);
        return `👤 ${data.givenName} ${data.familyName} | [${data.code || 'N/A'}] | [#️ ${data.permanentNumber || 'N/A'}] [${nicknames.join(' | ')}] | [${flagUrl ? `<img src="${flagUrl}" alt="${data.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : ''} ${data.nationality} ] | [🎂 ${formatDate(data.dateOfBirth)} - 📅 ${age} years old]`;
      }

      case '/standings': {
        const data = await api.getDriverStandings();
        if (!data || data.length === 0) return 'Error: No standings data available';
        return data.slice(0, 5).map(standing => 
          `P${standing.position} | ${formatDriver(`${standing.Driver.givenName} ${standing.Driver.familyName}`, standing.Driver.nationality)} (${standing.Constructor.name}) | ${standing.points} pts`
        ).join(' • ');
      }

      case '/schedule': {
        const data = await api.getRaceSchedule();
        if (!data || data.length === 0) return 'Error: No schedule data available';
        return data.slice(0, 5).map((race: any) => 
          `R${race.round} | ${formatDriver(race.raceName, race.country)} | ${formatDate(race.date)}`
        ).join(' • ');
      }

      case '/track': {
        if (!args[0]) return 'Error: Please provide a track ID (e.g., /track monza)';
        const data = await api.getTrackInfo(args[0].toLowerCase());
        if (!data) return 'Error: Track not found';
        return `${icons.flag} ${formatCircuit(data.circuitName, data.Location.country)} |  | ${icons.mapPin} ${data.Location.locality}, ${data.Location.country} | 🌍 ${data.Location.lat}°N, ${data.Location.long}°E`;
      }

      case '/live': {
        const data = await api.getLiveTimings();
        if (!data || data.length === 0) return 'Error: No live timing data available';
        return 'Live timing data available! Showing latest updates...';
      }

      case '/race': {
        if (!args[0]) return 'Error: Please provide a year (e.g., /race 2023)';
        const year = parseInt(args[0]);
        if (isNaN(year)) return 'Error: Invalid year format. Please use a number (e.g., /race 2023)';
        const round = args[1] ? parseInt(args[1]) : undefined;
        if (args[1] && isNaN(round!)) return 'Error: Invalid round format. Please use a number (e.g., /race 2023 1)';
        const data = await api.getRaceResults(year, round);
        if (!data || data.length === 0) return 'Error: No race results found';
        return data.slice(0, 5).map((result: any) =>
          `${icons.trophy} P${result.position} | ${formatDriver(`${result.Driver.givenName} ${result.Driver.familyName}`, result.Driver.nationality)} | ${formatWithTeamColor('', result.Constructor.name)} | ${icons.clock} ${result.Time?.time || result.status || 'No time'}`
        ).join('\n');
      }

      case '/qualifying': {
        if (!args[0] || !args[1]) return 'Error: Please provide year and round (e.g., /qualifying 2023 1)';
        const year = parseInt(args[0]);
        if (isNaN(year)) return 'Error: Invalid year format. Please use a number (e.g., /qualifying 2023 1)';
        const round = parseInt(args[1]);
        if (isNaN(round)) return 'Error: Invalid round format. Please use a number (e.g., /qualifying 2023 1)';
        const data = await api.getQualifyingResults(year, round);
        if (!data || data.length === 0) return 'Error: No qualifying results found';
        return data.slice(0, 5).map((result: any) => 
          `${result.position}. ${result.driver} - Q3: ${result.q3 || 'N/A'}`).join(' • ');
      }

      case '/laps': {
        if (!args[0] || !args[1]) return 'Error: Please provide year and round (e.g., /laps 2023 1)';
        const year = parseInt(args[0]);
        if (isNaN(year)) return 'Error: Invalid year format. Please use a number (e.g., /laps 2023 1)';
        const round = parseInt(args[1]);
        if (isNaN(round)) return 'Error: Invalid round format. Please use a number (e.g., /laps 2023 1)';
        const driverId = args[2];
        const data = await api.getLapTimes(year, round, driverId);
        if (!data || data.length === 0) return 'Error: No lap times found';
        return data.slice(0, 5).map((lap: any) => 
          `Lap ${lap.lap}: ${lap.time} (${lap.driver})`).join(' • ');
      }

      case '/pitstops': {
        if (!args[0] || !args[1]) return 'Error: Please provide year and round (e.g., /pitstops 2023 1)';
        const year = parseInt(args[0]);
        if (isNaN(year)) return 'Error: Invalid year format. Please use a number (e.g., /pitstops 2023 1)';
        const round = parseInt(args[1]);
        if (isNaN(round)) return 'Error: Invalid round format. Please use a number (e.g., /pitstops 2023 1)';
        const data = await api.getPitStops(year, round);
        if (!data || data.length === 0) return 'Error: No pit stop data found';
        return data.slice(0, 5).map((stop: any) => 
          `${stop.driver} - Lap ${stop.lap}: ${stop.duration}s`).join(' • ');
      }

      case '/help': {
        // Split commands into two columns
        const leftColumn = commands.slice(0, Math.ceil(commands.length / 2));
        const rightColumn = commands.slice(Math.ceil(commands.length / 2));
        
        // Format each column
        const formatColumn = (cmds: typeof commands) => {
          return cmds.map(cmd => 
            `${icons.tool} ${cmd.command.padEnd(20)} ${cmd.description}`
          );
        };

        const leftFormatted = formatColumn(leftColumn);
        const rightFormatted = formatColumn(rightColumn);

        // Combine columns with proper spacing
        const output = leftFormatted.map((left, i) => {
          const right = rightFormatted[i] || '';
          return `${left.padEnd(60)}${right}`;
        }).join('\n');

        return `Available Commands:\n\n${output}\n\nData sources: Ergast F1 API, OpenF1 API`;
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