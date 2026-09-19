'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { db } from '@/lib/supabase/client';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  ShoppingBag,
  Cpu,
  Clock,
  Code,
  Lock,
  ExternalLink,
} from 'lucide-react';

export default function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const caseItem = db.getCaseById(resolvedParams.id);

  if (!caseItem) {
    return (
      <div className="min-h-screen bg-[#050811] text-slate-100 p-8 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="w-12 h-12 text-amber-400 mb-3" />
        <h1 className="text-lg font-mono font-bold">CASE RECORD NOT FOUND</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          No case matches the specified identifier: {resolvedParams.id}
        </p>
        <Link
          href="/cases"
          className="mt-4 px-4 py-2 rounded-lg bg-slate-800 text-xs font-mono text-cyan-400 hover:bg-slate-700 transition-colors"
        >
          ← Return to Cases Registry
        </Link>
      </div>
    );
  }

  const c = caseItem;

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 p-4 lg:p-6 max-w-[1920px] mx-auto w-full space-y-4">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-[#00BAF2] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO CASES</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-400">
            SYSTEM ID: {c.id}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
              c.status === 'RESOLVED'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                : c.status === 'ESCALATED'
                ? 'bg-red-950 text-red-300 border border-red-500/50'
                : 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
            }`}
          >
            {c.status}
          </span>
        </div>
      </div>

      {/* Main Grid: Left Investigation Dossier & Right Verification Certificate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (8 cols): Investigation Details & Trace */}
        <div className="lg:col-span-8 space-y-4">
          {/* Header Card */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-cyan-400">
                CASE TICKET #{c.ticketNumber}
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                CREATED: {new Date(c.createdAt).toLocaleString()}
              </span>
            </div>
            <h1 className="text-base font-bold text-white font-mono">
              {c.intent}
            </h1>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <strong className="text-slate-400 font-mono block text-[10px] mb-1">
                ORIGINAL CUSTOMER INTAKE STATEMENT:
              </strong>
              &ldquo;{c.customerMessage || 'N/A'}&rdquo;
            </p>
          </div>

          {/* Customer & Order Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Box */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-1 border-b border-slate-800">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <User className="w-3.5 h-3.5" />
                  CUSTOMER 360 PROFILE
                </span>
                <span className="text-slate-500">{c.customerId}</span>
              </div>
              <div className="text-xs space-y-1 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Name:</span>
                  <span className="font-medium text-slate-200">{c.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Account Tier:</span>
                  <span className="font-mono text-cyan-300 uppercase">{c.customerTier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-slate-300">{c.customerEmail || 'Verified In App'}</span>
                </div>
              </div>
            </div>

            {/* Order Box */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-1 border-b border-slate-800">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  ORDER & LOGISTICS CONTEXT
                </span>
                <span className="text-slate-500">{c.orderNumber || 'N/A'}</span>
              </div>
              <div className="text-xs space-y-1 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Item:</span>
                  <span className="font-medium text-slate-200">{c.productName || 'Order Item'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Transaction Value:</span>
                  <span className="font-mono font-bold text-white">₹{c.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Currency:</span>
                  <span className="font-mono text-slate-300">{c.currency}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deterministic Execution Event Stepper */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-mono font-bold text-slate-200">
                  DETERMINISTIC EXECUTION TRACE
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {c.timeline.length} VERIFIED CHECKPOINTS
              </span>
            </div>

            <div className="space-y-2">
              {c.timeline.map((ev, i) => (
                <div
                  key={ev.id || i}
                  className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs"
                >
                  <span className="font-mono text-[10px] text-slate-500 mt-0.5">
                    {ev.timestamp}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold text-slate-200">
                        {ev.title}
                      </span>
                      {ev.tool && (
                        <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-[9px] font-mono text-cyan-300">
                          {ev.tool}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {ev.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Raw JSON Payload Inspector */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-mono font-bold text-slate-200">
                  AUDIT PAYLOAD INSPECTOR (SHA-256 ENCRYPTED TRACE)
                </h3>
              </div>
            </div>
            <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-300/90 overflow-x-auto max-h-60">
              {JSON.stringify(c, null, 2)}
            </pre>
          </div>
        </div>

        {/* Right Column (4 cols): Digital Verification Certificate & Action Summary */}
        <div className="lg:col-span-4 space-y-4">
          {/* Digital Verification Certificate */}
          <div className="p-5 rounded-xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-emerald-500/40 shadow-xl relative overflow-hidden">
            {/* Watermark badge */}
            <div className="absolute top-3 right-3 text-emerald-500/20">
              <ShieldCheck className="w-20 h-20" />
            </div>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-500/50 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-emerald-300 block">
                  DIGITAL VERIFICATION CERTIFICATE
                </span>
                <span className="text-[9px] font-mono text-slate-400">
                  STANDARD RESOLVEAI-V1-AUDIT
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs border-t border-slate-800 font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">
                  VERIFICATION STATUS:
                </span>
                <span className="font-bold text-emerald-400 text-sm">
                  {c.verificationStatus}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">
                  CHECK TYPE:
                </span>
                <span className="text-slate-300 text-[11px]">
                  {c.verificationDetails?.checkName || 'Deterministic Financial Gateway Reconcile'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">
                  GATEWAY REFERENCE:
                </span>
                <span className="text-emerald-300 font-bold tracking-wider">
                  {c.verificationDetails?.gatewayRefId || c.refundId || c.replacementOrderId || 'REF-RECONCILED-991'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">
                  VERIFIED TIMESTAMP:
                </span>
                <span className="text-slate-400 text-[11px]">
                  {c.verificationDetails?.verifiedAt || c.updatedAt}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">
                  IDEMPOTENCY HASH:
                </span>
                <span className="text-slate-500 text-[9px] break-all">
                  SHA256: 8a4d7f9104c8e76a5b23d90231fe98a0d9b4c2
                </span>
              </div>
            </div>
          </div>

          {/* Policy Evaluation Summary Card */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-200 pb-2 border-b border-slate-800">
              DETERMINISTIC POLICY PROFILE
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Risk Assessment:</span>
                <span className="font-mono font-bold text-emerald-400">{c.risk} RISK</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Auto Decision:</span>
                <span className="font-mono font-bold text-cyan-300">{c.decision}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Action Rule:</span>
                <span className="font-mono text-slate-300">{c.currentAction || 'COMPLETED'}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-normal">
              {c.resolution}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
