import { api } from '@/lib/api/client';
import { icons } from '@/lib/utils';

import { CommandFunction } from './index';

interface LiveCommands {
  [key: string]: CommandFunction;
}

export const liveCommands: LiveCommands = {
  '/live': async () => {
    const data = await api.getLiveTimings();
    if (!data || data.length === 0) {
      return '❌ Error: Live timing data is only available during active sessions';
    }
    
    return data.map(timing => [
      `P${timing.position} | Car #${timing.driver}`,
      `⏱️ Last Lap: ${timing.lastLapTime || 'N/A'}`,
      `S1: ${timing.sector1 || 'N/A'} | S2: ${timing.sector2 || 'N/A'} | S3: ${timing.sector3 || 'N/A'}`,
      `🚀 Speed Trap: ${timing.speed || 'N/A'} km/h`
    ].join(' | ')).join('\n');
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
        return '🌤️ Weather information is only available during active F1 sessions (Practice, Qualifying, or Race).\n\nTip: Try during a race weekend when cars are on track!';
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
      if (errorMessage.includes('No live session data available')) {
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