import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Procedural Academic Folio / Book
function AcademicFolio({ mouse }: { mouse: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const targetRotX = mouse.y * 0.25;
    const targetRotY = mouse.x * 0.35 + Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
    meshRef.current.rotation.x = THREE.MathUtils.damp(meshRef.current.rotation.x, targetRotX, 4, delta);
    meshRef.current.rotation.y = THREE.MathUtils.damp(meshRef.current.rotation.y, targetRotY, 4, delta);
  });

  return (
    <group ref={meshRef} position={[0, -0.2, 0]}>
      {/* Book Cover - Deep Navy Cloth */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 3.2, 0.35]} />
        <meshStandardMaterial 
          color="#151D28" 
          roughness={0.45} 
          metalness={0.15} 
        />
      </mesh>

      {/* Pages block - Ivory Parchment */}
      <mesh position={[0.08, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.25, 3.05, 0.3]} />
        <meshStandardMaterial 
          color="#F6F1E6" 
          roughness={0.8} 
        />
      </mesh>

      {/* Gold Trim / Spine accent */}
      <mesh position={[-1.15, 0, 0]}>
        <boxGeometry args={[0.08, 3.22, 0.38]} />
        <meshStandardMaterial 
          color="#D4AF37" 
          metalness={0.85} 
          roughness={0.25} 
        />
      </mesh>

      {/* Ribbon bookmark extending from book */}
      <mesh position={[0.2, -1.8, 0.18]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.2, 0.7, 0.02]} />
        <meshStandardMaterial 
          color="#8A252C" 
          roughness={0.6} 
        />
      </mesh>
    </group>
  );
}

// Floating Manuscript Paper Sheets
function FloatingManuscript({ position, rotation, delay }: { position: [number, number, number]; rotation: [number, number, number]; delay: number }) {
  const sheetRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!sheetRef.current) return;
    const t = state.clock.elapsedTime + delay;
    sheetRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.15;
    sheetRef.current.rotation.z = rotation[2] + Math.cos(t * 0.6) * 0.05;
  });

  return (
    <mesh ref={sheetRef} position={position} rotation={rotation} castShadow>
      <planeGeometry args={[1.6, 2.2]} />
      <meshStandardMaterial 
        color="#FBF8F2" 
        roughness={0.85} 
        side={THREE.DoubleSide} 
      />
    </mesh>
  );
}

// Gilded Academic Seal / Medal
function GildedSeal() {
  const sealRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!sealRef.current) return;
    sealRef.current.rotation.y += delta * 0.4;
    sealRef.current.position.y = 1.3 + Math.sin(state.clock.elapsedTime * 1.2) * 0.12;
  });

  return (
    <group ref={sealRef} position={[1.8, 1.2, 0.5]}>
      {/* Outer ring */}
      <mesh castShadow>
        <torusGeometry args={[0.55, 0.06, 16, 48]} />
        <meshStandardMaterial 
          color="#C5A880" 
          metalness={0.85} 
          roughness={0.2} 
        />
      </mesh>
      {/* Central insignia disc */}
      <mesh castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.04, 32]} />
        <meshStandardMaterial 
          color="#E8DCBE" 
          metalness={0.65} 
          roughness={0.3} 
        />
      </mesh>
    </group>
  );
}

// Octahedron geometry representing analytical clarity & research
function ResearchPolyhedron() {
  const polyRef = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (!polyRef.current) return;
    polyRef.current.rotation.x += delta * 0.3;
    polyRef.current.rotation.y += delta * 0.25;
  });

  return (
    <mesh ref={polyRef} position={[-2.2, -1.0, 0.4]} castShadow>
      <octahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial 
        color="#3E658C" 
        metalness={0.4} 
        roughness={0.3} 
        wireframe={false} 
        transparent 
        opacity={0.85} 
      />
    </mesh>
  );
}

export const AcademicCanvas: React.FC = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hasWebGL] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMouse({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 border border-[#E5E0D4] dark:border-[#2A3340] bg-[#F3EFE7] dark:bg-[#161B22]">
        <div className="text-center font-serif text-lg text-[#7E8B99]">
          Academic Archive & Folio
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 42 }}
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={1.6} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024} 
        />
        <pointLight position={[-4, -2, 2]} intensity={0.5} color="#FAF0D9" />

        <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.4}>
          <AcademicFolio mouse={mouse} />
          <GildedSeal />
          <FloatingManuscript 
            position={[-1.7, 1.4, -0.6]} 
            rotation={[0.1, 0.3, -0.15]} 
            delay={0} 
          />
          <FloatingManuscript 
            position={[1.9, -1.2, -0.4]} 
            rotation={[-0.1, -0.25, 0.2]} 
            delay={1.5} 
          />
          <ResearchPolyhedron />
        </Float>
      </Canvas>
    </div>
  );
};
