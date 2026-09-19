'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { POLICY_CONFIG } from '@/lib/constants';
import { sendCustomerRequestToN8N } from '@/lib/n8n/client';
import {
  Settings,
  Radio,
  Sliders,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Loader2,
  Server,
  Database,
  Lock,
} from 'lucide-react';

export default function SettingsPage() {
  const [state, store] = useAppStore();
  const [webhookInput, setWebhookInput] = useState(state.webhookUrl || '');
  const [pingStatus, setPingStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [pingMessage, setPingMessage] = useState<string | null>(null);

  // Policy Threshold state
  const [maxRefund, setMaxRefund] = useState(POLICY_CONFIG.MAX_AUTO_REFUND_AMOUNT);
  const [minTrust, setMinTrust] = useState(POLICY_CONFIG.MIN_TRUST_SCORE_FOR_AUTO);
  const [maxFraud, setMaxFraud] = useState(POLICY_CONFIG.MAX_FRAUD_RISK_SCORE);
  const [savedPolicy, setSavedPolicy] = useState(false);

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    store.setWebhookUrl(webhookInput.trim());
    setPingMessage('Webhook URL saved to local configuration.');
    setTimeout(() => setPingMessage(null), 2500);
  };

  const handleTestPing = async () => {
    setPingStatus('testing');
    setPingMessage('Sending health test payload to n8n webhook...');

    const res = await sendCustomerRequestToN8N(
      {
        request_id: 'HEALTH-CHECK-PING',
        message: 'System Ping Health Check',
      },
      webhookInput || state.webhookUrl
    );

    if (res.success) {
      setPingStatus('success');
      setPingMessage('Webhook responded successfully! Ready for live execution.');
    } else {
      setPingStatus('failed');
      setPingMessage(res.error || 'Failed to reach webhook endpoint. Check URL or CORS.');
    }
  };

  const handleSavePolicies = (e: React.FormEvent) => {
    e.preventDefault();
    POLICY_CONFIG.MAX_AUTO_REFUND_AMOUNT = maxRefund;
    POLICY_CONFIG.MIN_TRUST_SCORE_FOR_AUTO = minTrust;
    POLICY_CONFIG.MAX_FRAUD_RISK_SCORE = maxFraud;
    setSavedPolicy(true);
    setTimeout(() => setSavedPolicy(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 p-4 lg:p-6 max-w-[1920px] mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#00BAF2]" />
            <h1 className="text-lg font-bold font-mono tracking-wide text-white">
              SYSTEM CONFIGURATION & POLICY ENGINE
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure dual execution runtime, external n8n automation webhooks, and deterministic financial boundaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            SECURITY PROFILE: ENTERPRISE ZERO-LEAKAGE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (6 cols): Runtime & Webhook settings */}
        <div className="lg:col-span-6 space-y-4">
          {/* Execution Mode Card */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-3 shadow-xl">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Radio className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                EXECUTION RUNTIME MODE
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => store.setMode('DEMO')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  state.mode === 'DEMO'
                    ? 'bg-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-950/20'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-mono font-bold text-amber-300 block mb-1">
                  ● DEMO ENVIRONMENT
                </span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Self-contained deterministic simulation with realistic delays and offline multi-step execution. Ideal for stage presentations.
                </p>
              </button>

              <button
                type="button"
                onClick={() => store.setMode('LIVE')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  state.mode === 'LIVE'
                    ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/20'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-mono font-bold text-emerald-300 block mb-1">
                  ● LIVE MODE (N8N)
                </span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Dispatches requests directly to live n8n webhook URL via HTTP POST. Validates structured response contract.
                </p>
              </button>
            </div>
          </div>

          {/* n8n Webhook Configuration */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  N8N AUTOMATION WEBHOOK
                </h2>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                POST CONTRACT V1
              </span>
            </div>

            <form onSubmit={handleSaveWebhook} className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">
                  WEBHOOK ENDPOINT URL
                </label>
                <input
                  type="url"
                  value={webhookInput}
                  onChange={(e) => setWebhookInput(e.target.value)}
                  placeholder="https://your-n8n.cloud/webhook/resolveai/customer-request"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  Save Webhook URL
                </button>

                <button
                  type="button"
                  onClick={handleTestPing}
                  disabled={pingStatus === 'testing'}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {pingStatus === 'testing' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : pingStatus === 'success' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : pingStatus === 'failed' ? (
                    <XCircle className="w-3.5 h-3.5 text-red-400" />
                  ) : null}
                  <span>Test Connection Ping</span>
                </button>
              </div>

              {pingMessage && (
                <div
                  className={`p-2.5 rounded-lg text-xs font-mono border ${
                    pingStatus === 'success'
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                      : pingStatus === 'failed'
                      ? 'bg-red-950/60 border-red-500/50 text-red-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  {pingMessage}
                </div>
              )}
            </form>
          </div>

          {/* Reset Demo Data Card */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm flex items-center justify-between">
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-200">
                RESET SIMULATED DATA
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Re-seeds local storage with 20 customers, 30 orders, and default cases.
              </p>
            </div>
            <button
              onClick={() => {
                store.resetDemo();
                setPingMessage('Demo data restored to initial factory seed.');
                setTimeout(() => setPingMessage(null), 2500);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-200 text-xs font-mono font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>

        {/* Right Column (6 cols): Deterministic Business Policies */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  DETERMINISTIC POLICY THRESHOLDS
                </h2>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">
                GUARDRAILS ENFORCED
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Financial and risk actions are governed by deterministic code rules. The AI teammate may recommend an outcome, but cannot execute unless these thresholds are satisfied.
            </p>

            <form onSubmit={handleSavePolicies} className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">MAX AUTO-REFUND AMOUNT (INR)</span>
                  <span className="text-cyan-400 font-bold">₹{maxRefund.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={25000}
                  step={500}
                  value={maxRefund}
                  onChange={(e) => setMaxRefund(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <span className="text-[10px] text-slate-500">
                  Requests exceeding this limit automatically route to Human Escalation Center.
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">MIN CUSTOMER TRUST SCORE</span>
                  <span className="text-emerald-400 font-bold">{minTrust} / 100</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={90}
                  step={5}
                  value={minTrust}
                  onChange={(e) => setMinTrust(Number(e.target.value))}
                  className="w-full accent-emerald-400"
                />
                <span className="text-[10px] text-slate-500">
                  Customers with trust scores below this value require supervisor review.
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-300">MAX FRAUD RISK TOLERANCE</span>
                  <span className="text-amber-400 font-bold">{maxFraud} / 100</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={60}
                  step={5}
                  value={maxFraud}
                  onChange={(e) => setMaxFraud(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
                <span className="text-[10px] text-slate-500">
                  Risk engine score cap before halting autonomous financial payout.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-bold text-slate-200 transition-colors cursor-pointer"
                >
                  {savedPolicy ? 'Policy Thresholds Updated ✓' : 'Update Policy Guardrails'}
                </button>
              </div>
            </form>
          </div>

          {/* Enterprise Security Architecture Guarantee */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-[11px]">
              <Lock className="w-3.5 h-3.5" />
              <span>SECURITY & PRIVACY GUARANTEE</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              No private API keys, Supabase service-role secrets, or LLM keys are ever exposed in client bundles. All communications adhere to the deterministic contract specification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
