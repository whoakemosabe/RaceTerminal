'use client'

import { HelpCircle } from 'lucide-react';
import { commands } from '@/lib/commands';

export function HelpPanel() {
  return (
    <div className="my-2 glass-panel p-2">
      <div className="flex items-center gap-2 mb-2 border-b border-border/10 pb-1">
        <HelpCircle className="text-primary h-4 w-4" />
        <h2 className="text-sm font-medium text-primary">Quick Reference</h2>
      </div>
      
      <div className="grid grid-cols-[200px_1fr] gap-4">
        {/* Left Column - Shortcuts */}
        <div className="space-y-3">
          <div className="text-xs font-medium text-primary/80 mb-1">Keyboard Shortcuts</div>
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
        <div className="grid grid-cols-3 gap-x-6 gap-y-1">
          {commands.map((cmd) => {
            const [baseCmd, ...rest] = cmd.command.split(' ');
            const args = rest.join(' ');
            const aliases = baseCmd.match(/\((.*?)\)/)?.[1] || '';
            const cleanCmd = baseCmd.replace(/\s*\(.*?\)/, '');
            
            return (
              <div key={cmd.command} className="flex items-baseline gap-2 text-xs overflow-hidden">
                <code className="flex-shrink-0 text-secondary whitespace-nowrap font-mono">{cleanCmd}</code>
                {aliases && (
                  <span className="text-[10px] text-muted-foreground/60 font-mono whitespace-nowrap">
                    {aliases}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Tips */}
      <div className="mt-3 pt-2 border-t border-border/10 text-[10px] text-muted-foreground/70 flex items-center justify-between">
        <div>Type <code className="text-primary/70 px-1 py-0.5 bg-card/30 rounded">/help</code> for detailed documentation</div>
        <div className="flex items-center gap-4">
          <span>Tab to auto-complete</span>
          <span>Case-insensitive</span>
          <span>Use /list for data</span>
        </div>
      </div>
    </div>
  );
}