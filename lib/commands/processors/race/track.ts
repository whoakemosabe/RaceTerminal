'use client'

import { findTrackId, getTrackDetails, getFlagUrl } from '@/lib/utils';
import { trackNicknames } from '@/lib/utils/tracks';
import { CommandFunction } from '../index';

export const trackCommand: CommandFunction = async (args: string[], originalCommand: string) => {
  if (!args[0]) {
    const cmd = originalCommand === '/t' ? '/t' : '/track';
    return `❌ Error: Please provide a track name\nUsage: ${cmd} <name> (e.g., ${cmd} monza)\nTip: Use /list tracks to see all available tracks\nShortcuts: /t, /track`;
  }

  const trackId = findTrackId(args[0]);
  if (!trackId) {
    return `❌ Error: Track "${args[0]}" not found\nTry using:\n• Track name (e.g., monza, spa)\n• GP name (e.g., italian, belgian)\nShortcuts: /t, /track`;
  }
  
  const [name, nickname] = trackNicknames[trackId];
  const details = getTrackDetails(trackId);
  const country = name.includes('GP') ? 
    name.split(' ').pop()?.replace('GP', '').trim() : 
    nickname.split(' ').pop()?.replace('GP', '').trim();
  
  const flagUrl = country ? getFlagUrl(country) : '';
  const flag = flagUrl ? 
    `<img src="${flagUrl}" alt="${country} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
    '';
  
  return [
    `🏁 ${name} ${flag}`,
    '═'.repeat(60),
    `📍 Location: ${nickname}`,
    `📏 Length: ${details.length}km`,
    `↩️ Turns: ${details.turns}`,
    details.lapRecord ? [
      '⚡ Lap Record:',
      `  Time: ${details.lapRecord.time}`,
      `  Driver: ${details.lapRecord.driver}`,
      `  Year: ${details.lapRecord.year}`
    ].join('\n') : 'No lap record available'
  ].join('\n');
};