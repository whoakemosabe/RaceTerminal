'use client'

import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <motion.div 
      className={cn(
        "glass-panel flex flex-col max-h-[300px]",
        isMinimized ? "h-10" : "h-full"
      )}
      layout
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <div 
        className="flex items-center justify-between px-2 py-1 border-b border-border/10 cursor-pointer hover:bg-card/30 transition-colors"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="text-primary h-4 w-4" />
          <h2 className="text-sm font-medium text-primary">Quick Reference</h2>
        </div>
        {isMinimized ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      <AnimatePresence>
        {!isMinimized && (
          <motion.div 
            className="p-2 grid grid-cols-[180px_1fr] gap-4 flex-1 overflow-y-auto"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
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

            {/* Bottom Tips */}
            <div className="col-span-2 mt-3 pt-2 border-t border-border/10 text-[10px] text-muted-foreground/70 flex items-center justify-between flex-shrink-0">
              <div>Type <code className="text-primary px-1 py-0.5 bg-card/30 rounded">/help</code> for detailed documentation</div>
              <div className="flex items-center gap-4">
                <span>Tab to auto-complete</span>
                <span>Case-insensitive</span>
                <span>Use /list for data</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}