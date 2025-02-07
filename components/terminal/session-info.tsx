'use client'

import { useEffect, useState } from 'react';
import { Terminal, Cpu, Clock, Calendar, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { APP_VERSION } from '@/lib/constants';

export function SessionInfo() {
  const [mounted, setMounted] = useState(false);
  const [sessionStart] = useState(() => new Date());
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [uptime, setUptime] = useState('0:00');

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      const diff = Math.floor((Date.now() - sessionStart.getTime()) / 1000);
      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;
      setUptime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStart]);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="mb-2 p-2 glass-panel">
        <div className="gap-4 grid grid-cols-4 md:grid-cols-1">
          <div className="flex items-center gap-2 text-primary">
            <Terminal size={16} />
            <span className="font-mono text-sm">RaceTerminal Pro</span>
          </div>
          <div className="flex items-center gap-2 opacity-0 text-muted-foreground">
            <Calendar size={16} />
            <span className="font-mono text-sm">Loading...</span>
          </div>
          <div className="flex items-center gap-2 opacity-0 text-muted-foreground">
            <Clock size={16} />
            <span className="font-mono text-sm">Loading...</span>
          </div>
          <div className="flex items-center gap-2 opacity-0 text-muted-foreground">
            <Cpu size={16} />
            <span className="font-mono text-sm">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-2 p-2 glass-panel">
      <div className="flex justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Info size={16} />
          <span className="font-mono text-sm">v{APP_VERSION}</span>
        </div>
        <div className="flex flex-1 justify-center items-center gap-2 text-muted-foreground">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-help">
                <Calendar size={16} />
                <span className="font-mono text-sm">
                  {new Date(sessionStart).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="tooltip-content">
              <p>Session Start Date</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex flex-1 justify-center items-center gap-2 text-muted-foreground">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-help">
                <Clock size={16} />
                <span className="font-mono text-sm">
                  {currentTime.toLocaleTimeString()}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="tooltip-content">
              <p>Current Time</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex justify-end items-center gap-2 text-muted-foreground">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-help">
                <Cpu size={16} />
                <span className="font-mono text-sm">Uptime: {uptime}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="tooltip-content">
              <p>Session Duration</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}