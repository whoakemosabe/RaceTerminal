import { retryRequest, ergastClient, openF1Client } from './base';
import { DriverStanding } from '../types';

export const driversApi = {
  async getCurrentDrivers() {
    try {
      const { data } = await openF1Client.get('/drivers', {
        params: { session_key: 'latest' }
      });
      
      // Remove duplicates and get latest entry for each driver
      const uniqueDrivers = new Map();
      data.forEach((driver: any) => {
        uniqueDrivers.set(driver.driver_number, driver);
      });
      
      return Array.from(uniqueDrivers.values());
    } catch (error) {
      console.error('Error fetching current drivers:', error);
      return [];
    }
  },

  async getDriverStandings(year: number = new Date().getFullYear()): Promise<DriverStanding[]> {
    try {
      // Always use previous year since current year data won't be available yet
      const previousYear = year - 1;
      const response = await retryRequest(async () => {
        return await ergastClient.get(`/${previousYear}/driverStandings.json`);
      });
      
      const standings = response.data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings;
      
      if (!standings || !Array.isArray(standings)) {
        console.error('No standings data available for current or previous year');
        return [];
      }
      
      return standings.map((standing: any): DriverStanding => ({
        position: standing.position || '?',
        points: standing.points || '0',
        Driver: {
          driverId: standing.Driver?.driverId || '',
          code: standing.Driver?.code || '',
          permanentNumber: standing.Driver?.permanentNumber || '',
          givenName: standing.Driver?.givenName || '',
          familyName: standing.Driver?.familyName || '',
          nationality: standing.Driver?.nationality || 'Unknown'
        },
        Constructor: standing.Constructors?.[0] || { name: 'Unknown Team' }
      }));
    } catch (error) {
      console.error('Error fetching driver standings:', error);
      return [];
    }
  },

  async getDriverInfo(driverId: string) {
    return retryRequest(async () => {
      try {
        if (!driverId) {
          throw new Error('Driver not found. Please check the name and try again.');
        }

        // Normalize driver ID but preserve underscores
        const normalizedId = driverId.toLowerCase();
        const fallbackId = normalizedId.replace(/_/g, '');

        // Try both normalized and fallback IDs
        const [normalResponse, fallbackResponse] = await Promise.allSettled([
          ergastClient.get(`/drivers/${normalizedId}.json`),
          ergastClient.get(`/drivers/${fallbackId}.json`)
        ]);

        // Check responses in order of preference
        let driver = null;

        if (normalResponse.status === 'fulfilled' && normalResponse.value.data?.MRData?.DriverTable?.Drivers?.[0]) {
          driver = normalResponse.value.data.MRData.DriverTable.Drivers[0];
        } else if (fallbackResponse.status === 'fulfilled' && fallbackResponse.value.data?.MRData?.DriverTable?.Drivers?.[0]) {
          driver = fallbackResponse.value.data.MRData.DriverTable.Drivers[0];
        }

        if (!driver) {
          throw new Error('Driver not found. Please check the name and try again.');
        }

        return driver;
      } catch (error) {
        console.error('Error fetching driver info:', error);
        if (error instanceof Error) {
          if (error.message.includes('404') || error.message.includes('Driver not found')) {
            throw new Error('Driver not found. Please check the name and try again.');
          }
          throw new Error('Could not fetch driver data. Please try again later.');
        }
        throw new Error('Could not fetch driver data');
      }
    });
  },

  async compareDrivers(driver1Id: string, driver2Id: string) {
    return retryRequest(async () => {
      // Optimized function to get all driver stats in parallel
      const getDriverStats = async (driverId: string, limit = 1000) => {
        const [
          winsResponse,
          racesResponse,
          polesResponse,
          fastestLapsResponse,
          championshipsResponse
        ] = await Promise.all([
          ergastClient.get(`/drivers/${driverId}/results/1.json?limit=${limit}`),
          ergastClient.get(`/drivers/${driverId}/results.json?limit=1000`),
          ergastClient.get(`/drivers/${driverId}/qualifying/1.json`),
          ergastClient.get(`/drivers/${driverId}/fastest/1/results.json`),
          ergastClient.get(`/drivers/${driverId}/driverStandings.json`)
        ]);

        const wins = parseInt(winsResponse.data?.MRData?.total || '0');
        const totalRaces = parseInt(racesResponse.data?.MRData?.total || '0');
        const poles = parseInt(polesResponse.data?.MRData?.total || '0');
        const fastestLaps = parseInt(fastestLapsResponse.data?.MRData?.total || '0');
        const championships = championshipsResponse.data?.MRData?.StandingsTable?.StandingsLists?.filter(
          (standing: any) => standing.DriverStandings?.[0]?.position === "1"
        ).length || 0;

        // Get detailed race results for podiums and points
        const results = racesResponse.data?.MRData?.RaceTable?.Races || [];

        return {
          Races: results,
          wins,
          totalRaces,
          poles,
          fastestLaps,
          championships
        };
      };

      // Get stats for both drivers in parallel
      const [driver1Stats, driver2Stats] = await Promise.all([
        getDriverStats(driver1Id),
        getDriverStats(driver2Id)
      ]);

      if (!driver1Stats || !driver2Stats) {
        throw new Error('Could not fetch career comparison data');
      }

      return {
        driver1: {
          Races: driver1Stats.Races,
          driverId: driver1Id,
          totalRaces: driver1Stats.totalRaces,
          championships: driver1Stats.championships,
          poles: driver1Stats.poles,
          wins: driver1Stats.wins,
          fastestLaps: driver1Stats.fastestLaps
        },
        driver2: {
          Races: driver2Stats.Races,
          driverId: driver2Id,
          totalRaces: driver2Stats.totalRaces,
          championships: driver2Stats.championships,
          poles: driver2Stats.poles,
          wins: driver2Stats.wins,
          fastestLaps: driver2Stats.fastestLaps
        }
      };
    });
  }
};