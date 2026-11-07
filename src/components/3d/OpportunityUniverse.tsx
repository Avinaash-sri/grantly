import React, { useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Scholarship } from '../../types';

/* ================================================================
   OPPORTUNITY UNIVERSE — Interactive 3D Scholarship Node Graph
   ================================================================
   Each scholarship is a 3D node floating in space.
   - Clicking a node selects that scholarship.
   - Related scholarships (same field/country) are connected by lines.
   - Camera smoothly flies to the selected node.
   - Fallback grid view available.
   ================================================================ */

interface UniverseNode {
  scholarship: Scholarship;
  position: THREE.Vector3;
  color: string;
  size: number;
}

// Color by coverage type
function coverageColor(coverage: string): string {
  if (coverage.includes('Full Tuition & Living')) return '#C5A880';
  if (coverage.includes('Full Tuition')) return '#5C88B5';
  if (coverage.includes('Research')) return '#6B8E6B';
  if (coverage.includes('Stipend')) return '#8B6B8B';
  return '#7E8B99';
}

// Place nodes in a spherical layout with jitter
function layoutNodes(scholarships: Scholarship[]): UniverseNode[] {
  return scholarships.map((sch, i) => {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / scholarships.length);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const radius = 4.5 + (sch.amount / 100000) * 1.5;
    return {
      scholarship: sch,
      position: new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      ),
      color: coverageColor(sch.coverage),
      size: 0.08 + Math.sqrt(sch.amount / 1000000) * 0.12,
    };
  });
}

// Scholarship node mesh
function ScholarshipNodeMesh({
  node,
  isSelected,
  isRelated,
  onClick,
}: {
  node: UniverseNode;
  isSelected: boolean;
  isRelated: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    // Gentle float
    meshRef.current.position.y = node.position.y + Math.sin(t * 0.6 + node.position.x) * 0.08;
    // Pulse scale when selected
    const targetScale = isSelected ? 2.2 : hovered ? 1.6 : isRelated ? 1.3 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    // Rotate slowly
    meshRef.current.rotation.y += 0.008;
  });

  return (
    <mesh
      ref={meshRef}
      position={node.position}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
    >
      <icosahedronGeometry args={[node.size, 1]} />
      <meshStandardMaterial
        color={node.color}
        emissive={node.color}
        emissiveIntensity={isSelected ? 0.6 : hovered ? 0.35 : 0.1}
        metalness={0.4}
        roughness={0.3}
        transparent
        opacity={isSelected || isRelated || hovered ? 1.0 : 0.75}
      />
      {/* Label shown on hover / selected */}
      {(hovered || isSelected) && (
        <Html
          position={[0, node.size * 2.5, 0]}
          center
          style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}
        >
          <div className="bg-[#FAF8F5]/95 dark:bg-[#161B22]/95 border border-[#E5E0D4] dark:border-[#2A3340] rounded px-2 py-1 text-[10px] font-mono text-[#12161A] dark:text-[#F7F5F0] shadow-sm">
            <div className="font-semibold truncate max-w-[180px]">{node.scholarship.title}</div>
            <div className="text-[#C5A880]">{node.scholarship.amountFormatted}</div>
          </div>
        </Html>
      )}
    </mesh>
  );
}

// Connection lines between related nodes
function ConnectionLines({ nodes, selectedNode }: { nodes: UniverseNode[]; selectedNode: UniverseNode | null }) {
  const lines = useMemo(() => {
    if (!selectedNode) return [];
    return nodes
      .filter((n) => {
        if (n === selectedNode) return false;
        const sharedField = n.scholarship.fields.some((f) =>
          selectedNode.scholarship.fields.includes(f)
        );
        const sharedCountry = n.scholarship.country === selectedNode.scholarship.country;
        return sharedField || sharedCountry;
      })
      .map((n) => ({
        points: [selectedNode.position, n.position] as [THREE.Vector3, THREE.Vector3],
        node: n,
      }));
  }, [nodes, selectedNode]);

  return (
    <>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={line.points}
          color="#C5A880"
          lineWidth={0.8}
          transparent
          opacity={0.35}
          dashed={false}
        />
      ))}
    </>
  );
}

// Camera controller: flies to selected node
function CameraController({ target }: { target: THREE.Vector3 | null }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 14));

  useFrame((_, delta) => {
    if (target) {
      // Offset the camera to look at the node from a good angle
      const desired = new THREE.Vector3(
        target.x * 0.6,
        target.y * 0.6 + 1,
        target.z * 0.6 + 8
      );
      targetPos.current.lerp(desired, delta * 2);
    } else {
      targetPos.current.lerp(new THREE.Vector3(0, 0, 14), delta * 1.5);
    }
    camera.position.lerp(targetPos.current, delta * 3);
    camera.lookAt(target ?? new THREE.Vector3(0, 0, 0));
  });

  return null;
}

// Auto-rotate the whole scene slowly
function SceneRotator({ paused }: { paused: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    if (!groupRef.current || paused) return;
    groupRef.current.rotation.y += delta * 0.04;
  });
  return <group ref={groupRef} />;
}

interface OpportunityUniverseProps {
  scholarships: Scholarship[];
  onSelectScholarship: (s: Scholarship) => void;
}

export const OpportunityUniverse: React.FC<OpportunityUniverseProps> = ({
  scholarships,
  onSelectScholarship,
}) => {
  const nodes = useMemo(() => layoutNodes(scholarships), [scholarships]);
  const [selectedNode, setSelectedNode] = useState<UniverseNode | null>(null);
  const [cameraTarget, setCameraTarget] = useState<THREE.Vector3 | null>(null);
  const relatedIds = useMemo(() => {
    if (!selectedNode) return new Set<string>();
    return new Set(
      nodes
        .filter((n) => {
          const sharedField = n.scholarship.fields.some((f) =>
            selectedNode.scholarship.fields.includes(f)
          );
          const sharedCountry = n.scholarship.country === selectedNode.scholarship.country;
          return sharedField || sharedCountry;
        })
        .map((n) => n.scholarship.id)
    );
  }, [nodes, selectedNode]);

  const handleNodeClick = useCallback(
    (node: UniverseNode) => {
      if (selectedNode?.scholarship.id === node.scholarship.id) {
        // Open modal on second click
        onSelectScholarship(node.scholarship);
      } else {
        setSelectedNode(node);
        setCameraTarget(node.position.clone());
      }
    },
    [selectedNode, onSelectScholarship]
  );

  const handleDeselect = useCallback(() => {
    setSelectedNode(null);
    setCameraTarget(null);
  }, []);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 14], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onPointerMissed={handleDeselect}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#F7F5F0" />
        <pointLight position={[-8, -6, -8]} intensity={0.6} color="#9DBBD9" />
        <pointLight position={[0, -10, 5]} intensity={0.4} color="#E8DCBE" />

        <SceneRotator paused={!!selectedNode} />
        <CameraController target={cameraTarget} />
        <ConnectionLines nodes={nodes} selectedNode={selectedNode} />

        {nodes.map((node) => (
          <ScholarshipNodeMesh
            key={node.scholarship.id}
            node={node}
            isSelected={selectedNode?.scholarship.id === node.scholarship.id}
            isRelated={relatedIds.has(node.scholarship.id)}
            onClick={() => handleNodeClick(node)}
          />
        ))}
      </Canvas>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 pointer-events-none">
        {[
          { label: 'Full Tuition + Living', color: '#C5A880' },
          { label: 'Full Tuition', color: '#5C88B5' },
          { label: 'Research Fellowship', color: '#6B8E6B' },
          { label: 'Stipend & Travel', color: '#8B6B8B' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2 text-[10px] font-mono text-[#7E8B99] dark:text-[#7A8796]">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>

      {/* Selected node info panel */}
      {selectedNode && (
        <div className="absolute top-4 right-4 max-w-[260px] bg-[#FAF8F5]/95 dark:bg-[#161B22]/95 border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm p-4 shadow-lg animate-fade-in">
          <div className="text-[9px] font-mono uppercase tracking-wider text-[#C5A880] mb-1">
            Selected Opportunity
          </div>
          <div className="font-serif text-sm text-[#12161A] dark:text-[#F7F5F0] font-medium leading-snug mb-1">
            {selectedNode.scholarship.title}
          </div>
          <div className="text-xs font-mono text-[#2C4E6F] dark:text-[#5C88B5]">
            {selectedNode.scholarship.amountFormatted}
          </div>
          <div className="text-[10px] text-[#7E8B99] mt-1">
            {selectedNode.scholarship.institution} • {selectedNode.scholarship.country}
          </div>
          <button
            onClick={() => onSelectScholarship(selectedNode.scholarship)}
            className="mt-3 w-full px-3 py-1.5 bg-[#12161A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#12161A] text-[10px] font-mono uppercase tracking-wider rounded hover:bg-[#2C4E6F] transition-colors"
          >
            View Full Details →
          </button>
          <div className="text-[9px] font-mono text-[#7E8B99] mt-2 text-center">
            Click node again to open • Related nodes highlighted
          </div>
        </div>
      )}

      {/* Interaction hint */}
      {!selectedNode && (
        <div className="absolute bottom-4 right-4 text-[9px] font-mono tracking-widest uppercase text-[#7E8B99] dark:text-[#7A8796] pointer-events-none">
          Click a node to explore • Click again to open
        </div>
      )}
    </div>
  );
};

export default OpportunityUniverse;

