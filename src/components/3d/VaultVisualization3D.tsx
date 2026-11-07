import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import { ApplicationItem, Scholarship } from '../../types';

interface VaultVisualization3DProps {
  applications: ApplicationItem[];
  scholarships: Scholarship[];
}

function PillarItem({
  x,
  z,
  height,
  title,
  amount,
  status,
  isHovered,
  onHover
}: {
  x: number;
  z: number;
  height: number;
  title: string;
  amount: string;
  status: string;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    const targetY = isHovered ? 0.35 : 0;
    meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetY, 6, delta);
  });

  const isApproved = status === 'Approved';

  return (
    <group
      ref={meshRef}
      position={[x, 0, z]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(true);
      }}
      onPointerOut={() => onHover(false)}
    >
      {/* Pillar Column */}
      <mesh position={[0, height / 2 - 1.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.44, height, 20]} />
        <meshStandardMaterial
          color={isApproved ? '#D4AF37' : isHovered ? '#3E658C' : '#2C4E6F'}
          roughness={0.3}
          metalness={isApproved ? 0.8 : 0.4}
        />
      </mesh>

      {/* Capital Crest Base */}
      <mesh position={[0, height - 1.15, 0]}>
        <boxGeometry args={[0.9, 0.15, 0.9]} />
        <meshStandardMaterial color="#C5A880" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Floating 3D Label on Hover */}
      {isHovered && (
        <group position={[0, height - 0.7, 0]}>
          <Text
            fontSize={0.22}
            color="#12161A"
            anchorX="center"
            anchorY="middle"
          >
            {`${title.slice(0, 15)}... • ${amount}`}
          </Text>
        </group>
      )}
    </group>
  );
}

export const VaultVisualization3D: React.FC<VaultVisualization3DProps> = ({
  applications,
  scholarships
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const tracked = applications
    .map((app) => ({
      app,
      scholarship: scholarships.find((s) => s.id === app.scholarshipId)
    }))
    .filter((item) => item.scholarship !== undefined)
    .slice(0, 5);

  const positions = [
    { x: -2.4, z: 0 },
    { x: -1.2, z: 0.4 },
    { x: 0, z: -0.2 },
    { x: 1.2, z: 0.4 },
    { x: 2.4, z: 0 }
  ];

  return (
    <div className="w-full h-[280px] relative select-none rounded border border-[#E5E0D4] dark:border-[#2A3340] bg-[#F3EFE7] dark:bg-[#161B22] overflow-hidden">
      <div className="absolute top-3 left-4 z-10 pointer-events-none">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A880] block font-semibold">
          3D ENDOWMENT VAULT
        </span>
        <span className="text-xs font-serif text-[#12161A] dark:text-[#F7F5F0]">
          Interactive Capital Pillars • Hover Pillars to Inspect
        </span>
      </div>

      <Canvas
        camera={{ position: [0, 1.8, 4.6], fov: 42 }}
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[4, 6, 3]} intensity={1.6} castShadow />
        <pointLight position={[-4, -2, 2]} intensity={0.5} color="#FAF0D9" />

        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.15}>
          {/* Base Pedestal Platform */}
          <mesh position={[0, -1.35, 0]} receiveShadow>
            <boxGeometry args={[6.8, 0.25, 2.8]} />
            <meshStandardMaterial color="#EAE4D8" roughness={0.7} />
          </mesh>

          {/* Pillars for each tracked scholarship */}
          {tracked.map((item, idx) => {
            const pos = positions[idx] || { x: idx - 2, z: 0 };
            const normalizedHeight = 1.0 + (item.scholarship!.amount / 90000) * 1.4;

            return (
              <PillarItem
                key={item.app.id}
                x={pos.x}
                z={pos.z}
                height={normalizedHeight}
                title={item.scholarship!.title}
                amount={item.scholarship!.amountFormatted}
                status={item.app.status}
                isHovered={hoveredIdx === idx}
                onHover={(h) => setHoveredIdx(h ? idx : null)}
              />
            );
          })}
        </Float>
      </Canvas>
    </div>
  );
};

export default VaultVisualization3D;


