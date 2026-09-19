'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AICoreState } from '@/lib/types';
import { AI_STATE_META } from '@/lib/constants';

interface CentralSphereProps {
  status: AICoreState;
}

export const CentralSphere: React.FC<CentralSphereProps> = ({ status }) => {
  const outerMeshRef = useRef<THREE.Mesh>(null);
  const innerMeshRef = useRef<THREE.Mesh>(null);
  const verificationRingRef = useRef<THREE.Mesh>(null);
  const layer1Ref = useRef<THREE.Group>(null); // INTENT
  const layer2Ref = useRef<THREE.Group>(null); // CONTEXT
  const layer3Ref = useRef<THREE.Group>(null); // POLICY
  const layer4Ref = useRef<THREE.Group>(null); // RISK
  const layer5Ref = useRef<THREE.Group>(null); // ACTION
  const layer6Ref = useRef<THREE.Group>(null); // VERIFICATION
  const lightRef = useRef<THREE.PointLight>(null);

  const stateMeta = AI_STATE_META[status] || AI_STATE_META.IDLE;
  const targetColor = new THREE.Color(
    status === 'ESCALATED' ? '#EF4444' : status === 'VERIFYING' || status === 'RESOLVED' ? '#10B981' : '#00BAF2'
  );

  // Active layers based on sequential progression
  const isIntentActive = ['ANALYZING', 'SEARCHING', 'REASONING', 'DECIDING', 'EXECUTING', 'VERIFYING', 'RESOLVED'].includes(status);
  const isContextActive = ['SEARCHING', 'REASONING', 'DECIDING', 'EXECUTING', 'VERIFYING', 'RESOLVED'].includes(status);
  const isPolicyActive = ['REASONING', 'DECIDING', 'EXECUTING', 'VERIFYING', 'RESOLVED'].includes(status);
  const isRiskActive = ['REASONING', 'DECIDING', 'ESCALATED', 'EXECUTING', 'VERIFYING', 'RESOLVED'].includes(status);
  const isActionActive = ['DECIDING', 'EXECUTING', 'VERIFYING', 'RESOLVED'].includes(status);
  const isVerificationActive = ['VERIFYING', 'RESOLVED'].includes(status);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Outer translucent Paytm AI Shell
    if (outerMeshRef.current) {
      outerMeshRef.current.rotation.y += delta * 0.35;
      outerMeshRef.current.rotation.x += delta * 0.12;

      const pulseSpeed = status === 'DECIDING' || status === 'EXECUTING' ? 5 : status === 'ANALYZING' ? 3 : 1.5;
      const pulseAmp = status === 'DECIDING' ? 0.07 : 0.03;
      const scale = 1 + Math.sin(t * pulseSpeed) * pulseAmp;
      outerMeshRef.current.scale.set(scale, scale, scale);

      const mat = outerMeshRef.current.material as THREE.MeshPhysicalMaterial;
      if (mat) {
        mat.color.lerp(targetColor, 0.06);
        mat.emissive.lerp(targetColor, 0.06);
      }
    }

    // Inner Glowing Energy Core
    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.y -= delta * 0.7;
      innerMeshRef.current.rotation.z += delta * 0.25;

      const innerScale = 0.52 + Math.sin(t * (status === 'EXECUTING' ? 5 : 2)) * 0.05;
      innerMeshRef.current.scale.set(innerScale, innerScale, innerScale);

      const innerMat = innerMeshRef.current.material as THREE.MeshStandardMaterial;
      if (innerMat) {
        innerMat.color.lerp(targetColor, 0.08);
        innerMat.emissive.lerp(targetColor, 0.08);
      }
    }

    // Layer 1: INTENT
    if (layer1Ref.current) {
      layer1Ref.current.rotation.x += delta * 0.5;
      layer1Ref.current.rotation.y += delta * 0.3;
    }
    // Layer 2: CONTEXT
    if (layer2Ref.current) {
      layer2Ref.current.rotation.y -= delta * 0.6;
      layer2Ref.current.rotation.z += delta * 0.4;
    }
    // Layer 3: POLICY
    if (layer3Ref.current) {
      layer3Ref.current.rotation.z += delta * 0.7;
      layer3Ref.current.rotation.x -= delta * 0.25;
    }
    // Layer 4: RISK
    if (layer4Ref.current) {
      layer4Ref.current.rotation.y += delta * 0.8;
      layer4Ref.current.rotation.x += delta * 0.35;
    }
    // Layer 5: ACTION
    if (layer5Ref.current) {
      layer5Ref.current.rotation.x -= delta * 0.9;
      layer5Ref.current.rotation.z -= delta * 0.5;
    }
    // Layer 6: VERIFICATION
    if (layer6Ref.current) {
      layer6Ref.current.rotation.y -= delta * 1.2;
      layer6Ref.current.rotation.z += delta * 0.8;
    }

    // Signature Verification Ring
    if (verificationRingRef.current) {
      if (isVerificationActive) {
        verificationRingRef.current.visible = true;
        verificationRingRef.current.rotation.z += delta * 2.0;
        const ringScale = 1.42 + Math.sin(t * 3.5) * 0.06;
        verificationRingRef.current.scale.set(ringScale, ringScale, ringScale);
      } else {
        verificationRingRef.current.visible = false;
      }
    }

    // Dynamic Point Light
    if (lightRef.current) {
      lightRef.current.color.lerp(targetColor, 0.08);
      lightRef.current.intensity =
        status === 'EXECUTING' || status === 'RESOLVED' ? 2.6 : status === 'DECIDING' ? 2.0 : 1.3;
    }
  });

  return (
    <group>
      {/* Central dynamic light */}
      <pointLight ref={lightRef} distance={12} decay={2} />

      {/* Layer 1: INTENT Ring (Inner) */}
      <group ref={layer1Ref}>
        <mesh>
          <torusGeometry args={[0.72, 0.012, 16, 64]} />
          <meshBasicMaterial
            color="#00BAF2"
            transparent
            opacity={isIntentActive ? 0.85 : 0.15}
          />
        </mesh>
      </group>

      {/* Layer 2: CONTEXT Ring */}
      <group ref={layer2Ref} rotation={[Math.PI / 4, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.82, 0.012, 16, 64]} />
          <meshBasicMaterial
            color="#0284C7"
            transparent
            opacity={isContextActive ? 0.85 : 0.15}
          />
        </mesh>
      </group>

      {/* Layer 3: POLICY Ring */}
      <group ref={layer3Ref} rotation={[0, Math.PI / 3, 0]}>
        <mesh>
          <torusGeometry args={[0.92, 0.012, 16, 64]} />
          <meshBasicMaterial
            color="#38BDF8"
            transparent
            opacity={isPolicyActive ? 0.85 : 0.15}
          />
        </mesh>
      </group>

      {/* Layer 4: RISK Ring */}
      <group ref={layer4Ref} rotation={[Math.PI / 6, Math.PI / 6, 0]}>
        <mesh>
          <torusGeometry args={[1.02, 0.014, 16, 64]} />
          <meshBasicMaterial
            color={status === 'ESCALATED' ? '#EF4444' : '#F59E0B'}
            transparent
            opacity={isRiskActive ? 0.9 : 0.15}
          />
        </mesh>
      </group>

      {/* Layer 5: ACTION Ring */}
      <group ref={layer5Ref} rotation={[-Math.PI / 4, 0, Math.PI / 4]}>
        <mesh>
          <torusGeometry args={[1.12, 0.014, 16, 64]} />
          <meshBasicMaterial
            color="#10B981"
            transparent
            opacity={isActionActive ? 0.9 : 0.15}
          />
        </mesh>
      </group>

      {/* Layer 6: VERIFICATION Ring (Outer) */}
      <group ref={layer6Ref} rotation={[0, -Math.PI / 4, Math.PI / 3]}>
        <mesh>
          <torusGeometry args={[1.22, 0.015, 16, 64]} />
          <meshBasicMaterial
            color="#34D399"
            transparent
            opacity={isVerificationActive ? 0.95 : 0.15}
          />
        </mesh>
      </group>

      {/* Outer Translucent Glass AI Sphere */}
      <mesh ref={outerMeshRef}>
        <sphereGeometry args={[1.25, 48, 48]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.36}
          roughness={0.12}
          metalness={0.1}
          transmission={0.68}
          ior={1.45}
          thickness={0.85}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Wireframe geometric cage */}
      <mesh>
        <icosahedronGeometry args={[1.29, 2]} />
        <meshBasicMaterial
          color={targetColor}
          wireframe
          transparent
          opacity={0.14}
        />
      </mesh>

      {/* Inner Glowing Energy Core */}
      <mesh ref={innerMeshRef}>
        <sphereGeometry args={[0.58, 32, 32]} />
        <meshStandardMaterial
          roughness={0.2}
          metalness={0.8}
          emissive={targetColor}
          emissiveIntensity={1.4}
        />
      </mesh>

      {/* Dedicated Verification Ring that Closes Upon Outcome Verification */}
      <mesh ref={verificationRingRef} visible={false} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.48, 0.032, 16, 64]} />
        <meshBasicMaterial
          color="#34D399"
          transparent
          opacity={0.95}
        />
      </mesh>
    </group>
  );
};
