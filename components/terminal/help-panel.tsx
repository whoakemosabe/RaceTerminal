'use client'

import { HelpCircle } from 'lucide-react';
import { commands } from '@/lib/commands';
import { commandAliases } from '@/components/terminal/command-processor';

function getShortDescription(cmd: string): string {
  switch (cmd) {
    // Race Information
    case '/standings': return 'View driver championship standings';
    case '/teams': return 'View constructor standings';
    case '/schedule': return 'View race calendar';
    case '/next': return 'Next race info & countdown';
    case '/last': return 'Last race results';
    case '/track': return 'Circuit details & records';
    case '/car': return 'F1 car specifications';
    
    // Live Data
    case '/live': return 'Real-time timing data';
    case '/telemetry': return 'Live car telemetry';
    case '/status': return 'Track status & flags';
    case '/weather': return 'Circuit weather conditions';
    case '/tires': return 'Tire compounds & wear';
    
    // Historical Data
    case '/race': return 'Historical race results';
    case '/qualifying': return 'Qualifying session results';
    case '/sprint': return 'Sprint race results';
    case '/pitstops': return 'Pit stop timings';
    case '/fastest': return 'Fastest lap records';
    case '/laps': return 'Detailed lap times';
    
    // Analysis
    case '/pace': return 'Race pace & stint analysis';
    case '/gap': return 'Intervals & battle analysis';
    case '/compare': return 'Compare drivers/teams';
    case '/sector': return 'Qualifying sector analysis';
    case '/overtake': return 'Race overtaking analysis';
    case '/sector': return 'Qualifying sector analysis';
    case '/overtake': return 'Race overtaking analysis';
    
    // Effects
    case '/retro': return 'Retro text glow effect';
    case '/matrix': return 'Matrix digital rain';
    case '/crt': return 'CRT monitor effect';
    case '/glitch': return 'Glitch visual effect';
    case '/scanlines': return 'CRT scanlines overlay';
    case '/calc': return 'Calculator LCD effect';
    
    // System
    case '/user': return 'Set terminal username';
    case '/clear': return 'Clear terminal history';
    case '/help': return 'Command documentation';
    case '/theme': return 'Change color theme';
    case '/sys': return 'System diagnostics';
    case '/neofetch': return 'System info display';
    case '/hack': return 'Hacking simulation';
    case '/fontsize': return 'Adjust text size';
    case '/stats': return 'Usage statistics';
    case '/decrypt': return 'Code-breaking game';
    
    default: return '';
  }
}

function formatCommand(cmd: typeof commands[0]) {
  const [baseCmd, ...rest] = cmd.command.split(' ');
  const args = rest.join(' ');
  const aliases = baseCmd.match(/\((.*?)\)/)?.[1] || '';
  const cleanCmd = baseCmd.replace(/\s*\(.*?\)/, '').trim();
  const shortDesc = getShortDescription(cleanCmd);
  const shortcut = Object.entries(commandAliases)
    .find(([alias, target]) => target === cleanCmd)?.[0];
  
  return (
    <div key={cmd.command} className="flex items-baseline gap-2 text-xs overflow-hidden">
      <div className="flex items-baseline gap-2 min-w-[160px]">
        <code className="flex-shrink-0 text-primary whitespace-nowrap font-mono">{cleanCmd}</code>
        {shortcut && (
          <code className="text-[10px] text-secondary font-mono whitespace-nowrap">
            {shortcut}
          </code>
        )}
      </div>
      <span className="text-[10px] text-muted-foreground/70 truncate">{shortDesc}</span>
    </div>
  );
}

export function HelpPanel() {
  return (
    <div className="glass-panel p-2 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-2 border-b border-border/10 pb-1">
        <HelpCircle className="text-primary h-4 w-4" />
        <h2 className="text-sm font-medium text-primary">Quick Reference</h2>
      </div>
      
      <div className="grid grid-cols-[180px_1fr] gap-4 flex-1 overflow-y-auto">
        {/* Left Column - Shortcuts */}
        <div className="space-y-3">
          <div className="text-xs font-medium text-primary/80 mb-1">KEYBOARD</div>
          <div className="grid grid-cols-1 gap-1.5 text-xs">
            <div className="flex items-center justify-between">
              <kbd className="px-1.5 py-0.5 bg-card/50 rounded text-[10px] font-mono">Alt + Enter</kbd>
              <span className="text-muted-foreground">Fullscreen</span>
            </div>
            <div className="flex items-center justify-between">
              <kbd className="px-1.5 py-0.5 bg-card/50 rounded text-[10px] font-mono">Tab</kbd>
              <span className="text-muted-foreground">Complete</span>
            </div>
            <div className="flex items-center justify-between">
              <kbd className="px-1.5 py-0.5 bg-card/50 rounded text-[10px] font-mono">↑/↓</kbd>
              <span className="text-muted-foreground">History</span>
            </div>
            <div className="flex items-center justify-between">
              <kbd className="px-1.5 py-0.5 bg-card/50 rounded text-[10px] font-mono">Ctrl + L</kbd>
              <span className="text-muted-foreground">Clear</span>
            </div>
            <div className="flex items-center justify-between">
              <kbd className="px-1.5 py-0.5 bg-card/50 rounded text-[10px] font-mono">Ctrl + C</kbd>
              <span className="text-muted-foreground">Cancel</span>
            </div>
            <div className="flex items-center justify-between">
              <kbd className="px-1.5 py-0.5 bg-card/50 rounded text-[10px] font-mono">Esc</kbd>
              <span className="text-muted-foreground">Close</span>
            </div>
          </div>
        </div>

        {/* Right Column - Commands */}
        <div className="space-y-4">
          {/* Group commands by category with dividers */}
          {[
            {
              title: 'RACE INFORMATION',
              filter: ['standings', 'schedule', 'next', 'last', 'track', 'teams', 'car']
            },
            {
              title: 'LIVE DATA',
              filter: ['live', 'telemetry', 'status', 'weather', 'tires']
            },
            {
              title: 'HISTORICAL DATA',
              filter: ['race', 'qualifying', 'sprint', 'pitstops', 'fastest', 'laps']
            },
            {
              title: 'ANALYSIS',
              filter: ['pace', 'gap', 'sector', 'overtake', 'compare', 'sa', 'oa', 'ov']
            },
            {
              title: 'EFFECTS',
              filter: ['retro', 'matrix', 'crt', 'glitch', 'scanlines', 'calc', 'calculator']
            },
            {
              title: 'SYSTEM',
              filter: ['user', 'clear', 'help', 'theme', 'sys', 'neofetch', 'hack', 'fontsize', 'stats', 'decrypt', 'reset']
            }
          ].map((category, index) => (
            <div key={category.title}>
              <div className="flex items-center justify-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/20 to-border/20" />
                <div className="text-xs font-medium text-primary/80 min-w-[140px] text-center">{category.title}</div>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border/20 to-border/20" />
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-2">
                {commands
                  .filter(c => category.filter.some(term => 
                    c.command.toLowerCase().includes(term) ||
                    (c.category?.toLowerCase() === category.title.toLowerCase()) ||
                    (term === 'sa' && c.command.includes('/sector')) ||
                    (term === 'oa' && c.command.includes('/overtake')) ||
                    c.command.toLowerCase().includes(term) ||
                    (c.category?.toLowerCase() === category.title.toLowerCase()) ||
                    (term === 'sa' && c.command.includes('/sector')) ||
                    (term === 'oa' && c.command.includes('/overtake')) ||
                    (term === 'ov' && c.command.includes('/overtake'))
                  ))
                  .map(formatCommand)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Tips */}
      <div className="mt-3 pt-2 border-t border-border/10 text-[10px] text-muted-foreground/70 flex items-center justify-between flex-shrink-0">
        <div>Type <code className="text-primary px-1 py-0.5 bg-card/30 rounded">/help</code> for detailed documentation</div>
        <div className="flex items-center gap-4">
          <span>Tab to auto-complete</span>
          <span>Case-insensitive</span>
          <span>Use /list for data</span>
        </div>
      </div>
    </div>
  );
}