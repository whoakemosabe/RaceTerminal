'use client'

import { HelpCircle } from 'lucide-react';
import { commands } from '@/lib/commands';

export function HelpPanel() {
  return (
    <div className="my-2 glass-panel p-2">
      <div className="flex items-center gap-2 mb-2 border-b border-border/10 pb-1">
        <HelpCircle className="text-primary h-5 w-5" />
        <h2 className="text-base font-medium text-primary">Quick Reference</h2>
      </div>
      
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-48 bg-card/30 rounded p-1">
          <div className="text-sm font-medium text-primary/80 mb-2">Shortcuts</div>
          <div className="grid grid-cols-1 gap-1 text-sm">
            <div className="flex items-center justify-between">
              <kbd className="px-2 py-0.5 bg-card rounded text-xs">↑/↓</kbd>
              <span className="text-gray-400">History</span>
            </div>
            <div className="flex items-center justify-between">
              <kbd className="px-2 py-0.5 bg-card rounded text-xs">Tab</kbd>
              <span className="text-gray-400">Complete</span>
            </div>
            <div className="flex items-center justify-between">
              <kbd className="px-2 py-0.5 bg-card rounded text-xs">Ctrl+L</kbd>
              <span className="text-gray-400">Clear</span>
            </div>
            <div className="flex items-center justify-between">
              <kbd className="px-2 py-0.5 bg-card rounded text-xs">Ctrl+C</kbd>
              <span className="text-gray-400">Cancel</span>
            </div>
            <div className="flex items-center justify-between">
              <kbd className="px-2 py-0.5 bg-card rounded text-xs">Alt+Enter</kbd>
              <span className="text-gray-400">Fullscreen</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="text-sm font-medium text-primary/80 mb-2">Commands</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {commands.map((cmd) => (
              <div key={cmd.command} className="flex items-baseline text-sm gap-2 overflow-hidden">
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