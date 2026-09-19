'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { soundFx } from '@/lib/soundEffects';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';

export const HumanEscalationBanner: React.FC = () => {
  const [state, store] = useAppStore();
  const [actionDone, setActionDone] = useState<string | null>(null);

  const isHighRisk = state.aiState === 'ESCALATED' || state.activeCase?.status === 'ESCALATED';

  if (!isHighRisk) return null;

  const handleAction = (type: 'approve' | 'reject' | 'info') => {
    if (type === 'approve') {
      soundFx.playVerified();
      setActionDone('Supervisor approved transaction following manual ledger verification.');
    } else if (type === 'reject') {
      soundFx.playEscalation();
      setActionDone('Supervisor rejected transaction and placed a 24h fraud freeze on account.');
    } else {
      soundFx.playAction();
      setActionDone('Information request dispatched to customer via secure notification.');
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-950/90 to-red-950/80 border-2 border-red-500/70 p-5 shadow-[0_0_40px_rgba(239,68,68,0.25)] animate-in fade-in slide-in-from-top-3 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Escalation Context */}
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <h3 className="text-sm font-mono font-bold tracking-wider text-red-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              AUTONOMY PAUSED — HUMAN REVIEW REQUIRED
            </h3>
            <span className="px-2 py-0.2 rounded text-[9px] font-mono font-bold bg-red-950 text-red-300 border border-red-800">
              SAFETY BOUNDARY
            </span>
          </div>

          <p className="text-xs text-slate-200">
            <strong className="text-white font-semibold">Reason:</strong> ₹50,000 transaction dispute exceeds autonomous safety limit (₹5,000 max). Potential fraud heuristic detected.
          </p>

          <div className="text-[11px] font-mono text-amber-300 flex items-center gap-2">
            <span>AUTOPILOT RECOMMENDATION:</span>
            <span className="underline">Manual verification of user credentials before payout</span>
          </div>

          {actionDone && (
            <div className="mt-2 p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-xs font-mono text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{actionDone}</span>
            </div>
          )}
        </div>

        {/* Right: Human Supervisor Action Buttons */}
        {!actionDone && (
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleAction('approve')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-mono text-xs shadow-lg transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>APPROVE</span>
            </button>

            <button
              onClick={() => handleAction('reject')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold font-mono text-xs shadow-lg transition-all cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>REJECT</span>
            </button>

            <button
              onClick={() => handleAction('info')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs border border-slate-700 transition-all cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#00BAF2]" />
              <span>REQUEST INFO</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
