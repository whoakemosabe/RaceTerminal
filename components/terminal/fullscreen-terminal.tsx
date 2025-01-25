'use client'

import { useEffect, useRef, useState } from 'react';
import { Terminal as TerminalIcon, X } from 'lucide-react';
import { Terminal } from './terminal';
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
}

export function FullscreenTerminal({
  isOpen,
  onClose,
  ...props
}: FullscreenTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

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
    <div
      ref={containerRef}
      className={cn(
        'fixed inset-0 z-50 bg-background/80 backdrop-blur-md transition-all duration-200',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-card/50 hover:bg-card/70 transition-colors"
        >
          <X className="w-5 h-5 text-primary" />
        </button>
      </div>

      <div className="container mx-auto h-screen max-w-6xl p-4">
        <div className="h-full flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-primary">
            <TerminalIcon className="w-5 h-5" />
            <h2 className="text-lg font-medium">RaceTerminal Pro</h2>
          </div>

          <div className="flex-1 glass-panel">
            <Terminal {...props} />
          </div>
        </div>
      </div>
    </div>
  );
}