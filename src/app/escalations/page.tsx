'use client';

import React, { useState } from 'react';
import { db } from '@/lib/supabase/client';
import { Escalation, PriorityLevel } from '@/lib/types';
import {
  AlertTriangle,
  ShieldAlert,
  UserCheck,
  CheckCircle,
  Clock,
  HelpCircle,
  FileText,
  User,
  Shield,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function EscalationsPage() {
  const [escalations, setEscalations] = useState<Escalation[]>(db.getEscalations());
  const [selectedEscalation, setSelectedEscalation] = useState<Escalation | null>(
    escalations[0] || null
  );
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const refresh = () => {
    const list = db.getEscalations();
    setEscalations(list);
    if (selectedEscalation) {
      const updated = list.find((e) => e.id === selectedEscalation.id);
      setSelectedEscalation(updated || list[0] || null);
    }
  };

  const handleAction = (
    id: string,
    newStatus: Escalation['status'],
    message: string,
    assignee?: string
  ) => {
    db.updateEscalationStatus(id, newStatus, assignee);
    refresh();
    setActionSuccessMessage(message);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const getPriorityBadge = (p: PriorityLevel) => {
    switch (p) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-400 border border-red-500/60">
            CRITICAL PRIORITY
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-400 border border-amber-500/60">
            HIGH PRIORITY
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/60">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
            LOW
          </span>
        );
    }
  };

  const getStatusBadge = (s: Escalation['status']) => {
    switch (s) {
      case 'RESOLVED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/50">
            RESOLVED
          </span>
        );
      case 'ACKNOWLEDGED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-500/50">
            ACKNOWLEDGED
          </span>
        );
      case 'ASSIGNED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/50">
            ASSIGNED
          </span>
        );
      case 'INFO_REQUESTED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500/50">
            INFO REQUESTED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950/80 text-red-300 border border-red-500/40 animate-pulse">
            PENDING REVIEW
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
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <h1 className="text-lg font-bold font-mono tracking-wide text-white">
              HUMAN ESCALATION COMMAND CENTER
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cases deliberately handed off by autonomous AI policy guards requiring supervisor review, authorization, or investigation.
          </p>
        </div>

        {actionSuccessMessage && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Main Two-Column Triage View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Escalation Queue List (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="flex items-center justify-between px-1 text-xs font-mono text-slate-400 uppercase tracking-wider">
            <span>TRIAGE QUEUE ({escalations.length})</span>
            <span>SORT: PRIORITY</span>
          </div>

          <div className="space-y-2">
            {escalations.map((esc) => {
              const isSelected = selectedEscalation?.id === esc.id;
              return (
                <div
                  key={esc.id}
                  onClick={() => setSelectedEscalation(esc)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-950/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-white">
                      #{esc.caseNumber}
                    </span>
                    {getPriorityBadge(esc.priority)}
                  </div>

                  <h3 className="text-xs font-semibold text-slate-200 line-clamp-1">
                    {esc.issue}
                  </h3>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-cyan-400" />
                      {esc.customerName}
                    </span>
                    {getStatusBadge(esc.status)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Escalation Details & Action Console (7 cols) */}
        <div className="lg:col-span-7">
          {selectedEscalation ? (
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-xl space-y-4">
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-cyan-300">
                      CASE: #{selectedEscalation.caseNumber}
                    </span>
                    {getPriorityBadge(selectedEscalation.priority)}
                  </div>
                  <h2 className="text-sm font-bold text-white mt-1">
                    {selectedEscalation.issue}
                  </h2>
                </div>

                <div>{getStatusBadge(selectedEscalation.status)}</div>
              </div>

              {/* Customer & Risk Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">CUSTOMER</span>
                  <span className="font-bold text-slate-200">
                    {selectedEscalation.customerName}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">RISK EVALUATION</span>
                  <span className="font-bold text-red-400">
                    {selectedEscalation.riskLevel} RISK
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 block">ASSIGNED AGENT</span>
                  <span className="text-slate-300 truncate block">
                    {selectedEscalation.assignedTo || 'Unassigned Queue'}
                  </span>
                </div>
              </div>

              {/* AI Diagnostic Investigation Summary */}
              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400 block tracking-wider uppercase">
                  AI INVESTIGATION DOSSIER
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedEscalation.aiSummary}
                </p>
              </div>

              {/* Actions Attempted Checklist */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  ACTIONS ATTEMPTED BEFORE ESCALATION
                </span>
                <div className="space-y-1">
                  {selectedEscalation.actionsAttempted.map((act, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-slate-300"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policy Reason & Recommended Human Action */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/30">
                  <span className="text-[10px] font-mono font-bold text-red-400 block mb-1">
                    REASON FOR ESCALATION
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {selectedEscalation.reason}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/30">
                  <span className="text-[10px] font-mono font-bold text-cyan-300 block mb-1">
                    RECOMMENDED HUMAN ACTION
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {selectedEscalation.recommendedAction}
                  </p>
                </div>
              </div>

              {/* Action Buttons (Updates database & UI) */}
              <div className="pt-3 border-t border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block mb-2 font-semibold">
                  SUPERVISOR ACTIONS (PERSISTED TO DB):
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      handleAction(
                        selectedEscalation.id,
                        'ASSIGNED',
                        'Assigned to Senior Risk Analyst',
                        'Anil Mehta (Senior Risk Analyst)'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-purple-950 hover:bg-purple-900 border border-purple-500/50 text-purple-200 text-xs font-mono font-medium transition-colors cursor-pointer"
                  >
                    Assign to Me
                  </button>

                  <button
                    onClick={() =>
                      handleAction(
                        selectedEscalation.id,
                        'ACKNOWLEDGED',
                        'Case acknowledged and locked in queue'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-500/50 text-blue-200 text-xs font-mono font-medium transition-colors cursor-pointer"
                  >
                    Acknowledge
                  </button>

                  <button
                    onClick={() =>
                      handleAction(
                        selectedEscalation.id,
                        'RESOLVED',
                        'Human supervisor marked case RESOLVED'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 text-xs font-mono font-medium transition-colors cursor-pointer"
                  >
                    Approve & Resolve
                  </button>

                  <button
                    onClick={() =>
                      handleAction(
                        selectedEscalation.id,
                        'INFO_REQUESTED',
                        'Additional documentation requested from customer'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-amber-950 hover:bg-amber-900 border border-amber-500/50 text-amber-200 text-xs font-mono font-medium transition-colors cursor-pointer"
                  >
                    Request Information
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs font-mono">
              SELECT AN ESCALATED CASE TO INSPECT
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
