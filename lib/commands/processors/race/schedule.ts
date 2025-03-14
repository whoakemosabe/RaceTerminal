'use client'

import { schedule } from '@/lib/data/schedule';
import { getFlagUrl } from '@/lib/utils';
import { CommandFunction } from '../index';

export const scheduleCommand: CommandFunction = async () => {
  const now = new Date();
  const sessionInfo = schedule.getActiveSession();

  // Get next race and calculate countdown
  const nextRace = schedule.races.find(race => {
    if (race.type === 'testing') return false;
    const raceDate = new Date(race.sessions.race?.date || race.sessions.practice1.date);
    return raceDate > now;
  });

  // Format all races and sessions
  const races = schedule.races.map((race, index) => {
    if (race.type === 'testing') return null;
    
    const round = race.round.toString().padStart(2, '0');
    const flagUrl = getFlagUrl(race.circuit.country);
    const flag = flagUrl ? 
      `<img src="${flagUrl}" alt="${race.circuit.country} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : 
      '';
    
    // Check if this is the next race and add countdown
    const isNextRace = nextRace && nextRace.round === race.round;
    const isSprint = race.type === 'sprint_qualifying';
    const raceHeader = isNextRace ?
      `<span style="color: hsl(var(--primary))">🏁 R${round} | ${flag} ${race.officialName}${isSprint ? ' <span style="color: hsl(var(--warning))">⚡ SPRINT</span>' : ''}</span>` :
      `${' '} R${round} | ${flag} ${race.officialName}${isSprint ? ' <span style="color: hsl(var(--warning))">⚡ SPRINT</span>' : ''}`;
    const locationLine = `    📍 ${race.circuit.name}, ${race.circuit.location}`;
    
    // Format each session
    const sessions = Object.entries(race.sessions)
      .filter(([_, session]) => session) // Filter out undefined sessions
      .map(([key, session]) => {
        const sessionDate = new Date(session.dateET);
        const sessionEnd = new Date(sessionDate);
        sessionEnd.setHours(sessionEnd.getHours() + 2);
        const sessionStart = new Date(session.dateET);
        
        const isPast = now > sessionEnd;
        const isActive = sessionInfo?.session?.name === session.name && sessionInfo?.race.round === race.round;
        
        // Determine if this is the next session
        const isNext = !isPast && !isActive && sessionStart > now && (
          // Either this is the next chronological session overall
          !sessionInfo?.nextSession ||
          // Or this specific session is marked as next
          (sessionInfo?.nextSession?.name === session.name && 
           sessionInfo?.race.round === race.round)
        );
        
        // Format session name
        let sessionName = session.name;
        if (key === 'sprint_qualifying') sessionName = 'Sprint Qualifying';
        
        // Format date and time
        const date = sessionDate.toLocaleDateString('en-GB', {
          weekday: 'short',
          day: '2-digit',
          month: 'short'
        });
        const time = sessionDate.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'America/New_York'
        });
        
        // Color code the session
        let sessionLine = `      `;
        
        // Add status indicator with appropriate color
        if (isPast) {
          sessionLine += '<span style="color: hsl(var(--muted-foreground))">✓</span>';
        } else if (isActive) {
          sessionLine += '<span style="color: hsl(var(--success))">🟢</span>';
        } else if (isNext) {
          sessionLine += '<span style="color: hsl(var(--warning))">➤</span>';
        } else {
          sessionLine += ' ';
        }
        
        sessionLine += ` ${sessionName} | ${date} ${time}`;
        
        if (isActive) {
          const timeRemaining = sessionInfo?.session?.timeRemaining || 0;
          const minutes = timeRemaining % 60;
          const hours = Math.floor(timeRemaining / 60);
          const timeStr = hours > 0 ? 
            `${hours}h ${minutes}m` : 
            `${minutes}m`;
          sessionLine = `<span style="color: hsl(var(--success))">${sessionLine} (LIVE - ${timeStr} remaining)</span>`;
        } else if (isPast) {
          sessionLine = `<span style="color: hsl(var(--muted-foreground))">${sessionLine} (Completed)</span>`;
        } else if (isNext) {
          const countdown = sessionInfo?.nextSession?.countdown || 0;
          const minutes = countdown % 60;
          const hours = Math.floor(countdown / 60);
          const timeStr = hours > 0 ? 
            `${hours}h ${minutes}m` : 
            `${minutes}m`;
          sessionLine = `<span style="color: hsl(var(--warning))">${sessionLine} (Up Next - Starts in ${timeStr})</span>`;
        }
        
        return sessionLine;
      });
    
    return [
      raceHeader,
      locationLine,
      ...sessions,
      '' // Add empty line between races
    ].join('\n');
  }).filter(Boolean);
  
  return [
    '🏁 2025 FORMULA 1 WORLD CHAMPIONSHIP',
    '═'.repeat(60),
    '<span style="color: hsl(var(--muted-foreground))">All times shown in ET (24h)</span>',
    '',
    ...races,
    '',
    'Legend:',
    '<span style="color: hsl(var(--muted-foreground))">✓ Completed Session</span>',
    '<span style="color: hsl(var(--primary))">🏁 Current Race Weekend</span>',
    '<span style="color: hsl(var(--success))">🟢 Active Session</span>',
    '<span style="color: hsl(var(--warning))">➤ Next Session</span>',
    '<span style="color: hsl(var(--warning))">⚡ Sprint Weekend</span>',
    '  Future Session'
  ].join('\n');
};