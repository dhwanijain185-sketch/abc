'use client';

import React from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  CheckCircle2,
  Receipt,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Copy,
  Lock,
} from 'lucide-react';

export const ActionReceiptCard: React.FC = () => {
  const [state] = useAppStore();
  const c = state.activeCase;

  // Show only when case is verified or resolved
  const isResolved = c?.status === 'RESOLVED';
  const isVerifying = state.aiState === 'VERIFYING';

  if (!isResolved && !isVerifying) return null;

  const refundAmount = c?.amount ? `₹${c.amount.toLocaleString('en-IN')}` : '₹2,499';
  const refundId = c?.refundId || 'REF-PAYTM-8842';
  const ticketId = c?.ticketNumber || 'REQ-1024';

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#061226] via-[#040A18] to-[#02050E] border border-emerald-500/40 p-5 shadow-[0_0_35px_rgba(16,185,129,0.2)] animate-in fade-in zoom-in-95 duration-300">
      {/* Signature Wow Moment Banner */}
      <div className="pb-4 mb-4 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider">
              RESOLUTION VERIFIED & RECONCILED
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            AUDIT TRANSACTION ID: {refundId}
          </span>
        </div>

        {/* Blue Line Data Travel Visualizer: AI CORE -> REFUNDS -> CUSTOMER */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[#00BAF2] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#00BAF2]" />
            <span>AI CORE</span>
          </div>
          <div className="flex-1 mx-3 h-0.5 bg-gradient-to-r from-[#00BAF2] via-emerald-400 to-[#00BAF2] relative overflow-hidden">
            <div className="absolute inset-0 bg-white/70 animate-pulse" />
          </div>
          <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>PAYOUT GATEWAY</span>
          </div>
          <div className="flex-1 mx-3 h-0.5 bg-gradient-to-r from-[#00BAF2] via-emerald-400 to-[#00BAF2] relative overflow-hidden">
            <div className="absolute inset-0 bg-white/70 animate-pulse" />
          </div>
          <div className="flex items-center gap-1.5 text-white font-semibold">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>CUSTOMER WALLET</span>
          </div>
        </div>

        <div className="mt-2 text-center text-sm font-mono font-bold text-emerald-300">
          {refundAmount} INSTANT REVERSAL VERIFIED BY PAYTM SETTLEMENT GATEWAY
        </div>
      </div>

      {/* AUTOPILOT ACTION RECEIPT */}
      <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3 font-mono">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white tracking-wide">
              AUTOPILOT ACTION RECEIPT
            </h4>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
            STATUS: SUCCESS
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[9px] text-slate-500 block">ACTION EXECUTED</span>
            <span className="text-slate-200 font-bold">
              {c?.currentAction || 'CREATE_REFUND'}
            </span>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 block">AMOUNT PROCESSED</span>
            <span className="text-[#00BAF2] font-bold">{refundAmount}</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 block">CUSTOMER</span>
            <span className="text-slate-200 font-bold truncate block">
              {c?.customerName || 'Rahul Sharma'}
            </span>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 block">REQUEST ID</span>
            <span className="text-slate-200 font-bold">{ticketId}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[9px] text-slate-500 block">POLICY APPLIED</span>
            <span className="text-emerald-400 font-semibold">POL-402 DELAYED_SLA</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 block">RISK EVALUATION</span>
            <span className="text-emerald-400 font-semibold">PASSED (LOW / 12)</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 block">VERIFICATION</span>
            <span className="text-emerald-400 font-semibold">GATEWAY RECONCILED</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 block">TIMESTAMP</span>
            <span className="text-slate-400">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
