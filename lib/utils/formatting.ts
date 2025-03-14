// Formatting utilities
import { teamColors } from '@/lib/data/team-colors';
import { countryToCode } from './countries';
import { calculateTeamStats } from './stats';
import { teamNicknames, getTeamColor } from './teams';
import { driverNicknames } from '@/lib/data/drivers';
import { driverNumbers } from '@/lib/data/driver-numbers';

export function formatDriverComparison(data: any): string {
  const { driver1, driver2 } = data;
  
  if (!driver1?.Races || !driver2?.Races || driver1.Races.length === 0 || driver2.Races.length === 0) {
    return '❌ Error: Could not fetch career comparison data for one or both drivers';
  }

  // Get driver info from first race result that has driver data
  const driver1Info = driver1.Races[0]?.Results?.[0]?.Driver;
  const driver2Info = driver2.Races[0]?.Results?.[0]?.Driver;
  
  if (!driver1Info || !driver2Info) {
    return '❌ Error: Could not fetch driver information';
  }

  const driver1Name = `${driver1Info.givenName} ${driver1Info.familyName}`;
  const driver2Name = `${driver2Info.givenName} ${driver2Info.familyName}`;
  const driver1Nationality = driver1Info.nationality;
  const driver2Nationality = driver2Info.nationality;
  
  const stats1 = calculateDriverStats(driver1.Races);
  const stats2 = calculateDriverStats(driver2.Races);
  
  const totalRaces1 = driver1.totalRaces || 0;
  const totalRaces2 = driver2.totalRaces || 0;
  const poles1 = driver1.poles || 0;
  const poles2 = driver2.poles || 0;
  const wins1 = driver1.wins || 0;
  const wins2 = driver2.wins || 0;
  const fastestLaps1 = driver1.fastestLaps || 0;
  const fastestLaps2 = driver2.fastestLaps || 0;
  
  const flag1 = getFlagUrl(driver1Nationality);
  const flag2 = getFlagUrl(driver2Nationality);
  
  const flagImg1 = flag1 ? `<img src="${flag1}" alt="${driver1Nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:16px;">` : '';
  const flagImg2 = flag2 ? `<img src="${flag2}" alt="${driver2Nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:16px;">` : '';
  
  const maxNameLength = Math.max(driver1Name.length, driver2Name.length);
  const padding = 5;
  const sideWidth = maxNameLength + padding;
  const separator = '\n' + '═'.repeat(sideWidth) + ' 🏁 CAREER STATS 🏁 ' + '═'.repeat(sideWidth) + '\n';
  
  return [
    '🏆 DRIVER HEAD-TO-HEAD COMPARISON 🏆',
    separator,
    `${flagImg1} ${driver1Name}${' '.repeat(Math.max(0, sideWidth - driver1Name.length))}     ${flagImg2} ${driver2Name}`,
    `👑 Championships: ${driver1.championships}${' '.repeat(Math.max(0, sideWidth - driver1.championships.toString().length - 15))}     👑 Championships: ${driver2.championships}`,
    `🏎️ Races: ${totalRaces1}${' '.repeat(Math.max(0, sideWidth - totalRaces1.toString().length - 8))}     🏎️ Races: ${totalRaces2}`,
    `🏆 Race Wins: ${wins1}${' '.repeat(Math.max(0, sideWidth - wins1.toString().length - 12))}     🏆 Race Wins: ${wins2}`,
    `🥇 Podiums: ${stats1.podiums}${' '.repeat(Math.max(0, sideWidth - stats1.podiums.toString().length - 10))}     🥇 Podiums: ${stats2.podiums}`,
    `🎯 Pole Positions: ${poles1}${' '.repeat(Math.max(0, sideWidth - poles1.toString().length - 16))}     🎯 Pole Positions: ${poles2}`,
    `⚡ Fastest Laps: ${fastestLaps1}${' '.repeat(Math.max(0, sideWidth - fastestLaps1.toString().length - 15))}     ⚡ Fastest Laps: ${fastestLaps2}`,
    `💫 Points: ${stats1.points}${' '.repeat(Math.max(0, sideWidth - stats1.points.toString().length - 9))}     💫 Points: ${stats2.points}`,
    `🔥 Best Finish: P${stats1.bestFinish}${' '.repeat(Math.max(0, sideWidth - stats1.bestFinish.toString().length - 14))}     🔥 Best Finish: P${stats2.bestFinish}`,
    `🌟 Points/Race: ${(stats1.points / totalRaces1).toFixed(1)}${' '.repeat(Math.max(0, sideWidth - (stats1.points / totalRaces1).toFixed(1).length - 14))}     🌟 Points/Race: ${(stats2.points / totalRaces2).toFixed(1)}`,
    `🌟 Win Rate: ${((wins1 / totalRaces1) * 100).toFixed(1)}%${' '.repeat(Math.max(0, sideWidth - ((wins1 / totalRaces1) * 100).toFixed(1).length - 11))}     🌟 Win Rate: ${((wins2 / totalRaces2) * 100).toFixed(1)}%`,
    `🎯 Podium Rate: ${((stats1.podiums / totalRaces1) * 100).toFixed(1)}%${' '.repeat(Math.max(0, sideWidth - ((stats1.podiums / totalRaces1) * 100).toFixed(1).length - 14))}     🎯 Podium Rate: ${((stats2.podiums / totalRaces2) * 100).toFixed(1)}%`,
    `🎖️ Pole Rate: ${((poles1 / totalRaces1) * 100).toFixed(1)}%${' '.repeat(Math.max(0, sideWidth - ((poles1 / totalRaces1) * 100).toFixed(1).length - 12))}     🎖️ Pole Rate: ${((poles2 / totalRaces2) * 100).toFixed(1)}%`,
    separator
  ].join('\n');
}

function calculateDriverStats(results: any[]) {
  // Filter out races where the driver didn't participate or was disqualified
  const validResults = results.filter(race => 
    race.Results?.[0] && 
    race.Results[0].position !== undefined &&
    race.Results[0].position !== "R" &&  // Not retired
    race.Results[0].position !== "D" &&  // Not disqualified
    race.Results[0].position !== "E" &&  // Not excluded
    race.Results[0].position !== "W" &&  // Not withdrawn
    race.Results[0].position !== "F" &&  // Not failed to qualify
    race.Results[0].position !== "N"     // Not not classified
  );

  return {
    podiums: validResults.filter((r: any) => {
      const pos = parseInt(r.Results?.[0]?.position);
      return !isNaN(pos) && pos <= 3;
    }).length,
    points: validResults.reduce((acc: number, race: any) => {
      const points = parseFloat(race.Results[0].points || '0');
      return acc + (isNaN(points) ? 0 : points);
    }, 0),
    bestFinish: Math.min(...validResults.map((r: any) => {
      const pos = parseInt(r.Results?.[0]?.position);
      return !isNaN(pos) ? pos : Infinity;
    }))
  };
}

export function getFlagUrl(nationality: string): string {
  const countryCode = countryToCode[nationality];
  if (!countryCode) return '';
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
}

export function formatDriver(text: string, nationality: string): string {
  if (!text || !nationality) return 'Unknown Driver';
  const flagUrl = getFlagUrl(nationality);
  const flag = flagUrl ? ` <img src="${flagUrl}" alt="${nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:16px;">` : '';
  return `${text} [${nationality}${flag}]`;
}

export function formatCircuit(name: string, country: string): string {
  if (!name || !country) return 'Unknown Circuit';
  const flagUrl = getFlagUrl(country);
  const flag = flagUrl ? ` <img src="${flagUrl}" alt="${country} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:16px;">` : '';
  return `${name || 'Unknown Circuit'} [${country}${flag}]`;
}

export function formatWithTeamColor(text: string, team?: string): string {
  // If team is provided, use it directly, otherwise treat text as team name
  const teamName = team || text;
  const color = getTeamColor(text);
  return `<span style="color: ${color}">${text}</span>`;
}

export function formatTime(time: string): string {
  return time;
}

export function formatLapTime(time: string): string {
  return time;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatTeamComparison(data: any): string {
  const { team1, team2 } = data;
  
  if (!team1?.Races || !team2?.Races) {
    return 'Error: Could not fetch comparison data for one or both teams';
  }

  const team1Name = team1.constructorId ? 
    teamNicknames[team1.constructorId]?.[0] || team1.Races[0]?.Constructor?.name || 'Unknown Team' :
    team1.Races[0]?.Constructor?.name || 'Unknown Team';

  const team2Name = team2.constructorId ? 
    teamNicknames[team2.constructorId]?.[0] || team2.Races[0]?.Constructor?.name || 'Unknown Team' :
    team2.Races[0]?.Constructor?.name || 'Unknown Team';
  
  const stats1 = calculateTeamStats(team1.Races);
  const stats2 = calculateTeamStats(team2.Races);
  
  const team1Nationality = team1.Races[0]?.Constructor?.nationality || 'Unknown';
  const team2Nationality = team2.Races[0]?.Constructor?.nationality || 'Unknown';
  
  const flag1 = getFlagUrl(team1Nationality);
  const flag2 = getFlagUrl(team2Nationality);
  
  const flagImg1 = flag1 ? `<img src="${flag1}" alt="${team1Nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:16px;">` : '';
  const flagImg2 = flag2 ? `<img src="${flag2}" alt="${team2Nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:16px;">` : '';
  
  const maxNameLength = Math.max(team1Name.length, team2Name.length);
  const padding = 5;
  const sideWidth = maxNameLength + padding;
  const separator = '\n' + '═'.repeat(sideWidth) + ' 🏁 TEAM STATS 🏁 ' + '═'.repeat(sideWidth) + '\n';
  
  const coloredTeam1 = `<span style="color: ${getTeamColor(team1Name)}">${team1Name}</span>`;
  const coloredTeam2 = `<span style="color: ${getTeamColor(team2Name)}">${team2Name}</span>`;
  
  return [
    '🏎️ TEAM HEAD-TO-HEAD COMPARISON 🏎️',
    separator,
    `${flagImg1} ${coloredTeam1}${' '.repeat(Math.max(0, sideWidth - team1Name.length))}     ${flagImg2} ${coloredTeam2}`,
    `👑 Championships: ${team1.championships}${' '.repeat(Math.max(0, sideWidth - team1.championships.toString().length - 15))}     👑 Championships: ${team2.championships}`,
    `🏎️ Races: ${team1.totalRaces}${' '.repeat(Math.max(0, sideWidth - team1.totalRaces.toString().length - 8))}     🏎️ Races: ${team2.totalRaces}`,
    `🏆 Race Wins: ${stats1.wins}${' '.repeat(Math.max(0, sideWidth - stats1.wins.toString().length - 12))}     🏆 Race Wins: ${stats2.wins}`,
    `🥇 Podiums: ${stats1.podiums}${' '.repeat(Math.max(0, sideWidth - stats1.podiums.toString().length - 10))}     🥇 Podiums: ${stats2.podiums}`,
    `🎯 Pole Positions: ${team1.poles}${' '.repeat(Math.max(0, sideWidth - team1.poles.toString().length - 16))}     🎯 Pole Positions: ${team2.poles}`,
    `⚡ Fastest Laps: ${team1.fastestLaps}${' '.repeat(Math.max(0, sideWidth - team1.fastestLaps.toString().length - 15))}     ⚡ Fastest Laps: ${team2.fastestLaps}`,
    `💫 Points: ${stats1.points}${' '.repeat(Math.max(0, sideWidth - stats1.points.toString().length - 9))}     💫 Points: ${stats2.points}`,
    `🔥 Best Finish: P${stats1.bestFinish}${' '.repeat(Math.max(0, sideWidth - stats1.bestFinish.toString().length - 14))}     🔥 Best Finish: P${stats2.bestFinish}`,
    `📊 Points/Race: ${(stats1.points / team1.totalRaces).toFixed(1)}${' '.repeat(Math.max(0, sideWidth - (stats1.points / team1.totalRaces).toFixed(1).length - 14))}     📊 Points/Race: ${(stats2.points / team2.totalRaces).toFixed(1)}`,
    `🌟 Win Rate: ${((stats1.wins / team1.totalRaces) * 100).toFixed(1)}%${' '.repeat(Math.max(0, sideWidth - ((stats1.wins / team1.totalRaces) * 100).toFixed(1).length - 11))}     🌟 Win Rate: ${((stats2.wins / team2.totalRaces) * 100).toFixed(1)}%`,
    `🎯 Podium Rate: ${((stats1.podiums / team1.totalRaces) * 100).toFixed(1)}%${' '.repeat(Math.max(0, sideWidth - ((stats1.podiums / team1.totalRaces) * 100).toFixed(1).length - 14))}     🎯 Podium Rate: ${((stats2.podiums / team2.totalRaces) * 100).toFixed(1)}%`,
    `🎖️ Pole Rate: ${((team1.poles / team1.totalRaces) * 100).toFixed(1)}%${' '.repeat(Math.max(0, sideWidth - ((team1.poles / team1.totalRaces) * 100).toFixed(1).length - 12))}     🎖️ Pole Rate: ${((team2.poles / team2.totalRaces) * 100).toFixed(1)}%`,
    separator.replace('VS', '🏁')
  ].join('\n');
}