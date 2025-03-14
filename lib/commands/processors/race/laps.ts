import { api } from '@/lib/api/client';
import { getFlagUrl, getTeamColor } from '@/lib/utils';
import { CommandFunction } from '../index';

export const lapsCommand: CommandFunction = async (args: string[], originalCommand: string) => {
  if (!args[0] || !args[1]) {
    return '❌ Error: Please provide year and round\nUsage: /laps <year> <round> [driver]\nExample: /laps 2023 1 verstappen\n\nShows detailed lap time data including:\n• Individual lap times\n• Sector times\n• Position changes\n• Gap to leader';
  }

  const year = parseInt(args[0]);
  const round = parseInt(args[1]);
  const driverId = args[2]?.toLowerCase();

  if (isNaN(year) || year < 1950 || year > new Date().getFullYear()) {
    return `❌ Error: Invalid year. Please use a year between 1950 and ${new Date().getFullYear()}`;
  }

  if (isNaN(round) || round < 1) {
    return '❌ Error: Invalid round number';
  }

  try {
    const [raceData, lapTimes] = await Promise.all([
      api.getRaceResults(year, round),
      api.getLapTimes(year, round, driverId)
    ]);

    if (!raceData || !raceData.Results) {
      return `❌ Error: No race data found for ${year} round ${round}`;
    }

    if (!lapTimes || lapTimes.length === 0) {
      return `❌ Error: No lap time data available for ${year} round ${round}${driverId ? ` driver ${driverId}` : ''}`;
    }

    const header = formatHeader(raceData, driverId);
    const formattedLaps = formatTopLaps(lapTimes, raceData);

    return [header, formattedLaps].join('\n\n');

  } catch (error) {
    console.error('Error fetching lap times:', error);
    return '❌ Error: Could not fetch lap time data. Please try again later.';
  }
};

function formatHeader(raceData: any, driverId?: string): string {
  const driverInfo = driverId ? 
    raceData.Results.find((r: any) => r.Driver.driverId.toLowerCase() === driverId) : null;

  const title = driverInfo ?
    `LAP TIMES - ${driverInfo.Driver.givenName} ${driverInfo.Driver.familyName}` :
    'LAP TIMES - ALL DRIVERS';

  return [
    `📊 ${title}`,
    '═'.repeat(60),
    `📅 ${raceData.date}${raceData.time ? ' ' + raceData.time : ''}`,
    `📍 ${raceData.Circuit.circuitName}, ${raceData.Circuit.Location.locality}, ${raceData.Circuit.Location.country}`,
    '═'.repeat(60)
  ].join('\n');
}

function formatTopLaps(lapTimes: any[], raceData: any): string {
  // Group laps by driver if no specific driver was requested
  const lapsByDriver = new Map();
  const topTenDrivers = raceData.Results
    .filter((r: any) => parseInt(r.position) <= 10)
    .sort((a: any, b: any) => parseInt(a.position) - parseInt(b.position));
  
  lapTimes.forEach(lap => {
    if (!lapsByDriver.has(lap.driver)) {
      lapsByDriver.set(lap.driver, []);
    }
    lapsByDriver.get(lap.driver).push(lap);
  });

  // Format each driver's laps
  const formattedLaps = topTenDrivers.map(driverInfo => {
    const driverId = driverInfo.Driver.driverId.toUpperCase();
    const driverLaps = lapsByDriver.get(driverId) || [];

    if (!driverInfo) return '';
    
    // Convert lap times to numbers for sorting
    const validLaps = driverLaps
      .map((lap: any) => ({
        lap: parseInt(lap.lap),
        timeSeconds: timeToSeconds(lap.time),
        time: lap.time
      }))
      .filter(lap => !isNaN(lap.timeSeconds) && !isNaN(lap.lap) && lap.time !== 'PIT')
      .sort((a, b) => a.timeSeconds - b.timeSeconds);
    
    // Take top 5 fastest laps
    const topLaps = validLaps.slice(0, 5);

    const flagUrl = getFlagUrl(driverInfo.Driver.nationality);
    const flag = flagUrl ? 
      `<img src="${flagUrl}" alt="${driverInfo.Driver.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
      '';

    const teamColor = getTeamColor(driverInfo.Constructor.name);

    const laps = topLaps.map((lap: any) => 
      `Lap ${lap.lap.toString().padStart(2, ' ')}: ${lap.time}`
    ).join('\n');

    return [
      `P${driverInfo.position}. ${driverInfo.Driver.givenName} ${driverInfo.Driver.familyName} ${flag} | <span style="color: ${teamColor}">${driverInfo.Constructor.name}</span>`,
      laps,
      ''
    ].join('\n');
  });

  return formattedLaps.filter(Boolean).join('\n');
}

function timeToSeconds(time: string): number {
  if (!time) return NaN;
  
  const [minutes, seconds] = time.split(':');
  const mins = parseInt(minutes || '0');
  const secs = parseFloat(seconds || '0');
  
  if (isNaN(mins) || isNaN(secs)) return NaN;
  if (mins < 0 || secs < 0 || secs >= 60) return NaN;
  
  return mins * 60 + secs;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3);
  return `${mins}:${secs.padStart(6, '0')}`;
}