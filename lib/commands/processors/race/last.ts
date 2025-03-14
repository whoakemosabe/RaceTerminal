'use client'

import { api } from '@/lib/api/client';
import { getFlagUrl, getTeamColor } from '@/lib/utils';
import { CommandFunction } from '../index';

export const lastRaceCommand: CommandFunction = async () => {
  try {
    const data = await api.getLastRaceResults();
    if (!data) {
      return '❌ Error: No results available for the last race';
    }

    const raceInfo = `Round ${data.round} of ${data.season}`;

    const results = data.Results.slice(0, 5).map(result => {
      const flagUrl = getFlagUrl(result.Driver.nationality);
      const flag = flagUrl ? 
        `<img src="${flagUrl}" alt="${result.Driver.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
        '';
      const teamColor = getTeamColor(result.Constructor.name);

      return [
        `P${result.position}. ${result.Driver.givenName} ${result.Driver.familyName} ${flag}`,
        `Team: <span style="color: ${teamColor}">${result.Constructor.name}</span>`,
        `Time: ${result.Time ? result.Time.time : result.status}`,
        `Points: +${result.points}${result.FastestLap?.rank === "1" ? ' <span style="color: #9333EA">●</span>' : ''}`
      ].join(' | ');
    });

    return [
      `🏁 ${data.raceName} (${raceInfo})`,
      `📅 ${data.date}${data.time ? ' ' + data.time : ''}`,
      `📍 ${data.Circuit.circuitName}, ${data.Circuit.Location.locality}, ${data.Circuit.Location.country}`,
      '═'.repeat(60),
      '',
      ...results
    ].join('\n');
  } catch (error) {
    console.error('Error fetching last race results:', error);
    return '❌ Error: Could not fetch last race results. Please try again later.';
  }
};