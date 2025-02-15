export function formatTeamComparison(data: any): string {
  const { team1, team2 } = data;
  
  if (!team1 || !team2) {
    return 'Error: Could not fetch comparison data for one or both teams';
  }

  const team2Name = team2.constructorId ? 
    teamNicknames[team2.constructorId]?.[0] || team2.Races[0]?.Constructor?.name || 'Unknown Team' :
    team2.Races[0]?.Constructor?.name || 'Unknown Team';

  const team1Nationality = team1.Races[0]?.Constructor?.nationality || 'Unknown';
  const team2Nationality = team2.Races[0]?.Constructor?.nationality || 'Unknown';
  
  const flagImg1 = getFlagUrl(team1Nationality);
  const flagImg2 = getFlagUrl(team2Nationality);
  
  const coloredTeam1 = formatWithTeamColor(team1Name);
  const coloredTeam2 = formatWithTeamColor(team2Name);
  
  const sideWidth = 25;
  const separator = '='.repeat(sideWidth * 2 + 5) + '\n        VS        \n' + '='.repeat(sideWidth * 2 + 5);
  
  return [
    '🏎️ TEAM HEAD-TO-HEAD COMPARISON 🏎️',
    separator,
    `${flagImg1} ${coloredTeam1}${' '.repeat(Math.max(0, sideWidth - team1Name.length))}     ${flagImg2} ${coloredTeam2}`,
    `👑 Championships: ${team1.championships}${' '.repeat(Math.max(0, sideWidth - String(team1.championships).length - 15))}     👑 Championships: ${team2.championships}`,
    `🏎️ Races: ${team1.totalRaces}${' '.repeat(Math.max(0, sideWidth - String(team1.totalRaces).length - 8))}     🏎️ Races: ${team2.totalRaces}`,
    `🏆 Race Wins: ${team1.wins}${' '.repeat(Math.max(0, sideWidth - String(team1.wins).length - 12))}     🏆 Race Wins: ${team2.wins}`,
    `🥇 Podiums: ${team1.podiums}${' '.repeat(Math.max(0, sideWidth - String(team1.podiums).length - 10))}     🥇 Podiums: ${team2.podiums}`,
    `🎯 Pole Positions: ${team1.poles}${' '.repeat(Math.max(0, sideWidth - String(team1.poles).length - 16))}     🎯 Pole Positions: ${team2.poles}`,
    `⚡ Fastest Laps: ${team1.fastestLaps}${' '.repeat(Math.max(0, sideWidth - String(team1.fastestLaps).length - 15))}     ⚡ Fastest Laps: ${team2.fastestLaps}`,
    `🌟 Win Rate: ${((team1.wins / team1.totalRaces) * 100).toFixed(1)}%${' '.repeat(Math.max(0, sideWidth - ((team1.wins / team1.totalRaces) * 100).toFixed(1).length - 11))}     🌟 Win Rate: ${((team2.wins / team2.totalRaces) * 100).toFixed(1)}%`,
    `🎯 Podium Rate: ${((team1.podiums / team1.totalRaces) * 100).toFixed(1)}%${' '.repeat(Math.max(0, sideWidth - ((team1.podiums / team1.totalRaces) * 100).toFixed(1).length - 14))}     🎯 Podium Rate: ${((team2.podiums / team2.totalRaces) * 100).toFixed(1)}%`,
    `🎖️ Pole Rate: ${((team1.poles / team1.totalRaces) * 100).toFixed(1)}%${' '.repeat(Math.max(0, sideWidth - ((team1.poles / team1.totalRaces) * 100).toFixed(1).length - 12))}     🎖️ Pole Rate: ${((team2.poles / team2.totalRaces) * 100).toFixed(1)}%`,
    separator.replace('VS', '🏁')
  ].join('\n');
}