'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAppStore } from '@/lib/store/useAppStore';
import { soundFx } from '@/lib/soundEffects';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  X,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface ShowcaseModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShowcaseMode: React.FC<ShowcaseModeProps> = ({
  isOpen,
  onClose,
}) => {
  const [state, store] = useAppStore();
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [activeStage, setActiveStage] = useState<'intro' | 'scenario_1' | 'scenario_2' | 'conclusion'>('intro');

  useEffect(() => {
    if (isOpen) {
      setStepIndex(0);
      setActiveStage('intro');
      soundFx.playBoot();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartScenario1 = () => {
    setActiveStage('scenario_1');
    store.runScenario('delayed_order');
    soundFx.playAction();
  };

  const handleStartScenario2 = () => {
    setActiveStage('scenario_2');
    store.runScenario('high_risk');
    soundFx.playEscalation();
  };

  return (
    <div className="fixed inset-0 z-[120] flex flex-col bg-[#030712] text-white select-none overflow-y-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#050B1A]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center">
            <Image
              src="/paytm-logo.png"
              alt="Paytm"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm tracking-wider text-white">
                PAYTM <span className="text-[#00BAF2]">AUTOPILOT</span>
              </span>
              <span className="px-2 py-0.2 rounded text-[9px] font-mono bg-[#002970] text-[#00BAF2] border border-[#00BAF2]/30">
                SHOWCASE MODE 2.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              HACKATHON EXECUTIVE PRESENTATION
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              store.resetDemo();
              setActiveStage('intro');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-mono text-slate-300 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESTART</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-6 flex flex-col justify-center">
        {/* INTRO SCREEN */}
        {activeStage === 'intro' && (
          <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#002970]/50 border border-[#00BAF2]/30 text-[#00BAF2] text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AUTONOMOUS OPERATIONS ENGINE</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-mono">
              FROM CUSTOMER REQUEST<br />
              <span className="text-[#00BAF2]">TO VERIFIED RESOLUTION</span>
            </h1>

            <p className="max-w-xl mx-auto text-sm text-slate-300 leading-relaxed font-sans">
              Experience how Paytm Autopilot operates independently on real customer cases:
              investigating CRM context, checking carrier SLAs, evaluating policies, executing gateway actions,
              and knowing exactly when to pause for human supervision.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-[#00BAF2] font-bold mb-1">
                  <span>SCENARIO 1</span>
                  <span className="text-[10px] text-emerald-400">100% AUTONOMOUS</span>
                </div>
                <h4 className="text-sm font-semibold text-white">Delayed Order & Auto-Refund</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Breaches 48h SLA. Autopilot verifies identity, confirms delay, executes ₹2,499 refund, and validates gateway receipt.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold mb-1">
                  <span>SCENARIO 2</span>
                  <span className="text-[10px] text-red-400">HUMAN-IN-THE-LOOP</span>
                </div>
                <h4 className="text-sm font-semibold text-white">High-Risk Fraud Dispute</h4>
                <p className="text-xs text-slate-400 mt-1">
                  ₹50,000 dispute exceeds autonomous safety threshold. Autopilot pauses execution and routes directly to human specialist.
                </p>
              </div>
            </div>

            <button
              onClick={handleStartScenario1}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00BAF2] hover:bg-[#0082c8] text-slate-950 font-bold font-mono text-sm tracking-wide shadow-[0_0_25px_rgba(0,186,242,0.4)] transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>START DEMONSTRATION</span>
            </button>
          </div>
        )}

        {/* SCENARIO 1 RUNNER: DELAYED ORDER */}
        {activeStage === 'scenario_1' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-[#00BAF2] font-bold">
                  DEMONSTRATION 1 / 2
                </span>
                <h2 className="text-xl font-bold font-mono text-white mt-0.5">
                  Delayed Order: Autonomous Payout & Verification
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-950 border border-emerald-500/50 text-emerald-300">
                STATUS: {state.isExecuting ? 'EXECUTING AUTONOMOUSLY' : 'RESOLVED & VERIFIED'}
              </span>
            </div>

            {/* Execution Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Customer Intake */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 block">
                  INBOUND CUSTOMER STATEMENT
                </span>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200">
                  &ldquo;My order hasn&apos;t arrived. Please refund me.&rdquo;
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Customer: Rahul Sharma (Gold Tier) • Order: ORD8842
                </div>
              </div>

              {/* Policy & Risk Decision */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 block">
                  DETERMINISTIC EVALUATION
                </span>
                <div className="text-xs space-y-1 font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Carrier SLA Delay:</span>
                    <span className="text-amber-400 font-bold">+5 Days</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Policy Rule:</span>
                    <span className="text-[#00BAF2]">POL-402 Pass</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Fraud Risk Score:</span>
                    <span className="text-emerald-400">12/100 (Safe)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Authorized Action:</span>
                    <span className="text-emerald-400 font-bold">100% Refund</span>
                  </div>
                </div>
              </div>

              {/* Gateway Outcome */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 block">
                  GATEWAY RECEIPT
                </span>
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>₹2,499 Payout Reconciled</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-300">
                    REFUND ID: {state.activeCase?.refundId || 'REF-PAYTM-8842'}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    GATEWAY REF: BANK-SETTLE-OK
                  </div>
                </div>
              </div>
            </div>

            {/* Live Progress Bar */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span>{state.statusMessage}</span>
                <span>{Math.round(state.progress)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00BAF2] to-emerald-400 transition-all duration-300"
                  style={{ width: `${state.progress}%` }}
                />
              </div>
            </div>

            {/* Bottom Actions */}
            {!state.isExecuting && (
              <div className="pt-4 flex items-center justify-between">
                <div className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Autonomous resolution complete with zero manual intervention.</span>
                </div>
                <button
                  onClick={handleStartScenario2}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all"
                >
                  <span>NEXT: TEST HIGH-RISK SAFETY MECHANISM</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* SCENARIO 2 RUNNER: HIGH-RISK HUMAN-IN-THE-LOOP */}
        {activeStage === 'scenario_2' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  DEMONSTRATION 2 / 2
                </span>
                <h2 className="text-xl font-bold font-mono text-white mt-0.5">
                  High-Risk Dispute: Safe Autonomy Pause & Human Escalation
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-red-950 border border-red-500/50 text-red-300">
                STATUS: {state.isExecuting ? 'INVESTIGATING' : 'AUTONOMY PAUSED — HUMAN REVIEW'}
              </span>
            </div>

            {/* Risk Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 block">
                  DISPUTE DETAILS
                </span>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200">
                  &ldquo;I think someone made an unauthorized ₹50,000 transaction on my account.&rdquo;
                </div>
                <div className="text-[11px] font-mono text-red-400 font-bold">
                  AMOUNT: ₹50,000 (Exceeds ₹5,000 Auto-Refund Limit)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-red-300 font-bold">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>SAFETY GUARDRAIL TRIGGERED</span>
                </div>
                <p className="text-xs text-slate-300">
                  Risk Heuristic POL-801: Transaction amount requires manual supervisor verification and bank ledger fraud freeze.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      soundFx.playVerified();
                      setActiveStage('conclusion');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold font-mono"
                  >
                    APPROVE AFTER VERIFICATION
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playAction();
                      setActiveStage('conclusion');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono"
                  >
                    REQUEST IDENTITY PROOF
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            {!state.isExecuting && (
              <div className="pt-4 flex items-center justify-between">
                <div className="text-xs text-slate-400 font-mono">
                  Autonomous actions halted to prevent unauthorized capital loss.
                </div>
                <button
                  onClick={() => setActiveStage('conclusion')}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#00BAF2] text-slate-950 font-bold font-mono text-xs cursor-pointer"
                >
                  <span>VIEW EXECUTIVE TAKEAWAYS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* CONCLUSION SCREEN */}
        {activeStage === 'conclusion' && (
          <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-2xl bg-white p-3 mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(0,186,242,0.4)]">
              <Image
                src="/paytm-logo.png"
                alt="Paytm"
                width={50}
                height={50}
                className="object-contain"
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono tracking-widest text-[#00BAF2] uppercase">
                THE PAYTM AUTOPILOT THESIS
              </span>
              <h2 className="text-2xl md:text-3xl font-bold font-mono text-white max-w-2xl mx-auto leading-tight">
                &ldquo;Autonomy isn&apos;t about acting on everything. It&apos;s about knowing what can be handled — and when a human should take over.&rdquo;
              </h2>
            </div>

            <div className="max-w-2xl mx-auto grid grid-cols-3 gap-3 text-left">
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-[10px] font-mono text-[#00BAF2] block">01 INTENT</span>
                <div className="text-xs font-bold text-white mt-1">Deep Telematics</div>
                <p className="text-[10px] text-slate-400 mt-0.5">Integrates CRM, bank ledgers & delivery telemetry.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-[10px] font-mono text-emerald-400 block">02 EXECUTION</span>
                <div className="text-xs font-bold text-white mt-1">Verified Gateway</div>
                <p className="text-[10px] text-slate-400 mt-0.5">Zero blind actions. Validates bank receipts.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-[10px] font-mono text-amber-400 block">03 SAFETY</span>
                <div className="text-xs font-bold text-white mt-1">Deterministic Guards</div>
                <p className="text-[10px] text-slate-400 mt-0.5">Enforces caps, fraud models & human review.</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  store.resetDemo();
                  setActiveStage('intro');
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-mono text-slate-300 hover:text-white"
              >
                REPLAY SHOWCASE
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#00BAF2] hover:bg-[#0082c8] text-slate-950 font-bold font-mono text-xs cursor-pointer shadow-[0_0_20px_rgba(0,186,242,0.4)]"
              >
                RETURN TO COMMAND CENTER
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
