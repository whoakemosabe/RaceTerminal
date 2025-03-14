// Stats calculation utilities
export function calculateTeamStats(results: any[]) {
  // Filter out invalid results but keep all valid entries
  const validResults = results.filter(r => 
    r.Results?.length > 0
  );
  
  return {
    // Count race wins (any car finishing P1)
    wins: validResults.filter((r: any) => 
      r.Results?.some(result => 
        result?.position === "1" && !['DNQ', 'DNS', 'DNPQ', 'WD'].includes(result.status)
      )
    ).length,
    // Count podiums (any car finishing P1-P3)
    podiums: validResults.reduce((total: number, r: any) => {
      const podiumsInRace = r.Results?.reduce((count: number, result: any) => {
        const pos = parseInt(result?.position);
        return !isNaN(pos) && pos <= 3 && !['DNQ', 'DNS', 'DNPQ', 'WD'].includes(result.status) ? 
          count + 1 : count;
      }, 0) || 0;
      return total + podiumsInRace;
    }, 0),
    // Sum points from all cars in each race
    points: validResults.reduce((acc: number, r: any) => {
      const racePoints = r.Results?.reduce((raceAcc: number, result: any) => {
        // Only count points for classified finishes
        const points = ['DNQ', 'DNS', 'DNPQ', 'WD'].includes(result.status) ? 
          0 : parseFloat(result?.points || '0');
        return raceAcc + (isNaN(points) ? 0 : points);
      }, 0);
      return acc + (racePoints || 0);
    }, 0),
    // Find best finish from any car
    bestFinish: Math.min(...validResults.map((r: any) => {
      const positions = r.Results?.map(result => {
        const pos = parseInt(result?.position);
        return !isNaN(pos) && !['DNQ', 'DNS', 'DNPQ', 'WD'].includes(result.status) ? 
          pos : Infinity;
      }) || [Infinity];
      return Math.min(...positions);
    })),
    // Count fastest laps from any car
    fastestLaps: validResults.filter((r: any) => 
      r.Results?.some(result => 
        result?.FastestLap?.rank === "1" && !['DNQ', 'DNS', 'DNPQ', 'WD'].includes(result.status)
      )
    ).length
  };
}