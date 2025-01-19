'use client'

import { useEffect, useState } from 'react';
import { Terminal, Cpu, Clock, Calendar } from 'lucide-react';

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
            <span className="text-sm font-mono">RaceStats Pro v1.0.0</span>
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
          <Terminal size={16} />
          <span className="text-sm font-mono">RaceStats Pro v1.0.0</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar size={16} />
          <span className="text-sm font-mono">
            {sessionStart.toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock size={16} />
          <span className="text-sm font-mono">
            {currentTime.toLocaleTimeString()}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Cpu size={16} />
          <span className="text-sm font-mono">Uptime: {uptime}</span>
        </div>
      </div>
    </div>
  );
}