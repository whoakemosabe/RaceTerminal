export interface StintPerformance {
  number: number;
  laps: number;
  startLap: number;
  endLap: number;
  avgTime: number;
  medianTime: number;
  bestLap: number;
  worstLap: number;
  range: number;
  trend: number;
  consistency: number;
}

export interface DriverPaceAnalysis {
  driverId: string;
  timesInSeconds: number[];
  avgTime: number;
  median: number;
  bestTime: number;
  consistency: number;
  iqr: number;
  stints: StintPerformance[];
  bestStint: StintPerformance | null;
  result: any;
}

export interface GapAnalysis {
  driver: any;
  constructor: any;
  position: string;
  gapToAhead: number | null;
  driverAhead: {
    name: string;
    nationality: string;
  } | null;
  avgGapToLeader: number | null;
  gapConsistency: number | null;
  closestRival: {
    name: string;
    avgGap: number;
  } | null;
  minGap: number;
}