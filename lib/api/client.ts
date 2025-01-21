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
      if (!data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings) {
        throw new Error('Invalid constructor standings data format');
      }
      return data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
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
      const [driver1Data, driver2Data] = await Promise.all([
        ergastClient.get(`/drivers/${driver1Id}/results.json`),
        ergastClient.get(`/drivers/${driver2Id}/results.json`)
      ]);
      return {
        driver1: driver1Data.data.MRData.RaceTable,
        driver2: driver2Data.data.MRData.RaceTable
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
    return retryRequest(async () => {
      const { data } = await openF1Client.get('/weather');
      if (!data || data.length === 0) {
        return null;
      }
      return data[0];
    });
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