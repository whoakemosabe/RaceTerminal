import { driverNicknames, teamNicknames, trackNicknames, getFlagUrl, getTeamColor, getTrackDetails, findDriverId, countryToCode, driverNumbers, icons } from '@/lib/utils';
import { api } from '@/lib/api/client';

export const listCommands = {
  '/list': async (args: string[], originalCommand: string) => {
    if (!args[0]) {
      return `❌ Error: Please specify what to list\nUsage: /list <type>\nAvailable types:\n• drivers - List all drivers\n• teams - List all teams\n• tracks - List all tracks\nShortcuts: /ls, /list`;
    }

    const type = args[0].toLowerCase();

    switch (type) {
      case 'drivers': {
        // Get current drivers
        const currentDriverIds = [
          'albon', 'alonso', 'bearman', 'bottas', 'gasly', 'hamilton', 
          'hulkenberg', 'leclerc', 'magnussen', 'max_verstappen', 'norris', 
          'ocon', 'perez', 'piastri', 'ricciardo', 'russell', 'sainz', 
          'sargeant', 'stroll', 'tsunoda', 'zhou' 
        ];

        // Fetch current season results
        const currentYear = new Date().getFullYear();
        const results = await api.getRaceResults(currentYear);
        const wins = new Map<string, number>();

        // Count wins for each driver
        if (results && results.length > 0) {
          results.forEach((race: any) => {
            if (race.Results && race.Results[0] && race.Results[0].position === "1") {
              const driverId = findDriverId(`${race.Results[0].Driver.givenName} ${race.Results[0].Driver.familyName}`);
              if (driverId) {
                wins.set(driverId, (wins.get(driverId) || 0) + 1);
              }
            }
          });
        }

        const currentDrivers = currentDriverIds
          .map(id => {
            const nicknames = driverNicknames[id];
            const name = nicknames[0];
            const code = nicknames.find(n => n.length === 3 && n === n.toUpperCase()) || '';
            const nationality = nicknames.find(n => countryToCode[n]) || '';
            const number = driverNumbers[id] || '';
            const raceWins = wins.get(id) || 0;
            // Add team information
            const team = (() => {
              switch(id) {
                case 'max_verstappen':
                case 'perez':
                  return 'Red Bull Racing';
                case 'hamilton':
                case 'russell':
                  return 'Mercedes-AMG Petronas';
                case 'leclerc':
                case 'sainz':
                case 'bearman':
                  return 'Scuderia Ferrari';
                case 'norris':
                case 'piastri':
                  return 'McLaren F1 Team';
                case 'alonso':
                case 'stroll':
                  return 'Aston Martin F1 Team';
                case 'ocon':
                case 'gasly':
                  return 'Alpine F1 Team';
                case 'albon':
                case 'sargeant':
                  return 'Williams Racing';
                case 'ricciardo':
                case 'tsunoda':
                  return 'AlphaTauri';
                case 'bottas':
                case 'zhou':
                  return 'Alfa Romeo F1 Team';
                case 'hulkenberg':
                case 'magnussen':
                  return 'Haas F1 Team';
                default:
                  return 'Unknown Team';
              }
            })();
            return { id, name, code, nationality, number, team, wins: raceWins };
          })
          .sort((a, b) => a.name.localeCompare(b.name));

        // Get retired world champions
        const retiredChampions = Object.entries(driverNicknames)
          .filter(([id, nicknames]) => nicknames.length >= 5 && nicknames[4]?.includes(','))
          .map(([id, nicknames]) => ({
            id,
            name: nicknames[0],
            code: nicknames.find(n => n.length === 3 && n === n.toUpperCase()) || '',
            nationality: nicknames.find(n => countryToCode[n]) || '',
            championships: nicknames[4]
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        // Get notable non-champion drivers
        const notableDrivers = Object.entries(driverNicknames)
          .filter(([id, nicknames]) => {
            // Not a current driver and not a champion
            return !currentDrivers.some(d => d.id === id) && 
                   !retiredChampions.some(d => d.id === id);
          })
          .map(([id, nicknames]) => ({
            id,
            name: nicknames[0],
            code: nicknames.find(n => n.length === 3 && n === n.toUpperCase()) || '',
            nationality: nicknames.find(n => countryToCode[n]) || ''
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        // Format sections
        const currentSection = [
          '🏎️ Current F1 Drivers (2024 Season)',
          '═'.repeat(60),
          ...currentDrivers.map(d => {
            const flagUrl = getFlagUrl(d.nationality);
            const flag = flagUrl ? 
              `<img src="${flagUrl}" alt="${d.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
              '';
            const teamColor = getTeamColor(d.team);
            return `  #${d.number.padStart(2, '0')} | ${d.name} (${d.code}) ${flag} | <span style="color: ${teamColor}">${d.team}</span>${d.wins > 0 ? ` | 🏆 ${d.wins} ${d.wins === 1 ? 'win' : 'wins'}` : ''}`;
          })
        ];

        const championsSection = [
          '',
          '👑 World Champions',
          '═'.repeat(60),
          ...retiredChampions.map(d => {
            const flagUrl = getFlagUrl(d.nationality);
            const flag = flagUrl ? 
              `<img src="${flagUrl}" alt="${d.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
              '';
            return `  ${d.name} (${d.code}) ${flag} | 🏆 ${d.championships}`;
          })
        ];

        const notableSection = [
          '',
          '🌟 Notable Drivers',
          '═'.repeat(60),
          ...notableDrivers.map(d => {
            const flagUrl = getFlagUrl(d.nationality);
            const flag = flagUrl ? 
              `<img src="${flagUrl}" alt="${d.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
              '';
            return `  ${d.name} (${d.code}) ${flag}`;
          })
        ];

        return [...currentSection, ...championsSection, ...notableSection].join('\n');
      }

      case 'teams': {
        const teams = Object.entries(teamNicknames)
          .map(([id, names]) => {
            const mainName = names[0];
            const code = names.find(n => n.length === 3 && n === n.toUpperCase()) || '';
            const hq = names[3];
            const established = names[4];
            const championships = names[5];
            const nationality = names[6];
            const color = getTeamColor(mainName);
            const flagUrl = getFlagUrl(nationality);
            const flag = flagUrl ? 
              `<img src="${flagUrl}" alt="${nationality} flag" style="display:inline-block;vertical-align:middle;margin:0 2px;height:13px;width:25px;object-fit:cover;">` : 
              '';
            
            return `${flag} <span style="color: ${color}">${mainName}</span> (${code}) | 📍 ${hq} | 📅 ${established} | 🏆 ${championships}`;
          })
          .sort();

        return [
          '🏎️ Current F1 Teams:',
          ...teams
        ].join('\n');
      }

      case 'tracks': {
        const tracks = Object.entries(trackNicknames)
          .map(([id, [name, nickname, code, ...rest]]) => {
            const details = getTrackDetails(id);
            const country = name.includes('GP') ? 
              name.split(' ').pop()?.replace('GP', '').trim() : 
              nickname.split(' ').pop()?.replace('GP', '').trim();
            
            const flagUrl = country ? getFlagUrl(country) : '';
            const flag = flagUrl ? 
              `<img src="${flagUrl}" alt="${country} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
              '';
            
            const lapRecord = details.lapRecord ? 
              `${details.lapRecord.time} (${details.lapRecord.driver}, ${details.lapRecord.year})` : 
              'No record';
            
            return [
              `  ${flag} ${name}`,
              `    ${icons.mapPin} ${nickname} | ${icons.car} ${code}`,
              `    📏 Length: ${details.length}km | ↩️ Turns: ${details.turns}`,
              `    ⚡ Lap Record: ${lapRecord}`
            ].join('\n');
          })
          .sort();

        return [
          '🏁 Formula 1 Grand Prix Circuits',
          '═'.repeat(60),
          '',
          ...tracks
        ].join('\n');
      }

      default:
        return `❌ Error: Invalid list type "${type}"\nAvailable types: drivers, teams, tracks`;
    }
  }
};