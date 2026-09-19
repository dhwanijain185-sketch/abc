'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { soundFx } from '@/lib/soundEffects';
import { ShieldCheck, Cpu, CheckCircle2 } from 'lucide-react';

interface BootSequenceProps {
  forceShow?: boolean;
  onComplete?: () => void;
}

const NODES = [
  { name: 'CUSTOMER', color: '#00BAF2' },
  { name: 'ORDERS', color: '#0284C7' },
  { name: 'PAYMENTS', color: '#002970' },
  { name: 'POLICY', color: '#38BDF8' },
  { name: 'RISK', color: '#F59E0B' },
  { name: 'REFUNDS', color: '#10B981' },
  { name: 'TICKETS', color: '#60A5FA' },
  { name: 'HUMAN', color: '#EF4444' },
];

export const BootSequence: React.FC<BootSequenceProps> = ({
  forceShow = false,
  onComplete,
}) => {
  const [stage, setStage] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const seen = localStorage.getItem('paytm_autopilot_intro_seen');
    if (seen === 'true' && !forceShow) {
      if (onComplete) onComplete();
      return;
    }

    setIsVisible(true);
    soundFx.playBoot();

    const t1 = setTimeout(() => setStage(1), 500);   // Ring forms
    const t2 = setTimeout(() => setStage(2), 1200);  // Nodes appear
    const t3 = setTimeout(() => setStage(3), 1900);  // Connected into core
    const t4 = setTimeout(() => setStage(4), 2500);  // Engine ready & message
    const t5 = setTimeout(() => handleFinish(), 3400); // Transition to dashboard

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [forceShow]);

  const handleFinish = () => {
    localStorage.setItem('paytm_autopilot_intro_seen', 'true');
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="boot-overlay"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.03 }}
        transition={{ duration: 0.65, ease: 'easeInOut' }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020713] text-white select-none overflow-hidden"
      >
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,186,242,0.14)_0%,rgba(0,41,112,0.08)_45%,transparent_75%)] pointer-events-none" />

        {/* Tactical Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none opacity-40" />

        {/* Skip Button */}
        <button
          onClick={handleFinish}
          className="absolute top-6 right-6 px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer z-20 backdrop-blur-sm"
        >
          SKIP INTRO →
        </button>

        {/* Center Container */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Circular Blue Energy Rings */}
          <div className="relative flex items-center justify-center">
            {/* Outer Spinning Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
              className={`absolute w-56 h-56 rounded-full border border-dashed border-[#00BAF2]/30 transition-all duration-700 ${
                stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
            />

            {/* Inner Glowing Pulse Ring */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.5, 0.9, 0.5],
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className={`absolute w-44 h-44 rounded-full border-2 border-[#00BAF2] transition-all duration-500 shadow-[0_0_30px_rgba(0,186,242,0.45)] ${
                stage >= 1 ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Central Paytm Logo Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative w-24 h-24 rounded-2xl bg-white p-2 flex items-center justify-center shadow-[0_0_40px_rgba(0,186,242,0.5)] z-10 overflow-hidden"
            >
              <Image
                src="/paytm-logo.png"
                alt="Paytm"
                width={80}
                height={80}
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Nodes Emerging Around Ring (Stage 2+) */}
            {stage >= 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                {NODES.map((node, i) => {
                  const angle = (i / NODES.length) * (2 * Math.PI) - Math.PI / 2;
                  const radius = 125;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;

                  return (
                    <motion.div
                      key={node.name}
                      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                      animate={{ opacity: 1, scale: 1, x, y }}
                      transition={{ duration: 0.4, delay: i * 0.05, ease: 'easeOut' }}
                      className="absolute flex flex-col items-center"
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full shadow-md"
                        style={{
                          backgroundColor: node.color,
                          boxShadow: `0 0 10px ${node.color}`,
                        }}
                      />
                      <span className="text-[9px] font-mono tracking-widest text-slate-300 mt-1 font-semibold">
                        {node.name}
                      </span>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Product Lockup & Progression Subtitle */}
          <div className="mt-8 text-center flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <span className="text-xl font-bold font-mono tracking-wider text-white">
                PAYTM <span className="text-[#00BAF2]">AUTOPILOT</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono tracking-widest bg-[#002970]/80 border border-[#00BAF2]/40 text-[#00BAF2]">
                OPERATIONS OS
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-[11px] font-mono tracking-widest text-slate-400 uppercase mt-1"
            >
              AUTONOMOUS CUSTOMER OPERATIONS
            </motion.p>

            {/* Status Feedback in each stage */}
            <div className="mt-4 h-6 flex items-center justify-center">
              {stage === 0 && (
                <span className="text-[11px] font-mono text-slate-400 animate-pulse">
                  CONNECTING TO ENTERPRISE MESH...
                </span>
              )}
              {stage === 1 && (
                <span className="text-[11px] font-mono text-[#00BAF2] tracking-wider">
                  INITIALIZING AUTONOMOUS OPERATIONS
                </span>
              )}
              {stage === 2 && (
                <span className="text-[11px] font-mono text-slate-300 tracking-wider">
                  SYNCHRONIZING SYSTEM NODES: CUSTOMER • ORDERS • PAYMENTS • RISK
                </span>
              )}
              {stage === 3 && (
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ALL 10 ENTERPRISE NODES LINKED TO AI CORE</span>
                </div>
              )}
              {stage >= 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-xs font-mono font-bold tracking-widest text-[#00BAF2]">
                    UNDERSTANDS. INVESTIGATES. DECIDES. ACTS. VERIFIES.
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Subtext */}
        <div className="absolute bottom-6 flex items-center gap-3 text-[10px] font-mono text-slate-500">
          <span>PAYTM AUTONOMOUS ENGINE 2.0</span>
          <span>•</span>
          <span>ENTERPRISE AIR-GAP VERIFIED</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
