'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ToolNodeId, AICoreState } from '@/lib/types';
import { TOOL_NODES } from '@/lib/constants';

interface DataPacketsProps {
  activeTool: ToolNodeId | null;
  status: AICoreState;
}

interface Packet {
  targetPos: THREE.Vector3;
  color: string;
}

export const DataPackets: React.FC<DataPacketsProps> = ({ activeTool, status }) => {
  const packetRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);

  // Active target position
  const activeTargets: Packet[] = React.useMemo(() => {
    const list: Packet[] = [];
    if (activeTool) {
      const node = TOOL_NODES.find((n) => n.id === activeTool);
      if (node) {
        list.push({
          targetPos: new THREE.Vector3(...node.position),
          color: node.activeColor,
        });
      }
    } else if (status === 'SEARCHING') {
      const crm = TOOL_NODES.find((n) => n.id === 'CRM');
      const orders = TOOL_NODES.find((n) => n.id === 'ORDERS');
      if (crm) list.push({ targetPos: new THREE.Vector3(...crm.position), color: crm.activeColor });
      if (orders) list.push({ targetPos: new THREE.Vector3(...orders.position), color: orders.activeColor });
    } else if (status === 'ESCALATED') {
      const human = TOOL_NODES.find((n) => n.id === 'HUMAN');
      if (human) list.push({ targetPos: new THREE.Vector3(...human.position), color: '#EF4444' });
    }
    return list;
  }, [activeTool, status]);

  useFrame((_, delta) => {
    // Increment travel progress along curve
    progressRef.current = (progressRef.current + delta * 1.5) % 1.0;
  });

  if (activeTargets.length === 0) return null;

  return (
    <group ref={packetRef}>
      {activeTargets.map((target, idx) => {
        const u = (progressRef.current + idx * 0.4) % 1.0;
        const start = new THREE.Vector3(0, 0, 0);
        const end = target.targetPos;
        const mid = new THREE.Vector3()
          .addVectors(start, end)
          .multiplyScalar(0.5)
          .add(new THREE.Vector3(0, 0, 0.35));

        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const currentPos = curve.getPoint(u);

        return (
          <group key={idx} position={currentPos}>
            {/* Packet energy core */}
            <mesh>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshBasicMaterial color={target.color} />
            </mesh>
            {/* Packet soft aura */}
            <mesh>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshBasicMaterial
                color={target.color}
                transparent
                opacity={0.35}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
