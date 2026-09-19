'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { HeroBanner } from '@/components/dashboard/HeroBanner';
import { AutonomyPipeline } from '@/components/dashboard/AutonomyPipeline';
import { HumanEscalationBanner } from '@/components/dashboard/HumanEscalationBanner';
import { ActionReceiptCard } from '@/components/dashboard/ActionReceiptCard';
import { ExplainabilityCard } from '@/components/dashboard/ExplainabilityCard';
import { CaseDigitalTwin } from '@/components/dashboard/CaseDigitalTwin';
import { AIOrbitalCore } from '@/components/ai-core/AIOrbitalCore';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { LiveExecutionTimeline } from '@/components/timeline/LiveExecutionTimeline';
import { CustomerRequestPanel } from '@/components/chat/CustomerRequestPanel';
import { ActiveCaseDetails } from '@/components/case-panel/ActiveCaseDetails';
import { Shield, Zap, Radio } from 'lucide-react';

export default function DashboardPage() {
  const [state] = useAppStore();
  const [dataFlowEnabled, setDataFlowEnabled] = useState(false);

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 flex flex-col">
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 lg:p-6 space-y-4">
        {/* Hero Command Center Header */}
        <section aria-label="Hero Command Center">
          <HeroBanner
            dataFlowEnabled={dataFlowEnabled}
            onToggleDataFlow={() => setDataFlowEnabled((prev) => !prev)}
          />
        </section>

        {/* 7-Step Autonomy Pipeline Stepper */}
        <section aria-label="Autonomy Pipeline">
          <AutonomyPipeline />
        </section>

        {/* Human-in-the-Loop Escalation Banner (Conditional on High-Risk) */}
        <section aria-label="Human Escalation Guardrail">
          <HumanEscalationBanner />
        </section>

        {/* Signature Wow Moment & Action Receipt (Conditional on Verification/Resolution) */}
        <section aria-label="Action Receipt">
          <ActionReceiptCard />
        </section>

        {/* Operational Metrics Grid */}
        <section aria-label="Operational Metrics">
          <MetricsGrid />
        </section>

        {/* Hero Section: 3D AI Core (Hero) & Live Execution Timeline */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          {/* 3D AI Core Canvas */}
          <div className="xl:col-span-7 2xl:col-span-8 min-h-[420px] lg:min-h-[500px]">
            <AIOrbitalCore
              status={state.aiState}
              activeTool={state.activeTool}
              progress={state.progress}
              events={state.timeline}
              dataFlowEnabled={dataFlowEnabled}
            />
          </div>

          {/* Live Execution Timeline */}
          <div className="xl:col-span-5 2xl:col-span-4 min-h-[420px] lg:min-h-[500px]">
            <LiveExecutionTimeline />
          </div>
        </section>

        {/* Operational Reasoning & Autonomy Control Section */}
        <section aria-label="Operational Reasoning & Guardrails">
          <ExplainabilityCard />
        </section>

        {/* Case Digital Twin & Simulated Customer Context */}
        <section aria-label="Case Digital Twin & Customer Context">
          <CaseDigitalTwin />
        </section>

        {/* Bottom Section: Customer Request Intake & Active Case Inspector */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Customer Request / Chat Interaction Panel */}
          <div className="lg:col-span-7 2xl:col-span-8">
            <CustomerRequestPanel />
          </div>

          {/* Active Case Details Inspector */}
          <div className="lg:col-span-5 2xl:col-span-4">
            <ActiveCaseDetails />
          </div>
        </section>
      </main>
    </div>
  );
}
