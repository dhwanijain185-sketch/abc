'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  User,
  ShoppingBag,
  CreditCard,
  FileCheck,
  Zap,
  CheckCircle2,
  ChevronRight,
  Database,
  History,
  ShieldCheck,
} from 'lucide-react';

export const CaseDigitalTwin: React.FC = () => {
  const [state] = useAppStore();
  const c = state.activeCase;
  const [activeTab, setActiveTab] = useState<'twin' | 'context'>('twin');
  const [selectedTwinNode, setSelectedTwinNode] = useState<string>('ORDER');

  const twinSteps = [
    {
      id: 'CUSTOMER',
      label: 'CUSTOMER',
      sub: c?.customerName || 'Rahul Sharma',
      desc: `Tier: ${c?.customerTier?.toUpperCase() || 'GOLD'} • Trust Score: 89/100 • KYC: Complete`,
      icon: User,
      color: 'text-[#00BAF2]',
    },
    {
      id: 'ORDER',
      label: 'ORDER',
      sub: c?.orderNumber || 'ORD8842',
      desc: `Product: ${c?.productName || 'Smart Soundbox Gen 3'} • Courier: BlueDart • SLA: Breached (+5d)`,
      icon: ShoppingBag,
      color: 'text-sky-400',
    },
    {
      id: 'TRANSACTION',
      label: 'TRANSACTION',
      sub: `₹${c?.amount?.toLocaleString('en-IN') || '2,499'}`,
      desc: 'Method: Paytm UPI • Gateway Ref: TXN_884290 • Status: Capture Settled',
      icon: CreditCard,
      color: 'text-indigo-400',
    },
    {
      id: 'POLICY',
      label: 'POLICY',
      sub: 'POL-402 Pass',
      desc: 'Rule: Unfulfilled Delivery Breach SLA > 48 Hours. Auto-reversal permitted within ₹5,000 threshold.',
      icon: FileCheck,
      color: 'text-purple-400',
    },
    {
      id: 'ACTION',
      label: 'ACTION',
      sub: c?.currentAction || 'CREATE_REFUND',
      desc: 'Payload dispatched to Paytm Settlement Node. Idempotency Key: IDEM-PAYTM-8842.',
      icon: Zap,
      color: 'text-emerald-400',
    },
    {
      id: 'VERIFICATION',
      label: 'VERIFICATION',
      sub: c?.verificationStatus || 'VERIFIED',
      desc: 'Bank gateway callback received & validated. Reconciled in Paytm Ledger.',
      icon: CheckCircle2,
      color: 'text-emerald-300',
    },
  ];

  return (
    <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-4 backdrop-blur-sm shadow-xl flex flex-col justify-between">
      {/* Header with Tab Switcher */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#00BAF2]" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              {activeTab === 'twin' ? 'CASE DIGITAL TWIN' : 'SIMULATED CUSTOMER CONTEXT'}
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px] font-mono">
            <button
              onClick={() => setActiveTab('twin')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                activeTab === 'twin' ? 'bg-[#002970] text-[#00BAF2] font-bold' : 'text-slate-400'
              }`}
            >
              DIGITAL TWIN
            </button>
            <button
              onClick={() => setActiveTab('context')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                activeTab === 'context' ? 'bg-[#002970] text-[#00BAF2] font-bold' : 'text-slate-400'
              }`}
            >
              CUSTOMER CONTEXT
            </button>
          </div>
        </div>

        {/* TAB 1: DIGITAL TWIN PATHWAY */}
        {activeTab === 'twin' && (
          <div className="mt-3 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {twinSteps.map((node) => {
                const Icon = node.icon;
                const isSelected = selectedTwinNode === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedTwinNode(node.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#002970]/70 border-[#00BAF2] shadow-[0_0_12px_rgba(0,186,242,0.3)]'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Icon className={`w-3.5 h-3.5 ${node.color}`} />
                      <span className="text-[8px] font-mono opacity-60">TWIN</span>
                    </div>
                    <div className="text-[10px] font-mono font-bold text-white truncate">
                      {node.label}
                    </div>
                    <div className="text-[9px] font-mono text-[#00BAF2] truncate mt-0.5">
                      {node.sub}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Node Details Box */}
            {selectedTwinNode && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs font-mono">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>TWIN NODE TELEMETRY:</span>
                  <span className="text-[#00BAF2] font-bold">{selectedTwinNode}</span>
                </div>
                <p className="text-slate-200">
                  {twinSteps.find((s) => s.id === selectedTwinNode)?.desc}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SIMULATED CUSTOMER CONTEXT (MEMORY) */}
        {activeTab === 'context' && (
          <div className="mt-3 space-y-3 text-xs font-mono">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[9px] text-slate-500 block">CUSTOMER PROFILE</span>
                <span className="text-white font-bold">{c?.customerName || 'Rahul Sharma'}</span>
                <span className="text-[10px] text-[#00BAF2] block uppercase">{c?.customerTier || 'gold'} Member</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[9px] text-slate-500 block">TRUST / FRAUD SCORE</span>
                <span className="text-emerald-400 font-bold">89 / 100 (Trusted)</span>
                <span className="text-[10px] text-slate-400 block">0 Disputes in 24m</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[9px] text-slate-500 block">LIFETIME VOLUME</span>
                <span className="text-white font-bold">₹48,200</span>
                <span className="text-[10px] text-slate-400 block">14 Fulfilled Orders</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-[9px] text-slate-400 block">RECENT RESOLUTION HISTORY:</span>
              <div className="text-[11px] text-slate-300 flex items-center justify-between">
                <span>REQ-1019: Address update</span>
                <span className="text-emerald-400">Resolved (Auto)</span>
              </div>
              <div className="text-[11px] text-slate-300 flex items-center justify-between">
                <span>REQ-0982: Delivery rescheduling</span>
                <span className="text-emerald-400">Resolved (Auto)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>SIMULATED CUSTOMER CONTEXT (DEMO MOCK ENGINE)</span>
        <span className="text-emerald-400">100% RECONCILED</span>
      </div>
    </div>
  );
};
