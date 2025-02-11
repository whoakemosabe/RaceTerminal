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
    let drsOvertakes = 0;
    let previousPosition = startPos;

    // Analyze each lap
    const maxLaps = Math.max(...Array.from(lapTimesByLap.keys()));
    for (let lapNum = 1; lapNum <= maxLaps; lapNum++) {
      const lapData = lapTimesByLap.get(lapNum);
      if (!lapData) continue;

      const currentPosition = calculatePosition(lapData, driverId);

      if (currentPosition < previousPosition) {
        const positionsGained = previousPosition - currentPosition;
        const isDRS = isDRSOvertake(
          lapTimesByLap,
          lapNum,
          driverId,
          previousPosition,
          currentPosition
        );

        overtakes.push({
          lap: lapNum,
          positions: positionsGained,
          isDRS
        });

        if (isDRS) drsOvertakes++;
      }

      previousPosition = currentPosition;
    }

    drivers.set(result.Driver.driverId.toUpperCase(), {
      driver: result,
      startPos,
      finishPos,
      overtakes,
      drsOvertakes,
      totalPositionsGained: Math.max(0, startPos - finishPos)
    });
  });

  return Array.from(drivers.values());
}

function calculatePosition(lapTimes: any[], driverId: string): number {
  const lapDrivers = lapTimes
    .sort((a, b) => timeToMs(a.time) - timeToMs(b.time));
  
  const position = lapDrivers.findIndex(d => d.driver?.toUpperCase() === driverId) + 1;
  return position > 0 ? position : lapDrivers.length + 1;
}

function timeToMs(time: string): number {
  const [minutes, seconds] = time.split(':');
  return (parseInt(minutes || '0') * 60 + parseFloat(seconds || '0')) * 1000;
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

  const currentLap = currentLapTimes.find(lt => lt.driver?.toUpperCase() === driverId);
  const previousLap = previousLapTimes.find(lt => lt.driver?.toUpperCase() === driverId);

  if (!currentLap || !previousLap) return false;

  // Check for significant time gain and DRS zone
  const timeDelta = timeToMs(currentLap.time) - timeToMs(previousLap.time);
  const positionGained = prevPos > currentPos;

  // More accurate DRS detection
  const drsThreshold = -600; // 0.6s time gain threshold for DRS
  const isInDRSZone = timeDelta < drsThreshold;
  
  return isInDRSZone && positionGained;
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
    
    const overtakeRating = 
      totalOvertakes >= 6 ? '🟣 Exceptional' :
      totalOvertakes >= 4 ? '🟢 Strong' :
      totalOvertakes >= 2 ? '🟡 Active' :
      '⚪ Limited';

    // Calculate defensive rating based on how many times they were overtaken
    const defendRating =
      positionsLost === 0 ? '🟢 Excellent' :
      positionsLost <= 2 ? '🟢 Strong' :
      positionsLost <= 4 ? '🟡 Moderate' :
      positionsLost <= 6 ? '🟠 Vulnerable' :
      '🔴 Poor';

    return [
      `P${data.finishPos}. ${driver.Driver.givenName} ${driver.Driver.familyName} ${flag} | <span style="color: ${teamColor}">${driver.Constructor.name}</span>`,
      `Grid: P${data.startPos} → P${data.finishPos} (${gridToFinishChange > 0 ? '+' : ''}${gridToFinishChange} positions)`,
      `Overtaking: ${overtakeRating} | ${totalOvertakes} moves (${data.drsOvertakes} DRS)`,
      `Defense: ${defendRating} | Overtaken ${positionsLost} times`,
      data.overtakes.length > 0 ? 
        `Key Moves: ${data.overtakes.map((o: any) => `Lap ${o.lap} (${o.isDRS ? 'DRS' : 'Non-DRS'})`).join(', ')}` : '',
      ''
    ].filter(Boolean).join('\n');
  });
}