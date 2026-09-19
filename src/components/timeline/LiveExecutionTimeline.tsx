'use client';

import React, { useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { ExecutionEvent } from '@/lib/types';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Cpu,
  Terminal,
  ShieldCheck,
} from 'lucide-react';

export const LiveExecutionTimeline: React.FC = () => {
  const [state] = useAppStore();
  const timeline = state.timeline || [];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [timeline.length]);

  const getStatusIcon = (status: ExecutionEvent['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case 'error':
        return <XCircle className="w-3.5 h-3.5 text-red-400" />;
      case 'active':
        return <Loader2 className="w-3.5 h-3.5 text-[#00BAF2] animate-spin" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-slate-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl bg-slate-900/60 border border-slate-800/80 p-4 shadow-xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#00BAF2]" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            AUTONOMOUS EXECUTION TIMELINE
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono text-slate-400">
            EVENTS: {timeline.length}
          </span>
        </div>
      </div>

      {/* Events Container */}
      <div
        ref={scrollRef}
        className="flex-1 mt-3 space-y-2.5 overflow-y-auto pr-1 max-h-[400px] lg:max-h-[480px]"
      >
        {timeline.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center text-slate-500">
            <Terminal className="w-8 h-8 mb-2 opacity-30 text-[#00BAF2]" />
            <p className="text-xs font-mono">TIMELINE BUFFER READY</p>
            <p className="text-[10px] text-slate-400 mt-1">
              Events stream live upon customer request execution.
            </p>
          </div>
        ) : (
          timeline.map((ev, index) => {
            const isLast = index === timeline.length - 1;
            return (
              <div
                key={ev.id || index}
                className={`relative flex items-start gap-3 p-2.5 rounded-lg border transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
                  isLast
                    ? 'bg-[#002970]/30 border-[#00BAF2]/60 shadow-[0_0_15px_rgba(0,186,242,0.2)]'
                    : 'bg-slate-950/50 border-slate-800/60'
                }`}
              >
                {/* Status Dot / Icon */}
                <div className="mt-0.5 flex-shrink-0">{getStatusIcon(ev.status)}</div>

                {/* Event Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold font-mono tracking-tight text-slate-200 truncate">
                      {ev.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 flex-shrink-0">
                      {ev.timestamp}
                    </span>
                  </div>

                  <p className="mt-0.5 text-[11px] text-slate-400 leading-normal">
                    {ev.description}
                  </p>

                  {/* Tool Badge */}
                  {ev.tool && (
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-[9px] font-mono text-[#00BAF2]">
                        <Cpu className="w-2.5 h-2.5 text-[#00BAF2]" />
                        NODE: {ev.tool}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Audit Code */}
      <div className="pt-2.5 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono text-slate-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>DETERMINISTIC VERIFICATION LOG</span>
        </span>
        <span>GATEWAY HASH: SHA-256</span>
      </div>
    </div>
  );
};
