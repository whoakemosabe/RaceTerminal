import { api } from '@/lib/api/client';
import { icons } from '@/lib/utils';

import { CommandFunction } from './index';

interface LiveCommands {
  [key: string]: CommandFunction;
}

export const liveCommands: LiveCommands = {
  '/live': async () => {
    try {
      const response = await api.getLiveTimings();
      if (!response || !response.data) {
        return '❌ Error: Live timing data is only available during active sessions (Practice, Qualifying, Sprint, or Race)';
      }

      const { sessionType, sessionName, data } = response;

      // Sort data by position
      const sortedData = data
        .filter(timing => timing.position && timing.driver)
        .sort((a, b) => parseInt(a.position) - parseInt(b.position));

      if (sortedData.length === 0) {
        return `❌ No timing data available for current ${sessionType} session`;
      }

      const header = [
        `📊 LIVE ${sessionType.toUpperCase()} TIMING`,
        `📍 ${sessionName}`,
        '═'.repeat(60),
        ''
      ];

      const timingRows = sortedData.map(timing => {
        const sectors = [
          timing.sector1 ? `S1: ${formatTime(timing.sector1)}` : null,
          timing.sector2 ? `S2: ${formatTime(timing.sector2)}` : null,
          timing.sector3 ? `S3: ${formatTime(timing.sector3)}` : null
        ].filter(Boolean).join(' | ');

        const gap = timing.position === '1' ? 
          'LEADER' : 
          timing.gapToLeader ? 
            `+${timing.gapToLeader}` : 
            (timing.interval ? `+${timing.interval}` : 'N/A');

        return [
          `P${timing.position}. ${timing.driverName} (#${timing.driver.toString().padStart(2, '0')}) | ${timing.team}`,
          `Gap: ${gap}`,
          timing.lastLapTime ? `Last: ${formatTime(timing.lastLapTime)}` : null,
          sectors,
          timing.speed ? `Speed: ${timing.speed} km/h` : null
        ].filter(Boolean).join(' | ');
      });

      return [...header, ...timingRows].join('\n');

    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('No active F1 session')) {
          return '🏁 No active F1 session right now.\n\nLive timing data is only available during:\n• Practice Sessions\n• Qualifying\n• Sprint\n• Race\n\nTry again when cars are on track!';
        }
        return `❌ Error: ${error.message}`;
      }
      return '❌ Error: Could not fetch live timing data. Please try again later.';
    }
  },

  '/telemetry': async (args: string[]) => {
    if (!args[0]) {
      return '❌ Error: Please provide a driver number (e.g., /telemetry 44)';
    }

    const data = await api.getDriverTelemetry(args[0]);
    if (!data) {
      return '❌ Error: Telemetry data is only available during active sessions';
    }

    return [
      `🏎️ Car #${args[0]} Telemetry:`,
      `⚡ Speed: ${data.speed || 'N/A'} km/h`,
      `🔄 RPM: ${data.rpm || 'N/A'}`,
      `🎮 Throttle: ${data.throttle || 'N/A'}%`,
      `🛑 Brake: ${data.brake || 'N/A'}%`,
      `⚙️ Gear: ${data.gear || 'N/A'}`,
      `🌡️ Engine Temp: ${data.engine_temperature || 'N/A'}°C`,
      `⏱️ Updated: ${new Date(data.timestamp).toLocaleTimeString()}`
    ].join('\n');
  },

  '/weather': async () => {
    try {
      const data = await api.getTrackWeather();
      if (!data) {
        return '🌤️ No active F1 session right now.\n\nWeather data is only available during:\n• Practice Sessions\n• Qualifying\n• Sprint\n• Race\n\nTry again when cars are on track!';
      }
      
      const statusMap: Record<string, string> = {
        '1': '🟢 Track Clear',
        '2': '🟡 Yellow Flag',
        '3': '🟣 SC Deployed',
        '4': '🔴 Red Flag',
        '5': '⚫ Session Ended',
        '6': '🟠 VSC Deployed'
      };
      
      const conditions = [
        `${icons.flag} Track Status: ${statusMap[data.status] || 'Unknown'}`,
        `${icons.activity} Air Temp: ${data.air_temperature || 'N/A'}°C`,
        `${icons.activity} Track Temp: ${data.track_temperature || 'N/A'}°C`,
        `${icons.activity} Humidity: ${data.humidity || 'N/A'}%`,
        `${icons.activity} Pressure: ${data.pressure || 'N/A'} hPa`,
        `${icons.activity} Wind Speed: ${data.wind_speed || 'N/A'} km/h`,
        `${icons.activity} Wind Direction: ${data.wind_direction || 'N/A'}°`,
        `${icons.activity} Rainfall: ${data.rainfall ? 'Yes' : 'No'}`,
        `${icons.clock} Updated: ${new Date(data.timestamp).toLocaleTimeString()}`
      ].join('\n');
      
      return conditions;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (errorMessage.includes('No active F1 session') || errorMessage.includes('No weather data available')) {
        return '🌤️ No active F1 session right now.\n\nWeather data is only available during:\n• Practice Sessions\n• Qualifying\n• Sprint\n• Race\n\nTry again when cars are on track!';
      }
      console.error('Weather service error:', errorMessage);
      return '❌ Error: Unable to fetch weather data. Please try again later.';
    }
  },

  '/status': async () => {
    const data = await api.getTrackStatus();
    if (!data) {
      return '❌ Error: Track status is only available during active sessions';
    }
    
    const statusMap: Record<string, string> = {
      '1': '🟢 Track Clear',
      '2': '🟡 Yellow Flag',
      '3': '🟣 Safety Car Deployed',
      '4': '🔴 Red Flag',
      '5': '⚫ Session Ended',
      '6': '🟠 Virtual Safety Car Deployed'
    };
    
    return [
      `🏁 Track Status: ${statusMap[data.status] || 'Unknown'}`,
      `⏱️ Updated: ${new Date(data.timestamp).toLocaleTimeString()}`
    ].join('\n');
  }
};