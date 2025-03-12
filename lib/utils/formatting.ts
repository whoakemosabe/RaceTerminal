// Formatting utilities
import { teamColors } from '@/lib/data/team-colors';
import { countryToCode } from '@/lib/utils/countries';

export function getTeamColor(team: string): string {
  // Normalize team name by removing extra spaces and making case-insensitive
  const normalizedTeam = team.trim().toLowerCase();
  
  // Find matching team name
  const match = Object.entries(teamColors).find(([key]) => 
    key.toLowerCase() === normalizedTeam
  );
  
  if (match) {
    return match[1];
  }
  
  // Try partial matches
  const partialMatch = Object.entries(teamColors).find(([key]) => 
    key.toLowerCase().includes(normalizedTeam) ||
    normalizedTeam.includes(key.toLowerCase())
  );
  
  return partialMatch ? partialMatch[1] : '#666666';
}

export function getFlagUrl(nationality: string): string {
  const countryCode = countryToCode[nationality];
  if (!countryCode) return '';
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
}

export function formatDriver(text: string, nationality: string): string {
  if (!text || !nationality) return 'Unknown Driver';
  const flagUrl = getFlagUrl(nationality);
  const flag = flagUrl ? ` <img src="${flagUrl}" alt="${nationality} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:16px;">` : '';
  return `${text} [${nationality}${flag}]`;
}

export function formatCircuit(name: string, country: string): string {
  if (!name || !country) return 'Unknown Circuit';
  const flagUrl = getFlagUrl(country);
  const flag = flagUrl ? ` <img src="${flagUrl}" alt="${country} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:16px;">` : '';
  return `${name || 'Unknown Circuit'} [${country}${flag}]`;
}

export function formatWithTeamColor(text: string, team?: string): string {
  // If team is provided, use it directly, otherwise treat text as team name
  const teamName = team || text;
  const color = getTeamColor(text);
  return `<span style="color: ${color}">${text}</span>`;
}

export function formatTime(time: string): string {
  return time;
}

export function formatLapTime(time: string): string {
  return time;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}