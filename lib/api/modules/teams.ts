import { retryRequest, ergastClient } from './base';

export const teamsApi = {
  async getConstructorStandings(year: number = new Date().getFullYear()) {
    return retryRequest(async () => {
      // Always use previous year since current year data won't be available yet
      const previousYear = year - 1;
      const response = await ergastClient.get(`/${previousYear}/constructorStandings.json`);
      
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

  async compareTeams(team1Id: string, team2Id: string) {
    return retryRequest(async () => {
      // Enhanced function to get comprehensive team stats
      const getTeamStats = async (teamId: string) => {
        const [
          resultsResponse,
          championshipsResponse,
          winsResponse,
          polesResponse
        ] = await Promise.all([
          ergastClient.get(`/constructors/${teamId}/results.json?limit=2000`),
          ergastClient.get(`/constructors/${teamId}/constructorStandings/1.json`),
          ergastClient.get(`/constructors/${teamId}/results/1.json?limit=2000`),
          ergastClient.get(`/constructors/${teamId}/qualifying/1.json`)
        ]);

        const totalRaces = parseInt(resultsResponse.data?.MRData?.total || '0');
        const championships = parseInt(championshipsResponse.data?.MRData?.total || '0');
        const wins = parseInt(winsResponse.data?.MRData?.total || '0');
        const poles = parseInt(polesResponse.data?.MRData?.total || '0');
        const allResults = resultsResponse.data?.MRData?.RaceTable?.Races || [];

        // Calculate podiums by checking all results for top 3 finishes
        const podiums = allResults.reduce((total, race) => {
          const podiumFinishes = race.Results?.filter(result => 
            ["1", "2", "3"].includes(result.position)
          ).length || 0;
          return total + podiumFinishes;
        }, 0);

        // Calculate fastest laps
        const fastestLaps = allResults.reduce((total, race) => {
          const fastestLapsInRace = race.Results?.filter(result => 
            result.FastestLap?.rank === "1"
          ).length || 0;
          return total + fastestLapsInRace;
        }, 0);

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
  }
};