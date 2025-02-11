import { driverNicknames, teamNicknames, trackNicknames, getFlagUrl, getTeamColor, getTrackDetails, findDriverId, countryToCode, driverNumbers, icons, teamThemes, formatWithTeamColor } from '@/lib/utils';
import { colorThemes } from '@/lib/themes/colors';
import { calculatorThemes } from '@/lib/themes/calculator';

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

        const currentDrivers = currentDriverIds
          .map(id => {
            const nicknames = driverNicknames[id];
            const name = nicknames[0];
            const code = nicknames.find(n => n.length === 3 && n === n.toUpperCase()) || '';
            const nationality = nicknames.find(n => countryToCode[n]) || '';
            const number = driverNumbers[id] || '';
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
            return { id, name, code, nationality, number, team };
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
            return `  #${d.number.padStart(2, '0')} | ${d.name} (${d.code}) ${flag} | ${formatWithTeamColor('', d.team)}`;
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
            
            return `${flag} ${formatWithTeamColor('', mainName)} (${code}) | 📍 ${hq} | 📅 ${established} | 🏆 ${championships}`;
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
      
      case 'themes': {
        const separator = '═'.repeat(60);
        
        // Team Themes Section
        const teamSection = [
          '🏎️  F1 TEAM THEMES',
          separator,
          ...Object.entries(teamNicknames).map(([id, names]) => {
            const teamName = names[0];
            const teamColor = getTeamColor(teamName);
            const theme = teamThemes[id];
            return `<div style="display: inline-block; margin: 2px 0; padding: 4px 8px; background: linear-gradient(to right, hsl(${theme.primary}), hsl(${theme.secondary})); border: 1px solid hsl(${theme.border}); border-radius: 4px; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">${teamName}</div>`;
          })
        ];

        // Editor Themes Section
        const editorSection = [
          '',
          '🎨 EDITOR THEMES',
          separator,
          ...Object.entries(colorThemes).map(([name, theme]) => {
            return `<div style="display: inline-block; margin: 2px 0; padding: 4px 8px; background: linear-gradient(to right, hsl(${theme.primary}), hsl(${theme.secondary})); border: 1px solid hsl(${theme.border}); border-radius: 4px; color: hsl(${theme.foreground}); text-shadow: 0 1px 2px rgba(0,0,0,0.5);">${name}</div> - ${theme.description || 'Custom color scheme'}`;
          })
        ];

        // Calculator Themes Section
        const calcSection = [
          '',
          '🖩 CALCULATOR THEMES',
          separator,
          ...Object.entries(calculatorThemes).map(([name, theme]) => {
            const bgColor = theme.bg || '#c8d1c0';
            const textColor = theme.text || '#0d1f0c';
            return `<div style="display: inline-block; margin: 2px 0; padding: 4px 8px; background: ${bgColor}; border: 1px solid ${textColor}; border-radius: 4px; color: ${textColor};">${name}</div> - ${theme.description || 'Calculator theme'}`;
          })
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