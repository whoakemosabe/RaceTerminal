import { api } from '@/lib/api/client';
import { getFlagUrl, getTeamColor } from '@/lib/utils';
import { CommandFunction } from '../index';

export const raceResultsCommand: CommandFunction = async (args: string[], originalCommand: string) => {
  if (!args[0] || !args[1]) {
    return '❌ Error: Please provide year and round\nUsage: /race <year> <round>\nExample: /race 2023 1\n\nShows race results including:\n• Final classification\n• Time gaps\n• Points scored\n• Fastest laps';
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
    const data = await api.getRaceResults(year, round);
    if (!data || !data.Results) {
      return `❌ Error: No race data found for ${year} round ${round}`;
    }

    const separator = '═'.repeat(60);
    const header = [
      `🏁 ${data.raceName}`,
      `📅 ${data.date}${data.time ? ' ' + data.time : ''}`,
      `📍 ${data.Circuit.circuitName}, ${data.Circuit.Location.locality}, ${data.Circuit.Location.country}`,
      separator
    ].join('\n');

    const results = data.Results.map((result: any) => {
      const flagUrl = getFlagUrl(result.Driver.nationality);
      const flag = flagUrl ? 
        `<img src="${flagUrl}" alt="${result.Driver.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
        '';
      const teamColor = getTeamColor(result.Constructor.name);
      const hasFastestLap = result.FastestLap?.rank === "1";
      
      return [
        `P${result.position}`,
        `${result.Driver.givenName} ${result.Driver.familyName} ${flag}`,
        `<span style="color: ${teamColor}">${result.Constructor.name}</span>`,
        result.Time ? result.Time.time : result.status,
        `+${result.points} pts${hasFastestLap ? ' <span style="color: #9333EA">●</span>' : ''}`
      ].join(' | ');
    });

    return [
      header,
      ...results
    ].join('\n');
  } catch (error) {
    console.error('Error fetching race results:', error);
    return '❌ Error: Could not fetch race results. Please try again later.';
  }
};