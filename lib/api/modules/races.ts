import { retryRequest, ergastClient } from './base';

import { schedule } from '@/lib/data/schedule';

export const racesApi = {
  async getRaceSchedule(year: number = new Date().getFullYear()) {
    // Only return 2025 schedule
    if (year === 2025) {
      return schedule.races
        .filter(race => race.type !== 'testing') // Exclude testing sessions
        .map(race => {
          const raceDate = new Date(race.sessions.race?.date || race.sessions.practice1.date);
          const raceTime = raceDate.toISOString().split('T')[1].slice(0, 8);

          return {
            round: race.round.toString(),
            raceName: race.officialName,
            Circuit: {
              circuitName: race.circuit.name,
              Location: {
                locality: race.circuit.location,
                country: race.circuit.country
              }
            },
            date: raceDate.toISOString().split('T')[0],
            time: raceTime,
            FirstPractice: {
              date: race.sessions.practice1.date.split('T')[0],
              time: race.sessions.practice1.date.split('T')[1].slice(0, 8)
            },
            SecondPractice: {
              date: race.sessions.practice2.date.split('T')[0],
              time: race.sessions.practice2.date.split('T')[1].slice(0, 8)
            },
            ThirdPractice: race.sessions.practice3 ? {
              date: race.sessions.practice3.date.split('T')[0],
              time: race.sessions.practice3.date.split('T')[1].slice(0, 8)
            } : undefined,
            Qualifying: race.sessions.qualifying ? {
              date: race.sessions.qualifying.date.split('T')[0],
              time: race.sessions.qualifying.date.split('T')[1].slice(0, 8)
            } : undefined,
            Sprint: race.sessions.sprint ? {
              date: race.sessions.sprint.date.split('T')[0],
              time: race.sessions.sprint.date.split('T')[1].slice(0, 8)
            } : undefined
          };
        });
    }

    // For other years, return empty array since we only have 2025 data
    return [];
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
  }
};