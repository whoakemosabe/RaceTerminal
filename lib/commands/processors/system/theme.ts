'use client'

import { teamThemes, teamNicknames } from '@/lib/utils';
import { colorThemes } from '@/lib/themes/colors';
import { calculatorThemes } from '@/lib/themes/calculator';
import { CommandFunction } from '../index';

interface ThemeCommands {
  [key: string]: CommandFunction;
}

export const themeCommands: ThemeCommands = {
  '/theme': async (args: string[], originalCommand: string) => {
    if (!args[0]) {
      return `❌ Error: Please specify a theme name
Usage: /theme <name>

Available options:
• Team name (e.g., ferrari, mercedes)
• Editor theme (e.g., dracula, monokai)
• Calculator mode (e.g., theme calc amber)
• Reset colors (theme default)

Tip: Use /list themes to see all available themes with previews`;
    }

    // Handle calculator mode
    if (args[0].toLowerCase() === 'calc') {
      return handleCalculatorTheme(args[1]);
    }

    if (args[0].toLowerCase() === 'default') {
      // Remove calculator mode when resetting to default
      document.documentElement.classList.remove('calculator-enabled');
      localStorage.removeItem('calculator_color_scheme');
      return handleDefaultTheme();
    }

    // Check for VSCode theme
    const colorTheme = colorThemes[args[0].toLowerCase()];
    if (colorTheme) {
      // Remove calculator mode when switching to color theme
      document.documentElement.classList.remove('calculator-enabled');
      localStorage.removeItem('calculator_color_scheme');
      return handleColorTheme(colorTheme, args[0]);
    }

    // Check for team theme
    const teamId = findTeamId(args[0]);
    if (!teamId) {
      return `❌ Error: Theme "${args[0]}" not found. Try using:\n• Team name (e.g., ferrari)\n• Color theme (e.g., dracula)\n• Calculator theme (e.g., theme calc amber)`;
    }

    // Remove calculator mode when switching to team theme
    document.documentElement.classList.remove('calculator-enabled');
    localStorage.removeItem('calculator_color_scheme');
    return handleTeamTheme(teamId);
  }
};

function findTeamId(search: string): string | null {
  search = search.toLowerCase().trim();
  
  // Handle common variations
  if (search.includes('red bull') || search === 'redbull' || search === 'rb') {
    return 'red_bull';
  }
  if (search.includes('ferrari') || search.includes('scuderia')) {
    return 'ferrari';
  }
  if (search.includes('alphatauri') || search.includes('alpha tauri')) {
    return 'alphatauri';
  }
  
  // Direct match with team ID
  if (teamNicknames[search]) {
    return search;
  }
  
  // Search through nicknames
  for (const [teamId, names] of Object.entries(teamNicknames)) {
    // Check all variations
    if (names.some(name => 
      name.toLowerCase().includes(search) || 
      name.toLowerCase().replace(/\s+/g, '').includes(search)
    )) {
      return teamId;
    }
  }
  
  return null;
}

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
    document.documentElement.classList.remove('retro-text-enabled');
    document.documentElement.classList.remove('matrix-enabled');
    document.documentElement.classList.remove('matrix-rain-enabled');
    document.documentElement.classList.remove('scanlines-enabled');
    document.documentElement.classList.remove('crt-enabled');

    // Apply calculator theme
    const theme = calculatorThemes[scheme];
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--calc-${key}`, value);
    });

    localStorage.setItem('calculator_color_scheme', scheme);
    localStorage.setItem('terminal_theme', 'calculator');
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
  // Dispatch theme change immediately
  setTimeout(() => window.dispatchEvent(new CustomEvent('themeChange')), 0);
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
    // Dispatch theme change immediately
    setTimeout(() => window.dispatchEvent(new CustomEvent('themeChange')), 0);
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
    // Dispatch theme change immediately
    setTimeout(() => window.dispatchEvent(new CustomEvent('themeChange')), 0);
    
    return `🎨 Terminal theme changed to ${teamNicknames[teamId][0]} colors!`;
  } catch (error) {
    console.error('Failed to set theme:', error);
    return '❌ Error: Failed to apply theme. Please try again.';
  }
}