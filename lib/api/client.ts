// Export API modules
import { driversApi } from './modules/drivers';
import { teamsApi } from './modules/teams';
import { liveApi } from './modules/live';
import { racesApi } from './modules/races';

// Export combined API object
export const api = {
  // Driver methods
  getDriverStandings: driversApi.getDriverStandings,
  getDriverInfo: driversApi.getDriverInfo,
  compareDrivers: driversApi.compareDrivers,
  getCurrentDrivers: driversApi.getCurrentDrivers,

  // Team methods
  getConstructorStandings: teamsApi.getConstructorStandings,
  getConstructorInfo: teamsApi.getConstructorInfo,
  compareTeams: teamsApi.compareTeams,

  // Live data methods
  getLiveTimings: liveApi.getLiveTimings,
  getDriverTelemetry: liveApi.getDriverTelemetry,
  getTrackStatus: liveApi.getTrackStatus,
  getTrackWeather: liveApi.getTrackWeather,

  // Race methods
  getRaceSchedule: racesApi.getRaceSchedule,
  getRaceResults: racesApi.getRaceResults,
  getQualifyingResults: racesApi.getQualifyingResults,
  getLapTimes: racesApi.getLapTimes,
  getPitStops: racesApi.getPitStops,
  getNextRace: racesApi.getNextRace,
  getLastRaceResults: racesApi.getLastRaceResults
};