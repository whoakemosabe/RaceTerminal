import axios from 'axios';

const f1RacingClient = axios.create({
  baseURL: 'https://ergast.com/api/f1',
  params: {
    format: 'json'
  }
});

const ergastClient = axios.create({
  baseURL: 'https://ergast.com/api/f1',
  params: {
    format: 'json'
  }
});

const openF1Client = axios.create({
  baseURL: 'https://api.openf1.org/v1'
});

export const api = {
  async getDriverStandings(year: number = new Date().getFullYear()) {
    const { data } = await ergastClient.get(`/${year}/driverStandings.json`);
    const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    return standings.map((standing: any) => ({
      ...standing,
      Constructor: standing.Constructors[0]
    }));
  },

  async getConstructorStandings(year: number = new Date().getFullYear()) {
    const { data } = await ergastClient.get(`/${year}/constructorStandings.json`);
    return data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
  },

  async getRaceSchedule(year: number = new Date().getFullYear()) {
    const { data } = await ergastClient.get(`/${year}.json`);
    if (!data?.MRData?.RaceTable?.Races) {
      return [];
    }
    return data.MRData.RaceTable.Races.map((race: any) => ({
      ...race,
      country: race.Circuit.Location.country,
      date: race.date + (race.time ? 'T' + race.time : '')
    }));
  },

  async getDriverInfo(driverId: string) {
    const { data } = await ergastClient.get(`/drivers/${driverId}.json`);
    return data.MRData.DriverTable.Drivers[0];
  },

  async getTrackInfo(circuitId: string) {
    const { data } = await ergastClient.get(`/circuits/${circuitId}.json`);
    if (!data?.MRData?.CircuitTable?.Circuits?.[0]) {
      return null;
    }
    return data.MRData.CircuitTable.Circuits[0];
  },

  async getLiveTimings() {
    const { data } = await openF1Client.get('/live-timing');
    return data;
  },

  // New F1 Racing Results API endpoints
  async getRaceResults(year?: number, round?: number) {
    const path = year ? `/${year}${round ? `/${round}` : ''}` : '';
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
  },

  async getQualifyingResults(year: number, round: number) {
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
  },

  async getLapTimes(year: number, round: number, driverId?: string) {
    const { data } = await ergastClient.get(`/${year}/${round}/laps.json`);
    if (!data?.MRData?.RaceTable?.Races?.[0]?.Laps) {
      return [];
    }
    const laps = data.MRData.RaceTable.Races[0].Laps;
    return laps.map((lap: any) => ({
      lap: lap.number,
      time: lap.Timings[0].time,
      driver: lap.Timings[0].driverId.toUpperCase()
    }));
  },

  async getPitStops(year: number, round: number) {
    const { data } = await ergastClient.get(`/${year}/${round}/pitstops.json`);
    if (!data?.MRData?.RaceTable?.Races?.[0]?.PitStops) {
      return [];
    }
    return data.MRData.RaceTable.Races[0].PitStops.map((stop: any) => ({
      driver: stop.driverId.toUpperCase(),
      lap: stop.lap,
      duration: stop.duration
    }));
  }
};