import axios from 'axios';
import { AxiosError } from 'axios';
import { DriverStanding } from './types';

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
    const { data } = await ergastClient.get(`/${year}/driverStandings.json`);
    const standings = data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings;
    if (!standings) {
      return [];
    }
    return standings.map((standing: any): DriverStanding => ({
      position: standing.position || '?',
      points: standing.points || '0',
      Driver: {
        givenName: standing.Driver?.givenName || '',
        familyName: standing.Driver?.familyName || '',
        nationality: standing.Driver?.nationality || 'Unknown'
      },
      Constructor: standing.Constructors?.[0] || { name: 'Unknown Team' }
    }));
  },

  async getConstructorStandings(year: number = new Date().getFullYear()) {
    return retryRequest(async () => {
      const { data } = await ergastClient.get(`/${year}/constructorStandings.json`);
      const standings = data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings;
      if (!standings) {
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
      const { data } = await ergastClient.get(`/drivers/${driverId}.json`);
      if (!data?.MRData?.DriverTable?.Drivers?.[0]) {
        throw new Error('Driver not found');
      }
      return data.MRData.DriverTable.Drivers[0];
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

  // New F1 Racing Results API endpoints
  async getRaceResults(year?: number, round?: number) {
    return retryRequest(async () => {
      const { data } = await ergastClient.get(`/${year}/results${round ? `/${round}` : ''}.json`);
      if (!data?.MRData?.RaceTable?.Races?.[0]?.Results) {
        return [];
      }
      const results = data.MRData.RaceTable.Races[0].Results;
      return results.map((result: any) => ({
        position: result.position,
        Driver: {
          givenName: result.Driver.givenName,
          familyName: result.Driver.familyName,
          nationality: result.Driver.nationality
        },
        Constructor: result.Constructor,
        Time: result.Time ? { time: result.Time.time } : null,
        status: result.status,
        points: result.points
      }));
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
      const { data } = await ergastClient.get(`/constructors/${constructorId}.json`);
      if (!data?.MRData?.ConstructorTable?.Constructors?.[0]) {
        return null;
      }
      return data.MRData.ConstructorTable.Constructors[0];
    });
  },

  async compareDrivers(driver1Id: string, driver2Id: string) {
    return retryRequest(async () => {
      // Get race results
      const [driver1Data, driver2Data] = await Promise.all([
        ergastClient.get(`/drivers/${driver1Id}/results.json?limit=500&offset=0`),
        ergastClient.get(`/drivers/${driver2Id}/results.json?limit=500&offset=0`)
      ]);

      // Get championship standings
      const [driver1Championships, driver2Championships] = await Promise.all([
        ergastClient.get(`/drivers/${driver1Id}/driverStandings.json`),
        ergastClient.get(`/drivers/${driver2Id}/driverStandings.json`)
      ]);

      // Count championships (position "1" in final standings)
      const driver1ChampCount = driver1Championships.data?.MRData?.StandingsTable?.StandingsLists?.filter(
        (standing: any) => standing.DriverStandings?.[0]?.position === "1"
      ).length || 0;

      const driver2ChampCount = driver2Championships.data?.MRData?.StandingsTable?.StandingsLists?.filter(
        (standing: any) => standing.DriverStandings?.[0]?.position === "1"
      ).length || 0;

      // Get total race count for each driver
      const [driver1Total, driver2Total] = await Promise.all([
        ergastClient.get(`/drivers/${driver1Id}/results.json`),
        ergastClient.get(`/drivers/${driver2Id}/results.json`)
      ]);

      const driver1TotalRaces = parseInt(driver1Total.data?.MRData?.total || '0');
      const driver2TotalRaces = parseInt(driver2Total.data?.MRData?.total || '0');

      // Fetch all races if more than 500
      const driver1AllRaces = driver1TotalRaces > 500 ? 
        (await ergastClient.get(`/drivers/${driver1Id}/results.json?limit=500&offset=500`)).data?.MRData?.RaceTable?.Races || [] :
        [];

      const driver2AllRaces = driver2TotalRaces > 500 ?
        (await ergastClient.get(`/drivers/${driver2Id}/results.json?limit=500&offset=500`)).data?.MRData?.RaceTable?.Races || [] :
        [];

      const driver1Races = [
        ...(driver1Data.data?.MRData?.RaceTable?.Races || []),
        ...driver1AllRaces
      ];

      const driver2Races = [
        ...(driver2Data.data?.MRData?.RaceTable?.Races || []),
        ...driver2AllRaces
      ];

      if (!driver1Races || !driver2Races) {
        throw new Error('Could not fetch career comparison data');
      }

      return {
        driver1: {
          Races: driver1Races,
          driverId: driver1Id,
          totalRaces: driver1TotalRaces,
          championships: driver1ChampCount
        },
        driver2: {
          Races: driver2Races,
          driverId: driver2Id,
          totalRaces: driver2TotalRaces,
          championships: driver2ChampCount
        }
      };
    });
  },

  async compareTeams(team1Id: string, team2Id: string) {
    return retryRequest(async () => {
      const [team1Data, team2Data] = await Promise.all([
        ergastClient.get(`/current/constructors/${team1Id}/results.json`),
        ergastClient.get(`/current/constructors/${team2Id}/results.json`)
      ]);
      
      if (!team1Data.data?.MRData?.RaceTable?.Races || !team2Data.data?.MRData?.RaceTable?.Races) {
        throw new Error('Could not fetch comparison data');
      }
      
      const team1Results = team1Data.data.MRData.RaceTable;
      const team2Results = team2Data.data.MRData.RaceTable;
      
      // Add constructorId to help with name lookup
      team1Results.constructorId = team1Id;
      team2Results.constructorId = team2Id;
      
      return {
        team1: team1Results,
        team2: team2Results
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

  async getDriverTires(driverNumber: string) {
    return retryRequest(async () => {
      const { data } = await openF1Client.get('/tire_data', {
        params: { driver_number: driverNumber }
      });
      if (!data || data.length === 0) {
        return null;
      }
      return data[0];
    });
  },

  async getFastestLaps(year: number, round: number) {
    return retryRequest(async () => {
      const { data } = await ergastClient.get(`/${year}/${round}/fastest/1/results.json`);
      if (!data?.MRData?.RaceTable?.Races?.[0]?.Results) {
        return [];
      }
      return data.MRData.RaceTable.Races[0].Results;
    });
  },

  async getSprintResults(year: number, round: number) {
    return retryRequest(async () => {
      const { data } = await ergastClient.get(`/${year}/${round}/sprint.json`);
      if (!data?.MRData?.RaceTable?.Races?.[0]?.SprintResults) {
        return [];
      }
      return data.MRData.RaceTable.Races[0].SprintResults;
    });
  },
};