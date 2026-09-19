'use client';

import React, { useState } from 'react';
import { db } from '@/lib/supabase/client';
import { Customer } from '@/lib/types';
import {
  Users,
  Search,
  ShieldAlert,
  ShieldCheck,
  Star,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

export default function CustomersPage() {
  const customers = db.getCustomers();
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);

    const matchesTier = tierFilter === 'ALL' || c.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const getTierBadge = (tier: Customer['tier']) => {
    switch (tier) {
      case 'enterprise':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/50">
            ENTERPRISE
          </span>
        );
      case 'platinum':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/50">
            PLATINUM
          </span>
        );
      case 'gold':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500/50">
            GOLD
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
            STANDARD
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
            <Users className="w-5 h-5 text-[#00BAF2]" />
            <h1 className="text-lg font-bold font-mono tracking-wide text-white">
              CUSTOMER 360 DIRECTORY
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time customer risk profiles, verified trust scoring, and historical transaction telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            REGISTERED PROFILES: {customers.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/50 p-3 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, email, ID..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>TIER:</span>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-2.5 py-1 rounded bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">ALL TIERS</option>
            <option value="enterprise">ENTERPRISE</option>
            <option value="platinum">PLATINUM</option>
            <option value="gold">GOLD</option>
            <option value="standard">STANDARD</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 font-mono text-[11px] text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4">Trust Score</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Refunds</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredCustomers.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4 font-mono text-cyan-400 font-medium">
                    {c.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200">{c.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {c.email}
                    </div>
                  </td>
                  <td className="py-3 px-4">{getTierBadge(c.tier)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400"
                          style={{ width: `${c.trustScore}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-emerald-400 text-xs">
                        {c.trustScore}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-mono font-bold ${
                        c.riskScore > 50
                          ? 'text-red-400'
                          : c.riskScore > 20
                          ? 'text-amber-400'
                          : 'text-slate-300'
                      }`}
                    >
                      {c.riskScore}/100
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-200">
                    {c.totalOrders}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-200">
                    ₹{c.totalSpent.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {c.lifetimeRefunds}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {c.status === 'flagged' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-300 border border-red-500/50">
                        <AlertTriangle className="w-3 h-3 text-red-400" />
                        FLAGGED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/50">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        ACTIVE
                      </span>
                    )}
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
