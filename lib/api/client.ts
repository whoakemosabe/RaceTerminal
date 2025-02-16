import axios from 'axios';
import { AxiosError } from 'axios';
import { DriverStanding } from './types';
import { F1_CARS } from '@/lib/data/cars';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function retryRequest(fn: () => Promise<any>, retries = MAX_RETRIES): Promise<any> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error instanceof AxiosError && (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK')) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
}

const f1RacingClient = axios.create({
  baseURL: 'https://ergast.com/api/f1',
  params: {
    format: 'json'
  },
  timeout: 10000
});

const ergastClient = axios.create({
  baseURL: 'https://ergast.com/api/f1',
  params: {
    format: 'json'
  },
  timeout: 10000
});

const openF1Client = axios.create({
  baseURL: 'https://api.openf1.org/v1',
  timeout: 10000
});

export const api = {
  async getDriverStandings(year: number = new Date().getFullYear()): Promise<DriverStanding[]> {
    try {
      // Try current year first
      let response = await retryRequest(async () => {
        return await ergastClient.get(`/${year}/driverStandings.json`);
      });
      
      // If no data for current year, try previous year
      if (!response.data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings) {
        const previousYear = year - 1;
        response = await retryRequest(async () => {
          return await ergastClient.get(`/${previousYear}/driverStandings.json`);
        });
      }
      
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

  async getConstructorStandings(year: number = new Date().getFullYear()) {
    return retryRequest(async () => {
      // Try current year first
      let response = await ergastClient.get(`/${year}/constructorStandings.json`);
      
      // If no data for current year, try previous year
      if (!response.data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings) {
        const previousYear = year - 1;
        response = await ergastClient.get(`/${previousYear}/constructorStandings.json`);
      }
      
      const standings = response.data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings;
      
      if (!standings) {
        console.error('No constructor standings available for current or previous year');
        return [];
      }
      return standings.map((standing: any) => ({
        position: standing.position || '?',
        points: standing.points || '0',
        wins: standing.wins || '0',
        Constructor: {
          constructorId: standing.Constructor?.constructorId || '',
          name: standing.Constructor?.name || 'Unknown Team',
          nationality: standing.Constructor?.nationality || 'Unknown'
        }
      }));
    });
  },

  async getRaceSchedule(year: number = new Date().getFullYear()) {
    return retryRequest(async () => {
      const { data } = await ergastClient.get(`/${year}.json`);
      if (!data?.MRData?.RaceTable?.Races) {
        return [];
      }
      return data.MRData.RaceTable.Races.map((race: any) => ({
        ...race,
        country: race.Circuit.Location.country,
        date: race.date + (race.time ? 'T' + race.time : '')
      }));
    });
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

  async getTrackInfo(circuitId: string) {
    return retryRequest(async () => {
      const { data } = await ergastClient.get(`/circuits/${circuitId}.json`);
      if (!data?.MRData?.CircuitTable?.Circuits?.[0]) {
        return null;
      }
      return data.MRData.CircuitTable.Circuits[0];
    });
  },

  async getLiveTimings() {
    return retryRequest(async () => {
      const { data } = await openF1Client.get('/live-timing');
      if (!data) {
        throw new Error('Live timing service is currently unavailable');
      }
      if (data.length === 0) {
        return [];
      }
      return data.slice(0, 10).map((timing: any) => ({
        driver: timing.driver_number,
        position: timing.position,
        lastLapTime: timing.last_lap_time,
        sector1: timing.sector_1_time,
        sector2: timing.sector_2_time,
        sector3: timing.sector_3_time,
        speed: timing.speed_trap
      }));
    });
  },

  async getDriverTelemetry(driverNumber: string) {
    return retryRequest(async () => {
      const { data } = await openF1Client.get('/car_data', {
        params: { 
          driver_number: driverNumber,
          limit: 1
        }
      });
      if (!data) {
        throw new Error('Telemetry service is currently unavailable');
      }
      if (data.length === 0) {
        return null;
      }
      return data.slice(-1)[0];
    });
  },

  async getTrackStatus() {
    return retryRequest(async () => {
      const { data } = await openF1Client.get('/track_status');
      if (!data) {
        throw new Error('Track status service is currently unavailable');
      }
      if (data.length === 0) {
        return null;
      }
      return data.slice(-1)[0];
    });
  },

  async getRaceResults(year?: number, round?: number) {
    return retryRequest(async () => {
      const url = `/${year}/${round}/results.json`;
      const { data } = await ergastClient.get(url);
      
      const race = data?.MRData?.RaceTable?.Races?.[0];
      if (!race) {
        throw new Error('No race data found');
      }
      
      return race;
    });
  },

  async getQualifyingResults(year: number, round: number) {
    return retryRequest(async () => {
      const { data } = await ergastClient.get(`/${year}/${round}/qualifying.json`);
      if (!data?.MRData?.RaceTable?.Races?.[0]?.QualifyingResults) {
        return [];
      }
      return data.MRData.RaceTable.Races[0].QualifyingResults.map((result: any) => ({
        position: result.position,
        driver: `${result.Driver.givenName} ${result.Driver.familyName}`,
        q1: result.Q1 || 'N/A',
        q2: result.Q2 || 'N/A',
        q3: result.Q3 || 'N/A'
      }));
    });
  },

  async getLapTimes(year: number, round: number, driverId?: string) {
    return retryRequest(async () => {
      const { data } = await ergastClient.get(`/${year}/${round}/laps.json`);
      if (!data?.MRData?.RaceTable?.Races?.[0]?.Laps) {
        return [];
      }
      const laps = data.MRData.RaceTable.Races[0].Laps;
      const allLapTimes = laps.flatMap((lap: any) => 
        lap.Timings.map((timing: any) => ({
          lap: lap.number,
          time: timing.time,
          driver: timing.driverId.toUpperCase()
        }))
      );
      
      // Filter by driver if specified
      if (driverId) {
        const searchDriver = driverId.toUpperCase();
        return allLapTimes.filter(lap => lap.driver === searchDriver);
      }
      
      // Sort by lap number and time
      return allLapTimes.sort((a, b) => {
        const lapDiff = parseInt(a.lap) - parseInt(b.lap);
        if (lapDiff !== 0) return lapDiff;
        return a.time.localeCompare(b.time);
      });
    });
  },

  async getPitStops(year: number, round: number) {
    return retryRequest(async () => {
      const { data } = await ergastClient.get(`/${year}/${round}/pitstops.json`);
      if (!data?.MRData?.RaceTable?.Races?.[0]?.PitStops) {
        return [];
      }
      return data.MRData.RaceTable.Races[0].PitStops.map((stop: any) => ({
        driver: stop.driverId.toUpperCase(),
        lap: stop.lap,
        duration: stop.duration
      }));
    });
  },

  async getConstructorInfo(constructorId: string) {
    return retryRequest(async () => {
      const [infoResponse, championshipsResponse, resultsResponse] = await Promise.all([
        ergastClient.get(`/constructors/${constructorId}.json`),
        ergastClient.get(`/constructors/${constructorId}/constructorStandings/1.json`),
        ergastClient.get(`/constructors/${constructorId}/results.json?limit=1&order=season`)
      ]);

      if (!infoResponse.data?.MRData?.ConstructorTable?.Constructors?.[0]) {
        return null;
      }

      const constructor = infoResponse.data.MRData.ConstructorTable.Constructors[0];
      const championships = parseInt(championshipsResponse.data?.MRData?.total || '0');
      const firstRace = resultsResponse.data?.MRData?.RaceTable?.Races?.[0];
      const firstEntry = firstRace?.season || null;

      return {
        ...constructor,
        championships,
        firstEntry
      };
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
  },

  async compareTeams(team1Id: string, team2Id: string) {
    return retryRequest(async () => {
      // Enhanced function to get comprehensive team stats
      const getTeamStats = async (teamId: string) => {
        const [
          resultsResponse,
          championshipsResponse,
          polesResponse,
          fastestLapsResponse,
          podiumsResponse
        ] = await Promise.all([
          ergastClient.get(`/constructors/${teamId}/results.json?limit=2000`),
          ergastClient.get(`/constructors/${teamId}/constructorStandings/1.json`),
          ergastClient.get(`/constructors/${teamId}/qualifying/1.json`),
          ergastClient.get(`/constructors/${teamId}/fastest/1/results.json`),
          ergastClient.get(`/constructors/${teamId}/results.json?limit=2000`)
        ]);

        const totalRaces = parseInt(resultsResponse.data?.MRData?.total || '0');
        const championships = parseInt(championshipsResponse.data?.MRData?.total || '0');
        const poles = parseInt(polesResponse.data?.MRData?.total || '0');
        const fastestLaps = parseInt(fastestLapsResponse.data?.MRData?.total || '0');
        const allResults = podiumsResponse.data?.MRData?.RaceTable?.Races || [];

        // Calculate wins and podiums from all results
        const wins = allResults.filter(race => 
          race.Results?.[0]?.position === "1"
        ).length;

        const podiums = allResults.filter(race =>
          race.Results?.some(result => 
            ["1", "2", "3"].includes(result.position)
          )
        ).length;

        return {
          Races: allResults,
          totalRaces,
          championships,
          poles,
          fastestLaps,
          wins,
          podiums
        };
      };

      // Get stats for both teams in parallel
      const [team1Stats, team2Stats] = await Promise.all([
        getTeamStats(team1Id),
        getTeamStats(team2Id)
      ]);

      if (!team1Stats.Races.length || !team2Stats.Races.length) {
        throw new Error('Could not fetch comparison data');
      }

      return {
        team1: {
          Races: team1Stats.Races,
          constructorId: team1Id,
          totalRaces: team1Stats.totalRaces,
          championships: team1Stats.championships,
          wins: team1Stats.wins,
          podiums: team1Stats.podiums,
          poles: team1Stats.poles,
          fastestLaps: team1Stats.fastestLaps
        },
        team2: {
          Races: team2Stats.Races,
          constructorId: team2Id,
          totalRaces: team2Stats.totalRaces,
          championships: team2Stats.championships,
          wins: team2Stats.wins,
          podiums: team2Stats.podiums,
          poles: team2Stats.poles,
          fastestLaps: team2Stats.fastestLaps
        }
      };
    });
  },

  async getNextRace() {
    return retryRequest(async () => {
      const { data } = await ergastClient.get('/current/next.json');
      if (!data?.MRData?.RaceTable?.Races?.[0]) {
        return null;
      }
      return data.MRData.RaceTable.Races[0];
    });
  },

  async getLastRaceResults() {
    return retryRequest(async () => {
      const { data } = await ergastClient.get('/current/last/results.json');
      if (!data?.MRData?.RaceTable?.Races?.[0]) {
        return null;
      }
      return data.MRData.RaceTable.Races[0];
    });
  },

  async getTrackWeather() {
    // Set a shorter timeout for weather data since it's time-sensitive
    const weatherTimeout = 5000; // 5 seconds
    try {
      // Create a promise that rejects after the timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Weather data request timed out')), weatherTimeout);
      });
      
      // Create the actual data fetch promise
      const fetchPromise = retryRequest(async () => {
        const [statusResponse, weatherResponse] = await Promise.all([
          openF1Client.get('/track_status', {
            params: { limit: 1 },
            timeout: weatherTimeout
          }),
          openF1Client.get('/weather', {
            params: { limit: 1 },
            timeout: weatherTimeout
          })
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
      });

      // Race between the timeout and the fetch
      return await Promise.race([fetchPromise, timeoutPromise]);
    } catch (error) {
      if (error instanceof Error && error.message === 'Weather data request timed out') {
        throw new Error('Weather information is currently unavailable. Please try again during a live session.');
      }
      throw error;
    }
  },

  async getCarInfo(search: string) {
    // Normalize search term
    search = search.toLowerCase();

    // Handle year-based searches
    const yearMap: Record<string, string[]> = {
      '2024': ['rb20', 'w15', 'sf24'],
      '2023': ['rb19', 'w14', 'sf23', 'amr23', 'mcl60', 'a523']
    };
    
    // Direct match with car code
    if (F1_CARS[search]) {
      return F1_CARS[search];
    }
    
    // Search by year - return all cars from that year
    if (yearMap[search]) {
      return yearMap[search].map(code => F1_CARS[code]);
    }
    
    // Search by team name
    const teamSearch = search.replace(/\s+/g, '').toLowerCase();
    return Object.values(F1_CARS).find(car => 
      car.team.replace(/\s+/g, '').toLowerCase().includes(teamSearch)
    );
  }
};