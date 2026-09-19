'use client';

import React from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { AICoreState } from '@/lib/types';
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

const PIPELINE_STEPS = [
  { step: '01', key: 'UNDERSTAND', label: 'UNDERSTAND', activeStates: ['ANALYZING'] },
  { step: '02', key: 'INVESTIGATE', label: 'INVESTIGATE', activeStates: ['SEARCHING'] },
  { step: '03', key: 'REASON', label: 'REASON', activeStates: ['REASONING'] },
  { step: '04', key: 'DECIDE', label: 'DECIDE', activeStates: ['DECIDING'] },
  { step: '05', key: 'ACT', label: 'ACT', activeStates: ['EXECUTING'] },
  { step: '06', key: 'VERIFY', label: 'VERIFY', activeStates: ['VERIFYING'] },
  { step: '07', key: 'RESOLVE', label: 'RESOLVE', activeStates: ['RESOLVED'] },
];

function getStageIndex(status: AICoreState): number {
  switch (status) {
    case 'ANALYZING':
      return 0;
    case 'SEARCHING':
      return 1;
    case 'REASONING':
      return 2;
    case 'DECIDING':
      return 3;
    case 'EXECUTING':
      return 4;
    case 'VERIFYING':
      return 5;
    case 'RESOLVED':
      return 6;
    case 'ESCALATED':
      return 3; // Pauses at Decision/Risk evaluation
    default:
      return -1; // IDLE
  }
}

export const AutonomyPipeline: React.FC = () => {
  const [state] = useAppStore();
  const currentIdx = getStageIndex(state.aiState);
  const isEscalated = state.aiState === 'ESCALATED';

  return (
    <div className="rounded-xl bg-slate-900/50 border border-slate-800/80 p-3.5 backdrop-blur-sm shadow-md">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">
            AUTONOMOUS EXECUTION PIPELINE
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-[#00BAF2]">
            DETERMINISTIC
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          {isEscalated ? (
            <span className="text-red-400 font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              AUTONOMY PAUSED: HIGH-RISK EXCEPTION
            </span>
          ) : (
            <span className="text-slate-400">
              STAGE {currentIdx >= 0 ? `${currentIdx + 1} OF 7` : 'READY'}
            </span>
          )}
        </div>
      </div>

      {/* Steps Horizontal Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {PIPELINE_STEPS.map((s, idx) => {
          const isCompleted = currentIdx > idx || state.aiState === 'RESOLVED';
          const isCurrent = currentIdx === idx && !isCompleted;
          const isPending = currentIdx < idx && state.aiState !== 'RESOLVED';

          let stateStyle = 'bg-slate-950/60 border-slate-800 text-slate-500';
          if (isEscalated && idx === 3) {
            stateStyle = 'bg-red-950/60 border-red-500/80 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.3)]';
          } else if (isCurrent) {
            stateStyle = 'bg-[#002970]/80 border-[#00BAF2] text-[#00BAF2] shadow-[0_0_12px_rgba(0,186,242,0.3)]';
          } else if (isCompleted) {
            stateStyle = 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300';
          }

          return (
            <div
              key={s.step}
              className={`p-2 rounded-lg border flex flex-col justify-between transition-all duration-300 ${stateStyle}`}
            >
              <div className="flex items-center justify-between text-[9px] font-mono">
                <span className="font-bold opacity-70">{s.step}</span>
                {isCompleted ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-3 h-3 text-[#00BAF2] animate-spin" />
                ) : isEscalated && idx === 3 ? (
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                )}
              </div>

              <div className="mt-1 font-mono font-bold text-[11px] tracking-wider truncate">
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
