'use client'

import { HelpCircle } from 'lucide-react';
import { commands } from '@/lib/commands';

export function HelpPanel() {
  return (
    <div className="mb-3 mt-4 p-3 glass-panel">
      <div className="flex items-start gap-2">
        <HelpCircle className="text-primary mt-1 flex-shrink-0" />
        <div className="w-full">
          <h2 className="text-base font-semibold mb-1.5 text-primary">Available Commands</h2>
          <div className="mb-2 p-1.5 bg-card/30 rounded-lg">
            <h3 className="text-primary font-medium text-sm mb-1">Keyboard Shortcuts</h3>
            <ul className="grid grid-cols-2 gap-1 text-xs">
              <li className="text-gray-300">
                <kbd className="px-1.5 py-0.5 bg-card rounded text-xs">↑</kbd>
                <span className="ml-2">Previous command</span>
              </li>
              <li className="text-gray-300">
                <kbd className="px-1.5 py-0.5 bg-card rounded text-xs">↓</kbd>
                <span className="ml-2">Next command</span>
              </li>
              <li className="text-gray-300">
                <kbd className="px-1.5 py-0.5 bg-card rounded text-xs">Tab</kbd>
                <span className="ml-2">Auto-complete command</span>
              </li>
              <li className="text-gray-300">
                <kbd className="px-1.5 py-0.5 bg-card rounded text-xs">Ctrl</kbd>
                <span className="mx-1">+</span>
                <kbd className="px-1.5 py-0.5 bg-card rounded text-xs">L</kbd>
                <span className="ml-2">Clear terminal</span>
              </li>
              <li className="text-gray-300">
                <kbd className="px-1.5 py-0.5 bg-card rounded text-xs">Ctrl</kbd>
                <span className="mx-1">+</span>
                <kbd className="px-1.5 py-0.5 bg-card rounded text-xs">C</kbd>
                <span className="ml-2">Cancel command</span>
              </li>
            </ul>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            {commands.map((cmd) => (
              <li key={cmd.command} className="text-gray-300 break-words">
                <code className="text-secondary">{cmd.command}</code>
                <span className="mx-1">-</span>
                <span className="inline">{cmd.description}</span>
                <span className="text-[10px] text-gray-500 ml-1">({cmd.source})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}