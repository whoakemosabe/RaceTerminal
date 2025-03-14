'use client'

import { api } from '@/lib/api/client';
import { getFlagUrl } from '@/lib/utils';
import { CommandFunction } from '../index';

export const pitstopsCommand: CommandFunction = async (args: string[], originalCommand: string) => {
  if (!args[0] || !args[1]) {
    return '❌ Error: Please provide year and round\nUsage: /pitstops <year> <round>\nExample: /pitstops 2023 1\n\nShows pit stop data including:\n• Stop duration\n• Lap numbers\n• Position changes';
  }

  const year = parseInt(args[0]);
  const round = parseInt(args[1]);

  if (isNaN(year) || year < 2012 || year > new Date().getFullYear()) {
    return `❌ Error: Invalid year. Pit stop data is only available from 2012 onwards`;
  }

  if (isNaN(round) || round < 1) {
    return '❌ Error: Invalid round number';
  }

  try {
    const [raceData, pitstops] = await Promise.all([
      api.getRaceResults(year, round),
      api.getPitStops(year, round)
    ]);

    if (!pitstops || pitstops.length === 0) {
      return `❌ Error: No pit stop data found for ${year} round ${round}`;
    }

    // Group pit stops by driver
    const stopsByDriver = new Map();
    pitstops.forEach(stop => {
      if (!stopsByDriver.has(stop.driver)) {
        stopsByDriver.set(stop.driver, []);
      }
      stopsByDriver.get(stop.driver).push(stop);
    });

    // Format pit stops for each driver
    const formattedStops = Array.from(stopsByDriver.entries()).map(([driverId, stops]) => {
      const driverInfo = raceData.Results.find((r: any) => 
        r.Driver.driverId.toUpperCase() === driverId
      );

      if (!driverInfo) return null;

      const flagUrl = getFlagUrl(driverInfo.Driver.nationality);
      const flag = flagUrl ? 
        `<img src="${flagUrl}" alt="${driverInfo.Driver.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
        '';

      const stopsInfo = stops.map((stop: any) => 
        `Stop ${stop.lap}: ${stop.duration}s`
      ).join(' | ');

      return [
        `${driverInfo.Driver.givenName} ${driverInfo.Driver.familyName} ${flag}`,
        `Total Stops: ${stops.length}`,
        stopsInfo
      ].join(' | ');
    }).filter(Boolean);

    return [
      `🔧 ${raceData.raceName} Pit Stops`,
      `📅 ${raceData.date}${raceData.time ? ' ' + raceData.time : ''}`,
      `📍 ${raceData.Circuit.circuitName}, ${raceData.Circuit.Location.locality}, ${raceData.Circuit.Location.country}`,
      '═'.repeat(60),
      '',
      ...formattedStops
    ].join('\n');
  } catch (error) {
    console.error('Error fetching pit stop data:', error);
    return '❌ Error: Could not fetch pit stop data. Please try again later.';
  }
};