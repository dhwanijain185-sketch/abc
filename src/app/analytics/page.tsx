'use client';

import React, { useState } from 'react';
import { db } from '@/lib/supabase/client';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

export default function AnalyticsPage() {
  const cases = db.getCases();
  const escalations = db.getEscalations();

  const totalCases = cases.length;
  const resolved = cases.filter((c) => c.status === 'RESOLVED').length;
  const escalated = escalations.length;
  const autoResolved = cases.filter(
    (c) => c.status === 'RESOLVED' && c.decision === 'AUTO_RESOLVE'
  ).length;

  const automationRate = totalCases > 0 ? (autoResolved / totalCases) * 100 : 88.4;
  const verificationRate = 100;

  // Chart 1: Case Volume Over Time
  const volumeData = [
    { date: 'Sep 12', autonomous: 14, human: 2 },
    { date: 'Sep 13', autonomous: 19, human: 3 },
    { date: 'Sep 14', autonomous: 24, human: 2 },
    { date: 'Sep 15', autonomous: 31, human: 4 },
    { date: 'Sep 16', autonomous: 28, human: 3 },
    { date: 'Sep 17', autonomous: 36, human: 5 },
    { date: 'Sep 18', autonomous: 42, human: 4 },
  ];

  // Chart 2: Intent Distribution
  const intentData = [
    { name: 'Delayed Order', count: 18, fill: '#06B6D4' },
    { name: 'Damaged Item', count: 11, fill: '#10B981' },
    { name: 'Payment Issue', count: 7, fill: '#8B5CF6' },
    { name: 'Fraud Dispute', count: 4, fill: '#EF4444' },
    { name: 'Product Tech Info', count: 5, fill: '#3B82F6' },
  ];

  // Chart 3: Autonomous vs Human Resolution
  const resolutionData = [
    { name: 'Autonomous Verified', value: autoResolved || 32, color: '#10B981' },
    { name: 'Human Supervisor', value: escalated || 4, color: '#EF4444' },
  ];

  // Chart 4: Resolution Time (Seconds) by Intent
  const resolutionTimeData = [
    { intent: 'Delayed Order', timeSeconds: 11.2 },
    { intent: 'Damaged Item', timeSeconds: 14.6 },
    { intent: 'Payment Check', timeSeconds: 9.8 },
    { intent: 'Dispute Review', timeSeconds: 22.4 },
    { intent: 'General FAQ', timeSeconds: 4.1 },
  ];

  // Chart 5: Escalation Reasons
  const escalationReasons = [
    { reason: 'Exceeded ₹5K Limit', count: 12 },
    { reason: 'Fraud / Geofence Anomaly', count: 8 },
    { reason: 'Policy Return Window Expired', count: 5 },
    { reason: 'Customer Trust Score < 65', count: 4 },
  ];

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 p-4 lg:p-6 max-w-[1920px] mx-auto w-full space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#00BAF2]" />
            <h1 className="text-lg font-bold font-mono tracking-wide text-white">
              AUTONOMY PERFORMANCE TELEMETRY
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical telemetry on autonomous decision rates, verification velocity, and safe human handoff ratio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/50 text-amber-300 font-mono text-xs font-semibold">
            SIMULATED DATA
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300">
            INTERVAL: LAST 7 DAYS
          </span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block">TOTAL CASES</span>
          <span className="text-xl font-mono font-bold text-white mt-1 block">
            {totalCases}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block">RESOLVED</span>
          <span className="text-xl font-mono font-bold text-emerald-400 mt-1 block">
            {resolved}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block">ESCALATED</span>
          <span className="text-xl font-mono font-bold text-red-400 mt-1 block">
            {escalated}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block">AUTOMATION RATE</span>
          <span className="text-xl font-mono font-bold text-cyan-400 mt-1 block">
            {automationRate.toFixed(1)}%
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block">AVG RESOLUTION</span>
          <span className="text-xl font-mono font-bold text-sky-400 mt-1 block">
            12.4s
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block">ACTION SUCCESS</span>
          <span className="text-xl font-mono font-bold text-purple-400 mt-1 block">
            98.6%
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 block">VERIFICATION RATE</span>
          <span className="text-xl font-mono font-bold text-emerald-400 mt-1 block">
            100%
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Chart 1: Case Volume Over Time (7 cols) */}
        <div className="lg:col-span-7 p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-200">
              CASE VOLUME OVER TIME (DAILY BREAKDOWN)
            </span>
            <span className="text-[10px] font-mono text-cyan-400">TREND: +28%</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorAuto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorHuman" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" textAnchor="end" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="autonomous"
                  name="Autonomous Resolved"
                  stroke="#06B6D4"
                  fillOpacity={1}
                  fill="url(#colorAuto)"
                />
                <Area
                  type="monotone"
                  dataKey="human"
                  name="Human Escalated"
                  stroke="#EF4444"
                  fillOpacity={1}
                  fill="url(#colorHuman)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Autonomous vs Human Donut (5 cols) */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-200">
              AUTONOMOUS VS HUMAN RESOLUTION
            </span>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resolutionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {resolutionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Intent Distribution & Resolution Time by Intent */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Intent Distribution */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-200">
              CASES BY INTENT CATEGORY
            </span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis dataKey="name" type="category" stroke="#64748b" width={110} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="count" name="Case Count" fill="#06B6D4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Escalation Reasons */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-200">
              ESCALATION REASON DISTRIBUTION
            </span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={escalationReasons} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis dataKey="reason" type="category" stroke="#64748b" width={130} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="count" name="Escalation Count" fill="#EF4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
