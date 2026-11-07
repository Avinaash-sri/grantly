import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface EligibilityCore3DProps {
  gpa: number;
  matchScore?: number;
  isEvaluated?: boolean;
}

function CorePrism({ gpa, matchScore, isEvaluated }: EligibilityCore3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  // Normalized GPA factor (2.5 -> 4.0 mapped to 0 -> 1)
  const gpaFactor = Math.max(0, Math.min(1, (gpa - 2.5) / 1.5));
  const scoreFactor = matchScore ? matchScore / 100 : gpaFactor;

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const speedMultiplier = isEvaluated ? 1.8 : 0.8;

    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4 * speedMultiplier;
      meshRef.current.rotation.y += delta * 0.5 * speedMultiplier;
      const pulse = 1 + Math.sin(time * 2.5) * 0.04 * (isEvaluated ? 2 : 1);
      meshRef.current.scale.setScalar((0.85 + gpaFactor * 0.35) * pulse);
    }

    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.6;
      innerRef.current.rotation.z += delta * 0.7;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.y += delta * 0.6;
      ring1Ref.current.rotation.x = Math.sin(time * 0.8) * 0.3;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.5;
      ring2Ref.current.rotation.y = Math.cos(time * 0.9) * 0.3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Crystalline Facets */}
      <mesh ref={meshRef} castShadow>
        <icosahedronGeometry args={[1.3, 0]} />
        <meshStandardMaterial
          color={isEvaluated && scoreFactor > 0.8 ? '#D4AF37' : '#2C4E6F'}
          roughness={0.25}
          metalness={0.7}
          wireframe={false}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Inner Glowing Essence Core */}
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color={isEvaluated ? '#FAF0D9' : '#5C88B5'}
          emissive={isEvaluated ? '#C5A880' : '#1A2633'}
          emissiveIntensity={isEvaluated ? 0.6 : 0.2}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Telemetry Equatorial Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.85, 0.03, 16, 64]} />
        <meshStandardMaterial
          color="#C5A880"
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>

      {/* Telemetry Polar Ring 2 */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.1, 0.025, 16, 64]} />
        <meshStandardMaterial
          color="#5C88B5"
          metalness={0.75}
          roughness={0.3}
        />
      </mesh>

      {/* 4 Orbiting Evaluation Milestone Nodes */}
      {[-1.8, 1.8].map((x, i) => (
        <group key={i} position={[x, i % 2 === 0 ? 0.7 : -0.7, 0]}>
          <mesh>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#C5A880" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export const EligibilityCore3D: React.FC<EligibilityCore3DProps> = ({
  gpa,
  matchScore,
  isEvaluated
}) => {
  return (
    <div className="w-full h-full min-h-[260px] relative select-none">
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 4]} intensity={1.5} />
        <pointLight position={[-3, -3, 2]} intensity={0.6} color="#E8DCBE" />

        <Float speed={2} rotationIntensity={0.25} floatIntensity={0.4}>
          <CorePrism gpa={gpa} matchScore={matchScore} isEvaluated={isEvaluated} />
        </Float>
      </Canvas>
    </div>
  );
};

