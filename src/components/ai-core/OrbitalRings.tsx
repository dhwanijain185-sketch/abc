'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AICoreState } from '@/lib/types';
import { AI_STATE_META } from '@/lib/constants';

interface OrbitalRingsProps {
  status: AICoreState;
}

export const OrbitalRings: React.FC<OrbitalRingsProps> = ({ status }) => {
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);

  const speedMultiplier = AI_STATE_META[status]?.ringSpeed || 0.5;

  useFrame((_, delta) => {
    const s = delta * speedMultiplier;

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += s * 0.45;
      ring1Ref.current.rotation.y += s * 0.35;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= s * 0.55;
      ring2Ref.current.rotation.z += s * 0.25;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x -= s * 0.3;
      ring3Ref.current.rotation.z -= s * 0.4;
    }
  });

  const stateColor = AI_STATE_META[status]?.color || '#38BDF8';

  return (
    <group>
      {/* Ring 1 - Equator tilt */}
      <group ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <mesh>
          <torusGeometry args={[1.75, 0.012, 16, 100]} />
          <meshBasicMaterial
            color={stateColor}
            transparent
            opacity={0.35}
          />
        </mesh>
        {/* Subtle orbital node marker */}
        <mesh position={[1.75, 0, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#00F0FF" />
        </mesh>
      </group>

      {/* Ring 2 - Polar tilt */}
      <group ref={ring2Ref} rotation={[0, Math.PI / 3, Math.PI / 6]}>
        <mesh>
          <torusGeometry args={[2.1, 0.012, 16, 100]} />
          <meshBasicMaterial
            color={stateColor}
            transparent
            opacity={0.28}
          />
        </mesh>
        <mesh position={[-2.1, 0, 0]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>
      </group>

      {/* Ring 3 - Outer diagonal gyroscopic ring */}
      <group ref={ring3Ref} rotation={[-Math.PI / 5, 0, Math.PI / 4]}>
        <mesh>
          <torusGeometry args={[2.45, 0.01, 16, 100]} />
          <meshBasicMaterial
            color={stateColor}
            transparent
            opacity={0.2}
          />
        </mesh>
        <mesh position={[0, 2.45, 0]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color="#818CF8" />
        </mesh>
      </group>
    </group>
  );
};
