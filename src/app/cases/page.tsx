'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/supabase/client';
import { Case, PriorityLevel, RiskLevel, CaseStatus } from '@/lib/types';
import {
  Layers,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export default function CasesPage() {
  const allCases = db.getCases();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  const filteredCases = allCases.filter((c) => {
    const matchesSearch =
      c.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.intent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.orderNumber && c.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesRisk = riskFilter === 'ALL' || c.risk === riskFilter;

    return matchesSearch && matchesStatus && matchesRisk;
  });

  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            RESOLVED
          </span>
        );
      case 'ESCALATED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-300 border border-red-500/40">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            ESCALATED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
            INVESTIGATING
          </span>
        );
    }
  };

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'HIGH':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950/60 text-red-400 border border-red-800/40">
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/60 text-amber-400 border border-amber-800/40">
            MED
          </span>
        );
      default:
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
            LOW
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 p-4 lg:p-6 max-w-[1920px] mx-auto w-full space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#00BAF2]" />
            <h1 className="text-lg font-bold font-mono tracking-wide text-white">
              AUTONOMOUS CASES REGISTRY
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit-grade repository of all inbound customer requests, policy decisions, and verified resolutions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            TOTAL CASES: {allCases.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-900/50 p-3 rounded-xl border border-slate-800">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Case ID, Customer, Order..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <span>STATUS:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">ALL</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="ESCALATED">ESCALATED</option>
              <option value="INVESTIGATING">INVESTIGATING</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <span>RISK:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">ALL</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 font-mono text-[11px] text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Case / ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Intent</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Risk</th>
                <th className="py-3 px-4">Policy Decision</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredCases.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                    <Link
                      href={`/cases/${c.id}`}
                      className="hover:underline flex items-center gap-1"
                    >
                      {c.ticketNumber}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-200">{c.customerName}</div>
                    <span className="text-[10px] font-mono text-cyan-400/80 uppercase">
                      {c.customerTier}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 max-w-[200px] truncate">
                    {c.intent}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {c.orderNumber || '—'}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-200">
                    ₹{c.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4">{getRiskBadge(c.risk)}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                    {c.decision}
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(c.status)}</td>
                  <td className="py-3 px-4">
                    {c.verificationStatus === 'VERIFIED' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        VERIFIED
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500">
                        {c.verificationStatus}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/cases/${c.id}`}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 group-hover:bg-cyan-950 group-hover:border-cyan-500/40 group-hover:text-cyan-300 border border-slate-700 text-slate-300 transition-all text-[11px] font-mono"
                    >
                      <span>INSPECT</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
