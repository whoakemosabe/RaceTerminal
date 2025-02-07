import { api } from '@/lib/api/client';
import { getFlagUrl, formatDate } from '@/lib/utils';

export const carCommands = {
  '/car': async (args: string[], originalCommand: string) => {
    if (!args[0]) {
      const cmd = originalCommand === '/c' ? '/c' : '/car';
      return `❌ Error: Please provide a car name or year\nUsage: ${cmd} <name|year> (e.g., ${cmd} rb19 or ${cmd} 2023)\nTip: Use /list cars to see all available cars`;
    }

    const searchTerm = args[0].toLowerCase();
    const data = await api.getCarInfo(searchTerm);
    
    if (!data) {
      return `❌ Error: Could not find car "${args[0]}". Try using:\n• Car name (e.g., rb19, w14)\n• Year (e.g., 2023)\n• Team name (e.g., redbull)`;
    }

    const flagUrl = getFlagUrl(data.nationality);
    const flag = flagUrl ? `<img src="${flagUrl}" alt="${data.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : '';

    // If searching by year, show all cars in a table format
    if (Array.isArray(data)) {
      const header = '🏎️  2023 FORMULA 1 CARS  🏁';
      const separator = '═'.repeat(100);
      
      const carsTable = data.map(car => {
        const teamFlag = getFlagUrl(car.nationality);
        const flagImg = teamFlag ? 
          `<img src="${teamFlag}" alt="${car.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
          '';
        
        return [
          `${car.name} ${flagImg}`,
          `🏆 P${car.championshipPosition} | ${car.points} pts`,
          `📊 Wins: ${car.wins} | Poles: ${car.poles} | FL: ${car.fastestLaps}`,
          `🚀 Top Speed: ${car.topSpeed} km/h`,
          `📝 ${car.notes}`,
          ''
        ].join('\n');
      });

      return [
        header,
        separator,
        ...carsTable
      ].join('\n');
    }

    // Single car detailed view
    const header = `🏎️  ${data.name.toUpperCase()}  🏁\n`;
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
      `${formatColumn(`🏎️ Constructor: ${data.team} ${flag}`)}${formatColumn(`🛠️ Chassis: ${data.chassis}`)}`,
      `${formatColumn(`📅 Season: ${data.year}`)}${formatColumn(`🔧 Engine: ${data.engine}`)}`,
      `${formatColumn(`🏆 Championship: P${data.championshipPosition}`)}${formatColumn(`⚡ Power Unit: ${data.powerUnit}`)}`,
      `${formatColumn(`📊 Points: ${data.points}`)}`,
      '',
      // Physical Dimensions and Season Achievements
      `${formatColumn('📏 PHYSICAL DIMENSIONS')}${formatColumn('🎯 SEASON ACHIEVEMENTS')}`,
      `${formatColumn(halfSeparator)}${formatColumn(halfSeparator)}`,
      `${formatColumn(`📏 Length: ${data.length} mm`)}${formatColumn(`🏆 Race Wins: ${data.wins}`)}`,
      `${formatColumn(`↔️ Width: ${data.width} mm`)}${formatColumn(`🎯 Pole Positions: ${data.poles}`)}`,
      `${formatColumn(`↕️ Height: ${data.height} mm`)}${formatColumn(`⚡ Fastest Laps: ${data.fastestLaps}`)}`,
      `${formatColumn(`↔️ Wheelbase: ${data.wheelbase} mm`)}`,
      `${formatColumn(`⚖️ Weight: ${data.weight} kg`)}`,
      '',
      // Performance Metrics
      '🚀 PERFORMANCE METRICS',
      halfSeparator,
      `${formatColumn(`🏁 Maximum Speed: ${data.topSpeed} km/h`)}${formatColumn(`🚦 0-100 km/h: ${data.acceleration}s`)}`,
      `${formatColumn(`⬇️ Peak Downforce: ${data.maxDownforce} kg`)}`,
      '',
      // Notes section
      data.notes ? [
        '📝 ADDITIONAL NOTES',
        halfSeparator,
        data.notes
      ].join('\n') : ''
    ].filter(Boolean).join('\n');
  }
};