'use client'

import { useEffect, useRef, useState } from 'react';
import { Terminal as TerminalIcon, X } from 'lucide-react';
import { Terminal } from './terminal';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FullscreenTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  command: string;
  isProcessing: boolean;
  history: Array<{ command: string; output: string; username: string; timestamp?: string }>;
  showSuggestions: boolean;
  onShowSuggestionsChange: (show: boolean) => void;
  isNavigatingSuggestions: boolean;
  onNavigationStateChange: (isNavigating: boolean) => void;
  onCommandChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onExecute: () => void;
  showWelcome?: boolean;
  onCloseWelcome?: () => void;
}

export function FullscreenTerminal({
  isOpen,
  onClose,
  ...props
}: FullscreenTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Focus input when fullscreen opens
  useEffect(() => {
    if (isOpen && props.inputRef?.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        props.inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, props.inputRef]);

  useEffect(() => {
    setMounted(true);
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-50"
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ 
            opacity: 1,
            backdropFilter: 'blur(16px)',
            backgroundColor: 'hsl(var(--background))'
          }}
          exit={{ 
            opacity: 0,
            backdropFilter: 'blur(0px)',
            backgroundColor: 'transparent'
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <motion.div 
            className="absolute top-4 right-4 z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-card hover:bg-card/70 transition-colors" 
              aria-label="Close fullscreen terminal"
            >
              <X className="w-5 h-5 text-primary" aria-hidden="true" />
            </button>
          </motion.div>

          <motion.div 
            className="container mx-auto h-screen max-w-6xl p-4"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            <div className="h-full flex flex-col">
              <motion.div 
                className="flex items-center gap-2 mb-2 text-primary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: 0.2 }}
              >
                <TerminalIcon className="w-5 h-5" aria-hidden="true" />
                <h2 className="text-lg font-medium">RaceTerminal Pro</h2>
              </motion.div>

              <motion.div 
                className="flex-1 terminal-window"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.3 }}
              >
                <Terminal {...props} />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}