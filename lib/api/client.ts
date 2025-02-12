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

// F1 Car data (2023 season)
const F1_CARS_2023 = {
  // Current Season Cars (2024)
  'rb20': {
    name: 'Oracle Red Bull Racing RB20',
    year: 2024,
    team: 'Red Bull Racing',
    nationality: 'British',
    chassis: 'Carbon-fiber composite monocoque',
    engine: 'Honda RBPT',
    powerUnit: 'Honda RBPT V6 turbo-hybrid',
    length: 5050,
    width: 2000,
    height: 970,
    wheelbase: 3600,
    weight: 798,
    wins: 2,
    poles: 2,
    fastestLaps: 2,
    championshipPosition: 1,
    points: 97,
    topSpeed: 352,
    acceleration: 2.6,
    maxDownforce: 1850,
    notes: 'Evolution of the dominant RB19, featuring innovative "zero-pod" sidepod design'
  },
  'w15': {
    name: 'Mercedes-AMG F1 W15 E Performance',
    year: 2024,
    team: 'Mercedes-AMG Petronas',
    nationality: 'British',
    chassis: 'Carbon-fiber composite monocoque',
    engine: 'Mercedes-AMG F1 M15',
    powerUnit: 'Mercedes V6 turbo-hybrid',
    length: 5030,
    width: 2000,
    height: 970,
    wheelbase: 3590,
    weight: 798,
    wins: 0,
    poles: 0,
    fastestLaps: 0,
    championshipPosition: 2,
    points: 56,
    topSpeed: 349,
    acceleration: 2.6,
    maxDownforce: 1780,
    notes: 'Complete redesign from W14, featuring new suspension concept and improved cooling'
  },
  'sf24': {
    name: 'Scuderia Ferrari SF-24',
    year: 2024,
    team: 'Scuderia Ferrari',
    nationality: 'Italian',
    chassis: 'Carbon-fiber composite monocoque',
    engine: 'Ferrari 066/12',
    powerUnit: 'Ferrari V6 turbo-hybrid',
    length: 5040,
    width: 2000,
    height: 970,
    wheelbase: 3595,
    weight: 798,
    wins: 0,
    poles: 0,
    fastestLaps: 0,
    championshipPosition: 3,
    points: 49,
    topSpeed: 350,
    acceleration: 2.6,
    maxDownforce: 1770,
    notes: 'Features improved reliability and race pace compared to predecessor'
  },

  // Historic Championship-Winning Cars
  'mp4-4': {
    name: 'McLaren MP4/4',
    year: 1988,
    team: 'McLaren',
    nationality: 'British',
    chassis: 'Carbon-fiber composite monocoque',
    engine: 'Honda RA168E',
    powerUnit: 'V6 turbo',
    length: 4394,
    width: 2134,
    height: 1016,
    wheelbase: 2921,
    weight: 540,
    wins: 15,
    poles: 15,
    fastestLaps: 10,
    championshipPosition: 1,
    points: 199,
    topSpeed: 351,
    acceleration: 2.5,
    maxDownforce: 1200,
    notes: 'Most dominant F1 car of its era, won 15 out of 16 races in 1988 with Senna and Prost'
  },
  'f2004': {
    name: 'Ferrari F2004',
    year: 2004,
    team: 'Scuderia Ferrari',
    nationality: 'Italian',
    chassis: 'Carbon-fiber composite monocoque',
    engine: 'Ferrari 053',
    powerUnit: 'V10',
    length: 4545,
    width: 1796,
    height: 959,
    wheelbase: 3050,
    weight: 605,
    wins: 15,
    poles: 12,
    fastestLaps: 14,
    championshipPosition: 1,
    points: 262,
    topSpeed: 370,
    acceleration: 2.1,
    maxDownforce: 1300,
    notes: 'One of the most successful F1 cars ever, still holds several lap records'
  },
  'fw14b': {
    name: 'Williams FW14B',
    year: 1992,
    team: 'Williams',
    nationality: 'British',
    chassis: 'Carbon-fiber composite monocoque',
    engine: 'Renault RS4',
    powerUnit: 'V10',
    length: 4350,
    width: 2000,
    height: 950,
    wheelbase: 2890,
    weight: 505,
    wins: 10,
    poles: 15,
    fastestLaps: 11,
    championshipPosition: 1,
    points: 164,
    topSpeed: 345,
    acceleration: 2.4,
    maxDownforce: 1100,
    notes: 'Revolutionary active suspension system and advanced aerodynamics'
  },
  'rb9': {
    name: 'Red Bull RB9',
    year: 2013,
    team: 'Red Bull Racing',
    nationality: 'British',
    chassis: 'Carbon-fiber composite monocoque',
    engine: 'Renault RS27-2013',
    powerUnit: 'V8',
    length: 4800,
    width: 1800,
    height: 950,
    wheelbase: 3200,
    weight: 642,
    wins: 13,
    poles: 11,
    fastestLaps: 12,
    championshipPosition: 1,
    points: 596,
    topSpeed: 340,
    acceleration: 2.4,
    maxDownforce: 1400,
    notes: 'Last V8-era championship winner, dominated with Vettel winning 9 races in a row'
  },
  'w11': {
    name: 'Mercedes-AMG F1 W11 EQ Performance',
    year: 2020,
    team: 'Mercedes-AMG Petronas',
    nationality: 'British',
    chassis: 'Carbon-fiber composite monocoque',
    engine: 'Mercedes-AMG F1 M11',
    powerUnit: 'V6 turbo-hybrid',
    length: 5000,
    width: 2000,
    height: 950,
    wheelbase: 3700,
    weight: 746,
    wins: 13,
    poles: 15,
    fastestLaps: 9,
    championshipPosition: 1,
    points: 573,
    topSpeed: 360,
    acceleration: 2.4,
    maxDownforce: 1650,
    notes: 'Most dominant Mercedes car, set numerous track records during Covid-shortened season'
  },

  'rb19': {
    name: 'Oracle Red Bull Racing RB19',
    year: 2023,
    team: 'Red Bull Racing',
    nationality: 'British',
    chassis: 'Carbon-fiber composite monocoque',
    engine: 'Honda RBPT',
    powerUnit: 'Honda RBPT V6 turbo-hybrid',
    length: 5048,
    width: 2000,
    height: 970,
    wheelbase: 3600,
    weight: 798,
    wins: 21,
    poles: 12,
    fastestLaps: 11,
    championshipPosition: 1,
    points: 860,
    topSpeed: 350,
    acceleration: 2.6,
    maxDownforce: 1800,
    notes: 'Most dominant F1 car in history, won 21 out of 22 races in 2023. Set multiple records including most wins in a season.'
  },
  'w14': {
    name: 'Mercedes-AMG F1 W14 E Performance',
    year: 2023,
    team: 'Mercedes-AMG Petronas',
    nationality: 'British',
    chassis: 'Carbon-fiber composite monocoque',
    engine: 'Mercedes-AMG F1 M14',
    powerUnit: 'Mercedes V6 turbo-hybrid',
    length: 5025,
    width: 2000,
    height: 970,
    wheelbase: 3600,
    weight: 798,
    wins: 0,
    poles: 1,
    fastestLaps: 3,
    championshipPosition: 2,
    points: 409,
    topSpeed: 348,
    acceleration: 2.6,
    maxDownforce: 1750,
    notes: 'Evolution of the zero-sidepod concept, later abandoned mid-season in favor of more conventional design'
  },
  'sf23': {
    name: 'Scuderia Ferrari SF-23',
    year: 2023,
    team: 'Scuderia Ferrari',
    nationality: 'Italian',
    chassis: 'Carbon-fiber composite monocoque',
    engine: 'Ferrari 066/10',
    powerUnit: 'Ferrari V6 turbo-hybrid',
    length: 5035,
    width: 2000,
    height: 970,
    wheelbase: 3600,
    weight: 798,
    wins: 1,
    poles: 7,
    fastestLaps: 5,
    championshipPosition: 3,
    points: 406,
    topSpeed: 349,
    acceleration: 2.6,
    maxDownforce: 1760,
    notes: 'Strong qualifying pace but struggled with race pace and tire management. Secured victory in Singapore GP.'
  },
  'amr23': {
    name: 'Aston Martin AMR23',
    year: 2023,
    team: 'Aston Martin F1 Team',
    nationality: 'British',
    chassis: 'Carbon-fiber composite monocoque',
    engine: 'Mercedes-AMG F1 M14',
    powerUnit: 'Mercedes V6 turbo-hybrid',
    length: 5030,
    width: 2000,
    height: 970,
    wheelbase: 3590,
    weight: 798,
    wins: 0,
    poles: 0,
    fastestLaps: 0,
    championshipPosition: 5,
    points: 280,
    topSpeed: 347,
    acceleration: 2.7,
    maxDownforce: 1740,
    notes: 'Major step forward in performance, securing multiple podiums early in the season'
  },
  'mcl60': {
    name: 'McLaren MCL60',
    year: 2023,
    team: 'McLaren F1 Team',
    nationality: 'British',
    chassis: 'Carbon-fiber composite monocoque',
    engine: 'Mercedes-AMG F1 M14',
    powerUnit: 'Mercedes V6 turbo-hybrid',
    length: 5020,
    width: 2000,
    height: 970,
    wheelbase: 3580,
    weight: 798,
    wins: 0,
    poles: 0,
    fastestLaps: 2,
    championshipPosition: 4,
    points: 302,
    topSpeed: 346,
    acceleration: 2.7,
    maxDownforce: 1730,
    notes: 'Dramatic mid-season improvement after major upgrade package at Austrian GP'
  },
  'a523': {
    name: 'Alpine A523',
    year: 2023,
    team: 'Alpine F1 Team',
    nationality: 'French',
    chassis: 'Carbon-fiber composite monocoque',
    engine: 'Renault E-Tech RE23',
    powerUnit: 'Renault V6 turbo-hybrid',
    length: 5015,
    width: 2000,
    height: 970,
    wheelbase: 3575,
    weight: 798,
    wins: 0,
    poles: 0,
    fastestLaps: 0,
    championshipPosition: 6,
    points: 120,
    topSpeed: 345,
    acceleration: 2.7,
    maxDownforce: 1720,
    notes: 'Featured innovative front wing design and unique sidepod concept'
  }
};

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
          throw new Error('Driver not found');
        }

        return driver;
      } catch (error) {
        console.error('Error fetching driver info:', error);
        if (error instanceof Error) {
          if (error.message.includes('404') || error.message === 'Driver not found') {
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

  // New F1 Racing Results API endpoints
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
      // Optimized function to get all team stats in parallel
      const getTeamStats = async (teamId: string) => {
        const [
          resultsResponse,
          championshipsResponse,
          polesResponse,
          fastestLapsResponse
        ] = await Promise.all([
          ergastClient.get(`/constructors/${teamId}/results.json?limit=1000`),
          ergastClient.get(`/constructors/${teamId}/constructorStandings/1.json`),
          ergastClient.get(`/constructors/${teamId}/qualifying/1.json`),
          ergastClient.get(`/constructors/${teamId}/fastest/1/results.json`)
        ]);

        const totalRaces = parseInt(resultsResponse.data?.MRData?.total || '0');
        const championships = parseInt(championshipsResponse.data?.MRData?.total || '0');
        const poles = parseInt(polesResponse.data?.MRData?.total || '0');
        const fastestLaps = parseInt(fastestLapsResponse.data?.MRData?.total || '0');

        // Get all results in parallel batches if needed
        const results = [resultsResponse.data?.MRData?.RaceTable?.Races || []];
        if (totalRaces > 1000) {
          const remainingBatches = Math.ceil((totalRaces - 1000) / 1000);
          const batchPromises = Array.from({ length: remainingBatches }, (_, i) =>
            ergastClient.get(`/constructors/${teamId}/results.json?limit=1000&offset=${(i + 1) * 1000}`)
          );
          const batchResults = await Promise.all(batchPromises);
          results.push(...batchResults.map(batch => batch.data?.MRData?.RaceTable?.Races || []));
        }

        return {
          Races: results.flat(),
          totalRaces,
          championships,
          poles,
          fastestLaps
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
          poles: team1Stats.poles,
          fastestLaps: team1Stats.fastestLaps
        },
        team2: {
          Races: team2Stats.Races,
          constructorId: team2Id,
          totalRaces: team2Stats.totalRaces,
          championships: team2Stats.championships,
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

  // Add getCarInfo method to api object
  async getCarInfo(search: string) {
    // Normalize search term
    search = search.toLowerCase();

    // Handle year-based searches
    const yearMap: Record<string, string[]> = {
      '2024': ['rb20', 'w15', 'sf24'],
      '2023': ['rb19', 'w14', 'sf23', 'amr23', 'mcl60', 'a523'],
      '2020': ['w11'],
      '2013': ['rb9'],
      '2004': ['f2004'],
      '1992': ['fw14b'],
      '1988': ['mp4-4']
    };
    
    // Direct match with car code
    if (F1_CARS_2023[search]) {
      return F1_CARS_2023[search];
    }
    
    // Search by year - return all cars from that year
    if (yearMap[search]) {
      return yearMap[search].map(code => F1_CARS_2023[code]);
    }
    
    // Search by team name
    const teamSearch = search.replace(/\s+/g, '').toLowerCase();
    return Object.values(F1_CARS_2023).find(car => 
      car.team.replace(/\s+/g, '').toLowerCase().includes(teamSearch)
    );
  }
};