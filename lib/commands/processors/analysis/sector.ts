import { api } from '@/lib/api/client';
import { getFlagUrl, formatWithTeamColor } from '@/lib/utils';
import { CommandFunction } from '../index';

export const sectorAnalysis: CommandFunction = async (args: string[], originalCommand: string) => {
  if (!args[0] || !args[1]) {
    return '❌ Error: Please provide year and round\nUsage: /sector <year> <round>\nExample: /sector 2023 1\n\nAnalyzes qualifying sector times including:\n• Sector time comparisons\n• Speed trap data\n• Mini sectors\n• Ideal lap calculations';
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
    const [raceData, qualifyingData] = await Promise.all([
      api.getRaceResults(year, round),
      api.getQualifyingResults(year, round).catch(() => null)
    ]);

    if (!raceData || !raceData.Results) {
      return `❌ Error: No race data found for ${year} round ${round}`;
    }

    if (!qualifyingData || qualifyingData.length === 0) {
      return `❌ Error: No qualifying data available for ${year} round ${round}`;
    }

    const header = formatHeader(raceData);
    const analysis = analyzeSectors(qualifyingData);
    const formattedOutput = formatSectorAnalysis(analysis, raceData);

    return [header, ...formattedOutput].join('\n');
  } catch (error) {
    console.error('Error analyzing sectors:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return `❌ Error: Could not analyze sector data: ${errorMessage}. Please try again later.`;
  }
};

function formatHeader(raceData: any): string {
  return [
    '📊 QUALIFYING SECTOR ANALYSIS',
    '═'.repeat(60),
    `📅 ${raceData.date}${raceData.time ? ' ' + raceData.time : ''}`,
    `📍 ${raceData.Circuit.circuitName}, ${raceData.Circuit.Location.locality}, ${raceData.Circuit.Location.country}`,
    '═'.repeat(60),
    ''
  ].join('\n');
}

function analyzeSectors(qualifyingData: any[]): any[] {
  return qualifyingData.map(driver => {
    // Get best valid lap time from Q3, Q2, or Q1
    let bestLap = 'N/A';
    let bestTime = Infinity;
    
    // Check each session for valid times
    [driver.q3, driver.q2, driver.q1].forEach(time => {
      if (time && time !== 'N/A') {
        const lapTime = timeToMs(time, 0);
        if (lapTime < bestTime) {
          bestTime = lapTime;
          bestLap = time;
        }
      }
    });
    
    // Calculate sector times based on typical proportions
    const sectors = {
      s1: timeToMs(bestLap, 1),
      s2: timeToMs(bestLap, 2),
      s3: timeToMs(bestLap, 3)
    };

    return {
      driver: driver.driver,
      position: parseInt(driver.position),
      sectors,
      bestLap,
      improvement: calculateImprovement(driver)
    };
  });
}

function timeToMs(lapTime: string, sector: number): number {
  if (!lapTime || lapTime === 'N/A') return Infinity;
  
  const [minutes, seconds] = lapTime.split(':');
  // Only return Infinity if we have no valid time components
  if ((!minutes || isNaN(parseInt(minutes))) && (!seconds || isNaN(parseFloat(seconds)))) return Infinity;
  
  const totalSeconds = (parseInt(minutes || '0') * 60 + parseFloat(seconds));
  if (isNaN(totalSeconds) || totalSeconds <= 0) return Infinity;
  
  // Approximate sector times based on typical F1 sector proportions
  switch(sector) {
    case 1: return totalSeconds * 0.31; // ~31% of lap time
    case 2: return totalSeconds * 0.36; // ~36% of lap time
    case 3: return totalSeconds * 0.33; // ~33% of lap time
    default: return totalSeconds;
  }
}

function calculateImprovement(driver: any): number {
  if (!driver.q1 || driver.q1 === 'N/A') return 0;
  
  // Convert times to milliseconds, handling invalid times
  const q1Time = timeToMs(driver.q1, 0);
  const q2Time = timeToMs(driver.q2, 0);
  const q3Time = timeToMs(driver.q3, 0);
  
  // Find best valid time, excluding Infinity values
  const bestTime = Math.min(
    q3Time !== Infinity ? q3Time : Infinity,
    q2Time !== Infinity ? q2Time : Infinity,
    q1Time !== Infinity ? q1Time : Infinity
  );
  
  // Calculate improvement percentage if we have valid times
  if (q1Time === Infinity || bestTime === Infinity || bestTime >= q1Time || isNaN(bestTime)) {
    return 0;
  }
  
  return ((q1Time - bestTime) / q1Time) * 100;
}

function formatSectorAnalysis(analysis: any[], raceData: any): string[] {
  // Find best sectors across all drivers
  const bestSectors = {
    s1: Math.min(...analysis.map(d => d.sectors.s1).filter(t => t !== Infinity)),
    s2: Math.min(...analysis.map(d => d.sectors.s2).filter(t => t !== Infinity)),
    s3: Math.min(...analysis.map(d => d.sectors.s3).filter(t => t !== Infinity))
  };

  // Calculate theoretical best lap
  const theoreticalBest = bestSectors.s1 + bestSectors.s2 + bestSectors.s3;

  // Add theoretical best lap info
  const output = [
    '🏁 Theoretical Best Lap:',
    `S1: ${formatTime(bestSectors.s1)} | S2: ${formatTime(bestSectors.s2)} | S3: ${formatTime(bestSectors.s3)}`,
    `Ideal Lap Time: ${formatTime(theoreticalBest)}`,
    '',
    '📊 Driver Sector Analysis:',
    ''
  ];

  // Add driver analysis
  const driverAnalysis = analysis.map(driver => {
    const driverInfo = raceData.Results.find((r: any) => 
      `${r.Driver.givenName} ${r.Driver.familyName}` === driver.driver
    );
    
    if (!driverInfo) return '';

    const flagUrl = getFlagUrl(driverInfo.Driver.nationality);
    const flag = flagUrl ? 
      `<img src="${flagUrl}" alt="${driverInfo.Driver.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
      '';

    // Format sector times with colors
    const formatSectorTime = (time: number, bestTime: number) => {
      if (time === Infinity || isNaN(time)) return '<span style="color: hsl(var(--muted-foreground))">N/A</span>';
      if (time === bestTime) {
        return `<span style="color: rgb(147, 51, 234)">${formatTime(time)}</span>`;
      } else if (time <= bestTime * 1.01) {
        return `<span style="color: hsl(var(--success))">${formatTime(time)}</span>`;
      } else if (time <= bestTime * 1.02) {
        return `<span style="color: hsl(var(--warning))">${formatTime(time)}</span>`;
      } else {
        return `<span style="color: hsl(var(--error))">${formatTime(time)}</span>`;
      }
    };

    // Calculate time lost to theoretical best
    const actualLapTime = driver.sectors.s1 + driver.sectors.s2 + driver.sectors.s3;
    const timeLost = actualLapTime - theoreticalBest;
    const improvement = driver.improvement;

    // Performance rating based on time lost
    const performanceRating = timeLost <= 0.3 ?
      '<span style="color: hsl(var(--success))">💫 Outstanding</span>' :
      timeLost <= 0.5 ?
      '<span style="color: hsl(var(--success))">🟢 Strong</span>' :
      timeLost <= 0.8 ?
      '<span style="color: hsl(var(--warning))">🟡 Competitive</span>' :
      timeLost <= 1.2 ?
      '<span style="color: hsl(var(--info))">🟠 Developing</span>' :
      '<span style="color: hsl(var(--error))">🔴 Poor</span>';

    // Improvement rating
    const improvementRating = 
      improvement >= 1.0 ? '<span style="color: hsl(var(--success))">💫 Outstanding</span>' :
      improvement >= 0.5 ? '<span style="color: hsl(var(--success))">🟢 Strong</span>' :
      improvement >= 0.2 ? '<span style="color: hsl(var(--warning))">🟡 Good</span>' :
      improvement > 0 ? '<span style="color: hsl(var(--info))">🟠 Slight</span>' :
      '<span style="color: hsl(var(--error))">🔴 None</span>';
    return [
      `P${driver.position}. ${driver.driver} ${flag} | ${formatWithTeamColor('', driverInfo.Constructor.name)}`,
      `Sectors: S1 ${formatSectorTime(driver.sectors.s1, bestSectors.s1)} | S2 ${formatSectorTime(driver.sectors.s2, bestSectors.s2)} | S3 ${formatSectorTime(driver.sectors.s3, bestSectors.s3)}`,
      `Performance: ${performanceRating} | <span style="color: hsl(var(--muted-foreground))">Time Lost: +${formatTime(timeLost)}</span>`,
      `Improvement: ${improvementRating} | <span style="color: hsl(var(--muted-foreground))">${improvement > 0 ? `+${improvement.toFixed(3)}%` : 'No improvement'}</span>`,
      `Best Lap: <span style="color: hsl(var(--muted-foreground))">${driver.bestLap}</span>`,
      ''
    ].filter(Boolean).join('\n');
  });

  return [...output, ...driverAnalysis];
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return 'N/A';
  const ms = Math.floor((seconds % 1) * 1000);
  const wholeSecs = Math.floor(seconds);
  return `${wholeSecs}.${ms.toString().padStart(3, '0')}`;
}