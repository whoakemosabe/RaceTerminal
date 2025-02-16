import { api } from '@/lib/api/client';
import { getFlagUrl, formatDate } from '@/lib/utils';
import { F1_CARS } from '@/lib/data/cars';

export const carCommands = {
  '/car': async (args: string[], originalCommand: string) => {
    if (!args[0]) {
      const cmd = originalCommand === '/c' ? '/c' : '/car';
      return `❌ Error: Please provide a car name\nUsage: ${cmd} <name> (e.g., ${cmd} mp4-4)\nTip: Use /list cars to see all available cars`;
    }

    // Normalize search but preserve hyphens for car IDs that use them
    const carId = args[0].toLowerCase();
    const car = F1_CARS[carId];

    if (!car) {
      // Try without hyphens as fallback
      const fallbackId = args[0].toLowerCase().replace(/[/-]/g, '');
      const fallbackCar = F1_CARS[fallbackId];
      
      if (fallbackCar) {
        return formatCarInfo(fallbackCar);
      }
      
      return `❌ Error: Could not find car "${args[0]}". Try using the exact car code (e.g., mp4-4, f2002, rb19)`;
    }

    return formatCarInfo(car);
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
