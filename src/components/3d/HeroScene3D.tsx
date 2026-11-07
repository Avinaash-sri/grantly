import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 1. Classical Colonnade / Architectural Portal Structure
function ArchitecturalColonnade({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    const p = scrollProgress.current;
    // Rotate and shift backwards as camera enters deeper into the academic space
    const targetZ = -2.5 - p * 3.5;
    const targetRotY = -0.2 + p * 0.4;
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetZ, 3, delta);
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 3, delta);
  });

  return (
    <group ref={groupRef} position={[0, -0.5, -2.5]}>
      {/* Base Plinth / Foundation */}
      <mesh position={[0, -2.2, 0]} receiveShadow>
        <boxGeometry args={[14, 0.4, 6]} />
        <meshStandardMaterial color="#E8E2D5" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Classical Fluted Columns - 4 stately pillars */}
      {[-4.5, -1.8, 1.8, 4.5].map((x, idx) => (
        <group key={idx} position={[x, 0.2, 0]}>
          {/* Column Base */}
          <mesh position={[0, -2.0, 0]} castShadow>
            <cylinderGeometry args={[0.55, 0.65, 0.4, 24]} />
            <meshStandardMaterial color="#EAE4D8" roughness={0.6} />
          </mesh>
          {/* Shaft */}
          <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.42, 0.48, 3.8, 24]} />
            <meshStandardMaterial color="#F3EDE2" roughness={0.55} metalness={0.05} />
          </mesh>
          {/* Capital */}
          <mesh position={[0, 2.1, 0]} castShadow>
            <boxGeometry args={[1.0, 0.35, 1.0]} />
            <meshStandardMaterial color="#E5DFC2" roughness={0.5} metalness={0.15} />
          </mesh>
        </group>
      ))}

      {/* Lintel / Architrave beam */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[13.5, 0.6, 2.2]} />
        <meshStandardMaterial color="#ECE6D8" roughness={0.6} />
      </mesh>
    </group>
  );
}

// 2. Open Academic Folio with layered deckle-edge leaves
function OpenManuscriptFolio({ scrollProgress, mouse }: { scrollProgress: React.MutableRefObject<number>; mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const folioRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!folioRef.current) return;
    const p = scrollProgress.current;
    const m = mouse.current;

    // In Section 1-2: Open book takes center-right stage
    // In Section 3: Book tilts toward viewer
    // In Section 4: Tilts into analytical presentation angle
    const targetX = 1.2 - p * 1.5 + m.x * 0.4;
    const targetY = -0.1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.08 + p * 0.5 - m.y * 0.3;
    const targetZ = 0.5 - p * 0.8;

    const targetRotX = 0.25 + p * 0.4 - m.y * 0.3;
    const targetRotY = -0.4 + p * 0.8 + m.x * 0.4;
    const targetRotZ = -0.05 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03;

    folioRef.current.position.x = THREE.MathUtils.damp(folioRef.current.position.x, targetX, 4, delta);
    folioRef.current.position.y = THREE.MathUtils.damp(folioRef.current.position.y, targetY, 4, delta);
    folioRef.current.position.z = THREE.MathUtils.damp(folioRef.current.position.z, targetZ, 4, delta);

    folioRef.current.rotation.x = THREE.MathUtils.damp(folioRef.current.rotation.x, targetRotX, 4, delta);
    folioRef.current.rotation.y = THREE.MathUtils.damp(folioRef.current.rotation.y, targetRotY, 4, delta);
    folioRef.current.rotation.z = THREE.MathUtils.damp(folioRef.current.rotation.z, targetRotZ, 4, delta);
  });

  return (
    <group ref={folioRef} position={[1.2, -0.1, 0.5]}>
      {/* Left Cover - Deep Navy Buckram */}
      <mesh position={[-1.25, 0, 0]} rotation={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[2.3, 3.2, 0.12]} />
        <meshStandardMaterial color="#141C27" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Right Cover */}
      <mesh position={[1.25, 0, 0]} rotation={[0, -0.18, 0]} castShadow>
        <boxGeometry args={[2.3, 3.2, 0.12]} />
        <meshStandardMaterial color="#141C27" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Left Open Pages Stack - Warm Ivory */}
      <mesh position={[-1.15, 0.08, 0]} rotation={[0, 0.14, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 3.0, 0.22]} />
        <meshStandardMaterial color="#FAF6EE" roughness={0.8} />
      </mesh>

      {/* Right Open Pages Stack */}
      <mesh position={[1.15, 0.08, 0]} rotation={[0, -0.14, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 3.0, 0.22]} />
        <meshStandardMaterial color="#FAF6EE" roughness={0.8} />
      </mesh>

      {/* Spine Gilded Accent */}
      <mesh position={[0, -0.02, -0.05]}>
        <cylinderGeometry args={[0.22, 0.22, 3.22, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#C5A880" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Crimson Silk Bookmark Ribbon */}
      <mesh position={[0.2, -1.8, 0.25]} rotation={[0, 0, -0.12]}>
        <boxGeometry args={[0.25, 1.2, 0.015]} />
        <meshStandardMaterial color="#88232B" roughness={0.6} />
      </mesh>
    </group>
  );
}

// 3. Layered Scholarship Certificates & Documents (They separate into distinct planes on scroll!)
function LayeredScholarshipDocuments({ scrollProgress, mouse }: { scrollProgress: React.MutableRefObject<number>; mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null);
  const doc1Ref = useRef<THREE.Group>(null);
  const doc2Ref = useRef<THREE.Group>(null);
  const doc3Ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const p = scrollProgress.current;
    const m = mouse.current;
    const time = state.clock.elapsedTime;

    // Overall cluster movement
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, -2.2 + p * 1.8 + m.x * 0.3, 3, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, 0.6 - p * 0.8 - m.y * 0.25, 3, delta);

    // Section 3: Separation effect (Documents fan out dramatically along X, Y and Z!)
    const spreadFactor = Math.sin(p * Math.PI) * 2.2 + p * 1.5;

    if (doc1Ref.current) {
      doc1Ref.current.position.x = -spreadFactor * 0.9;
      doc1Ref.current.position.z = spreadFactor * 0.8;
      doc1Ref.current.rotation.z = -0.15 - spreadFactor * 0.12 + Math.sin(time * 0.7) * 0.03;
      doc1Ref.current.rotation.y = 0.25 + spreadFactor * 0.2;
    }

    if (doc2Ref.current) {
      doc2Ref.current.position.y = spreadFactor * 0.7;
      doc2Ref.current.position.z = 0;
      doc2Ref.current.rotation.z = 0.08 + Math.cos(time * 0.6) * 0.03;
      doc2Ref.current.rotation.x = -spreadFactor * 0.15;
    }

    if (doc3Ref.current) {
      doc3Ref.current.position.x = spreadFactor * 0.95;
      doc3Ref.current.position.z = -spreadFactor * 0.6;
      doc3Ref.current.rotation.z = 0.2 + spreadFactor * 0.15 + Math.sin(time * 0.8 + 1) * 0.03;
      doc3Ref.current.rotation.y = -0.3 - spreadFactor * 0.18;
    }
  });

  return (
    <group ref={groupRef} position={[-2.2, 0.6, -0.2]}>
      {/* Document 1: The Rhodes Trust Charter */}
      <group ref={doc1Ref}>
        <mesh castShadow receiveShadow>
          <planeGeometry args={[2.0, 2.7]} />
          <meshStandardMaterial color="#FCF9F2" roughness={0.85} side={THREE.DoubleSide} />
        </mesh>
        {/* Embossed Gold Seal on document */}
        <mesh position={[0.6, -0.9, 0.02]}>
          <cylinderGeometry args={[0.22, 0.22, 0.03, 24]} />
          <meshStandardMaterial color="#C5A880" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Subtle heading line bar */}
        <mesh position={[0, 0.9, 0.015]}>
          <boxGeometry args={[1.4, 0.06, 0.01]} />
          <meshStandardMaterial color="#2C4E6F" roughness={0.4} />
        </mesh>
      </group>

      {/* Document 2: Knight-Hennessy Grant Portfolio */}
      <group ref={doc2Ref} position={[0.2, 0.2, 0.15]}>
        <mesh castShadow receiveShadow>
          <planeGeometry args={[1.9, 2.6]} />
          <meshStandardMaterial color="#F8F4EA" roughness={0.88} side={THREE.DoubleSide} />
        </mesh>
        {/* Bronze seal */}
        <mesh position={[-0.55, -0.85, 0.02]}>
          <cylinderGeometry args={[0.2, 0.2, 0.025, 24]} />
          <meshStandardMaterial color="#B08D57" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.85, 0.015]}>
          <boxGeometry args={[1.3, 0.05, 0.01]} />
          <meshStandardMaterial color="#88232B" roughness={0.5} />
        </mesh>
      </group>

      {/* Document 3: Turing Computing Fellowship Matrix */}
      <group ref={doc3Ref} position={[-0.15, -0.25, -0.15]}>
        <mesh castShadow receiveShadow>
          <planeGeometry args={[1.85, 2.5]} />
          <meshStandardMaterial color="#FAF5EB" roughness={0.85} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.5, 0.75, 0.02]}>
          <cylinderGeometry args={[0.18, 0.18, 0.025, 20]} />
          <meshStandardMaterial color="#5C88B5" metalness={0.7} roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
}

// 4. Concentric Armillary Rings (Rotates around educational axis)
function ArmillarySphere({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const midRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const p = scrollProgress.current;
    const speed = 0.5 + p * 2.0;

    if (outerRingRef.current) {
      outerRingRef.current.rotation.x += delta * speed * 0.4;
      outerRingRef.current.rotation.y += delta * speed * 0.3;
    }
    if (midRingRef.current) {
      midRingRef.current.rotation.y -= delta * speed * 0.5;
      midRingRef.current.rotation.z += delta * speed * 0.35;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.x -= delta * speed * 0.6;
      innerRingRef.current.rotation.z -= delta * speed * 0.45;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.8;
      coreRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.06;
    }
  });

  return (
    <group position={[2.8, 1.8, -0.6]}>
      {/* Outer Ring */}
      <mesh ref={outerRingRef} castShadow>
        <torusGeometry args={[0.9, 0.045, 16, 64]} />
        <meshStandardMaterial color="#C5A880" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Middle Ring */}
      <mesh ref={midRingRef} castShadow>
        <torusGeometry args={[0.72, 0.04, 16, 56]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Inner Meridian Ring */}
      <mesh ref={innerRingRef} castShadow>
        <torusGeometry args={[0.55, 0.035, 16, 48]} />
        <meshStandardMaterial color="#8C704B" metalness={0.75} roughness={0.3} />
      </mesh>

      {/* Central Meridian Crystal Core */}
      <mesh ref={coreRef} castShadow>
        <octahedronGeometry args={[0.24, 0]} />
        <meshStandardMaterial color="#2C4E6F" metalness={0.4} roughness={0.2} transparent opacity={0.88} />
      </mesh>
    </group>
  );
}

// 5. Intelligent Camera & Storytelling Choreography Controller
function CameraStorytellingController({
  scrollProgress,
  mouse
}: {
  scrollProgress: React.MutableRefObject<number>;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_state, delta) => {
    const p = scrollProgress.current;
    const m = mouse.current;

    // 5-Section Camera Choreography Path:
    // Stage 1 (p=0.0 to 0.2): Cinematic opening vista [0, 0.6, 6.8] looking at center
    // Stage 2 (p=0.2 to 0.45): Camera dives closer toward the academic tome [0.8, 0.2, 4.4]
    // Stage 3 (p=0.45 to 0.7): Shifts left [-0.9, 0.4, 3.8] framing separating documents
    // Stage 4 (p=0.7 to 0.9): Ascends to analytical overview [0, 1.4, 5.2]
    // Stage 5 (p=0.9 to 1.0): Gentle elevation transition [0, 2.2, 6.4] into discovery view

    let targetCamX = 0;
    let targetCamY = 0.6;
    let targetCamZ = 6.8;
    let targetLookX = 0;
    let targetLookY = 0;
    let targetLookZ = 0;

    if (p < 0.25) {
      const t = p / 0.25;
      targetCamX = THREE.MathUtils.lerp(0, 0.8, t);
      targetCamY = THREE.MathUtils.lerp(0.6, 0.3, t);
      targetCamZ = THREE.MathUtils.lerp(6.8, 4.8, t);
      targetLookX = THREE.MathUtils.lerp(0, 0.4, t);
    } else if (p < 0.5) {
      const t = (p - 0.25) / 0.25;
      targetCamX = THREE.MathUtils.lerp(0.8, -1.0, t);
      targetCamY = THREE.MathUtils.lerp(0.3, 0.4, t);
      targetCamZ = THREE.MathUtils.lerp(4.8, 3.9, t);
      targetLookX = THREE.MathUtils.lerp(0.4, -0.8, t);
      targetLookY = THREE.MathUtils.lerp(0, 0.2, t);
    } else if (p < 0.75) {
      const t = (p - 0.5) / 0.25;
      targetCamX = THREE.MathUtils.lerp(-1.0, 0.0, t);
      targetCamY = THREE.MathUtils.lerp(0.4, 1.2, t);
      targetCamZ = THREE.MathUtils.lerp(3.9, 5.0, t);
      targetLookX = THREE.MathUtils.lerp(-0.8, 0.0, t);
      targetLookY = THREE.MathUtils.lerp(0.2, 0.4, t);
    } else {
      const t = (p - 0.75) / 0.25;
      targetCamX = THREE.MathUtils.lerp(0.0, 0.0, t);
      targetCamY = THREE.MathUtils.lerp(1.2, 2.0, t);
      targetCamZ = THREE.MathUtils.lerp(5.0, 6.6, t);
      targetLookX = 0;
      targetLookY = THREE.MathUtils.lerp(0.4, 0.1, t);
    }

    // Add subtle mouse parallax offset
    const parallaxX = m.x * 0.55;
    const parallaxY = m.y * 0.45;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX + parallaxX, 3.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY + parallaxY, 3.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 3.5, delta);

    lookAtTarget.current.x = THREE.MathUtils.damp(lookAtTarget.current.x, targetLookX, 3.5, delta);
    lookAtTarget.current.y = THREE.MathUtils.damp(lookAtTarget.current.y, targetLookY, 3.5, delta);
    lookAtTarget.current.z = THREE.MathUtils.damp(lookAtTarget.current.z, targetLookZ, 3.5, delta);

    camera.lookAt(lookAtTarget.current);
  });

  return null;
}

export const HeroScene3D: React.FC = () => {
  const scrollProgress = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Mouse movement tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // GSAP ScrollTrigger synchronization with page scrolling
    const trigger = ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
      }
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      trigger.kill();
    };
  }, []);

  return (
    <div className="w-full h-full absolute inset-0 select-none pointer-events-none">
      <Canvas
        camera={{ position: [0, 0.6, 6.8], fov: 44 }}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        {/* Architectural Studio Lighting Setup */}
        <ambientLight intensity={0.75} />
        
        {/* Warm Sunlight Key */}
        <directionalLight
          position={[6, 9, 5]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={25}
          shadow-bias={-0.0001}
        />

        {/* Soft Cool Rim Light */}
        <pointLight position={[-6, 4, 3]} intensity={0.9} color="#9DBBD9" />

        {/* Warm Bronze Bounce Fill */}
        <pointLight position={[0, -4, 2]} intensity={0.6} color="#E8DCBE" />

        {/* Interactive 3D Objects Choreography */}
        <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.35}>
          <ArchitecturalColonnade scrollProgress={scrollProgress} />
          <OpenManuscriptFolio scrollProgress={scrollProgress} mouse={mouse} />
          <LayeredScholarshipDocuments scrollProgress={scrollProgress} mouse={mouse} />
          <ArmillarySphere scrollProgress={scrollProgress} />
        </Float>

        {/* Contact Shadow for Grounded Architectural Depth */}
        <ContactShadows
          position={[0, -2.4, 0]}
          opacity={0.45}
          scale={16}
          blur={2.4}
          far={4.5}
        />

        {/* Camera Scroll Storyteller */}
        <CameraStorytellingController scrollProgress={scrollProgress} mouse={mouse} />
      </Canvas>
    </div>
  );
};

export default HeroScene3D;


