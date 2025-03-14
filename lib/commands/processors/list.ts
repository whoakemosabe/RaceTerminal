import { driverNicknames, teamNicknames, trackNicknames, getFlagUrl, getTeamColor, getTrackDetails, findDriverId, countryToCode, driverNumbers, icons, teamThemes, formatWithTeamColor } from '@/lib/utils';
import { colorThemes } from '@/lib/themes/colors';
import { calculatorThemes } from '@/lib/themes/calculator';
import { api } from '@/lib/api/client';

export const listCommands = {
  '/list': async (args: string[], originalCommand: string) => {
    if (!args[0]) {
      return `❌ Error: Please specify what to list\nUsage: /list <type>\nAvailable types:\n• drivers - List all drivers\n• teams - List all teams\n• tracks - List all tracks\nShortcuts: /ls, /list`;
    }

    const type = args[0].toLowerCase();

    switch (type) {
      case 'drivers': {
        // Get real-time current drivers from OpenF1 API
        const currentDrivers = await api.getCurrentDrivers();
        
        if (!currentDrivers || currentDrivers.length === 0) {
          return '❌ Error: Could not fetch current driver data. Please try again later.';
        }

        const formattedDrivers = currentDrivers
          .sort((a, b) => a.full_name.localeCompare(b.full_name))
          .map(driver => ({
            name: `${driver.first_name} ${driver.last_name}`,
            code: driver.name_acronym,
            nationality: mapCountryCode(driver.country_code),
            number: driver.driver_number.toString(),
            team: driver.team_name,
            teamColor: `#${driver.team_colour}`
          }));

        // Helper function to map OpenF1 country codes to proper nationality
        function mapCountryCode(code: string): string {
          const countryMap: Record<string, string> = {
            'NED': 'Dutch',
            'ITA': 'Italian',
            'ESP': 'Spanish',
            'MEX': 'Mexican',
            'MCO': 'Monegasque',
            'AUS': 'Australian',
            'GBR': 'British',
            'THA': 'Thai',
            'CHN': 'Chinese',
            'JPN': 'Japanese',
            'FRA': 'French',
            'CAN': 'Canadian',
            'GER': 'German',
            'DEN': 'Danish',
            'USA': 'American'
          };
          return countryMap[code] || code;
        }
        // Get retired champions sorted by championships
        const retiredChampions = Object.entries(driverNicknames)
          .filter(([id, nicknames]) => {
            // Include both historical champions and those with championship years
            return (
              nicknames.some(nick => nick.includes(',') && /\d{4}/.test(nick)) ||
              ['hawthorn', 'surtees'].includes(id)
            );
          })
          .map(([id, nicknames]) => {
            const number = driverNumbers[id] || '';
            const championshipYears = nicknames.find(nick => nick.includes(',') && /\d{4}/.test(nick)) || '';
            return {
              id,
              name: nicknames[0],
              code: nicknames.find(n => n.length === 3 && n === n.toUpperCase()) || '',
              nationality: nicknames.find(n => countryToCode[n]) || '',
              championships: championshipYears,
              championshipCount: (championshipYears.match(/\d{4}/g) || []).length,
              number
            };
          })
          .sort((a, b) => b.championshipCount - a.championshipCount);

        // Get notable non-champion drivers
        const notableDrivers = Object.entries(driverNicknames)
          .filter(([id, nicknames]) => {
            // Exclude:
            // 1. Current drivers (by checking against currentDrivers)
            // 2. Champions (by checking for championship years)
            // 3. Current driver names (by checking first name against currentDrivers)
            const isCurrentDriver = currentDrivers.some(d => 
              d.first_name.toLowerCase() + ' ' + d.last_name.toLowerCase() === nicknames[0].toLowerCase()
            );
            const isChampion = nicknames.some(nick => nick.includes(',') && /\d{4}/.test(nick));
            
            return !isCurrentDriver && !isChampion;
          })
          .map(([id, nicknames]) => {
            const number = driverNumbers[id] || '';
            return {
              id,
              name: nicknames[0],
              code: nicknames.find(n => n.length === 3 && n === n.toUpperCase()) || '',
              nationality: nicknames.find(n => countryToCode[n]) || '',
              number
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name));

        // Format sections
        const currentSection = [
          '🏎️ Current F1 Drivers (2025 Season)',
          '═'.repeat(60),
          ...formattedDrivers.map(d => {
            const flagUrl = getFlagUrl(d.nationality);
            const flag = flagUrl ? 
              `<img src="${flagUrl}" alt="${d.nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
              '';
            const numberDisplay = `#${d.number.padStart(2, '0')}`;
            return `${numberDisplay} | ${d.name} ${flag} (${d.code}) | <span style="color: ${d.teamColor}">${d.team}</span>`;
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
            const numberDisplay = d.number ? `#${d.number.padStart(2, '0')}` : '   ';
            return `${numberDisplay} | ${d.name} (${d.code}) ${flag} | 🏆 ${d.championshipCount} (${d.championships})`;
          })
        ];

        return [...currentSection, ...championsSection].join('\n');
      }

      case 'teams': {
        // Sort teams by championships
        const sortedTeams = Object.entries(teamNicknames)
          .map(([id, names]) => ({
            id,
            name: names[0],
            code: names[1],
            hq: names[3],
            established: names[4],
            championships: parseInt(names[5]),
            nationality: names[6]
          }))
          .sort((a, b) => b.championships - a.championships);

        const teams = sortedTeams.map((team, index) => {
          const flagUrl = getFlagUrl(team.nationality);
          const flag = flagUrl ? 
            `<img src="${flagUrl}" alt="${team.nationality} flag" style="display:inline-block;vertical-align:middle;margin:0 2px;height:13px;width:25px;object-fit:cover;">` : 
            '';
          
          const teamColor = getTeamColor(team.name);
          return `${(index + 1).toString().padStart(2, ' ')}. ${flag} <span style="color: ${teamColor}">${team.name}</span> | 🏆 ${team.championships} Championships | 📍 ${team.hq} | 📅 ${team.established}`;
        });

        return [
          '🏎️ F1 TEAMS BY CHAMPIONSHIPS',
          '═'.repeat(60),
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
      
      case 'themes': {
        const separator = '═'.repeat(60);
        
        // Format team themes with color swatches
        const teamSection = [
          '🏎️  F1 TEAM THEMES',
          separator,
          Object.entries(teamNicknames).map(([id, names]) => {
            const teamName = names[0].padEnd(25);
            const theme = teamThemes[id];
            // Special handling for Haas (white background)
            const isHaas = id === 'haas';
            return `<span style="display:inline-block;margin:4px;padding:2px 12px;min-width:200px;font-size:12px;background:linear-gradient(to right,hsl(${theme.primary}),hsl(${theme.secondary}));border:1px solid hsl(${theme.border});border-radius:4px;color:${isHaas ? '#111111' : 'white'} !important;font-family:monospace;text-shadow:${isHaas ? 'none' : '0 1px 2px rgba(0,0,0,0.9),0 2px 4px rgba(0,0,0,0.7),0 0 8px rgba(255,255,255,0.2)'};font-weight:600;letter-spacing:0.02em">${teamName}</span>`;
          }).join('\n')
        ];

        // Format editor themes with color swatches
        const editorSection = [
          '',
          '🎨 EDITOR THEMES',
          separator,
          Object.entries(colorThemes).map(([name, theme]) => {
            const themeName = name.padEnd(15);
            // Calculate if theme is light or dark based on background
            const [h, s, l] = theme.background.split(' ');
            const isLight = parseInt(l) > 50;
            // Use dark text for light themes, light text for dark themes
            const textColor = isLight ? '#111111' : '#ffffff';
            const textShadow = isLight ? 'none' : '0 1px 2px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.7), 0 0 8px rgba(255,255,255,0.3)';
            return `<span style="display:inline-block;margin:4px;padding:2px 12px;min-width:200px;font-size:12px;background:linear-gradient(to right,hsl(${theme.primary}),hsl(${theme.secondary}));border:1px solid hsl(${theme.border});border-radius:4px;color:${textColor} !important;font-family:monospace;text-shadow:${textShadow};font-weight:600;letter-spacing:0.02em;box-shadow:inset 0 1px rgba(255,255,255,0.15),0 1px 3px rgba(0,0,0,0.2)">${themeName}</span> ${theme.description || 'Custom color scheme'}`;
          }).join('\n')
        ];

        // Format calculator themes with LCD-style swatches
        const calcSection = [
          '',
          '🖩 CALCULATOR THEMES',
          separator,
          Object.entries(calculatorThemes).map(([name, theme]) => {
            const bgColor = theme.bg || '#c8d1c0';
            const textColor = theme.text || '#0d1f0c';
            const accentColor = theme.accent || textColor;
            const shadowColor = `${textColor}80`;
            const themeName = name.padEnd(15);
            // Create LCD-style display with numbers
            const lcdDisplay = `<span style="display:inline-block;margin-left:8px;padding:1px 6px;font-family:'Courier New',monospace;font-size:14px;background:${bgColor};border:1px solid ${accentColor};border-radius:2px;color:${textColor} !important;text-shadow:0 0 2px ${shadowColor};font-weight:bold;letter-spacing:0.1em;box-shadow:inset 0 2px 4px rgba(0,0,0,0.2),inset 0 -1px 1px rgba(255,255,255,0.3)">12:34</span>`;
            return `<span style="display:inline-block;margin:4px;padding:2px 12px;min-width:200px;font-size:12px;font-family:monospace;background:${bgColor};border:1px solid ${accentColor};border-radius:4px;box-shadow:inset 0 2px 4px rgba(0,0,0,0.15),inset 0 -1px 1px rgba(255,255,255,0.3)"><span style="color:${textColor} !important;text-shadow:0 0 3px ${shadowColor};font-weight:600;letter-spacing:0.02em">${themeName}</span>${lcdDisplay}</span> ${theme.description || 'Calculator theme'}`;
          }).join('\n')
        ];

        return [
          ...teamSection,
          ...editorSection,
          ...calcSection,
          '',
          'Usage:',
          '• /theme <team-name> - Apply F1 team colors',
          '• /theme <editor-theme> - Apply editor theme',
          '• /theme calc <calc-theme> - Apply calculator theme',
          '• /theme default - Reset to default colors'
        ].join('\n');
      }

      default:
        return `❌ Error: Invalid list type "${type}"\nAvailable types: drivers, teams, tracks, themes`;
    }
  }
};