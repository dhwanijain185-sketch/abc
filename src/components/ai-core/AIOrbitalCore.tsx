'use client';

import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AICoreState, ToolNodeId, ExecutionEvent } from '@/lib/types';
import { AI_STATE_META, TOOL_NODES } from '@/lib/constants';
import { CentralSphere } from './CentralSphere';
import { OrbitalRings } from './OrbitalRings';
import { ToolNodes } from './ToolNodes';
import { DataPackets } from './DataPackets';
import { AmbientParticles } from './AmbientParticles';

export interface AIOrbitalCoreProps {
  status: AICoreState;
  activeTool: ToolNodeId | null;
  progress?: number;
  events?: ExecutionEvent[];
  focusNode?: ToolNodeId | null;
  dataFlowEnabled?: boolean;
}

// Camera controller with smooth node-targeting travel and subtle mouse parallax
const CameraController: React.FC<{
  status: AICoreState;
  focusNode?: ToolNodeId | null;
}> = ({ status, focusNode }) => {
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    // Check if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Default target camera position
    let targetX = 0;
    let targetY = 0.2;
    let targetZ = 7.2;

    if (focusNode) {
      const node = TOOL_NODES.find((n) => n.id === focusNode);
      if (node) {
        // Camera smoothly moves halfway toward the focused node for a dramatic cinematic angle
        targetX = node.position[0] * 0.45;
        targetY = node.position[1] * 0.45;
        targetZ = 6.2;
      }
    } else if (status === 'DECIDING' || status === 'EXECUTING') {
      targetZ = 6.5; // Focus zoom
    } else if (status === 'ESCALATED') {
      const humanNode = TOOL_NODES.find((n) => n.id === 'HUMAN');
      if (humanNode) {
        targetX = humanNode.position[0] * 0.35;
        targetY = humanNode.position[1] * 0.35;
        targetZ = 6.8;
      }
    }

    if (!prefersReducedMotion) {
      targetX += mouseRef.current.x * 0.5;
      targetY += mouseRef.current.y * 0.35;
    }

    const lerpFactor = prefersReducedMotion ? 0.2 : 0.045;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, lerpFactor);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, lerpFactor);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, lerpFactor);

    state.camera.lookAt(0, 0, 0);
  });

  return null;
};

// Fallback component for SSR or environments without WebGL
const WebGLFallback: React.FC<{ status: AICoreState; activeTool: ToolNodeId | null }> = ({
  status,
  activeTool,
}) => {
  const meta = AI_STATE_META[status] || AI_STATE_META.IDLE;
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
      <div
        className="w-36 h-36 rounded-full border border-[#00BAF2]/30 flex items-center justify-center animate-pulse"
        style={{
          boxShadow: `0 0 35px ${meta.color}40`,
          borderColor: meta.color,
        }}
      >
        <div
          className="w-20 h-20 rounded-full"
          style={{ backgroundColor: `${meta.color}30`, border: `2px solid ${meta.color}` }}
        />
      </div>
      <div className="mt-4 font-mono text-xs tracking-widest text-slate-300">
        {meta.label}
      </div>
      {activeTool && (
        <div className="mt-1 font-mono text-[11px] text-[#00BAF2]">
          ACTIVE TOOL: {activeTool}
        </div>
      )}
    </div>
  );
};

export const AIOrbitalCore: React.FC<AIOrbitalCoreProps> = ({
  status,
  activeTool,
  progress = 0,
  focusNode,
}) => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const stateMeta = AI_STATE_META[status] || AI_STATE_META.IDLE;

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] lg:min-h-[480px] flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#060D1E] via-[#040814] to-[#02050E] border border-[#00BAF2]/20 shadow-2xl">
      {/* Background ambient radial glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 transition-all duration-700"
        style={{
          background: `radial-gradient(circle at center, ${stateMeta.color} 0%, rgba(0,41,112,0.15) 45%, transparent 70%)`,
        }}
      />

      {/* Grid overlay for tactical command aesthetics */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,186,242,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,186,242,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top HUD State Banner */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: stateMeta.color }}
          />
          <span className="font-mono text-xs font-bold tracking-wider text-white">
            {stateMeta.label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {activeTool && (
            <span className="px-2.5 py-0.5 rounded-md bg-[#002970]/80 border border-[#00BAF2]/40 text-[10px] font-mono text-[#00BAF2] font-semibold">
              NODE: {activeTool}
            </span>
          )}
          <span className="font-mono text-[10px] text-slate-400 bg-slate-950/70 px-2 py-0.5 rounded border border-slate-800">
            LOAD: {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Bottom Sub-Operation Readout */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="font-mono text-[11px] text-slate-300 flex items-center gap-2">
          <span className="text-[#00BAF2]">▶</span>
          <span>{stateMeta.subLabel}</span>
        </div>
        <div className="font-mono text-[9px] text-slate-500">
          PAYTM-AUTOPILOT-V2
        </div>
      </div>

      {/* 3D Canvas or Fallback */}
      {hasWebGL ? (
        <Canvas
          camera={{ position: [0, 0, 7.2], fov: 45 }}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            alpha: true,
          }}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.45} />
            <directionalLight position={[5, 8, 5]} intensity={0.75} />
            <directionalLight position={[-5, -4, -2]} intensity={0.35} color="#00BAF2" />

            <CameraController status={status} focusNode={focusNode} />
            <CentralSphere status={status} />
            <OrbitalRings status={status} />
            <ToolNodes activeTool={activeTool} status={status} />
            <DataPackets activeTool={activeTool} status={status} />
            <AmbientParticles status={status} />
          </Suspense>
        </Canvas>
      ) : (
        <WebGLFallback status={status} activeTool={activeTool} />
      )}
    </div>
  );
};
