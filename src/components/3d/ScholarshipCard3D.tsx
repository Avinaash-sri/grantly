import React, { useRef, useState } from 'react';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Scholarship } from '../../types';
import { Bookmark, Clock, MapPin, Plus, Check, Scale } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ScholarshipCard3DProps {
  scholarship: Scholarship;
  position?: [number, number, number];
}

/**
 * 3D Scholarship Card
 * -------------------
 * A thin plane acts as a "panel" that holds the original 2D card UI via `Html`.
 * The plane receives shadows and reacts to mouse hover with a subtle tilt using
 * damped rotation. All interactive elements (bookmark, compare, track) remain
 * standard HTML, ensuring accessibility and keyboard navigation.
 *
 * Hover tilt is calculated from the mouse position relative to the plane's
 * bounding box. The tilt magnitude is intentionally small (max 6°) to keep
 * reading comfortable while giving a tactile feel.
 *
 * The component is lazy‑loaded in `DiscoveryView` and only rendered on
 * non‑touch devices (or when reduced‑motion is not preferred) to avoid
 * performance issues on mobile.
 */
export const ScholarshipCard3D: React.FC<ScholarshipCard3DProps> = ({
  scholarship,
  position = [0, 0, 0],
}) => {
  const ref = useRef<THREE.Mesh>(null!);
  const { setSelectedScholarship, toggleBookmark, isBookmarked, addApplication, applications, toggleComparison, isCompared } = useApp();

  const bookmarked = isBookmarked(scholarship.id);
  const compared = isCompared(scholarship.id);
  const isTracking = applications.some((a) => a.scholarshipId === scholarship.id);

  const [hovered, setHovered] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Update rotation on every frame when hovered
  useFrame(() => {
    if (!ref.current) return;
    const targetRotX = hovered ? (mouse.y * 0.1) : 0; // limited rotation
    const targetRotY = hovered ? (-mouse.x * 0.1) : 0;
    // Damped rotation for smoothness
    ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, targetRotX, 4, 0.016);
    ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, targetRotY, 4, 0.016);
  });

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    // Convert pointer coordinates to normalized -0.5..0.5 range relative to mesh size
    const { offsetX, offsetY } = e.nativeEvent as any; // type cast for simplicity
    const rect = (e.target as any).getBoundingClientRect();
    const x = (offsetX / rect.width) - 0.5;
    const y = (offsetY / rect.height) - 0.5;
    setMouse({ x, y });
  };

  return (
    <group position={position}>
      {/* Plane that receives light and casts a subtle shadow */}
      <mesh
        ref={ref}
        castShadow
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => { setHovered(false); setMouse({ x: 0, y: 0 }); }}
        onPointerMove={handlePointerMove}
      >
        {/* Thin panel – 0.2 depth to give a real‑world feel */}
        <boxGeometry args={[2.5, 3.2, 0.2]} />
        <meshStandardMaterial
          color="#FAF8F5"
          metalness={0}
          roughness={0.4}
          flatShading={false}
        />
        {/* HTML overlay – contains the original card markup */}
        <Html
          // center the HTML on the front face of the box
          position={[0, 0, 0.11]}
          // Transform controls to keep it upright despite plane tilt
          transform
          rotation-x={-Math.PI / 2}
          // Prevent pointer events from leaking to the 3D scene
          occlude
          // Ensure the HTML canvas matches the box size
          // (width: 250px ≈ 2.5 units, height: 320px ≈ 3.2 units)
          style={{ width: '250px', height: '320px', pointerEvents: 'auto' }}
        >
          {/* Re‑use the existing 2D card JSX – extracted into a function for readability */}
          <ScholarshipCardInner
            scholarship={scholarship}
            bookmarked={bookmarked}
            compared={compared}
            isTracking={isTracking}
            onSelect={() => setSelectedScholarship(scholarship)}
            onToggleBookmark={() => toggleBookmark(scholarship.id)}
            onToggleCompare={() => toggleComparison(scholarship.id)}
            onAddApplication={() => addApplication(scholarship.id)}
          />
        </Html>
      </mesh>
    </group>
  );
};

/**
 * Inner 2D markup extracted from the original `ScholarshipCard` component.
 * Keeping it separate avoids duplication of business logic (state, callbacks)
 * while allowing the 3D wrapper to handle visual effects.
 */
interface InnerProps {
  scholarship: Scholarship;
  bookmarked: boolean;
  compared: boolean;
  isTracking: boolean;
  onSelect: () => void;
  onToggleBookmark: () => void;
  onToggleCompare: () => void;
  onAddApplication: () => void;
}

const ScholarshipCardInner: React.FC<InnerProps> = ({
  scholarship,
  bookmarked,
  compared,
  isTracking,
  onSelect,
  onToggleBookmark,
  onToggleCompare,
  onAddApplication,
}) => {
  return (
    <div className="bg-[#FAF8F5] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm p-4 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-start justify-between pb-2 border-b border-[#E5E0D4] dark:border-[#2A3340]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796]">
              {scholarship.institution}
            </span>
            {scholarship.featured && (
              <span className="px-1.5 py-0.2 bg-[#C5A880]/20 text-[#8C6B38] dark:text-[#E0C8A4] text-[8px] font-mono uppercase rounded">
                Spotlight
              </span>
            )}
          </div>
          <h3
            onClick={onSelect}
            className="font-serif text-lg font-normal text-[#12161A] dark:text-[#F7F5F0] hover:text-[#2C4E6F] dark:hover:text-[#5C88B5] cursor-pointer transition-colors leading-snug"
          >
            {scholarship.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-[#7E8B99] dark:text-[#7A8796] mt-1 font-mono">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{scholarship.location} • {scholarship.country}</span>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleCompare(); }}
            className={`p-1 rounded border transition-colors ${
              compared ? 'bg-[#C5A880] text-[#12161A] border-[#C5A880]' : 'bg-white dark:bg-[#1B2129] text-[#7E8B99] border-[#E5E0D4] dark:border-[#2A3340] hover:text-[#12161A] dark:hover:text-[#F7F5F0]'
            }`}
            title={compared ? 'In Comparison Matrix' : 'Compare Fellowship'}
          >
            <Scale className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }}
            className={`p-1 rounded border transition-colors ${
              bookmarked ? 'bg-[#2C4E6F] text-white border-[#2C4E6F]' : 'bg-white dark:bg-[#1B2129] text-[#7E8B99] border-[#E5E0D4] dark:border-[#2A3340] hover:text-[#12161A] dark:hover:text-[#F7F5F0]'
            }`}
            title={bookmarked ? 'Saved to Dossier' : 'Save to Dossier'}
          >
            <Bookmark className="w-3 h-3 fill-current" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="py-2 border-b border-[#E5E0D4] dark:border-[#2A3340]">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="block text-[8px] font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796]">Funding</span>
            <span className="font-serif text-base font-bold text-[#12161A] dark:text-[#F7F5F0]">{scholarship.amountFormatted}</span>
            <span className="block text-[9px] font-mono text-[#2C4E6F] dark:text-[#5C88B5]">{scholarship.coverage}</span>
          </div>
          <div>
            <span className="block text-[8px] font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796]">GPA</span>
            <span className="text-sm font-mono font-medium text-[#12161A] dark:text-[#F7F5F0]">Min GPA: {scholarship.minGPA}</span>
            <span className="block text-[9px] font-mono text-[#7E8B99] dark:text-[#7A8796]">{scholarship.financialNeed}</span>
          </div>
        </div>
        <p className="text-xs text-[#4A5562] dark:text-[#B6C0CC] mt-2 line-clamp-3 leading-relaxed">
          {scholarship.description}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {scholarship.fields.slice(0, 3).map((field) => (
            <span key={field} className="px-2 py-0.5 text-[8px] font-mono bg-[#F3EFE7] dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] text-[#4A5562] dark:text-[#B6C0CC] rounded">
              {field}
            </span>
          ))}
          {scholarship.fields.length > 3 && (
            <span className="px-1.5 py-0.5 text-[8px] font-mono text-[#7E8B99]">+{scholarship.fields.length - 3} more</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 flex items-center justify-between text-xs text-[#7E8B99] dark:text-[#7A8796]">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{scholarship.deadlineDaysRemaining} days ({scholarship.deadline})</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onSelect}
            className="px-2 py-1 bg-white dark:bg-[#1B2129] border border-[#D1C9BC] dark:border-[#384556] rounded text-[#12161A] dark:text-[#F7F5F0] hover:bg-[#F3EFE7] dark:hover:bg-[#1B2129] transition-colors"
          >
            Inspect
          </button>
          <button
            onClick={onAddApplication}
            disabled={isTracking}
            className={`px-2 py-1 rounded flex items-center justify-center gap-1 transition-colors ${
              isTracking
                ? 'bg-[#EBF1F7] dark:bg-[#1A2633] text-[#2C4E6F] dark:text-[#5C88B5] border border-[#2C4E6F]/30 cursor-default'
                : 'bg-[#12161A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#12161A] hover:bg-[#2C4E6F]'
            }`}
          >
            {isTracking ? (<><Check className="w-3.5 h-3.5" />Tracked</>) : (<><Plus className="w-3.5 h-3.5" />Track</>) }
          </button>
        </div>
      </div>
    </div>
  );
};

