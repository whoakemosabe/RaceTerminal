'use client'

import { HelpCircle } from 'lucide-react';
import { commands } from '@/lib/commands';

export function HelpPanel() {
  return (
    <div className="mb-8 p-6 glass-panel">
      <div className="flex items-start gap-3 mb-4">
        <HelpCircle className="text-primary mt-1 flex-shrink-0" />
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-2 text-primary">Available Commands</h2>
          <p className="text-gray-400 mb-4 tracking-wide">
            Data provided by Ergast F1 API and OpenF1 API
          </p>
          <div className="mb-4 p-3 bg-card/30 rounded-lg">
            <h3 className="text-primary font-semibold mb-2">Keyboard Shortcuts</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <li className="text-gray-300">
                <kbd className="px-2 py-1 bg-card rounded">↑</kbd>
                <span className="ml-2">Previous command</span>
              </li>
              <li className="text-gray-300">
                <kbd className="px-2 py-1 bg-card rounded">↓</kbd>
                <span className="ml-2">Next command</span>
              </li>
              <li className="text-gray-300">
                <kbd className="px-2 py-1 bg-card rounded">Tab</kbd>
                <span className="ml-2">Auto-complete command</span>
              </li>
              <li className="text-gray-300">
                <kbd className="px-2 py-1 bg-card rounded">Ctrl</kbd>
                <span className="mx-1">+</span>
                <kbd className="px-2 py-1 bg-card rounded">L</kbd>
                <span className="ml-2">Clear terminal</span>
              </li>
              <li className="text-gray-300">
                <kbd className="px-2 py-1 bg-card rounded">Ctrl</kbd>
                <span className="mx-1">+</span>
                <kbd className="px-2 py-1 bg-card rounded">C</kbd>
                <span className="ml-2">Cancel command</span>
              </li>
            </ul>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commands.map((cmd) => (
              <li key={cmd.command} className="text-gray-300 break-words">
                <code className="text-secondary">{cmd.command}</code>
                <span className="mx-2">-</span>
                <span className="block md:inline mt-1 md:mt-0">{cmd.description}</span>
                <span className="text-sm text-gray-500 ml-2">({cmd.source})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}