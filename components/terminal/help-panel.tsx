/*Glass folding panel below terminal window */
'use client'

import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { commands } from '@/lib/commands';
import { commandAliases } from '@/components/terminal/command-processor';
import { quickReferenceCategories, keyboardShortcuts } from '@/lib/data/quick-reference';
import { commandInfo } from '@/lib/data/command-info';
import { useState } from 'react';
import { cn } from '@/lib/utils';

function formatCommand(cmd: typeof commands[0]) {
  const [baseCmd, ...rest] = cmd.command.split(' ');
  const args = rest.join(' ');
  const aliases = baseCmd.match(/\((.*?)\)/)?.[1] || '';
  const cleanCmd = baseCmd.replace(/\s*\(.*?\)/, '').trim();
  const shortcut = Object.entries(commandAliases)
    .find(([alias, target]) => target === cleanCmd)?.[0];
  
  return (
    <div key={cmd.command} className="flex items-baseline gap-2 overflow-hidden text-xs">
      <div className="flex items-baseline gap-2 min-w-[160px]">
        <code className="flex-shrink-0 font-mono text-primary whitespace-nowrap">{cleanCmd}</code>
        {shortcut && (
          <code className="font-mono text-[10px] text-secondary whitespace-nowrap">
            {shortcut}
          </code>
        )}
      </div>
      <span className="text-[10px] text-muted-foreground/70 truncate">{cmd.description}</span>
    </div>
  );
}

export function HelpPanel() {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div 
      className={cn(
        "glass-panel flex flex-col transition-all duration-200 ease-out",
        isMinimized ? "h-[50px]" : "h-[250px] sm:h-[300px]"
      )}
    >
      <div 
        className="flex justify-between items-center hover:bg-card/30 px-2 py-1 transition-all duration-200 ease-out cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-primary" />
          <h2 className="font-medium text-primary text-sm whitespace-nowrap">Quick Reference</h2>
        </div>
        {isMinimized ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground transition-transform duration-200 ease-out" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200 ease-out" />
        )}
      </div>

      {/* Tips Bar Container */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mini Tips Bar - Shows when minimized */}
        <div 
          className={cn(
            "px-2 py-1 bg-card/30 backdrop-blur-sm border-t border-border/10 text-[10px] text-muted-foreground/70 flex items-center justify-between transition-all duration-200 ease-out overflow-hidden",
            isMinimized ? "opacity-100 translate-y-0 h-[20px]" : "opacity-0 -translate-y-full pointer-events-none h-0"
          )}
        >
          <div className="flex items-center gap-4">
            <span>Tab to auto-complete</span>
            <span>•</span>
            <span>Case-insensitive</span>
            <span>•</span>
            <span>Use /list for data</span>
          </div>
        </div>

        {/* Main Content */}
        <div 
          className={cn(
            "flex flex-col overflow-hidden transition-all duration-200 ease-out",
            isMinimized ? "h-0" : "flex-1"
          )}
        >
          <div 
          className={cn(
            "flex-1 overflow-y-auto relative pt-2",
            isMinimized ? "h-0" : "flex-1"
          )}
        >
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-[180px_1fr] p-2">
            {/* Left Column - Shortcuts */}
            <div className="space-y-3">
              <div className="mb-1 font-medium text-primary/80 text-xs">KEYBOARD</div>
              <div className="gap-1.5 grid grid-cols-1 text-xs">
                {keyboardShortcuts.map((shortcut) => (
                  <div key={shortcut.key} className="flex justify-between items-center">
                    <kbd className="bg-card/50 px-1.5 py-0.5 rounded font-mono text-[10px]">{shortcut.key}</kbd>
                    <span className="text-muted-foreground">{shortcut.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Commands */}
            <div className="space-y-4">
              {quickReferenceCategories.map((category) => (
                <div key={category.title}>
                  <div className="flex justify-center items-center gap-2">
                    <div className="flex-1 bg-gradient-to-r from-transparent to-border/20 via-border/20 h-px" />
                    <div className="min-w-[140px] font-medium text-primary/80 text-xs text-center">{category.title}</div>
                    <div className="flex-1 bg-gradient-to-l from-transparent to-border/20 via-border/20 h-px" />
                  </div>
                  <div className="gap-x-6 gap-y-1 grid grid-cols-1 sm:grid-cols-2 mt-2">
                    {commands
                      .filter(c => category.filter.some(term => 
                        c.command.toLowerCase().includes(term) ||
                        (c.category?.toLowerCase() === category.title.toLowerCase()) ||
                        (term === 'sa' && c.command.includes('/sector')) ||
                        (term === 'oa' && c.command.includes('/overtake')) ||
                        (term === 'ov' && c.command.includes('/overtake')) ||
                        (term === 'md' && c.command.includes('/compare driver')) ||
                        (term === 'mt' && c.command.includes('/compare team')) ||
                        c.command.toLowerCase().includes(term)
                      ))
                      .map(formatCommand)}
                  </div>
                </div>
              ))}
            </div>
          </div>
            
            {/* Bottom Tips Bar */}
            <div className="bottom-0 sticky flex justify-between items-center bg-card/30 backdrop-blur-sm p-2 border-t border-border/10 text-[10px] text-muted-foreground/70">
              <div className="hidden sm:block">Type <code className="bg-card/30 px-1 py-0.5 rounded text-primary">/help</code> for detailed documentation</div>
              <div className="flex items-center gap-2 sm:gap-4">
                <span>Tab to auto-complete</span>
                <span>Case-insensitive</span>
                <span className="hidden sm:inline">Use /list for data</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}