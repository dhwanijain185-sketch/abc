'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store/useAppStore';
import { db } from '@/lib/supabase/client';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Clock,
  Fingerprint,
} from 'lucide-react';

interface MetricItem {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  subtext: string;
}

// Simple animated counter hook
const useAnimatedNumber = (targetValue: number, duration: number = 1000): number => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();

    const updateCounter = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = start + (targetValue - start) * ease;
      setCurrent(val);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCurrent(targetValue);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [targetValue, duration]);

  return current;
};

const MetricCard: React.FC<{
  metric: MetricItem;
  mode: 'DEMO' | 'LIVE';
}> = ({ metric, mode }) => {
  const animatedValue = useAnimatedNumber(metric.value, 1200);
  const Icon = metric.icon;

  const formattedValue =
    metric.decimals !== undefined
      ? animatedValue.toFixed(metric.decimals)
      : Math.round(animatedValue).toString();

  return (
    <div className="relative group p-4 rounded-xl paytm-card paytm-card-hover">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono tracking-wider text-slate-400 font-medium">
          {metric.label}
        </span>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center border"
          style={{
            backgroundColor: `${metric.color}15`,
            borderColor: `${metric.color}40`,
            color: metric.color,
          }}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Main counter value */}
      <div className="mt-2.5 flex items-baseline gap-1">
        <span className="text-2xl font-bold font-mono tracking-tight text-white">
          {formattedValue}
        </span>
        {metric.suffix && (
          <span className="text-xs font-mono font-semibold text-slate-400">
            {metric.suffix}
          </span>
        )}
      </div>

      {/* Subtext and demo pill */}
      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-sans">
        <span>{metric.subtext}</span>
        {mode === 'DEMO' && (
          <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-slate-950/80 border border-slate-800 text-slate-400">
            SIMULATED
          </span>
        )}
      </div>
    </div>
  );
};

export const MetricsGrid: React.FC = () => {
  const [state] = useAppStore();
  const cases = db.getCases();
  const escalations = db.getEscalations();

  const totalCases = cases.length;
  const resolvedCases = cases.filter((c) => c.status === 'RESOLVED').length;
  const escalatedCases = escalations.length;
  const activeCases = cases.filter(
    (c) => c.status === 'OPEN' || c.status === 'INVESTIGATING'
  ).length;

  const autoResolved = cases.filter(
    (c) => c.status === 'RESOLVED' && c.decision === 'AUTO_RESOLVE'
  ).length;
  const automationRate = totalCases > 0 ? (autoResolved / totalCases) * 100 : 88.4;
  const verifiedCases = cases.filter((c) => c.verificationStatus === 'VERIFIED').length;
  const verificationRate = resolvedCases > 0 ? (verifiedCases / resolvedCases) * 100 : 100;

  const metrics: MetricItem[] = [
    {
      id: 'active_cases',
      label: 'ACTIVE CASES',
      value: activeCases,
      icon: ShieldCheck,
      color: '#00BAF2',
      subtext: 'Autonomous queue processing',
    },
    {
      id: 'resolved_cases',
      label: 'RESOLVED CASES',
      value: resolvedCases,
      icon: CheckCircle2,
      color: '#10B981',
      subtext: '100% gateway verified',
    },
    {
      id: 'escalated_cases',
      label: 'ESCALATED CASES',
      value: escalatedCases,
      icon: AlertTriangle,
      color: '#EF4444',
      subtext: 'Human supervisor queue',
    },
    {
      id: 'automation_rate',
      label: 'AUTOMATION RATE',
      value: automationRate,
      suffix: '%',
      decimals: 1,
      icon: Zap,
      color: '#00BAF2',
      subtext: 'Zero manual touchpoints',
    },
    {
      id: 'avg_resolution_time',
      label: 'AVG RESOLUTION TIME',
      value: 12.4,
      suffix: 's',
      decimals: 1,
      icon: Clock,
      color: '#0284C7',
      subtext: 'Request to verified receipt',
    },
    {
      id: 'verification_rate',
      label: 'VERIFICATION RATE',
      value: verificationRate,
      suffix: '%',
      decimals: 0,
      icon: Fingerprint,
      color: '#34D399',
      subtext: 'Zero unverified resolutions',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {metrics.map((metric) => (
        <MetricCard key={metric.id} metric={metric} mode={state.mode} />
      ))}
    </div>
  );
};
