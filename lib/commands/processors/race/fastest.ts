import { api } from '@/lib/api/client';
import { getFlagUrl, getTeamColor } from '@/lib/utils';
import { CommandFunction } from '../index';

export const fastestLapCommand: CommandFunction = async (args: string[], originalCommand: string) => {
  if (!args[0] || !args[1]) {
    return '❌ Error: Please provide year and round\nUsage: /fastest <year> <round>\nExample: /fastest 2023 1\n\nShows fastest lap data including:\n• Lap time\n• Driver\n• Team\n• Lap number\n• Speed trap';
  }

  const year = parseInt(args[0]);
  const round = parseInt(args[1]);

  if (isNaN(year) || year < 1950 || year > new Date().getFullYear()) {
    return `❌ Error: Invalid year. Please use a year between 1950 and ${new Date().getFullYear()}`;
  }

  if (isNaN(round) || round < 1) {
    return '❌ Error: Invalid round number';
  }

  try {
    const raceData = await api.getRaceResults(year, round);
    if (!raceData || !raceData.Results) {
      return `❌ Error: No race data found for ${year} round ${round}`;
    }

    // Find driver with fastest lap
    const fastestLapDriver = raceData.Results.find((r: any) => 
      r.FastestLap?.rank === "1"
    );

    if (!fastestLapDriver || !fastestLapDriver.FastestLap) {
      return `❌ Error: No fastest lap data available for ${year} round ${round}`;
    }

    const flagUrl = getFlagUrl(fastestLapDriver.Driver.nationality);
    const flag = flagUrl ? 
      `<img src="${flagUrl}" alt="${fastestLapDriver.Driver.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
      '';
    const teamColor = getTeamColor(fastestLapDriver.Constructor.name);

    return [
      '⚡ FASTEST LAP DETAILS',
      '═'.repeat(50),
      `📅 ${raceData.date}${raceData.time ? ' ' + raceData.time : ''}`,
      `📍 ${raceData.Circuit.circuitName}, ${raceData.Circuit.Location.locality}, ${raceData.Circuit.Location.country}`,
      '',
      `Driver: ${fastestLapDriver.Driver.givenName} ${fastestLapDriver.Driver.familyName} ${flag}`,
      `Team: <span style="color: ${teamColor}">${fastestLapDriver.Constructor.name}</span>`,
      `Time: ${fastestLapDriver.FastestLap.Time.time}`,
      `Lap: ${fastestLapDriver.FastestLap.lap}`,
      fastestLapDriver.FastestLap.AverageSpeed ? 
        `Average Speed: ${fastestLapDriver.FastestLap.AverageSpeed.speed} ${fastestLapDriver.FastestLap.AverageSpeed.units}` : 
        ''
    ].filter(Boolean).join('\n');
  } catch (error) {
    console.error('Error fetching fastest lap data:', error);
    return '❌ Error: Could not fetch fastest lap data. Please try again later.';
  }
};