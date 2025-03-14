'use client'

import { api } from '@/lib/api/client';
import { getFlagUrl, getTeamColor } from '@/lib/utils';
import { CommandFunction } from '../index';

export const qualifyingCommand: CommandFunction = async (args: string[], originalCommand: string) => {
  if (!args[0] || !args[1]) {
    const cmd = originalCommand === '/q' ? '/q' : '/qualifying';
    return `❌ Error: Please provide year and round\nUsage: ${cmd} <year> <round>\nExample: ${cmd} 2023 1\nNote: Qualifying data is only available from 2003 onwards\nShortcuts: /q, /ql, /qualifying`;
  }

  const year = parseInt(args[0]);
  if (isNaN(year) || year < 2003 || year > new Date().getFullYear()) {
    return `❌ Error: Invalid year. Qualifying data is only available from 2003 to ${new Date().getFullYear()}`;
  }

  const round = parseInt(args[1]);
  if (isNaN(round) || round < 1 || round > 30) {
    return '❌ Error: Invalid round number. Please use a number between 1 and 30';
  }

  try {
    const [raceData, qualifyingData] = await Promise.all([
      api.getRaceResults(year, round),
      api.getQualifyingResults(year, round)
    ]);

    if (!qualifyingData || qualifyingData.length === 0 || !raceData) {
      return `❌ Error: No qualifying results found for ${year} round ${round}.\n\nNote: Qualifying data is only available:\n• From 2003 onwards\n• For completed race weekends\n• When qualifying session was held`;
    }

    // Get race info for header
    const raceInfo = raceData.raceName || `Round ${round}`;

    const separator = '═'.repeat(60);
    const header = [
      `🏁 ${raceInfo} Qualifying`,
      `📅 ${raceData.date}${raceData.time ? ' ' + raceData.time : ''}`,
      `📍 ${raceData.Circuit.circuitName}, ${raceData.Circuit.Location.locality}, ${raceData.Circuit.Location.country}`,
      separator
    ].join('\n');

    // Helper function to convert lap time to milliseconds
    function timeToMs(time: string): number {
      if (!time || time === 'N/A') return Infinity;
      const [minutes, seconds] = time.split(':');
      return (parseInt(minutes || '0') * 60 + parseFloat(seconds)) * 1000;
    }

    // Find fastest times for each session
    const allTimes = {
      q1: qualifyingData.map(r => timeToMs(r.q1)),
      q2: qualifyingData.map(r => timeToMs(r.q2)),
      q3: qualifyingData.map(r => timeToMs(r.q3))
    };

    const fastestTimes = {
      q1: Math.min(...allTimes.q1),
      q2: Math.min(...allTimes.q2.filter(t => t !== Infinity)),
      q3: Math.min(...allTimes.q3.filter(t => t !== Infinity))
    };

    // Get constructor info for each driver
    const driverTeams = new Map(raceData.Results.map((r: any) => [
      `${r.Driver.givenName} ${r.Driver.familyName}`,
      r.Constructor
    ]));

    const results = qualifyingData.map(result => {
      // Get times in milliseconds
      const times = {
        q1: timeToMs(result.q1),
        q2: timeToMs(result.q2),
        q3: timeToMs(result.q3)
      };

      // Check if each time is the fastest
      const isFastest = {
        q1: times.q1 === fastestTimes.q1 && times.q1 !== Infinity,
        q2: times.q2 === fastestTimes.q2 && times.q2 !== Infinity,
        q3: times.q3 === fastestTimes.q3 && times.q3 !== Infinity
      };

      // Get driver's constructor info
      const constructor = driverTeams.get(result.driver);
      const teamColor = constructor ? getTeamColor(constructor.name) : '#666666';
      const teamName = constructor ? constructor.name : 'Unknown Team';

      const driverInfo = raceData.Results.find((r: any) => 
        `${r.Driver.givenName} ${r.Driver.familyName}` === result.driver
      )?.Driver;

      const flagUrl = driverInfo ? getFlagUrl(driverInfo.nationality) : '';
      const flag = flagUrl ? 
        `<img src="${flagUrl}" alt="${driverInfo.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
        '';

      // Format each session time with purple for fastest
      const formatTime = (time: string, isFastest: boolean) => {
        if (time === 'N/A') return time;
        return isFastest ? `<span style="color: rgb(147, 51, 234)">${time}</span>` : time;
      };

      return [
        `P${result.position}`,
        `${result.driver} ${flag}`,
        `<span style="color: ${teamColor}">${teamName}</span>`,
        `Q1: ${formatTime(result.q1, isFastest.q1)} | Q2: ${formatTime(result.q2, isFastest.q2)} | Q3: ${formatTime(result.q3, isFastest.q3)}`
      ].join(' | ');
    });

    return [
      header,
      ...results
    ].join('\n');
  } catch (error) {
    console.error('Error fetching qualifying results:', error);
    return `❌ Error: No qualifying results found for ${year} round ${round}. Please check the year and round number.`;
  }
};