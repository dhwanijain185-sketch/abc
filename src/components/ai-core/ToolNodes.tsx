'use client';

import React, { useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { ToolNodeId, ToolNodeInfo, AICoreState } from '@/lib/types';
import { TOOL_NODES } from '@/lib/constants';

interface ToolNodesProps {
  activeTool: ToolNodeId | null;
  status: AICoreState;
}

// Subcomponent for each Tool Node with hover interactions
const SingleToolNode: React.FC<{
  node: ToolNodeInfo;
  isActive: boolean;
  status: AICoreState;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}> = ({ node, isActive, status, isHovered, onHover }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const glowRef = React.useRef<THREE.Mesh>(null);

  const isHumanEscalation = node.id === 'HUMAN' && (status === 'ESCALATED' || isActive);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (isActive || isHovered ? 1.8 : 0.4);
      const targetScale = isHovered ? 1.5 : isActive ? 1.35 : 1.0;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
    if (glowRef.current) {
      glowRef.current.rotation.z -= delta * (isHovered ? 1.4 : 0.8);
      const glowScale = isHovered ? 1.9 : isActive ? 1.7 : 1.2;
      glowRef.current.scale.lerp(
        new THREE.Vector3(glowScale, glowScale, glowScale),
        0.1
      );
    }
  });

  const displayColor = isHumanEscalation
    ? '#EF4444'
    : isHovered
    ? '#00BAF2'
    : isActive
    ? node.activeColor
    : node.color;

  return (
    <group
      position={node.position}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(true);
      }}
      onPointerOut={() => onHover(false)}
    >
      {/* Node Outer Halo Ring */}
      <mesh ref={glowRef}>
        <ringGeometry args={[0.26, 0.34, 32]} />
        <meshBasicMaterial
          color={displayColor}
          transparent
          opacity={isHovered ? 0.95 : isActive ? 0.9 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main Node Octahedron/Sphere */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial
          color={displayColor}
          emissive={displayColor}
          emissiveIntensity={isHovered ? 2.2 : isActive ? 1.8 : 0.65}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Point Light for active or hovered illumination */}
      {(isActive || isHovered) && (
        <pointLight
          color={displayColor}
          intensity={isHovered ? 2.2 : 1.8}
          distance={4.5}
          decay={2}
        />
      )}

      {/* 3D HTML Tool Label & Hover Tooltip */}
      <Html
        distanceFactor={9}
        position={[0, -0.44, 0]}
        center
        className="pointer-events-none select-none"
      >
        <div
          className={`flex flex-col items-center px-2 py-0.5 rounded-lg transition-all duration-300 ${
            isHovered
              ? 'bg-[#002970]/95 border border-[#00BAF2] shadow-[0_0_16px_rgba(0,186,242,0.6)] scale-105'
              : isActive
              ? 'bg-slate-900/95 border border-[#00BAF2]/80 shadow-[0_0_12px_rgba(0,186,242,0.4)]'
              : 'bg-slate-950/75 border border-slate-800/80'
          }`}
        >
          <span
            className={`text-[10px] font-mono font-bold tracking-wider ${
              isHumanEscalation
                ? 'text-red-400'
                : isHovered
                ? 'text-white'
                : isActive
                ? 'text-[#00BAF2]'
                : 'text-slate-400'
            }`}
          >
            {node.id}
          </span>
          <span className="text-[8px] text-slate-300 whitespace-nowrap">
            {node.name}
          </span>

          {/* Interactive Hover Tooltip */}
          {isHovered && (
            <div className="mt-1 px-2 py-1 rounded bg-[#020713] border border-[#00BAF2]/50 text-[8px] font-sans text-slate-200 max-w-[150px] text-center shadow-lg animate-in fade-in duration-150">
              {node.description}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};

// Curved connection line from central origin [0,0,0] to tool node
const ConnectionCurve: React.FC<{
  node: ToolNodeInfo;
  isActive: boolean;
  isHovered: boolean;
  status: AICoreState;
}> = ({ node, isActive, isHovered, status }) => {
  const linePoints = useMemo(() => {
    const start = new THREE.Vector3(0, 0, 0);
    const end = new THREE.Vector3(...node.position);

    // Midpoint arc curve
    const mid = new THREE.Vector3()
      .addVectors(start, end)
      .multiplyScalar(0.5)
      .add(new THREE.Vector3(0, 0, 0.35));

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return curve.getPoints(36);
  }, [node.position]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(linePoints);
  }, [linePoints]);

  const isHuman = node.id === 'HUMAN' && (status === 'ESCALATED' || isActive);
  const color = isHuman
    ? '#EF4444'
    : isHovered
    ? '#00BAF2'
    : isActive
    ? node.activeColor
    : '#1e293b';
  const opacity = isHovered ? 0.95 : isActive ? 0.85 : 0.22;

  return (
    <primitive
      object={
        new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({
            color: new THREE.Color(color),
            transparent: true,
            opacity,
            linewidth: isHovered || isActive ? 2 : 1,
          })
        )
      }
    />
  );
};

export const ToolNodes: React.FC<ToolNodesProps> = ({ activeTool, status }) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<ToolNodeId | null>(null);

  return (
    <group>
      {TOOL_NODES.map((node) => {
        const isActive =
          activeTool === node.id ||
          (status === 'SEARCHING' && (node.id === 'CRM' || node.id === 'ORDERS')) ||
          (status === 'REASONING' && (node.id === 'POLICY' || node.id === 'RISK')) ||
          (status === 'DECIDING' && (node.id === 'POLICY' || node.id === 'PAYMENTS')) ||
          (status === 'EXECUTING' && (node.id === 'REFUNDS' || node.id === 'TICKETS')) ||
          (status === 'ESCALATED' && node.id === 'HUMAN');

        const isHovered = hoveredNodeId === node.id;

        return (
          <React.Fragment key={node.id}>
            <ConnectionCurve
              node={node}
              isActive={isActive}
              isHovered={isHovered}
              status={status}
            />
            <SingleToolNode
              node={node}
              isActive={isActive}
              isHovered={isHovered}
              status={status}
              onHover={(hovered) => setHoveredNodeId(hovered ? node.id : null)}
            />
          </React.Fragment>
        );
      })}
    </group>
  );
};
