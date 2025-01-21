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
      
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-48 bg-card/30 rounded p-1">
          <div className="text-[10px] font-medium text-primary/80 mb-1">Shortcuts</div>
          <div className="grid grid-cols-1 gap-0.5 text-[10px]">
            <div className="flex items-center justify-between">
              <kbd className="px-1 bg-card rounded text-[9px]">↑/↓</kbd>
              <span className="text-gray-400">History</span>
            </div>
            <div className="flex items-center justify-between">
              <kbd className="px-1 bg-card rounded text-[9px]">Tab</kbd>
              <span className="text-gray-400">Complete</span>
            </div>
            <div className="flex items-center justify-between">
              <kbd className="px-1 bg-card rounded text-[9px]">Ctrl+L</kbd>
              <span className="text-gray-400">Clear</span>
            </div>
            <div className="flex items-center justify-between">
              <kbd className="px-1 bg-card rounded text-[9px]">Ctrl+C</kbd>
              <span className="text-gray-400">Cancel</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="text-[10px] font-medium text-primary/80 mb-1">Commands</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
            {commands.map((cmd) => (
              <div key={cmd.command} className="flex items-baseline text-[10px] gap-1 overflow-hidden">
                <code className="text-secondary whitespace-nowrap">{cmd.command.split(' ')[0]}</code>
                <span className="text-gray-400 truncate">{cmd.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}