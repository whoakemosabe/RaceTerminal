import { api } from '@/lib/api/client';
import { findDriverId } from '@/lib/utils';
import { CommandFunction } from '../index';

export const plotCommand: CommandFunction = async (args: string[], originalCommand: string) => {
  if (!args[0] || !args[1] || !args[2]) {
    return '❌ Error: Please provide year, round and driver\nUsage: /plot <year> <round> <driver>\nExample: /plot 2023 1 verstappen\n\nGenerates ASCII lap time progression chart including:\n• Lap time trends\n• Session best laps\n• Performance deltas';
  }

  const year = parseInt(args[0]);
  const round = parseInt(args[1]);
  const driverId = findDriverId(args[2]);

  if (isNaN(year) || year < 1950 || year > new Date().getFullYear()) {
    return `❌ Error: Invalid year. Please use a year between 1950 and ${new Date().getFullYear()}`;
  }

  if (isNaN(round) || round < 1) {
    return '❌ Error: Invalid round number';
  }

  if (!driverId) {
    return `❌ Error: Driver "${args[2]}" not found. Try using:\n• Driver's last name (e.g., verstappen)\n• Driver code (e.g., VER)\n• Driver number (e.g., 1)`;
  }

  try {
    const [raceData, lapTimes] = await Promise.all([
      api.getRaceResults(year, round),
      api.getLapTimes(year, round, driverId)
    ]);

    if (!raceData?.Results?.length) {
      return `❌ Error: No race data found for ${year} round ${round}. Please check the year and round number.`;
    }

    if (!lapTimes || !Array.isArray(lapTimes) || lapTimes.length === 0) {
      return `❌ Error: No lap time data available for ${driverId} in ${year} round ${round}. This could be due to:\n• Driver did not participate\n• Driver did not complete any laps\n• Race data not yet available`;
    }

    // Process lap times more flexibly
    const validLapTimes = lapTimes.filter(lt => {
      if (!lt || !lt.time) return false;
      const time = timeToSeconds(lt.time);
      return !isNaN(time) && time > 0 && time < 300; // Filter unreasonable times (>5 min)
    });

    if (validLapTimes.length === 0) {
      return `❌ Error: No valid lap time data found for ${driverId} in ${year} round ${round}. Please check:\n• Driver participated in the race\n• Race has been completed\n• Data is available for the selected year/round`;
    }

    const header = formatHeader(raceData, driverId);
    const plot = generatePlot(validLapTimes);
    const stats = generateStats(validLapTimes);

    return [header, plot, stats].join('\n\n');

  } catch (error) {
    console.error('Error generating lap time plot:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return `❌ Error: Could not generate lap time plot. Please ensure:\n• Valid year and round numbers (e.g., /plot 2023 1 verstappen)\n• Driver participated in the race\n• Race has been completed\n• Data is available for the selected year/round\n\nError details: ${errorMessage}`;
  }
};

function formatHeader(raceData: any, driverId: string): string {
  const driverResult = raceData.Results.find((r: any) => 
    r.Driver.driverId.toLowerCase() === driverId.toLowerCase()
  );

  if (!driverResult) {
    return '❌ Driver not found in race results';
  }

  return [
    `📈 LAP TIME PROGRESSION - ${driverResult.Driver.givenName} ${driverResult.Driver.familyName}`,
    '═'.repeat(60),
    `📅 ${raceData.date}${raceData.time ? ' ' + raceData.time : ''}`,
    `📍 ${raceData.Circuit.circuitName}, ${raceData.Circuit.Location.locality}, ${raceData.Circuit.Location.country}`,
    '═'.repeat(60)
  ].join('\n');
}

function generatePlot(lapTimes: any[]): string {
  const HEIGHT = 20;
  const WIDTH = 60;
  
  // Convert lap times to seconds and filter invalid ones with better validation
  const times = lapTimes.map(lt => ({
    lap: parseInt(lt.lap),
    time: lt.time ? timeToSeconds(lt.time) : null
  })).filter(lt => lt.time !== null && !isNaN(lt.time) && lt.time > 0 && lt.time < 300); // Filter out unreasonable times (>5 min)

  if (times.length === 0) {
    return '❌ No valid lap times available for plotting. This could be due to:\n• Driver retired early\n• Timing data unavailable\n• Race not completed';
  }

  if (times.length < 3) {
    return '❌ Not enough valid lap times to generate plot (minimum 3 laps required)';
  }

  const minTime = Math.min(...times.map(t => t.time));
  const maxTime = Math.max(...times.map(t => t.time));
  const timeRange = maxTime - minTime;
  const padding = timeRange * 0.1; // Add 10% padding

  // Create plot grid
  const grid = Array(HEIGHT).fill(0).map(() => Array(WIDTH).fill(' '));

  // Plot y-axis
  for (let i = 0; i < HEIGHT; i++) {
    grid[i][6] = '│';
  }

  // Plot x-axis
  for (let i = 6; i < WIDTH; i++) {
    grid[HEIGHT - 1][i] = '─';
  }

  // Add y-axis labels (lap times)
  for (let i = 0; i <= 4; i++) {
    const time = minTime - padding + (timeRange + 2 * padding) * (4 - i) / 4;
    const label = time.toFixed(1).padStart(5);
    const y = Math.floor(HEIGHT * i / 4);
    label.split('').forEach((char, x) => {
      grid[y][x] = char;
    });
    grid[y][5] = '┤';
  }

  // Plot lap times
  times.forEach((lt, i) => {
    const x = 7 + Math.floor((WIDTH - 8) * i / (times.length - 1));
    const normalizedTime = (lt.time - minTime + padding) / (timeRange + 2 * padding);
    const y = Math.floor((1 - normalizedTime) * (HEIGHT - 2));
    
    // Choose marker based on performance
    const marker = lt.time === minTime ? '🟣' : // Purple for fastest
                  lt.time <= minTime * 1.01 ? '🟢' : // Green within 1%
                  lt.time <= minTime * 1.02 ? '🟡' : // Yellow within 2%
                  '⚪'; // White otherwise
    
    if (y >= 0 && y < HEIGHT - 1) {
      grid[y][x] = marker;
    }
  });

  // Add lap number labels
  [1, Math.floor(times.length / 2), times.length].forEach(lap => {
    const x = 7 + Math.floor((WIDTH - 8) * (lap - 1) / (times.length - 1));
    const label = lap.toString();
    label.split('').forEach((char, i) => {
      if (x + i < WIDTH) {
        grid[HEIGHT - 1][x + i] = char;
      }
    });
  });

  // Convert grid to string
  const plotStr = grid.map(row => row.join('')).join('\n');

  // Add legend
  const legend = [
    '',
    'Legend:',
    '🟣 Fastest Lap',
    '🟢 Within 1% of Fastest',
    '🟡 Within 2% of Fastest',
    '⚪ Over 2% of Fastest',
    '',
    'X-Axis: Lap Number',
    'Y-Axis: Lap Time (seconds)'
  ].join('\n');

  return plotStr + '\n' + legend;
}

function generateStats(lapTimes: any[]): string {
  const times = lapTimes
    .map(lt => timeToSeconds(lt.time))
    .filter(t => !isNaN(t) && t > 0 && t < 300); // Filter out unreasonable times

  if (times.length === 0) return '';

  if (times.length < 3) return 'Not enough valid lap times for statistics';

  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  const medianTime = times.sort((a, b) => a - b)[Math.floor(times.length / 2)];
  
  // Calculate consistency (standard deviation)
  const variance = times.reduce((acc, t) => acc + Math.pow(t - avgTime, 2), 0) / times.length;
  const stdDev = Math.sqrt(variance);
  
  const consistencyRating = 
    stdDev < 0.5 ? `<span style="color: hsl(var(--success))">🟢 Excellent</span>` :
    stdDev < 1.0 ? `<span style="color: hsl(var(--success))">🟢 Good</span>` :
    stdDev < 1.5 ? `<span style="color: hsl(var(--warning))">🟡 Fair</span>` :
    `<span style="color: hsl(var(--error))">🔴 Poor</span>`;

  return [
    'Statistics:',
    `Best Lap: ${formatTime(minTime)}`,
    `Average: ${formatTime(avgTime)}`,
    `Median: ${formatTime(medianTime)}`,
    `Range: ${(maxTime - minTime).toFixed(3)}s`,
    `Consistency: ${consistencyRating} (±${stdDev.toFixed(3)}s)`
  ].join('\n');
}

function timeToSeconds(time: string): number {
  if (!time) return NaN;
  
  // Convert to string if needed
  const timeStr = String(time).trim();
  
  // Handle different time formats
  if (timeStr.includes(':')) {
    const [minutes, seconds] = timeStr.split(':');
    const mins = parseInt(minutes);
    const secs = parseFloat(seconds);
    return !isNaN(mins) && !isNaN(secs) ? mins * 60 + secs : NaN;
  } else {
    // Try parsing as seconds only
    const secs = parseFloat(timeStr);
    return !isNaN(secs) ? secs : NaN;
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3);
  return `${mins}:${secs.padStart(6, '0')}`;
}

function timeToMs(time: string): number {
  try {
    const seconds = timeToSeconds(time);
    if (isNaN(seconds)) return NaN;
    return seconds * 1000;
  } catch (error) {
    return NaN;
  }
}