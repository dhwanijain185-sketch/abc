'use client';

import React from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Lock,
  FileCheck,
  Cpu,
} from 'lucide-react';

export const ExplainabilityCard: React.FC = () => {
  const [state] = useAppStore();
  const c = state.activeCase;

  // Derive operational reasoning tokens
  const intentText = c?.intent || 'Delayed Order & Refund Request';
  const contextText = c?.orderNumber ? `Order ${c.orderNumber} breached 48h carrier SLA` : 'Customer requested delivery resolution';
  const policyText = c?.status === 'ESCALATED' ? 'POL-801: High-value transaction requires human verification' : 'POL-402: Auto-refund approved for delayed unfulfilled delivery';
  const riskText = c?.status === 'ESCALATED' ? 'HIGH RISK (Score: 88/100) — Boundary triggered' : `LOW RISK (${c?.risk || 'LOW'}) — Deterministic safe zone`;
  const actionText = c?.status === 'ESCALATED' ? 'Escalate to specialist triage queue' : c?.currentAction || 'Issue ₹2,499 Instant Wallet Reversal';
  const verificationText = c?.verificationStatus === 'VERIFIED' ? 'Passed: Reconciled with Bank Gateway' : c?.status === 'ESCALATED' ? 'Required: Identity confirmation before payout' : 'Pending: Scheduled gateway verification';
  const resultText = c?.status === 'RESOLVED' ? 'Verified Resolution Delivered' : c?.status === 'ESCALATED' ? 'Autonomy Paused for Supervisor Review' : 'Active Execution';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* WHY AUTOPILOT ACTED (Explainability) */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-4 backdrop-blur-sm shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#00BAF2]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                WHY AUTOPILOT ACTED (OPERATIONAL REASONING)
              </h3>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              AUDIT COMPLIANT
            </span>
          </div>

          {/* Reasoning Grid */}
          <div className="mt-3 grid grid-cols-2 gap-2.5 text-xs font-mono">
            <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/60">
              <span className="text-[9px] text-slate-500 block mb-0.5">01 INTENT</span>
              <span className="text-slate-200 font-medium truncate block">{intentText}</span>
            </div>

            <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/60">
              <span className="text-[9px] text-slate-500 block mb-0.5">02 CONTEXT</span>
              <span className="text-slate-200 font-medium truncate block">{contextText}</span>
            </div>

            <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/60">
              <span className="text-[9px] text-slate-500 block mb-0.5">03 POLICY EVALUATED</span>
              <span className="text-[#00BAF2] font-medium truncate block">{policyText}</span>
            </div>

            <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/60">
              <span className="text-[9px] text-slate-500 block mb-0.5">04 RISK HEURISTIC</span>
              <span className={`font-medium truncate block ${c?.status === 'ESCALATED' ? 'text-red-400' : 'text-emerald-400'}`}>
                {riskText}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/60">
              <span className="text-[9px] text-slate-500 block mb-0.5">05 ACTION APPROVED</span>
              <span className="text-slate-200 font-medium truncate block">{actionText}</span>
            </div>

            <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/60">
              <span className="text-[9px] text-slate-500 block mb-0.5">06 GATEWAY VERIFICATION</span>
              <span className="text-emerald-300 font-medium truncate block">{verificationText}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
          <span className="text-slate-400">OUTCOME STATUS:</span>
          <span className={`font-bold ${c?.status === 'RESOLVED' ? 'text-emerald-400' : c?.status === 'ESCALATED' ? 'text-red-400' : 'text-[#00BAF2]'}`}>
            {resultText}
          </span>
        </div>
      </div>

      {/* AUTONOMY CONTROL & GUARDRAILS */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-4 backdrop-blur-sm shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                AUTONOMY CONTROL & SAFETY BOUNDARIES
              </h3>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#002970]/60 border border-[#00BAF2]/30 text-[#00BAF2] font-semibold">
              CONTROLLED AUTONOMY
            </span>
          </div>

          {/* Autonomy flow indicator */}
          <div className="mt-3 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <div className="text-[10px] font-mono text-slate-400 mb-1.5 flex items-center justify-between">
              <span>OPERATIONAL FLOW:</span>
              <span className="text-emerald-400">POLICY BOUND</span>
            </div>
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-300 gap-1">
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">OBSERVE</span>
              <span>→</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">RECOMMEND</span>
              <span>→</span>
              <span className="px-1.5 py-0.5 rounded bg-[#002970] border border-[#00BAF2]/50 text-[#00BAF2]">EXECUTE APPROVED</span>
              <span>→</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-300">VERIFY</span>
              <span>→</span>
              <span className="px-1.5 py-0.5 rounded bg-red-950 border border-red-500/50 text-red-300">ESCALATE</span>
            </div>
          </div>

          {/* 6 Enterprise Guardrails */}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Policy Engine Active</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Risk Engine Active</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Verification Required</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Duplicate Protection</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Audit Logging</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Human Escalation</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>MAX AUTO REFUND CAP: ₹5,000</span>
          <span className="text-[#00BAF2]">AIR-GAP DETERMINISTIC</span>
        </div>
      </div>
    </div>
  );
};
