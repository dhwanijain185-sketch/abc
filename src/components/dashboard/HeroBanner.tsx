'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppStore } from '@/lib/store/useAppStore';
import { soundFx } from '@/lib/soundEffects';
import {
  Play,
  Layers,
  Shield,
  Zap,
  Activity,
  ChevronRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface HeroBannerProps {
  dataFlowEnabled: boolean;
  onToggleDataFlow: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  dataFlowEnabled,
  onToggleDataFlow,
}) => {
  const [state, store] = useAppStore();

  return (
    <div className="relative rounded-2xl bg-gradient-to-r from-[#060D1F] via-[#040916] to-[#020612] border border-[#00BAF2]/25 p-5 lg:p-7 shadow-2xl overflow-hidden">
      {/* Background radial blue glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00BAF2]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Column: Headline & Value Proposition */}
        <div className="max-w-3xl space-y-3">
          {/* Tagline pill */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#002970]/70 border border-[#00BAF2]/40 text-[#00BAF2] text-[11px] font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#00BAF2] animate-pulse" />
              <span>PAYTM AUTOPILOT</span>
            </div>
            <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase hidden sm:inline">
              AUTONOMOUS CUSTOMER OPERATIONS
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono tracking-tight text-white leading-tight">
            FROM REQUEST TO <span className="text-[#00BAF2]">VERIFIED RESOLUTION.</span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-2xl">
            An autonomous AI teammate that investigates customer context, evaluates enterprise policy and risk, executes approved actions and verifies the outcome.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                store.runScenario('delayed_order');
                soundFx.playAction();
              }}
              disabled={state.isExecuting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00BAF2] hover:bg-[#0082c8] text-slate-950 font-bold font-mono text-xs tracking-wider shadow-[0_0_20px_rgba(0,186,242,0.4)] transition-all disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>RUN AUTOPILOT</span>
            </button>

            <Link
              href="/cases"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-mono text-xs font-medium transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#00BAF2]" />
              <span>VIEW CASES</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </Link>

            {/* Data Flow Toggle Button (PHASE 20) */}
            <button
              onClick={onToggleDataFlow}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-mono transition-all cursor-pointer ${
                dataFlowEnabled
                  ? 'bg-[#002970]/80 border-[#00BAF2] text-[#00BAF2] shadow-[0_0_12px_rgba(0,186,242,0.3)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>DATA FLOW: {dataFlowEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Autopilot Status Card */}
        <div className="flex-shrink-0 w-full lg:w-80 p-4 rounded-xl bg-slate-950/75 border border-[#00BAF2]/25 shadow-xl space-y-3 font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold text-slate-200">AUTOPILOT STATUS</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold">
              OPERATIONAL
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="text-[10px] text-slate-400">CURRENT ACTIVITY:</div>
            <div className="text-xs font-semibold text-[#00BAF2] truncate">
              {state.statusMessage}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">AGENT STAGE:</span>
            <span className="px-2 py-0.5 rounded bg-[#002970]/80 text-[#00BAF2] font-bold border border-[#00BAF2]/30">
              {state.aiState}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
