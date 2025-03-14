'use client'

import { api } from '@/lib/api/client';
import { getFlagUrl, getTeamColor } from '@/lib/utils';
import { CommandFunction } from '../index';

export const sprintCommand: CommandFunction = async (args: string[], originalCommand: string) => {
  if (!args[0] || !args[1]) {
    return '❌ Error: Please provide year and round\nUsage: /sprint <year> <round>\nExample: /sprint 2023 1\n\nShows sprint race results including:\n• Final classification\n• Time gaps\n• Points scored';
  }

  const year = parseInt(args[0]);
  const round = parseInt(args[1]);

  if (isNaN(year) || year < 2021 || year > new Date().getFullYear()) {
    return `❌ Error: Invalid year. Sprint races were introduced in 2021`;
  }

  if (isNaN(round) || round < 1) {
    return '❌ Error: Invalid round number';
  }

  try {
    const data = await api.getRaceResults(year, round);
    if (!data || !data.Results) {
      return `❌ Error: No sprint data found for ${year} round ${round}`;
    }

    const results = data.Results.map(result => {
      const flagUrl = getFlagUrl(result.Driver.nationality);
      const flag = flagUrl ? 
        `<img src="${flagUrl}" alt="${result.Driver.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
        '';
      const teamColor = getTeamColor(result.Constructor.name);

      return [
        `P${result.position}`,
        `${result.Driver.givenName} ${result.Driver.familyName} ${flag}`,
        `<span style="color: ${teamColor}">${result.Constructor.name}</span>`,
        result.Time ? result.Time.time : result.status,
        `+${result.points} pts`
      ].join(' | ');
    });

    return [
      `🏁 ${data.raceName} Sprint`,
      `📅 ${data.date}${data.time ? ' ' + data.time : ''}`,
      `📍 ${data.Circuit.circuitName}, ${data.Circuit.Location.locality}, ${data.Circuit.Location.country}`,
      '═'.repeat(60),
      '',
      ...results
    ].join('\n');
  } catch (error) {
    console.error('Error fetching sprint results:', error);
    return '❌ Error: Could not fetch sprint results. Please try again later.';
  }
};