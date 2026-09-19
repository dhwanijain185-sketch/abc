'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  FileText,
  ShieldCheck,
  User,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Receipt,
} from 'lucide-react';

export const ActiveCaseDetails: React.FC = () => {
  const [state] = useAppStore();
  const c = state.activeCase;

  if (!c) {
    return (
      <div className="flex flex-col h-full rounded-xl bg-slate-900/60 border border-slate-800/80 p-4 shadow-xl backdrop-blur-sm text-center items-center justify-center text-slate-500">
        <FileText className="w-8 h-8 opacity-30 mb-2 text-[#00BAF2]" />
        <p className="text-xs font-mono">NO ACTIVE CASE INSPECTED</p>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'text-red-400 bg-red-950/80 border-red-500/50';
      case 'HIGH':
        return 'text-amber-400 bg-amber-950/80 border-amber-500/50';
      case 'MEDIUM':
        return 'text-[#00BAF2] bg-[#002970]/80 border-[#00BAF2]/50';
      default:
        return 'text-slate-400 bg-slate-800/80 border-slate-700/50';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return 'text-red-400 bg-red-950/80 border-red-500/50';
      case 'MEDIUM':
        return 'text-amber-400 bg-amber-950/80 border-amber-500/50';
      default:
        return 'text-emerald-400 bg-emerald-950/80 border-emerald-500/50';
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl bg-slate-900/60 border border-slate-800/80 p-4 shadow-xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#00BAF2]" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            CASE INSPECTOR
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#00BAF2]">
            #{c.ticketNumber}
          </span>
          <Link
            href={`/cases/${c.id}`}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Open Deep Audit Log"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Case Overview Grid */}
      <div className="mt-3 space-y-3 text-xs">
        {/* Customer & Order */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] font-mono text-slate-500 block mb-0.5">
              CUSTOMER
            </span>
            <div className="font-medium text-slate-200 flex items-center gap-1.5 truncate">
              <User className="w-3.5 h-3.5 text-[#00BAF2] flex-shrink-0" />
              <span className="truncate">{c.customerName}</span>
            </div>
            <span className="text-[9px] font-mono text-[#00BAF2] uppercase mt-0.5 block">
              {c.customerTier} TIER
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] font-mono text-slate-500 block mb-0.5">
              ORDER
            </span>
            <div className="font-medium text-slate-200 flex items-center gap-1.5 truncate">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="truncate">{c.orderNumber || 'N/A'}</span>
            </div>
            <span className="text-[9px] font-mono text-slate-400 mt-0.5 block truncate">
              {c.productName || 'Order Item'}
            </span>
          </div>
        </div>

        {/* Intent & Amount */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] font-mono text-slate-500 block mb-0.5">
              INTENT
            </span>
            <div className="font-semibold text-slate-200 truncate">
              {c.intent}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] font-mono text-slate-500 block mb-0.5">
              AMOUNT
            </span>
            <div className="font-mono font-bold text-[#00BAF2] text-sm flex items-center">
              ₹{c.amount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Priority & Risk Badges */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500">PRIORITY</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getPriorityColor(
                c.priority
              )}`}
            >
              {c.priority}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500">RISK LEVEL</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getRiskColor(
                c.risk
              )}`}
            >
              {c.risk}
            </span>
          </div>
        </div>

        {/* Decision & Status */}
        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500">
              POLICY DECISION:
            </span>
            <span className="font-mono text-xs font-bold text-[#00BAF2]">
              {c.decision}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500">STATUS:</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                c.status === 'RESOLVED'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                  : c.status === 'ESCALATED'
                  ? 'bg-red-950 text-red-300 border border-red-500/50'
                  : 'bg-[#002970] text-[#00BAF2] border border-[#00BAF2]/50 animate-pulse'
              }`}
            >
              {c.status}
            </span>
          </div>
        </div>

        {/* Verification Status */}
        <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              VERIFICATION
            </span>
            <span
              className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                c.verificationStatus === 'VERIFIED'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                  : c.verificationStatus === 'SKIPPED'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {c.verificationStatus}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            {c.verificationDetails?.checkName ||
              (c.status === 'RESOLVED'
                ? 'Autonomous gateway reconciliation verified'
                : 'Pending autonomous verification sequence')}
          </p>
          {c.refundId && (
            <div className="mt-1 font-mono text-[10px] text-emerald-400 font-semibold">
              REFUND ID: {c.refundId}
            </div>
          )}
          {c.replacementOrderId && (
            <div className="mt-1 font-mono text-[10px] text-[#00BAF2] font-semibold">
              REPLACEMENT ORDER: {c.replacementOrderId}
            </div>
          )}
        </div>
      </div>

      {/* Deep Link to Case Audit */}
      <div className="mt-3 pt-3 border-t border-slate-800/80">
        <Link
          href={`/cases/${c.id}`}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-medium text-slate-200 transition-colors cursor-pointer"
        >
          <span>VIEW FULL AUDIT & CERTIFICATE</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
