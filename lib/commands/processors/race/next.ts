'use client'

import { api } from '@/lib/api/client';
import { calculateCountdown, getFlagUrl, findTrackId, getTrackDetails } from '@/lib/utils';
import { schedule } from '@/lib/data/schedule';
import { CommandFunction } from '../index';

export const nextRaceCommand: CommandFunction = async () => {
  try {
    // Get next race from 2025 schedule
    const now = new Date();
    const nextRace = schedule.races.find(race => {
      if (race.type === 'testing') return false;
      const raceDate = new Date(race.sessions.race?.date || race.sessions.practice1.date);
      return raceDate > now;
    });

    if (!nextRace) {
      return '❌ No upcoming races scheduled';
    }

    const countdown = calculateCountdown(new Date(nextRace.sessions.race?.date || nextRace.sessions.practice1.date));
    const flagUrl = getFlagUrl(nextRace.circuit.country);
    const flag = flagUrl ? `<img src="${flagUrl}" alt="${nextRace.circuit.country} flag" style="display:inline;vertical-align:middle;margin:0 2px;height:13px;">` : '';
    
    // Format session times in ET
    const formatSessionTime = (session: any) => {
      if (!session) return '';
      const date = new Date(session.dateET);
      return date.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/New_York'
      });
    };

    // Get track details
    const trackId = findTrackId(nextRace.circuit.name);
    const trackDetails = trackId ? getTrackDetails(trackId) : null;

    return [
      `🏁 ${nextRace.officialName}`,
      '═'.repeat(60),
      '',
      `📍 Circuit: ${nextRace.circuit.name}`,
      `📌 Location: ${nextRace.circuit.location}, ${nextRace.circuit.country} ${flag}`,
      trackDetails ? [
        `🛣️ Track Length: ${trackDetails.length}km`,
        `↩️ Turns: ${trackDetails.turns}`,
        trackDetails.lapRecord ? 
          `⚡ Lap Record: ${trackDetails.lapRecord.time} (${trackDetails.lapRecord.driver}, ${trackDetails.lapRecord.year})` : 
          null
      ].filter(Boolean).join('\n') : '',
      '',
      '⏰ SESSION SCHEDULE (ET)',
      '─'.repeat(40),
      nextRace.sessions.practice1 ? `FP1: ${formatSessionTime(nextRace.sessions.practice1)}` : '',
      nextRace.sessions.practice2 ? `FP2: ${formatSessionTime(nextRace.sessions.practice2)}` : '',
      nextRace.sessions.practice3 ? `FP3: ${formatSessionTime(nextRace.sessions.practice3)}` : '',
      nextRace.sessions.sprint_qualifying ? `Sprint Qualifying: ${formatSessionTime(nextRace.sessions.sprint_qualifying)}` : '',
      nextRace.sessions.sprint ? `Sprint Race: ${formatSessionTime(nextRace.sessions.sprint)}` : '',
      nextRace.sessions.qualifying ? `Qualifying: ${formatSessionTime(nextRace.sessions.qualifying)}` : '',
      nextRace.sessions.race ? `Race: ${formatSessionTime(nextRace.sessions.race)}` : '',
      '',
      `⏳ Race starts in: ${countdown}`,
      '',
      nextRace.type === 'sprint_qualifying' ? 
        '⚡ SPRINT WEEKEND: This is a Sprint format race weekend!' : 
        null
    ].filter(Boolean).join('\n');

  } catch (error) {
    console.error('Error fetching next race:', error);
    return '❌ Error: Could not fetch next race information. Please try again later.';
  }
};