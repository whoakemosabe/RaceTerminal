'use client'

import { useEffect, useState } from 'react';
import { Terminal, Cpu, Clock, Calendar, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
      <div className="mb-4 p-3 glass-panel">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 text-primary">
            <Terminal size={16} />
            <span className="text-sm font-mono">RaceTerminal Pro v1.0.1</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground opacity-0">
            <Calendar size={16} />
            <span className="text-sm font-mono">Loading...</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground opacity-0">
            <Clock size={16} />
            <span className="text-sm font-mono">Loading...</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground opacity-0">
            <Cpu size={16} />
            <span className="text-sm font-mono">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 p-3 glass-panel">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2 text-primary">
          <Info size={16} />
          <span className="text-sm font-mono">v1.0.1</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-help">
                <Calendar size={16} />
                <span className="text-sm font-mono">
                  {sessionStart.toLocaleDateString()}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="tooltip-content">
              <p>Session Start Date</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-help">
                <Clock size={16} />
                <span className="text-sm font-mono">
                  {currentTime.toLocaleTimeString()}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="tooltip-content">
              <p>Current Time</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-help">
                <Cpu size={16} />
                <span className="text-sm font-mono">Uptime: {uptime}</span>
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