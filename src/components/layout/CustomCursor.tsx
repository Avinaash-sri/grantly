import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';

export const CustomCursor: React.FC = () => {
  const { theme } = useApp();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isText, setIsText] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  // Check touch devices
  const [isTouchDevice] = useState(() =>
    typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  );

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!hasMoved) setHasMoved(true);

      const target = e.target as HTMLElement | null;
      if (!target) {
        setIsHovered(false);
        setIsText(false);
        return;
      }

      // Check text input
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;
      setIsText(isInput);

      // Check clickable / hoverable
      const isClickable =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'SELECT' ||
        Boolean(target.closest('button')) ||
        Boolean(target.closest('a')) ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer');

      setIsHovered(isClickable);
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true, capture: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true, capture: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true, capture: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove, { capture: true });
      window.removeEventListener('mousedown', handleMouseDown, { capture: true });
      window.removeEventListener('mouseup', handleMouseUp, { capture: true });
    };
  }, [hasMoved, isTouchDevice]);

  if (isTouchDevice || !hasMoved) return null;

  const isDark = theme === 'dark';

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden select-none"
      style={{ pointerEvents: 'none' }}
      data-cursor-element="true"
    >
      {/* Outer Fluid Magnetic Ring */}
      <div
        className="fixed top-0 left-0 rounded-full border pointer-events-none transition-transform duration-150 ease-out will-change-transform"
        data-cursor-element="true"
        style={{
          width: isText ? '4px' : '38px',
          height: isText ? '24px' : '38px',
          borderRadius: isText ? '2px' : '9999px',
          transform: `translate3d(${isText ? pos.x - 2 : pos.x - 19}px, ${isText ? pos.y - 12 : pos.y - 19}px, 0) scale(${
            isMouseDown ? 0.85 : isHovered ? 1.45 : 1
          })`,
          borderColor: isHovered
            ? (isDark ? 'rgba(224, 200, 164, 0.95)' : 'rgba(197, 168, 128, 0.95)')
            : (isDark ? 'rgba(92, 136, 181, 0.75)' : 'rgba(44, 78, 111, 0.6)'),
          backgroundColor: isHovered
            ? (isDark ? 'rgba(224, 200, 164, 0.18)' : 'rgba(197, 168, 128, 0.12)')
            : (isDark ? 'rgba(92, 136, 181, 0.08)' : 'rgba(44, 78, 111, 0.05)'),
          boxShadow: isDark
            ? '0 0 16px rgba(0, 0, 0, 0.6)'
            : '0 0 12px rgba(0, 0, 0, 0.15)'
        }}
      />

      {/* Central Sharp Precision Dot — Always High Contrast */}
      <div
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full pointer-events-none transition-transform duration-75 will-change-transform"
        data-cursor-element="true"
        style={{
          transform: `translate3d(${pos.x - 5}px, ${pos.y - 5}px, 0) scale(${isMouseDown ? 0.75 : 1})`,
          backgroundColor: isHovered
            ? (isDark ? '#E0C8A4' : '#C5A880')
            : (isDark ? '#F7F5F0' : '#12161A'),
          boxShadow: isDark
            ? '0 0 0 1.5px rgba(15, 18, 22, 0.95), 0 0 8px rgba(224, 200, 164, 0.5)'
            : '0 0 0 1.5px rgba(255, 255, 255, 0.95), 0 1px 4px rgba(0, 0, 0, 0.35)'
        }}
      />
    </div>
  );
};
