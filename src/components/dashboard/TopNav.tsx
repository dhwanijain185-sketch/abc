'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store/useAppStore';
import { soundFx } from '@/lib/soundEffects';
import { CommandPalette } from '@/components/common/CommandPalette';
import { ShowcaseMode } from '@/components/common/ShowcaseMode';
import { ArchitectureModal } from '@/components/common/ArchitectureModal';
import { BootSequence } from '@/components/common/BootSequence';
import {
  Activity,
  Layers,
  Users,
  BarChart3,
  AlertTriangle,
  Settings,
  Play,
  RotateCcw,
  Radio,
  CheckCircle2,
  ChevronDown,
  Search,
  Tv,
  Volume2,
  VolumeX,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const TopNav: React.FC = () => {
  const pathname = usePathname();
  const [state, store] = useAppStore();
  const [showScenarios, setShowScenarios] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showShowcase, setShowShowcase] = useState(false);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [replayBoot, setReplayBoot] = useState(false);
  const [soundActive, setSoundActive] = useState(false);

  useEffect(() => {
    setSoundActive(soundFx.isEnabled());

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Command Palette on '/' or 'Cmd+K' / 'Ctrl+K'
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)
      ) {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleSound = () => {
    const isNowActive = soundFx.toggle();
    setSoundActive(isNowActive);
  };

  const navLinks = [
    { href: '/dashboard', label: 'Command Center', icon: Activity },
    { href: '/cases', label: 'Cases', icon: Layers },
    { href: '/customers', label: 'Customers', icon: Users },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/escalations', label: 'Escalations', icon: AlertTriangle },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#00BAF2]/20 bg-[#040814]/90 backdrop-blur-md">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand & Subtitle Lockup */}
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              onClick={() => soundFx.playNavigate()}
              className="flex items-center gap-3 group"
            >
              {/* Authentic Paytm Logo Image */}
              <div className="relative w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shadow-[0_0_15px_rgba(0,186,242,0.35)] group-hover:shadow-[0_0_20px_rgba(0,186,242,0.6)] transition-all overflow-hidden">
                <Image
                  src="/paytm-logo.png"
                  alt="Paytm"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base tracking-wider text-white font-mono">
                    PAYTM <span className="text-[#00BAF2]">AUTOPILOT</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono tracking-widest bg-[#002970]/80 border border-[#00BAF2]/40 text-[#00BAF2]">
                    AUTONOMOUS OPS
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 tracking-tight hidden sm:block">
                  Understands. Investigates. Decides. Acts. Verifies.
                </p>
              </div>
            </Link>

            {/* Primary Navigation */}
            <nav className="hidden xl:flex items-center gap-1 ml-4">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => soundFx.playNavigate()}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#002970]/70 text-[#00BAF2] border border-[#00BAF2]/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        isActive ? 'text-[#00BAF2]' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Action Controls & Tools */}
          <div className="flex items-center gap-2.5">
            {/* Quick Command Palette Launcher */}
            <button
              onClick={() => setShowCommandPalette(true)}
              title="Open Command Palette (Press /)"
              className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/70 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[#00BAF2]" />
              <span>Search</span>
              <kbd className="px-1.5 py-0.2 rounded bg-slate-950 border border-slate-700 text-[9px] text-slate-400">
                /
              </kbd>
            </button>

            {/* Showcase Mode Button */}
            <button
              onClick={() => setShowShowcase(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#002970] to-[#0047b3] hover:from-[#003899] hover:to-[#005cd6] text-[#00BAF2] border border-[#00BAF2]/40 text-xs font-mono font-semibold tracking-wide shadow-[0_0_12px_rgba(0,186,242,0.25)] transition-all cursor-pointer"
            >
              <Tv className="w-3.5 h-3.5 text-[#00BAF2]" />
              <span className="hidden sm:inline">SHOWCASE MODE</span>
            </button>

            {/* Quick Scenario Runner Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowScenarios(!showScenarios)}
                disabled={state.isExecuting}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#00BAF2] hover:bg-[#0082c8] text-slate-950 text-xs font-bold font-mono tracking-wide shadow-[0_0_14px_rgba(0,186,242,0.4)] transition-all disabled:opacity-50 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>RUN AUTOPILOT</span>
                <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-70" />
              </button>

              {showScenarios && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#060D1E] border border-[#00BAF2]/40 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[10px] font-mono text-[#00BAF2] px-2 py-1 font-semibold border-b border-slate-800 mb-1">
                    EXECUTE AUTONOMOUS SCENARIO
                  </div>
                  <button
                    onClick={() => {
                      setShowScenarios(false);
                      store.runScenario('delayed_order');
                      soundFx.playAction();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-900 transition-colors flex flex-col gap-0.5"
                  >
                    <span className="text-xs font-medium text-[#00BAF2]">
                      Scenario 1: Delayed Order
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ₹2,499 refund auto-resolved & gateway verified
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setShowScenarios(false);
                      store.runScenario('damaged_product');
                      soundFx.playAction();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-900 transition-colors flex flex-col gap-0.5"
                  >
                    <span className="text-xs font-medium text-emerald-400">
                      Scenario 2: Damaged Product
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Auto replacement order dispatched with SLA
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setShowScenarios(false);
                      store.runScenario('high_risk');
                      soundFx.playEscalation();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-900 transition-colors flex flex-col gap-0.5"
                  >
                    <span className="text-xs font-medium text-red-400">
                      Scenario 3: High-Risk Dispute
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ₹50,000 security escalation to human supervisor
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Architecture Modal Button */}
            <button
              onClick={() => setShowArchitecture(true)}
              title="How Autopilot Operates"
              className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-[#00BAF2] transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              title={`Audio Cues: ${soundActive ? 'Active' : 'Muted'}`}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                soundActive
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {soundActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Replay Boot Sequence */}
            <button
              onClick={() => setReplayBoot(true)}
              title="Replay Cinematic Boot Sequence"
              className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00BAF2]" />
            </button>

            {/* Reset Demo Button */}
            <button
              onClick={() => store.resetDemo()}
              title="Reset to default seed data"
              className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* System Mode Pill Toggle */}
            <button
              onClick={() => store.setMode(state.mode === 'DEMO' ? 'LIVE' : 'DEMO')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border transition-all cursor-pointer ${
                state.mode === 'LIVE'
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
              }`}
            >
              <Radio className="w-3 h-3 animate-pulse" />
              <span className="hidden md:inline">
                {state.mode === 'LIVE' ? 'LIVE GATEWAY' : 'SIMULATED ENVIRONMENT'}
              </span>
              <span className="md:hidden">
                {state.mode === 'LIVE' ? 'LIVE' : 'SIM'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="xl:hidden flex items-center justify-around py-1.5 px-2 border-t border-slate-800/60 bg-[#020713]/90 overflow-x-auto text-xs">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => soundFx.playNavigate()}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] whitespace-nowrap ${
                  isActive
                    ? 'text-[#00BAF2] font-semibold bg-[#002970]/60'
                    : 'text-slate-400'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Global Modals & Boot Sequences */}
      <BootSequence forceShow={replayBoot} onComplete={() => setReplayBoot(false)} />
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onOpenShowcase={() => setShowShowcase(true)}
        onOpenArchitecture={() => setShowArchitecture(true)}
        onReplayBoot={() => setReplayBoot(true)}
      />
      <ShowcaseMode
        isOpen={showShowcase}
        onClose={() => setShowShowcase(false)}
      />
      <ArchitectureModal
        isOpen={showArchitecture}
        onClose={() => setShowArchitecture(false)}
      />
    </>
  );
};
