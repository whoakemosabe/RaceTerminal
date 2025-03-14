import { retryRequest, openF1Client } from './base';

export const liveApi = {
  async getLiveTimings() {
    return retryRequest(async () => {
      try {
        // Get session info first
        const sessionResponse = await openF1Client.get('/session', {
          params: { session_key: 'latest' }
        });
        
        if (!sessionResponse.data || sessionResponse.data.length === 0) {
          throw new Error('No active F1 session');
        }
        
        const session = sessionResponse.data[0];
        const sessionType = session.session_type || 'Unknown';
        const sessionName = session.meeting_name || 'Unknown Session';
        
        // Get timing data
        const timingResponse = await openF1Client.get('/timing', {
          params: { session_key: session.session_key }
        });
        
        if (!timingResponse.data || timingResponse.data.length === 0) {
          throw new Error(`No timing data available for current ${sessionType} session`);
        }
        
        // Get driver info for names and teams
        const driversResponse = await openF1Client.get('/drivers', {
          params: { session_key: session.session_key }
        });
        
        const drivers = new Map(
          driversResponse.data.map((d: any) => [
            d.driver_number,
            {
              name: `${d.first_name} ${d.last_name}`,
              team: d.team_name
            }
          ])
        );
        
        // Process timing data
        const processedData = timingResponse.data.map((timing: any) => {
          const driver = drivers.get(timing.driver_number);
          return {
            position: timing.position,
            driver: timing.driver_number,
            driverName: driver?.name || `Driver #${timing.driver_number}`,
            team: driver?.team || 'Unknown Team',
            lastLapTime: timing.last_lap_time,
            sector1: timing.sector_1_time,
            sector2: timing.sector_2_time,
            sector3: timing.sector_3_time,
            speed: timing.speed_trap,
            gapToLeader: timing.gap_to_leader,
            interval: timing.interval
          };
        });
        
        return {
          sessionType,
          sessionName,
          data: processedData.filter(d => d.position && d.driver)
        };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('No active F1 session');
      }
    });
  },


  async getDriverTelemetry(driverNumber: string) {
    return retryRequest(async () => {
      try {
        const { data } = await openF1Client.get('/car_data', {
          params: { driver_number: driverNumber, limit: 1 }
        });
        if (!data || data.length === 0) {
          throw new Error('Telemetry service is currently unavailable');
        }
        return data[0];
      } catch (error) {
        throw new Error('No telemetry data available. Please try during an active session.');
      }
    });
  },

  async getTrackStatus() {
    return retryRequest(async () => {
      try {
        const { data } = await openF1Client.get('/track_status');
        if (!data || data.length === 0) {
          throw new Error('Track status service is currently unavailable');
        }
        return data[0];
      } catch (error) {
        throw new Error('No track status available. Please try during an active session.');
      }
    });
  },


  async getTrackWeather() {
    return retryRequest(async () => {
      try {
        const [statusResponse, weatherResponse] = await Promise.all([
          openF1Client.get('/track_status', { params: { limit: 1 } }),
          openF1Client.get('/weather', { params: { limit: 1 } })
        ]);

        const trackStatus = statusResponse.data?.[0];
        const weather = weatherResponse.data?.[0] || {};

        if (!trackStatus || !trackStatus.status) {
          throw new Error('No live session data available');
        }

        return {
          status: trackStatus.status,
          timestamp: trackStatus.timestamp,
          air_temperature: weather.air_temperature,
          track_temperature: weather.track_temperature,
          humidity: weather.humidity,
          pressure: weather.pressure,
          wind_speed: weather.wind_speed,
          wind_direction: weather.wind_direction,
          rainfall: weather.rainfall
        };

      } catch (error) {
        throw new Error('No weather data available. Please try during an active session.');
      }
    });
  }
};