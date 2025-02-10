import { api } from '@/lib/api/client';
import { getFlagUrl, getTeamColor } from '@/lib/utils';
import { CommandFunction } from '../index';
import { GapAnalysis } from './types';

export const gapAnalysis: CommandFunction = async (args: string[], originalCommand: string) => {
  if (!args[0] || !args[1]) {
    return '❌ Error: Please provide year and round\nUsage: /gap <year> <round>\nExample: /gap 2023 1\n\nAnalyzes race gaps including:\n• Intervals between drivers\n• Gap to leader\n• Position changes\n• Battle analysis';
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
    const [raceData, lapTimes] = await Promise.all([
      api.getRaceResults(year, round),
      api.getLapTimes(year, round)
    ]);

    if (!raceData || !raceData.Results || !lapTimes || lapTimes.length === 0) {
      return '❌ Error: No data available for this race';
    }

    const header = formatHeader(raceData);
    const gapAnalysis = analyzeGaps(raceData, lapTimes);
    const formattedOutput = formatGapAnalysis(gapAnalysis);

    return [header, ...formattedOutput].join('\n');

  } catch (error) {
    console.error('Error analyzing race gaps:', error);
    return '❌ Error: Could not analyze race gaps. Please try again later.';
  }
};

function formatHeader(raceData: any): string {
  return [
    '📊 RACE GAP ANALYSIS',
    `📅 ${raceData.date}${raceData.time ? ' ' + raceData.time : ''}`,
    `📍 ${raceData.Circuit.circuitName}, ${raceData.Circuit.Location.locality}, ${raceData.Circuit.Location.country}`,
    '═'.repeat(60),
    ''
  ].join('\n');
}

function analyzeGaps(raceData: any, lapTimes: any[]): GapAnalysis[] {
  const driverLaps = groupLapsByDriver(lapTimes);
  
  return raceData.Results.map((result: any) => {
    const driverId = result.Driver.driverId.toUpperCase();
    const driverLapTimes = driverLaps.get(driverId) || [];
    
    const position = parseInt(result.position);
    const driverAhead = position > 1 ? 
      raceData.Results.find((r: any) => parseInt(r.position) === position - 1) : 
      null;
    
    const gapToAhead = calculateGapToAhead(driverLapTimes, driverAhead, driverLaps);
    const avgGapToLeader = calculateGapToLeader(driverLapTimes, raceData.Results[0], driverLaps);
    const gapConsistency = calculateGapConsistency(driverLapTimes, raceData.Results[0], driverLaps);
    const { closestRival, minGap } = findClosestRival(driverLapTimes, result, raceData.Results, driverLaps);

    return {
      driver: result.Driver,
      constructor: result.Constructor,
      position: result.position,
      gapToAhead,
      driverAhead: driverAhead ? {
        name: `${driverAhead.Driver.givenName} ${driverAhead.Driver.familyName}`,
        nationality: driverAhead.Driver.nationality
      } : null,
      avgGapToLeader,
      gapConsistency,
      closestRival,
      minGap
    };
  });
}

function groupLapsByDriver(lapTimes: any[]): Map<string, any[]> {
  const driverLaps = new Map();
  lapTimes.forEach(lap => {
    if (!driverLaps.has(lap.driver)) {
      driverLaps.set(lap.driver, []);
    }
    driverLaps.get(lap.driver).push({
      lap: parseInt(lap.lap),
      time: lap.time
    });
  });
  return driverLaps;
}

function timeToSeconds(time: string): number {
  const [minutes, seconds] = time.split(':');
  return parseFloat(minutes) * 60 + parseFloat(seconds);
}

function calculateGapToAhead(driverLaps: any[], driverAhead: any, driverLapsMap: Map<string, any[]>): number | null {
  if (!driverAhead) return null;
  
  const aheadLaps = driverLapsMap.get(driverAhead.Driver.driverId.toUpperCase()) || [];
  const gaps = driverLaps.map((lap, index) => {
    const aheadLap = aheadLaps[index];
    if (!aheadLap || !lap) return null;
    
    return timeToSeconds(lap.time) - timeToSeconds(aheadLap.time);
  }).filter(gap => gap !== null);

  return gaps.length > 0 ? gaps.reduce((a, b) => a + b, 0) / gaps.length : null;
}

function calculateGapToLeader(driverLaps: any[], leader: any, driverLapsMap: Map<string, any[]>): number | null {
  const leaderLaps = driverLapsMap.get(leader.Driver.driverId.toUpperCase()) || [];
  const gaps = driverLaps.map((lap, index) => {
    const leaderLap = leaderLaps[index];
    if (!leaderLap || !lap) return null;
    
    return timeToSeconds(lap.time) - timeToSeconds(leaderLap.time);
  }).filter(gap => gap !== null);

  return gaps.length > 0 ? gaps.reduce((a, b) => a + b, 0) / gaps.length : null;
}

function calculateGapConsistency(driverLaps: any[], leader: any, driverLapsMap: Map<string, any[]>): number | null {
  const leaderLaps = driverLapsMap.get(leader.Driver.driverId.toUpperCase()) || [];
  const gaps = driverLaps.map((lap, index) => {
    const leaderLap = leaderLaps[index];
    if (!leaderLap || !lap) return null;
    
    return timeToSeconds(lap.time) - timeToSeconds(leaderLap.time);
  }).filter(gap => gap !== null);

  if (gaps.length === 0) return null;

  const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  return Math.sqrt(gaps.reduce((acc, gap) => 
    acc + Math.pow(gap - avgGap, 2), 0
  ) / gaps.length);
}

function findClosestRival(driverLaps: any[], driver: any, allDrivers: any[], driverLapsMap: Map<string, any[]>): { closestRival: any, minGap: number } {
  const rivalGaps = new Map();
  
  allDrivers.forEach(rival => {
    if (rival.Driver.driverId === driver.Driver.driverId) return;
    
    const rivalLaps = driverLapsMap.get(rival.Driver.driverId.toUpperCase()) || [];
    const gaps = driverLaps.map((lap, index) => {
      const rivalLap = rivalLaps[index];
      if (!rivalLap || !lap) return null;
      
      return Math.abs(timeToSeconds(lap.time) - timeToSeconds(rivalLap.time));
    }).filter(gap => gap !== null);

    if (gaps.length > 0) {
      rivalGaps.set(rival.Driver.driverId, {
        avgGap: gaps.reduce((a, b) => a + b, 0) / gaps.length,
        name: `${rival.Driver.givenName} ${rival.Driver.familyName}`
      });
    }
  });

  let closestRival = null;
  let minGap = Infinity;
  rivalGaps.forEach((data, rivalId) => {
    if (data.avgGap < minGap) {
      minGap = data.avgGap;
      closestRival = data;
    }
  });

  return { closestRival, minGap };
}

function formatGapAnalysis(analysis: GapAnalysis[]): string[] {
  return analysis.map(driver => {
    const flagUrl = getFlagUrl(driver.driver.nationality);
    const flag = flagUrl ? `<img src="${flagUrl}" alt="${driver.driver.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : '';
    const teamColor = getTeamColor(driver.constructor.name);

    const gapToLeader = driver.avgGapToLeader !== null ?
      `+${driver.avgGapToLeader.toFixed(3)}s` :
      'N/A';
      
    const gapToAheadStr = driver.gapToAhead !== null ?
      `+${driver.gapToAhead.toFixed(3)}s to ${driver.driverAhead?.name}` :
      'N/A';

    const consistency = driver.gapConsistency !== null ?
      driver.gapConsistency.toFixed(3) :
      'N/A';

    const rivalInfo = driver.closestRival ?
      `${driver.closestRival.name} (+${driver.minGap.toFixed(3)}s)` :
      'N/A';

    const consistencyRating = driver.gapConsistency !== null ?
      driver.gapConsistency < 0.5 ? '🟢 High' :
      driver.gapConsistency < 1.0 ? '🟡 Medium' :
                                   '🔴 Low' :
      'N/A';

    // Format the main driver line according to the requested format
    const driverLine = `P${driver.position}. ${driver.driver.givenName} ${driver.driver.familyName} | ${driver.driver.nationality} ${flag} | <span style="color: ${teamColor}">${driver.constructor.name}</span>`;

    return [
      driverLine,
      `Gap to P${parseInt(driver.position) - 1}: ${gapToAheadStr}`,
      `Gap to Leader: ${gapToLeader}`,
      `Consistency: ${consistencyRating} (±${consistency}s)`,
      `Closest Battle: ${rivalInfo}`,
      ''
    ].join('\n');
  });
}