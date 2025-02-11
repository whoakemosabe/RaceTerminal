'use client'

import { HelpCircle } from 'lucide-react';
import { commands } from '@/lib/commands';
import { commandAliases } from '@/components/terminal/command-processor';
import { quickReferenceCategories, keyboardShortcuts } from '@/lib/data/quick-reference';
import { commandInfo } from '@/lib/data/command-info';

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
          {/* Group commands by category with dividers */}
          {quickReferenceCategories.map((category, index) => (
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