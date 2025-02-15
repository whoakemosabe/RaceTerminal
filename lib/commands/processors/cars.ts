import { api } from '@/lib/api/client';
import { getFlagUrl, formatDate } from '@/lib/utils';
import { F1_CARS } from '@/lib/data/cars';

export const carCommands = {
  '/car': async (args: string[], originalCommand: string) => {
    if (!args[0]) {
      const cmd = originalCommand === '/c' ? '/c' : '/car';
      return `❌ Error: Please provide a car name or year\nUsage: ${cmd} <name|year> (e.g., ${cmd} rb19 or ${cmd} 2023)\nTip: Use /list cars to see all available cars`;
    }

    // Normalize search term
    const search = args[0].toLowerCase();

    // Handle year-based searches
    const yearMap: Record<string, string[]> = {
      '2024': ['rb20', 'w15', 'sf24'],
      '2023': ['rb19', 'w14', 'sf23', 'amr23', 'mcl60', 'a523']
    };
    
    // Direct match with car code
    if (F1_CARS[search]) {
      return formatCarInfo(F1_CARS[search]);
    }
    
    // Search by year - return all cars from that year
    if (yearMap[search]) {
      return formatYearCars(yearMap[search].map(code => F1_CARS[code]), search);
    }
    
    // Search by team name
    const teamSearch = search.replace(/\s+/g, '').toLowerCase();
    const carByTeam = Object.values(F1_CARS).find(car => 
      car.team.replace(/\s+/g, '').toLowerCase().includes(teamSearch)
    );

    if (!carByTeam) {
      return `❌ Error: Could not find car "${args[0]}". Try using:\n• Car name (e.g., rb19, w14)\n• Year (e.g., 2023)\n• Team name (e.g., redbull)`;
    }

    return formatCarInfo(carByTeam);
  }
};

function formatCarInfo(car: any): string {
  const flagUrl = getFlagUrl(car.nationality);
  const flag = flagUrl ? `<img src="${flagUrl}" alt="${car.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : '';

  const header = `🏎️  ${car.name.toUpperCase()}  🏁\n`;
  const separator = '═'.repeat(Math.max(header.length, 80));
  const halfSeparator = '─'.repeat(40);

  // Format columns with equal width
  const formatColumn = (text: string, width: number = 40) => {
    return text.padEnd(width);
  };

  return [
    header,
    separator,
    // Team Information and Technical Specs side by side
    `${formatColumn('🏢 TEAM INFORMATION')}${formatColumn('⚙️ TECHNICAL SPECIFICATIONS')}`,
    `${formatColumn(halfSeparator)}${formatColumn(halfSeparator)}`,
    `${formatColumn(`🏎️ Constructor: ${car.team} ${flag}`)}${formatColumn(`🛠️ Chassis: ${car.chassis}`)}`,
    `${formatColumn(`📅 Season: ${car.year}`)}${formatColumn(`🔧 Engine: ${car.engine}`)}`,
    `${formatColumn(`🏆 Championship: P${car.championshipPosition}`)}${formatColumn(`⚡ Power Unit: ${car.powerUnit}`)}`,
    `${formatColumn(`📊 Points: ${car.points}`)}`,
    '',
    // Physical Dimensions and Season Achievements
    `${formatColumn('📏 PHYSICAL DIMENSIONS')}${formatColumn('🎯 SEASON ACHIEVEMENTS')}`,
    `${formatColumn(halfSeparator)}${formatColumn(halfSeparator)}`,
    `${formatColumn(`📏 Length: ${car.length} mm`)}${formatColumn(`🏆 Race Wins: ${car.wins}`)}`,
    `${formatColumn(`↔️ Width: ${car.width} mm`)}${formatColumn(`🎯 Pole Positions: ${car.poles}`)}`,
    `${formatColumn(`↕️ Height: ${car.height} mm`)}${formatColumn(`⚡ Fastest Laps: ${car.fastestLaps}`)}`,
    `${formatColumn(`↔️ Wheelbase: ${car.wheelbase} mm`)}`,
    `${formatColumn(`⚖️ Weight: ${car.weight} kg`)}`,
    '',
    // Performance Metrics
    '🚀 PERFORMANCE METRICS',
    halfSeparator,
    `${formatColumn(`🏁 Maximum Speed: ${car.topSpeed} km/h`)}${formatColumn(`🚦 0-100 km/h: ${car.acceleration}s`)}`,
    `${formatColumn(`⬇️ Peak Downforce: ${car.maxDownforce} kg`)}`,
    '',
    // Notes section
    car.notes ? [
      '📝 ADDITIONAL NOTES',
      halfSeparator,
      car.notes
    ].join('\n') : ''
  ].filter(Boolean).join('\n');
}
