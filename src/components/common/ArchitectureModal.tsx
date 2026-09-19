'use client';

import React from 'react';
import {
  X,
  MessageSquare,
  Sparkles,
  Database,
  FileCheck,
  ShieldAlert,
  Cpu,
  Zap,
  CheckCircle2,
  Send,
  Lock,
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STAGES = [
  {
    step: '01',
    title: 'CUSTOMER REQUEST',
    desc: 'Inbound message from WhatsApp, Web Portal, or Paytm App',
    icon: MessageSquare,
    color: '#00BAF2',
  },
  {
    step: '02',
    title: 'AI UNDERSTANDING',
    desc: 'Entity extraction, intent categorization, token parsing',
    icon: Sparkles,
    color: '#38BDF8',
  },
  {
    step: '03',
    title: 'CUSTOMER & ORDER CONTEXT',
    desc: 'Real-time lookup in CRM 360, Order telematics & carrier SLAs',
    icon: Database,
    color: '#0284C7',
  },
  {
    step: '04',
    title: 'POLICY ENGINE',
    desc: 'Deterministic SLA checks, return window validation, refund caps',
    icon: FileCheck,
    color: '#60A5FA',
  },
  {
    step: '05',
    title: 'RISK ENGINE',
    desc: 'Fraud probability heuristics, trust scoring, AML guardrails',
    icon: ShieldAlert,
    color: '#F59E0B',
  },
  {
    step: '06',
    title: 'DECISION ENGINE',
    desc: 'Deterministic outcome: Auto-Resolve vs. Human Escalation',
    icon: Cpu,
    color: '#A78BFA',
  },
  {
    step: '07',
    title: 'ACTION EXECUTION',
    desc: 'Idempotent dispatch to Payments Gateway or Logistics Ledger',
    icon: Zap,
    color: '#10B981',
  },
  {
    step: '08',
    title: 'GATEWAY VERIFICATION',
    desc: 'Independent reconciliation of bank receipt & status confirmation',
    icon: CheckCircle2,
    color: '#34D399',
  },
  {
    step: '09',
    title: 'CUSTOMER COMMS & AUDIT',
    desc: 'Instant customer push & tamper-proof cryptographic audit log',
    icon: Send,
    color: '#00BAF2',
  },
];

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#050C1B] border border-[#00BAF2]/30 shadow-[0_0_60px_rgba(0,186,242,0.25)] p-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#00BAF2]" />
              <h2 className="text-base font-bold font-mono tracking-wider text-white">
                HOW PAYTM AUTOPILOT OPERATES
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              End-to-end deterministic autonomous customer operations architecture
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pipeline Diagram */}
        <div className="my-6 space-y-3">
          {STAGES.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="relative">
                <div className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-[#00BAF2]/40 transition-all">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `${s.color}15`,
                      border: `1px solid ${s.color}40`,
                      color: s.color,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-400">
                        {s.step}
                      </span>
                      <span className="text-xs font-bold font-mono text-white tracking-wide">
                        {s.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{s.desc}</p>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950 text-[10px] font-mono text-[#00BAF2] border border-slate-800">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>DETERMINISTIC</span>
                  </div>
                </div>

                {/* Arrow connector */}
                {idx < STAGES.length - 1 && (
                  <div className="w-0.5 h-3 bg-gradient-to-b from-[#00BAF2]/50 to-transparent mx-auto my-0.5" />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Principles */}
        <div className="p-4 rounded-xl bg-[#002970]/30 border border-[#00BAF2]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-300">
            <strong className="text-[#00BAF2] font-mono block text-[11px]">
              AUTONOMY PRINCIPLE:
            </strong>
            &ldquo;Autonomy isn&apos;t about acting on everything. It&apos;s about knowing what can be handled — and when a human should take over.&rdquo;
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#00BAF2] hover:bg-[#0082c8] text-slate-950 font-bold text-xs font-mono transition-colors whitespace-nowrap cursor-pointer"
          >
            GOT IT
          </button>
        </div>
      </div>
    </div>
  );
};
