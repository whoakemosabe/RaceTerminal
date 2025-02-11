import { teamThemes, teamNicknames, findTeamId } from '@/lib/utils';
import { colorThemes } from '@/lib/themes/colors';
import { calculatorThemes } from '@/lib/themes/calculator';
import { CommandFunction } from '../index';

interface ThemeCommands {
  [key: string]: CommandFunction;
}

export const themeCommands: ThemeCommands = {
  '/theme': async (args: string[]) => {
    if (!args[0]) {
      // Get all available themes
      const allThemes = [
        // Team themes
        ...Object.entries(teamNicknames).map(([id, names]) => ({
          value: names[0].toLowerCase(),
          type: 'team',
          name: names[0],
          color: getTeamColor(names[0]),
          established: names[4]
        })),
        // VSCode themes
        ...Object.entries(colorThemes).map(([id, theme]) => ({
          value: id,
          type: 'editor',
          name: id,
          description: theme.description
        })),
        // Calculator themes
        ...Object.entries(calculatorThemes).map(([id, theme]) => ({
          value: `calc ${id}`,
          type: 'calculator',
          name: id,
          description: theme.description
        }))
      ];

      // Format themes by category
      const teamList = Object.entries(teamNicknames)
        .sort((a, b) => a[1][0].localeCompare(b[1][0]))
        .map(([id, names], index) => {
          const teamName = names[0];
          const teamColor = getTeamColor(teamName);
          const established = names[4];
          return `• <span style="color: ${teamColor}">${teamName}</span> (Est. ${established})`;
        });
      
      const colorList = Object.keys(colorThemes)
        .sort()
        .map(name => {
          const theme = colorThemes[name];
          return `• ${name} (${theme.description || 'Custom color scheme'})`;
        });

      const calcList = Object.keys(calculatorThemes)
        .sort()
        .map(name => `• ${name} (${calculatorThemes[name].description || 'LCD theme'})`);
      
      return [
        '❌ Error: Please provide a theme name',
        'Usage: /theme <name> (e.g., /theme ferrari or /theme dracula)',
        '',
        '🏎️  F1 Team Themes',
        '═'.repeat(50),
        teamList.join('\n'),
        '',
        '🎨 Editor Themes',
        '═'.repeat(50),
        colorList.join('\n'),
        '',
        '🖩 Calculator Themes',
        '═'.repeat(50),
        'Usage: /theme calc <scheme>',
        calcList.join('\n'),
        '',
        '🔄 Reset Theme',
        '═'.repeat(50),
        '• /theme default - Restore default terminal colors'
      ].join('\n');
    }

    // Handle calculator mode
    if (args[0].toLowerCase() === 'calc') {
      return handleCalculatorTheme(args[1]);
    }

    if (args[0].toLowerCase() === 'default') {
      return handleDefaultTheme();
    }

    // Check for VSCode theme
    const colorTheme = colorThemes[args[0].toLowerCase()];
    if (colorTheme) {
      return handleColorTheme(colorTheme, args[0]);
    }

    // Check for team theme
    const teamId = findTeamId(args[0]);
    if (!teamId) {
      return `❌ Error: Theme "${args[0]}" not found. Try using:\n• Team name (e.g., ferrari)\n• Color theme (e.g., dracula)\n• Calculator theme (e.g., theme calc amber)`;
    }

    return handleTeamTheme(teamId);
  }
};

function handleCalculatorTheme(scheme?: string): string {
  const validCalcSchemes = Object.keys(calculatorThemes);

  if (!scheme || !validCalcSchemes.includes(scheme)) {
    const calcSchemes = validCalcSchemes.map(name => `• ${name}`).join('\n');
    return [
      '❌ Error: Invalid calculator scheme',
      'Usage: /theme calc <scheme>',
      '',
      'Available Calculator Schemes:',
      calcSchemes
    ].join('\n');
  }

  try {
    // Enable calculator mode
    document.documentElement.classList.add('calculator-enabled');

    // Apply calculator theme
    const theme = calculatorThemes[scheme];
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--calc-${key}`, value);
    });

    localStorage.setItem('calculator_color_scheme', scheme);
    return `🖩 Calculator mode enabled with ${scheme} LCD theme!`;
  } catch (error) {
    console.error('Failed to apply calculator theme:', error);
    return '❌ Error: Failed to apply calculator theme';
  }
}

function handleDefaultTheme(): string {
  document.documentElement.style.setProperty('--primary', '186 100% 50%');
  document.documentElement.style.setProperty('--secondary', '288 100% 73%');
  document.documentElement.style.setProperty('--accent', '288 100% 73%');
  document.documentElement.style.setProperty('--border', '186 100% 50%');
  document.documentElement.style.setProperty('--background', '0 0% 0%');
  document.documentElement.style.setProperty('--foreground', '210 40% 98%');
  document.documentElement.style.setProperty('--card', '0 0% 4%');
  document.documentElement.style.setProperty('--card-foreground', '210 40% 98%');
  document.documentElement.style.setProperty('--popover', '0 0% 4%');
  document.documentElement.style.setProperty('--popover-foreground', '210 40% 98%');
  document.documentElement.style.setProperty('--muted', '217.2 32.6% 17.5%');
  document.documentElement.style.setProperty('--muted-foreground', '215 20.2% 65.1%');
  localStorage.removeItem('terminal_theme');
  return '🎨 Terminal theme reset to default colors!';
}

function handleColorTheme(colorTheme: any, themeName: string): string {
  try {
    // Apply VSCode theme colors
    const [h, s, l] = colorTheme.background.split(' ');
    const darkerL = Math.max(0, parseInt(l) - 4); // Make history bg slightly darker
    const evenDarkerL = Math.max(0, parseInt(l) - 6); // Make page bg even darker
    
    // Set main background colors
    document.documentElement.style.setProperty('--background', `${h} ${s} ${evenDarkerL}%`);
    document.documentElement.style.setProperty('--card', `${h} ${s} ${darkerL}%`);
    document.documentElement.style.setProperty('--popover', `${h} ${s} ${darkerL}%`);
    document.documentElement.style.setProperty('--history-bg', `${h} ${s} ${darkerL}%`);

    document.documentElement.style.setProperty('--foreground', colorTheme.foreground);
    document.documentElement.style.setProperty('--primary-foreground', colorTheme.foreground);
    document.documentElement.style.setProperty('--secondary-foreground', colorTheme.foreground);
    document.documentElement.style.setProperty('--accent-foreground', colorTheme.foreground);
    document.documentElement.style.setProperty('--card-foreground', colorTheme.foreground);
    document.documentElement.style.setProperty('--popover-foreground', colorTheme.foreground);
    document.documentElement.style.setProperty('--primary', colorTheme.primary);
    document.documentElement.style.setProperty('--secondary', colorTheme.secondary);
    document.documentElement.style.setProperty('--accent', colorTheme.accent);
    document.documentElement.style.setProperty('--muted', colorTheme.muted);
    document.documentElement.style.setProperty('--muted-foreground', colorTheme.foreground);
    document.documentElement.style.setProperty('--border', colorTheme.border);
    
    // Update other history colors
    document.documentElement.style.setProperty('--history-fg', colorTheme.foreground);
    document.documentElement.style.setProperty('--history-primary', colorTheme.primary);
    document.documentElement.style.setProperty('--history-secondary', colorTheme.secondary);
    document.documentElement.style.setProperty('--history-accent', colorTheme.accent);
    document.documentElement.style.setProperty('--history-muted', colorTheme.muted);
    document.documentElement.style.setProperty('--history-border', colorTheme.border);
    
    localStorage.setItem('terminal_theme', themeName.toLowerCase());
    return `🎨 Terminal theme changed to ${themeName} colors!`;
  } catch (error) {
    console.error('Failed to apply theme:', error);
    return '❌ Error: Failed to apply theme';
  }
}

function handleTeamTheme(teamId: string): string {
  const theme = teamThemes[teamId];
  if (!theme) {
    return `❌ Error: Theme "${teamId}" not found. Try using:\n• Team name (e.g., ferrari)\n• Color theme (e.g., dracula)\n• Calculator theme (e.g., theme calc amber)`;
  }

  try {
    // Reset to default background colors first
    document.documentElement.style.setProperty('--background', '0 0% 0%');
    document.documentElement.style.setProperty('--card', '0 0% 2%');
    document.documentElement.style.setProperty('--popover', '0 0% 2%');
    document.documentElement.style.setProperty('--history-bg', '0 0% 2%');
    
    // Set theme colors
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--secondary', theme.secondary);
    document.documentElement.style.setProperty('--primary-foreground', '210 40% 98%');
    document.documentElement.style.setProperty('--secondary-foreground', '210 40% 98%');
    document.documentElement.style.setProperty('--accent-foreground', '210 40% 98%');
    document.documentElement.style.setProperty('--accent', theme.accent);
    document.documentElement.style.setProperty('--border', theme.border);
    document.documentElement.style.setProperty('--foreground', '210 40% 98%');
    document.documentElement.style.setProperty('--card-foreground', '210 40% 98%');
    document.documentElement.style.setProperty('--popover-foreground', '210 40% 98%');
    document.documentElement.style.setProperty('--muted', '217.2 32.6% 17.5%');
    document.documentElement.style.setProperty('--muted-foreground', '215 20.2% 65.1%');

    // Update other history colors
    document.documentElement.style.setProperty('--history-fg', '210 40% 98%');
    document.documentElement.style.setProperty('--history-primary', `hsl(${theme.primary})`);
    document.documentElement.style.setProperty('--history-secondary', `hsl(${theme.secondary})`);
    document.documentElement.style.setProperty('--history-accent', `hsl(${theme.accent})`);
    document.documentElement.style.setProperty('--history-muted', 'hsl(217.2 32.6% 17.5%)');
    document.documentElement.style.setProperty('--history-border', `hsl(${theme.border})`);
    
    localStorage.setItem('terminal_theme', teamId);
    
    return `🎨 Terminal theme changed to ${teamNicknames[teamId][0]} colors!`;
  } catch (error) {
    console.error('Failed to set theme:', error);
    return '❌ Error: Failed to apply theme. Please try again.';
  }
}