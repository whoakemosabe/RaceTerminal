import { api } from '@/lib/api/client';
import { getFlagUrl, getTeamColor } from '@/lib/utils';
import { CommandFunction } from '../index';

export const overtakeAnalysis: CommandFunction = async (args: string[], originalCommand: string) => {
  if (!args[0] || !args[1]) {
    return '❌ Error: Please provide year and round\nUsage: /overtake <year> <round>\nExample: /overtake 2023 1\n\nAnalyzes race overtakes including:\n• Position changes\n• Overtaking zones\n• Defense statistics\n• DRS effectiveness';
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
      api.getLapTimes(year, round).catch(() => null)
    ]);

    if (!raceData || !raceData.Results) {
      return `❌ Error: No race data found for ${year} round ${round}`;
    }

    if (!lapTimes || lapTimes.length === 0) {
      return `❌ Error: No data available for ${year} round ${round}`;
    }

    const header = formatHeader(raceData);
    const analysis = analyzeOvertakes(raceData, lapTimes);
    const formattedOutput = formatOvertakeAnalysis(analysis, raceData);

    return [header, ...formattedOutput].join('\n');
  } catch (error) {
    console.error('Error analyzing overtakes:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return `❌ Error: Could not analyze overtake data: ${errorMessage}. Please try again later.`;
  }
};

function formatHeader(raceData: any): string {
  return [
    '📊 OVERTAKING ANALYSIS',
    '═'.repeat(60),
    `📅 ${raceData.date}${raceData.time ? ' ' + raceData.time : ''}`,
    `📍 ${raceData.Circuit.circuitName}, ${raceData.Circuit.Location.locality}, ${raceData.Circuit.Location.country}`,
    '═'.repeat(60),
    ''
  ].join('\n');
}

function analyzeOvertakes(raceData: any, lapTimes: any[]): any[] {
  const drivers = new Map();
  
  // Group lap times by lap number for easier access
  const lapTimesByLap = new Map();
  lapTimes.forEach(lap => {
    const lapNum = parseInt(lap.lap);
    // Filter out invalid lap times
    if (!lap.time || typeof lap.time !== 'string') return;
    const time = timeToMs(lap.time);
    if (isNaN(time) || time <= 0) return;

    if (!lapTimesByLap.has(lapNum)) {
      lapTimesByLap.set(lapNum, []);
    }
    lapTimesByLap.get(lapNum).push(lap);
  });
  
  raceData.Results.forEach((result: any, index: number) => {
    const gridPosition = parseInt(result.grid);
    const startPos = gridPosition === 0 ? 
      raceData.Results.length + 1 : // Last place + 1 for pit lane starts
      gridPosition;
    const finishPos = parseInt(result.position);
    const driverId = result.Driver.driverId.toUpperCase();

    // Track position changes through the race
    let overtakes = [];
    let timesBeingOvertaken = 0;
    let drsOvertakes = 0;
    let overtakeAttempts = 0;
    let unsuccessfulAttempts = 0;
    let previousPosition = startPos;
    let lastOvertakeLap = 0;
    let positionsLost = 0;

    // Analyze each lap
    const maxLaps = Math.max(...Array.from(lapTimesByLap.keys()));
    for (let lapNum = 1; lapNum <= maxLaps; lapNum++) {
      const lapData = lapTimesByLap.get(lapNum);
      if (!lapData) continue;

      const currentPosition = calculatePosition(lapData, driverId);
      const positionDelta = previousPosition - currentPosition;

      // Handle position changes
      if (positionDelta > 0) {
        // Check if this is a new overtaking sequence
        const isNewOvertakingSequence = lapNum - lastOvertakeLap > 2;
        
        // Increment attempts counter
        overtakeAttempts++;

        // Analyze DRS usage
        const isDRS = isDRSOvertake(
          lapTimesByLap,
          lapNum,
          driverId,
          previousPosition,
          currentPosition
        );

        overtakes.push({
          lap: lapNum,
          positions: positionDelta,
          isDRS
        });

        if (isDRS) drsOvertakes++;
        lastOvertakeLap = lapNum;
      } else if (positionDelta < 0) {
        // Track being overtaken and unsuccessful attempts
        timesBeingOvertaken += Math.abs(positionDelta);
        positionsLost += Math.abs(positionDelta);
        unsuccessfulAttempts++;
      }

      previousPosition = currentPosition;
    }

    // Calculate true overtaking efficiency
    const successfulOvertakes = overtakes.length;
    const totalAttempts = overtakeAttempts + unsuccessfulAttempts;
    const efficiency = totalAttempts > 0 ? 
      (successfulOvertakes / totalAttempts) * 100 : 0;

    drivers.set(result.Driver.driverId.toUpperCase(), {
      driver: result,
      startPos,
      finishPos,
      overtakes,
      drsOvertakes,
      timesBeingOvertaken,
      positionsLost,
      overtakeAttempts,
      unsuccessfulAttempts,
      overtakeEfficiency: efficiency,
      totalPositionsGained: Math.max(0, startPos - finishPos)
    });
  });

  return Array.from(drivers.values());
}

function calculatePosition(lapTimes: any[], driverId: string): number {
  // Filter out invalid times first
  const validLapTimes = lapTimes.filter(lt => {
    const time = timeToMs(lt.time);
    return !isNaN(time) && time > 0;
  });

  // Sort by valid times only
  const lapDrivers = validLapTimes.sort((a, b) => {
    const timeA = timeToMs(a.time);
    const timeB = timeToMs(b.time);
    return timeA - timeB;
  });
  
  const position = lapDrivers.findIndex(d => d.driver?.toUpperCase() === driverId) + 1;
  return position > 0 ? position : lapDrivers.length + 1;
}

function timeToMs(time: string): number {
  if (!time || typeof time !== 'string') return NaN;

  const [minutes, seconds] = time.split(':');
  const mins = parseInt(minutes || '0');
  const secs = parseFloat(seconds || '0');
  
  if (isNaN(mins) || isNaN(secs)) return NaN;
  if (mins < 0 || secs < 0 || secs >= 60) return NaN;
  
  return (mins * 60 + secs) * 1000;
}

function isDRSOvertake(
  lapTimesByLap: Map<number, any[]>,
  lapNum: number,
  driverId: string,
  prevPos: number,
  currentPos: number
): boolean {
  const currentLapTimes = lapTimesByLap.get(lapNum) || [];
  const previousLapTimes = lapTimesByLap.get(lapNum - 1) || [];
  const nextLapTimes = lapTimesByLap.get(lapNum + 1) || [];

  const currentLap = currentLapTimes.find(lt => lt.driver?.toUpperCase() === driverId);
  const previousLap = previousLapTimes.find(lt => lt.driver?.toUpperCase() === driverId);
  const nextLap = nextLapTimes.find(lt => lt.driver?.toUpperCase() === driverId);

  if (!currentLap || !previousLap) return false;

  // Calculate time deltas
  const currentTime = timeToMs(currentLap.time);
  const previousTime = timeToMs(previousLap.time);
  const nextTime = nextLap ? timeToMs(nextLap.time) : NaN;

  if (isNaN(currentTime) || isNaN(previousTime)) return false;

  const timeDelta = currentTime - previousTime;
  const nextTimeDelta = !isNaN(nextTime) ? nextTime - currentTime : 0;
  const positionGained = prevPos > currentPos;

  // Enhanced DRS detection criteria
  const drsThreshold = -600; // 0.6s time gain threshold for DRS
  const sustainedGainThreshold = 400; // 0.4s threshold for sustained gain
  const isSignificantGain = timeDelta < drsThreshold;
  const isSustainedGain = nextLap && nextTimeDelta > -sustainedGainThreshold; // Not losing significant time next lap
  
  // Check for DRS zone characteristics
  const isDRSZonePattern = 
    isSignificantGain && // Significant time gain
    isSustainedGain && // Sustained speed into next lap
    positionGained && // Actually gained position
    Math.abs(timeDelta) < 2000 && // Not due to pit stop
    Math.abs(timeDelta) > 100; // Filter out timing anomalies

  return isDRSZonePattern;
}

function formatOvertakeAnalysis(analysis: any[], raceData: any): string[] {
  return analysis.map(data => {
    const driver = data.driver;
    const flagUrl = getFlagUrl(driver.Driver.nationality);
    const flag = flagUrl ? 
      `<img src="${flagUrl}" alt="${driver.Driver.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
      '';
    const teamColor = getTeamColor(driver.Constructor.name);

    // Calculate net position change from grid to finish
    const gridToFinishChange = data.startPos - data.finishPos;
    
    // Total overtakes made by the driver
    const totalOvertakes = data.overtakes.reduce((sum: number, o: any) => sum + o.positions, 0);
    
    // Calculate positions lost (if finished behind grid position)
    const positionsLost = Math.max(0, data.finishPos - data.startPos);
    
    // Calculate overtake efficiency (successful moves vs attempts)
    const overtakeEfficiency = data.overtakeEfficiency;
    
    const overtakeRating = 
      totalOvertakes >= 6 ? '<span style="color: hsl(var(--success))">🟣 Exceptional</span>' :
      totalOvertakes >= 4 ? '<span style="color: hsl(var(--success))">🟢 Strong</span>' :
      totalOvertakes >= 2 ? '<span style="color: hsl(var(--warning))">🟡 Active</span>' :
      '<span style="color: hsl(var(--muted-foreground))">⚪ Limited</span>';

    // Enhanced defensive rating that considers track position and times overtaken
    const timesOvertaken = data.overtakes.reduce((sum: number, o: any) => 
      sum + (o.positions < 0 ? Math.abs(o.positions) : 0), 0);
    
    // Base defend score heavily penalized by times overtaken
    const defendScore = Math.max(0, 10 - (positionsLost * 1.5) - (timesOvertaken * 1.2));
    
    // Position bonuses reduced if driver was overtaken multiple times
    const startPosBonus = data.startPos <= 5 ? 2 : // Harder to defend from front
                         data.startPos <= 10 ? 1.5 : 
                         data.startPos <= 15 ? 1 : 0.5;
    const finishPosBonus = data.finishPos <= data.startPos ? 1.5 : 
                          data.finishPos <= data.startPos + 2 ? 0.75 : 0;
    
    // Apply position bonuses but reduce them if overtaken multiple times
    const bonusMultiplier = Math.max(0, 1 - (timesOvertaken * 0.15));
    const adjustedStartBonus = startPosBonus * bonusMultiplier;
    const adjustedFinishBonus = finishPosBonus * bonusMultiplier;
    
    // Calculate final score with adjusted bonuses
    const finalDefendScore = Math.min(10, Math.max(0, 
      defendScore + adjustedStartBonus + adjustedFinishBonus
    ));

    // Calculate defensive rating based on how many times they were overtaken
    const defendRating =
      data.timesBeingOvertaken === 0 && data.positionsLost === 0 ? '<span style="color: hsl(var(--success))">🟣 Impenetrable</span>' :
      data.timesBeingOvertaken <= 1 && data.positionsLost <= 1 ? '<span style="color: hsl(var(--success))">🟢 Excellent</span>' :
      data.timesBeingOvertaken <= 2 && data.positionsLost <= 2 ? '<span style="color: hsl(var(--warning))">🟡 Solid</span>' :
      data.timesBeingOvertaken <= 3 && data.positionsLost <= 3 ? '<span style="color: hsl(var(--info))">🟠 Vulnerable</span>' :
      '<span style="color: hsl(var(--error))">🔴 Poor</span>';

    return [
      `P${data.finishPos}. ${driver.Driver.givenName} ${driver.Driver.familyName} ${flag} | <span style="color: ${teamColor}">${driver.Constructor.name}</span>`,
      `Grid: P${data.startPos} → P${data.finishPos} ${
        gridToFinishChange > 0 
          ? `<span style="color: hsl(var(--success))">(+${gridToFinishChange} positions)</span>` 
          : gridToFinishChange < 0 
            ? `<span style="color: hsl(var(--error)))">(${gridToFinishChange} positions)</span>`
            : '<span style="color: hsl(var(--muted-foreground)))(±0 positions)</span>'
      }`,
      `Overtaking: ${overtakeRating} | <span style="color: hsl(var(--muted-foreground))">${totalOvertakes} moves (${data.drsOvertakes} DRS, ${overtakeEfficiency.toFixed(1)}% efficiency)</span>`,
      `Defense: ${defendRating} | <span style="color: hsl(var(--muted-foreground))">Overtaken ${positionsLost} times</span>`,
      data.overtakes.length > 0 ? 
        `Key Moves: <span style="color: hsl(var(--muted-foreground))">${data.overtakes.map((o: any) => 
          `Lap ${o.lap} (${o.isDRS ? 
            '<span style="color: hsl(var(--success))">DRS</span>' : 
            '<span style="color: hsl(var(--info))">Non-DRS</span>'
          })`
        ).join(', ')}</span>` : '',
      ''
    ].filter(Boolean).join('\n');
  });
}