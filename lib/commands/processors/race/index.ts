import { api } from '@/lib/api/client';
import { getFlagUrl, getTeamColor } from '@/lib/utils';
import { CommandFunction } from '../index';
import { raceResultsCommand } from './results';
import { lapsCommand } from './laps';
import { fastestLapCommand } from './fastest';
import { scheduleCommand } from './schedule';
import { nextRaceCommand } from './next';
import { lastRaceCommand } from './last';
import { qualifyingCommand } from './qualifying';
import { sprintCommand } from './sprint';
import { pitstopsCommand } from './pitstops';
import { trackCommand } from './track';

// Export all race commands
export const raceCommands = {
  '/race': raceResultsCommand,
  '/laps': lapsCommand,
  '/fastest': fastestLapCommand, 
  '/schedule': scheduleCommand,
  '/next': nextRaceCommand,
  '/last': lastRaceCommand,
  '/qualifying': qualifyingCommand, 
  '/sprint': sprintCommand,
  '/pitstops': pitstopsCommand,
  '/track': trackCommand,
  // Add aliases
  '/q': qualifyingCommand,
  '/ql': qualifyingCommand,
  '/t': trackCommand
} as Record<string, CommandFunction>;

// Export types for TypeScript support
export interface Race {
  round: number;
  type: 'testing' | 'conventional' | 'sprint_qualifying';
  name: string;
  officialName: string;
  circuit: {
    name: string;
    location: string;
    country: string;
  };
  sessions: {
    practice1: Session;
    practice2?: Session;
    practice3?: Session;
    qualifying?: Session;
    sprint_qualifying?: Session;
    sprint?: Session;
    race?: Session;
  };
}

export interface Session {
  name: string;
  date: string;
  dateET: string;
}

export const races = {
  races: [
    // ... races array content ...
  ],
  
  // Helper functions
  getNextRace() {
    const now = new Date();
    return this.races.find(race => 
      new Date(race.sessions.race?.date || race.sessions.practice1.date) > now
    );
  },
  
  getRaceByRound(round: number) {
    return this.races.find(race => race.round === round);
  },
  
  formatDate(date: string, timeZone: 'UTC' | 'ET' = 'UTC') {
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timeZone === 'ET' ? 'America/New_York' : 'UTC',
      hour12: false
    });
  },

  getActiveSession() {
    const now = new Date();
    let activeRace = null;
    let activeSession = null;
    let nextSession = null;
    
    for (const race of this.races) {
      if (race.type === 'testing') continue;
      
      // Get all sessions sorted by date
      const sessions = Object.entries(race.sessions)
        .filter(([_, session]) => session) // Filter out undefined sessions
        .map(([key, session]) => ({
          key,
          ...session,
          startTime: new Date(session.date), // Use UTC date
          endTime: null as Date | null
        }))
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
      
      // Calculate end times for all sessions
      sessions.forEach(session => {
        const duration = (() => {
          switch (session.key) {
            case 'practice1':
            case 'practice2':
            case 'practice3':
            case 'qualifying':
              return 60; // 1 hour
            case 'sprint_qualifying':
              return 45; // 45 minutes
            case 'sprint':
              return 30; // 30 minutes
            case 'race':
              return 120; // 2 hours
            default:
              return 60; // Default 1 hour
          }
        })();
        session.endTime = new Date(session.startTime.getTime() + (duration * 60 * 1000));
      });
      
      // Calculate weekend boundaries
      const weekendStart = sessions[0].startTime;
      const lastSession = sessions[sessions.length - 1].startTime;
      const weekendEnd = new Date(lastSession.getTime() + (3 * 60 * 60 * 1000)); // 3 hours after last session
      
      if (now >= weekendStart && now < weekendEnd) {
        activeRace = race;
        
        let foundActive = false;
        let foundNext = false;
        for (let i = 0; i < sessions.length; i++) {
          const session = sessions[i];
          const now = new Date();
          
          // Check if session is active
          if (now >= session.startTime && now < session.endTime) {
            foundActive = true;
            activeSession = {
              type: session.key,
              name: session.name,
              startTime: session.startTime,
              endTime: session.endTime,
              status: session.name,
              timeRemaining: Math.floor((session.endTime.getTime() - now.getTime()) / 60000) // minutes remaining
            };
            continue; // Continue to find next session
          }
          
          // If session hasn't started yet and we haven't found active or next session
          if (now < session.startTime && !foundNext) {
            foundNext = true;
            nextSession = {
              type: session.key,
              name: session.name,
              startTime: session.startTime,
              endTime: session.endTime,
              status: session.name,
              countdown: Math.floor((session.startTime.getTime() - now.getTime()) / 60000) // minutes until start
            };
            break; // Found next session, no need to check others
          }
        }
        break; // Found active race weekend, no need to check others
      }
      
      // If no active session found, check for next race weekend
      if (!activeSession && !nextSession && now < weekendStart) {
        const firstSession = sessions[0];
        
        nextSession = {
          type: firstSession.key,
          name: firstSession.name,
          startTime: firstSession.startTime,
          endTime: firstSession.endTime,
          status: firstSession.name,
          countdown: Math.floor((firstSession.startTime.getTime() - now.getTime()) / 60000)
        };
        activeRace = race;
        break;
      }
    }
    
    if (!activeRace) return null;
    
    return {
      race: activeRace,
      session: activeSession,
      nextSession,
      isRaceWeekend: true
    };
  }
};