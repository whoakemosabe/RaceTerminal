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
    const formattedOutput = formatOvertakeAnalysis(analysis);

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
  
  // Initialize driver data
  raceData.Results.forEach((result: any) => {
    drivers.set(result.Driver.driverId.toUpperCase(), {
      driver: result,
      startPos: parseInt(result.grid),
      finishPos: parseInt(result.position),
      overtakes: [],
      defends: [],
      drsOvertakes: 0,
      drsDefends: 0
    });
  });

  // Analyze lap-by-lap position changes
  let previousLap = new Map();
  lapTimes.forEach(lap => {
    const lapNum = parseInt(lap.lap);
    const driverId = lap.driver;
    
    if (lapNum === 1) {
      previousLap.set(driverId, parseInt(drivers.get(driverId).startPos));
      return;
    }

    const currentPos = calculatePosition(lapTimes, lapNum, driverId);
    const previousPos = previousLap.get(driverId);

    if (previousPos && currentPos < previousPos) {
      // Gained position(s)
      const driverData = drivers.get(driverId);
      driverData.overtakes.push({
        lap: lapNum,
        positions: previousPos - currentPos,
        isDRS: isDRSOvertake(lapTimes, lapNum, driverId)
      });
      if (isDRSOvertake(lapTimes, lapNum, driverId)) {
        driverData.drsOvertakes++;
      }
    } else if (previousPos && currentPos > previousPos) {
      // Lost position(s)
      const driverData = drivers.get(driverId);
      driverData.defends.push({
        lap: lapNum,
        positions: currentPos - previousPos
      });
    }

    previousLap.set(driverId, currentPos);
  });

  return Array.from(drivers.values());
}

function calculatePosition(lapTimes: any[], lapNum: number, driverId: string): number {
  const lapDrivers = lapTimes
    .filter(lt => parseInt(lt.lap) === lapNum)
    .sort((a, b) => timeToMs(a.time) - timeToMs(b.time));
  
  return lapDrivers.findIndex(d => d.driver === driverId) + 1;
}

function timeToMs(time: string): number {
  const [minutes, seconds] = time.split(':');
  return (parseInt(minutes) * 60 + parseFloat(seconds)) * 1000;
}

function isDRSOvertake(lapTimes: any[], lapNum: number, driverId: string): boolean {
  // Approximate DRS detection based on typical delta time patterns
  const currentLap = lapTimes.find(lt => 
    parseInt(lt.lap) === lapNum && lt.driver === driverId
  );
  const previousLap = lapTimes.find(lt => 
    parseInt(lt.lap) === lapNum - 1 && lt.driver === driverId
  );

  if (!currentLap || !previousLap) return false;

  const delta = timeToMs(currentLap.time) - timeToMs(previousLap.time);
  return delta < -800; // Typical DRS overtake time gain threshold
}

function formatOvertakeAnalysis(analysis: any[]): string[] {
  return analysis.map(data => {
    const driver = data.driver;
    const flagUrl = getFlagUrl(driver.Driver.nationality);
    const flag = flagUrl ? 
      `<img src="${flagUrl}" alt="${driver.Driver.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
      '';
    const teamColor = getTeamColor(driver.Constructor.name);

    const positionsGained = data.startPos - data.finishPos;
    const totalOvertakes = data.overtakes.reduce((sum: number, o: any) => sum + o.positions, 0);
    const totalDefends = data.defends.reduce((sum: number, d: any) => sum + d.positions, 0);

    const overtakeRating = 
      totalOvertakes >= 5 ? '🟣 Exceptional' :
      totalOvertakes >= 3 ? '🟢 Strong' :
      totalOvertakes >= 1 ? '🟡 Active' :
      '⚪ Limited';

    const defendRating =
      totalDefends === 0 && positionsGained > 0 ? '🟢 Clean Race' :
      totalDefends <= 2 ? '🟢 Solid' :
      totalDefends <= 4 ? '🟡 Under Pressure' :
      '🔴 Defensive';

    return [
      `P${data.finishPos}. ${driver.Driver.givenName} ${driver.Driver.familyName} ${flag} | <span style="color: ${teamColor}">${driver.Constructor.name}</span>`,
      `Grid: P${data.startPos} → P${data.finishPos} (${positionsGained > 0 ? '+' : ''}${positionsGained} positions)`,
      `Overtaking: ${overtakeRating} | ${totalOvertakes} moves (${data.drsOvertakes} DRS)`,
      `Defense: ${defendRating} | ${totalDefends} position changes`,
      data.overtakes.length > 0 ? 
        `Key Moves: ${data.overtakes.map((o: any) => `Lap ${o.lap} (${o.isDRS ? 'DRS' : 'Non-DRS'})`).join(', ')}` : '',
      ''
    ].filter(Boolean).join('\n');
  });
}