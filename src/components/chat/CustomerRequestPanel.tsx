'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { soundFx } from '@/lib/soundEffects';
import {
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  Package,
  RotateCcw,
  CreditCard,
  AlertTriangle,
} from 'lucide-react';

export const CustomerRequestPanel: React.FC = () => {
  const [state, store] = useAppStore();
  const [inputMessage, setInputMessage] = useState('');

  const activeCase = state.activeCase;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || state.isExecuting) return;

    // Detect scenario based on input
    const lower = inputMessage.toLowerCase();
    if (lower.includes('damage') || lower.includes('broken')) {
      store.runScenario('damaged_product', inputMessage);
      soundFx.playAction();
    } else if (
      lower.includes('unauthorized') ||
      lower.includes('fraud') ||
      lower.includes('50,000') ||
      lower.includes('hacked')
    ) {
      store.runScenario('high_risk', inputMessage);
      soundFx.playEscalation();
    } else {
      store.runScenario('delayed_order', inputMessage);
      soundFx.playAction();
    }

    setInputMessage('');
  };

  const quickScenarios = [
    {
      id: 'delayed_order',
      label: 'Delayed Order',
      prompt: "My order hasn't arrived and I want a refund.",
      icon: Package,
      badge: 'Auto Refund',
      color: 'border-[#00BAF2]/40 text-[#00BAF2] hover:bg-[#002970]/40',
      action: () => {
        store.runScenario('delayed_order');
        soundFx.playAction();
      },
    },
    {
      id: 'damaged_product',
      label: 'Damaged Product',
      prompt: 'The product I received is damaged. I want a replacement.',
      icon: RotateCcw,
      badge: 'Auto Swap',
      color: 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/40',
      action: () => {
        store.runScenario('damaged_product');
        soundFx.playAction();
      },
    },
    {
      id: 'duplicate_payment',
      label: 'Duplicate Payment',
      prompt: 'I was charged twice for order ORD8842. Please reverse the duplicate.',
      icon: CreditCard,
      badge: 'Payment Check',
      color: 'border-sky-500/40 text-sky-300 hover:bg-sky-950/40',
      action: () => {
        store.runScenario('delayed_order', 'I was charged twice for order ORD8842. Please reverse the duplicate.');
        soundFx.playAction();
      },
    },
    {
      id: 'unauthorized_tx',
      label: 'High-Risk Dispute',
      prompt: 'I think someone made an unauthorized ₹50,000 transaction.',
      icon: AlertTriangle,
      badge: 'Human Escalate',
      color: 'border-red-500/40 text-red-400 hover:bg-red-950/40',
      action: () => {
        store.runScenario('high_risk');
        soundFx.playEscalation();
      },
    },
  ];

  return (
    <div className="flex flex-col h-full rounded-xl bg-slate-900/60 border border-slate-800/80 p-4 shadow-xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00BAF2]" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            CUSTOMER REQUEST INTAKE
          </h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
          CHANNEL: WEB_INTAKE (SIMULATED)
        </span>
      </div>

      {/* Quick Action Scenario Pills */}
      <div className="pt-3 pb-2">
        <div className="text-[10px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
          FAST WORKFLOW INJECTION
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {quickScenarios.map((sc) => {
            const Icon = sc.icon;
            return (
              <button
                key={sc.id}
                type="button"
                disabled={state.isExecuting}
                onClick={sc.action}
                className={`p-2 rounded-lg border bg-slate-950/60 text-left transition-all cursor-pointer disabled:opacity-50 ${sc.color}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-mono opacity-80">{sc.badge}</span>
                </div>
                <div className="text-[11px] font-medium leading-tight truncate">
                  {sc.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Active Interaction Box */}
      <div className="my-2 flex-1 rounded-lg bg-slate-950/70 border border-slate-800/60 p-3.5 flex flex-col justify-between overflow-y-auto min-h-[160px]">
        {activeCase ? (
          <div className="space-y-3">
            {/* Customer Message Bubble */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-slate-400">
                CUSTOMER ({activeCase.customerName || 'Inbound User'}):
              </span>
              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-200">
                {activeCase.customerMessage || "My order hasn't arrived and I want a refund."}
              </div>
            </div>

            {/* Paytm Autopilot Operational Response */}
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#00BAF2] flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3 h-3 text-[#00BAF2]" />
                  PAYTM AUTOPILOT OUTCOME:
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                    activeCase.status === 'RESOLVED'
                      ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                      : activeCase.status === 'ESCALATED'
                      ? 'bg-red-950 border border-red-500/50 text-red-300'
                      : 'bg-[#002970] border border-[#00BAF2]/50 text-[#00BAF2] animate-pulse'
                  }`}
                >
                  {activeCase.status}
                </span>
              </div>

              <div
                className={`p-3 rounded-lg border text-xs leading-relaxed transition-all ${
                  activeCase.status === 'RESOLVED'
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
                    : activeCase.status === 'ESCALATED'
                    ? 'bg-red-950/30 border-red-500/40 text-red-100'
                    : 'bg-slate-900/90 border-slate-700/80 text-slate-300'
                }`}
              >
                {state.isExecuting ? (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00BAF2] animate-ping" />
                    <span className="font-mono text-xs text-[#00BAF2]">
                      {state.statusMessage}...
                    </span>
                  </div>
                ) : (
                  <div>
                    <p>{activeCase.aiResponse || activeCase.resolution}</p>
                    {activeCase.verificationDetails?.confirmed && (
                      <div className="mt-2 pt-2 border-t border-emerald-500/30 flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          VERIFIED GATEWAY REF:{' '}
                          <strong className="text-emerald-200">
                            {activeCase.verificationDetails.gatewayRefId}
                          </strong>
                        </span>
                      </div>
                    )}
                    {activeCase.status === 'ESCALATED' && (
                      <div className="mt-2 pt-2 border-t border-red-500/30 flex items-center gap-2 text-[10px] font-mono text-red-400">
                        <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                        <span>
                          TRANSFERRED TO SPECIALIST ESCALATION CENTER (Supervisor Notified)
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-500">
            <Package className="w-8 h-8 mb-2 opacity-40 text-[#00BAF2]" />
            <p className="text-xs">No active request in progress.</p>
            <p className="text-[10px] mt-1 text-slate-400">
              Type an issue or click a workflow injection button above.
            </p>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative mt-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={state.isExecuting}
          placeholder="Describe your issue and let Paytm Autopilot handle it..."
          className="w-full pl-3.5 pr-10 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00BAF2]/80 focus:ring-1 focus:ring-[#00BAF2]/80 transition-all font-sans disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || state.isExecuting}
          className="absolute right-1.5 top-1.5 p-1.5 rounded-md bg-[#00BAF2] hover:bg-[#0082c8] text-slate-950 disabled:opacity-40 transition-colors cursor-pointer"
        >
          {state.isExecuting ? (
            <span className="w-3.5 h-3.5 block border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </button>
      </form>
    </div>
  );
};
