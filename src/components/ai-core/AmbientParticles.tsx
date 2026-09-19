'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AICoreState } from '@/lib/types';
import { AI_STATE_META } from '@/lib/constants';

interface AmbientParticlesProps {
  status: AICoreState;
}

export const AmbientParticles: React.FC<AmbientParticlesProps> = ({ status }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Responsive particle count: ~64 particles for desktop, ~32 on smaller screens
  const particleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 32 : 64;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Distribute in a soft sphere around the core
      const radius = 1.8 + Math.random() * 3.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      vel[i * 3] = (Math.random() - 0.5) * 0.008;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.008;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.008;
    }

    return [pos, vel];
  }, [particleCount]);

  const speedFactor = status === 'ANALYZING' ? 2.5 : status === 'EXECUTING' ? 2.0 : 1.0;

  useFrame(() => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      array[i * 3] += velocities[i * 3] * speedFactor;
      array[i * 3 + 1] += velocities[i * 3 + 1] * speedFactor;
      array[i * 3 + 2] += velocities[i * 3 + 2] * speedFactor;

      // Soft boundary bounce
      if (Math.abs(array[i * 3]) > 5) velocities[i * 3] *= -1;
      if (Math.abs(array[i * 3 + 1]) > 5) velocities[i * 3 + 1] *= -1;
      if (Math.abs(array[i * 3 + 2]) > 5) velocities[i * 3 + 2] *= -1;
    }

    posAttr.needsUpdate = true;
  });

  const stateColor = AI_STATE_META[status]?.color || '#38BDF8';

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color={stateColor}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
