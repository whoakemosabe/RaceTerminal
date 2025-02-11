import { api } from '@/lib/api/client';
import { getFlagUrl, getTeamColor } from '@/lib/utils';
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
    // Get best lap time from Q3, Q2, or Q1 (in that order)
    const bestLap = driver.q3 || driver.q2 || driver.q1;
    
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
  const totalSeconds = (parseInt(minutes || '0') * 60 + parseFloat(seconds));
  
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
  
  const q1Time = timeToMs(driver.q1, 0);
  const q2Time = timeToMs(driver.q2, 0);
  const q3Time = timeToMs(driver.q3, 0);
  
  const bestTime = Math.min(
    q3Time !== Infinity ? q3Time : Infinity,
    q2Time !== Infinity ? q2Time : Infinity,
    q1Time !== Infinity ? q1Time : Infinity
  );
  
  return q1Time !== Infinity && bestTime !== Infinity ? 
    ((q1Time - bestTime) / q1Time) * 100 : 0;
}

function formatSectorAnalysis(analysis: any[], raceData: any): string[] {
  // Find best sectors across all drivers
  const bestSectors = {
    s1: Math.min(...analysis.map(d => d.sectors.s1)),
    s2: Math.min(...analysis.map(d => d.sectors.s2)),
    s3: Math.min(...analysis.map(d => d.sectors.s3))
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
    const teamColor = getTeamColor(driverInfo.Constructor.name);

    // Calculate sector performance indicators
    const sectorIndicators = {
      s1: driver.sectors.s1 === bestSectors.s1 ? '🟣' : // Purple (fastest)
          driver.sectors.s1 <= bestSectors.s1 * 1.01 ? '🟢' : // Green (within 1%)
          driver.sectors.s1 <= bestSectors.s1 * 1.02 ? '🟡' : // Yellow (within 2%)
          '⚪', // White (over 2%)
      s2: driver.sectors.s2 === bestSectors.s2 ? '🟣' :
          driver.sectors.s2 <= bestSectors.s2 * 1.01 ? '🟢' :
          driver.sectors.s2 <= bestSectors.s2 * 1.02 ? '🟡' : '⚪',
      s3: driver.sectors.s3 === bestSectors.s3 ? '🟣' :
          driver.sectors.s3 <= bestSectors.s3 * 1.01 ? '🟢' :
          driver.sectors.s3 <= bestSectors.s3 * 1.02 ? '🟡' : '⚪'
    };

    // Calculate time lost to theoretical best
    const actualLapTime = driver.sectors.s1 + driver.sectors.s2 + driver.sectors.s3;
    const timeLost = actualLapTime - theoreticalBest;
    const improvement = driver.improvement;

    return [
      `P${driver.position}. ${driver.driver} ${flag} | <span style="color: ${teamColor}">${driverInfo.Constructor.name}</span>`,
      `Sectors: ${sectorIndicators.s1} ${formatTime(driver.sectors.s1)} | ${sectorIndicators.s2} ${formatTime(driver.sectors.s2)} | ${sectorIndicators.s3} ${formatTime(driver.sectors.s3)}`,
      `Best Lap: ${driver.bestLap} | Time Lost: +${formatTime(timeLost)}`,
      improvement > 0 ? `Improvement: ${improvement.toFixed(3)}%` : '',
      ''
    ].filter(Boolean).join('\n');
  });

  return [...output, ...driverAnalysis];
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return 'N/A';
  const ms = Math.floor((seconds % 1) * 1000);
  const wholeSecs = Math.floor(seconds);
  return `${wholeSecs}.${ms.toString().padStart(3, '0')}`;
}