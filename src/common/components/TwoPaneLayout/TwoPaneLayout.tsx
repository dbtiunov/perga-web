import React, { useEffect, useMemo, useRef, useState } from 'react';

import Storage from '@common/utils/storage';
import { StorageKeys } from '@common/utils/storage_keys';

interface TwoPaneLayoutProps {
  leftPane: React.ReactNode;
  rightPane: React.ReactNode;
  storageKey: StorageKeys;
  defaultLeftWidthPercent?: number;
  minLeftWidthPercent?: number;
  maxLeftWidthPercent?: number;
}

const RESIZE_HANDLE_WIDTH_PX = 6;
const mdQuery = '(min-width: 768px)';

export const TwoPaneLayout: React.FC<TwoPaneLayoutProps> = ({
  leftPane,
  rightPane,
  storageKey,
  defaultLeftWidthPercent = 50,
  minLeftWidthPercent = 10,
  maxLeftWidthPercent = 90,
}) => {
  // Track if viewport is at least md to apply resizable width only on md+
  const [isMd, setIsMd] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return true;
    }
    return window.matchMedia(mdQuery).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mql = window.matchMedia(mdQuery);
    const onChange = () => setIsMd(mql.matches);
    onChange();
    mql.addEventListener?.('change', onChange);

    return () => mql.removeEventListener?.('change', onChange);
  }, []);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [leftPaneWidthPercent, setLeftPaneWidthPercent] = useState<number>(() => {
    if (typeof window === 'undefined') {
      return defaultLeftWidthPercent;
    }

    const savedWidthRaw = Storage.get(storageKey, null);
    const savedWidthParsed = savedWidthRaw ? parseFloat(savedWidthRaw) : NaN;
    if (isNaN(savedWidthParsed)) {
      return defaultLeftWidthPercent;
    }

    return Math.min(maxLeftWidthPercent, Math.max(minLeftWidthPercent, savedWidthParsed));
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (clientX: number) => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const available = rect.width - RESIZE_HANDLE_WIDTH_PX;
    const xWithin = Math.min(Math.max(clientX - rect.left, 0), available);
    const percent = (xWithin / available) * 100;
    const clamped = Math.min(maxLeftWidthPercent, Math.max(minLeftWidthPercent, percent));
    setLeftPaneWidthPercent(clamped);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !isDragging) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => handleMouseMove(e.clientX);
    const onMouseUp = () => {
      setIsDragging(false);
      Storage.set(storageKey, String(leftPaneWidthPercent));
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseleave', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseleave', onMouseUp);
    };
  }, [handleMouseMove, isDragging, leftPaneWidthPercent, storageKey]);

  const leftPaneStyle = useMemo(
    () => ({ width: `${leftPaneWidthPercent}%` }),
    [leftPaneWidthPercent],
  );

  return (
    <div
      ref={containerRef}
      className="md:h-screen flex flex-col md:flex-row w-full bg-bg-main overflow-auto md:overflow-hidden"
    >
      {/* Left pane */}
      <div
        className="w-full md:flex-none md:overflow-auto md:min-h-0 flex flex-col"
        style={isMd ? leftPaneStyle : undefined}
      >
        {leftPane}
      </div>

      {/* Separator with resize handle */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize panes"
        className="hidden md:block md:shrink-0 md:cursor-col-resize md:bg-transparent"
        style={{ width: RESIZE_HANDLE_WIDTH_PX, touchAction: 'none' }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        <div className="h-full w-px mx-auto bg-gray-600" />
      </div>

      {/* Right pane */}
      <div className="w-full md:flex-1 overflow-auto min-h-0">{rightPane}</div>
    </div>
  );
};
