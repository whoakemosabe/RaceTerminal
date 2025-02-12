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
    <div key={cmd.command} className="flex items-baseline gap-2 text-xs overflow-hidden">
      <div className="flex items-baseline gap-2 min-w-[160px]">
        <code className="flex-shrink-0 text-primary whitespace-nowrap font-mono">{cleanCmd}</code>
        {shortcut && (
          <code className="text-[10px] text-secondary font-mono whitespace-nowrap">
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
        isMinimized ? "h-[50px]" : "h-[300px]"
      )}
    >
      <div 
        className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-card/30 transition-all duration-200 ease-out"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="text-primary h-4 w-4" />
          <h2 className="text-sm font-medium text-primary whitespace-nowrap">Quick Reference</h2>
        </div>
        {isMinimized ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground transition-transform duration-200 ease-out" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 ease-out" />
        )}
      </div>

      {/* Tips Bar Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
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
          <div className="flex-1 overflow-y-auto relative pt-2">
            <div className="p-2 grid grid-cols-[180px_1fr] gap-4">
              {/* Left Column - Shortcuts */}
              <div className="space-y-3">
                <div className="text-xs font-medium text-primary/80 mb-1">KEYBOARD</div>
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  {keyboardShortcuts.map((shortcut) => (
                    <div key={shortcut.key} className="flex items-center justify-between">
                      <kbd className="px-1.5 py-0.5 bg-card/50 rounded text-[10px] font-mono">{shortcut.key}</kbd>
                      <span className="text-muted-foreground">{shortcut.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Commands */}
              <div className="space-y-4">
                {quickReferenceCategories.map((category) => (
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
            <div className="sticky bottom-0 p-2 border-t border-border/10 text-[10px] text-muted-foreground/70 flex items-center justify-between bg-card/30 backdrop-blur-sm">
              <div>Type <code className="text-primary px-1 py-0.5 bg-card/30 rounded">/help</code> for detailed documentation</div>
              <div className="flex items-center gap-4">
                <span>Tab to auto-complete</span>
                <span>Case-insensitive</span>
                <span>Use /list for data</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}