'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store/useAppStore';
import { soundFx } from '@/lib/soundEffects';
import {
  Search,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Users,
  BarChart3,
  AlertTriangle,
  Settings,
  Tv,
  HelpCircle,
  Volume2,
  VolumeX,
  X,
  Cpu,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenShowcase: () => void;
  onOpenArchitecture: () => void;
  onReplayBoot: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenShowcase,
  onOpenArchitecture,
  onReplayBoot,
}) => {
  const router = useRouter();
  const [, store] = useAppStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const commands = [
    {
      id: 'demo_delayed_order',
      title: 'Run Autopilot Demo: Delayed Order',
      subtitle: '₹2,499 refund auto-resolved & gateway verified',
      category: 'DEMO EXECUTION',
      icon: Play,
      color: 'text-[#00BAF2]',
      action: () => {
        store.runScenario('delayed_order');
        soundFx.playAction();
        onClose();
      },
    },
    {
      id: 'demo_damaged_product',
      title: 'Run Autopilot Demo: Damaged Product',
      subtitle: 'Automatic replacement order created with courier SLA',
      category: 'DEMO EXECUTION',
      icon: Play,
      color: 'text-emerald-400',
      action: () => {
        store.runScenario('damaged_product');
        soundFx.playAction();
        onClose();
      },
    },
    {
      id: 'demo_high_risk',
      title: 'Run Autopilot Demo: High-Risk Dispute',
      subtitle: '₹50,000 security risk triggers human-in-the-loop escalation',
      category: 'DEMO EXECUTION',
      icon: AlertTriangle,
      color: 'text-red-400',
      action: () => {
        store.runScenario('high_risk');
        soundFx.playEscalation();
        onClose();
      },
    },
    {
      id: 'showcase_mode',
      title: 'Launch Showcase Mode 2.0',
      subtitle: 'Fullscreen hackathon presentation mode',
      category: 'PRESENTATION',
      icon: Tv,
      color: 'text-[#00BAF2]',
      action: () => {
        onOpenShowcase();
        onClose();
      },
    },
    {
      id: 'open_architecture',
      title: 'Open Architecture: How Autopilot Operates',
      subtitle: 'View end-to-end 9-stage autonomous decision pipeline',
      category: 'SYSTEM',
      icon: Cpu,
      color: 'text-purple-400',
      action: () => {
        onOpenArchitecture();
        onClose();
      },
    },
    {
      id: 'nav_dashboard',
      title: 'Navigate: Command Center',
      subtitle: 'View 3D AI Core and live telemetry',
      category: 'NAVIGATION',
      icon: Sparkles,
      color: 'text-[#00BAF2]',
      action: () => {
        router.push('/dashboard');
        soundFx.playNavigate();
        onClose();
      },
    },
    {
      id: 'nav_cases',
      title: 'Navigate: Cases Registry',
      subtitle: 'Audit log of all autonomous cases',
      category: 'NAVIGATION',
      icon: Layers,
      color: 'text-cyan-400',
      action: () => {
        router.push('/cases');
        soundFx.playNavigate();
        onClose();
      },
    },
    {
      id: 'nav_customers',
      title: 'Navigate: Customers & CRM 360',
      subtitle: 'Customer trust scores and historical profiles',
      category: 'NAVIGATION',
      icon: Users,
      color: 'text-sky-400',
      action: () => {
        router.push('/customers');
        soundFx.playNavigate();
        onClose();
      },
    },
    {
      id: 'nav_analytics',
      title: 'Navigate: Telemetry & Analytics',
      subtitle: 'Autonomous KPIs and resolution telemetry',
      category: 'NAVIGATION',
      icon: BarChart3,
      color: 'text-indigo-400',
      action: () => {
        router.push('/analytics');
        soundFx.playNavigate();
        onClose();
      },
    },
    {
      id: 'nav_escalations',
      title: 'Navigate: Human Escalations',
      subtitle: 'Specialist triage queue for high-risk exceptions',
      category: 'NAVIGATION',
      icon: AlertTriangle,
      color: 'text-amber-400',
      action: () => {
        router.push('/escalations');
        soundFx.playNavigate();
        onClose();
      },
    },
    {
      id: 'nav_settings',
      title: 'Navigate: Policy & Settings',
      subtitle: 'Configure autonomous refund thresholds and SLAs',
      category: 'NAVIGATION',
      icon: Settings,
      color: 'text-slate-300',
      action: () => {
        router.push('/settings');
        soundFx.playNavigate();
        onClose();
      },
    },
    {
      id: 'replay_boot',
      title: 'Replay Cinematic Boot Sequence',
      subtitle: 'Watch Paytm Autopilot initialization animation',
      category: 'EXPERIENCE',
      icon: Sparkles,
      color: 'text-[#00BAF2]',
      action: () => {
        onReplayBoot();
        onClose();
      },
    },
    {
      id: 'toggle_sound',
      title: `Toggle Sound Effects (${soundFx.isEnabled() ? 'Enabled' : 'Muted'})`,
      subtitle: 'Toggle synthesizer audio cues for enterprise events',
      category: 'SYSTEM',
      icon: soundFx.isEnabled() ? Volume2 : VolumeX,
      color: 'text-emerald-400',
      action: () => {
        soundFx.toggle();
        onClose();
      },
    },
    {
      id: 'reset_demo',
      title: 'Reset Demo Seed Data',
      subtitle: 'Restore database and state to initial seed values',
      category: 'SYSTEM',
      icon: RotateCcw,
      color: 'text-rose-400',
      action: () => {
        store.resetDemo();
        onClose();
      },
    },
  ];

  const filtered = commands.filter((cmd) => {
    const q = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.subtitle.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-[#060D1E] border border-[#00BAF2]/30 shadow-[0_0_50px_rgba(0,186,242,0.2)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Top Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
          <Search className="w-5 h-5 text-[#00BAF2]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search (e.g. 'refund', 'showcase', 'cases')..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-sans"
          />
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
            ESC TO EXIT
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">
              NO MATCHING COMMANDS FOUND
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#002970]/60 border border-[#00BAF2]/50 shadow-[0_0_15px_rgba(0,186,242,0.25)]'
                      : 'hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center bg-slate-900/80 border border-slate-700/80 ${cmd.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white flex items-center gap-2">
                        <span>{cmd.title}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{cmd.subtitle}</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 px-2 py-0.5 rounded bg-slate-950/60">
                    {cmd.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-800 bg-[#040916] flex items-center justify-between text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span>↑↓ NAVIGATE</span>
            <span>•</span>
            <span>ENTER TO RUN</span>
          </div>
          <span className="text-[#00BAF2]">PAYTM AUTOPILOT COMMAND</span>
        </div>
      </div>
    </div>
  );
};
