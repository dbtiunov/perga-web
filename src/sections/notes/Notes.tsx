import { useEffect, useMemo, useRef, useState } from 'react';

import Storage from '@common/utils/storage';
import { StorageKeys } from '@common/utils/storage_keys.ts';

const DEFAULT_LEFT_PANE_WIDTH_PERCENT = 20; // w-1/5
const MIN_LEFT_PANE_WIDTH_PERCENT = 10;
const MAX_LEFT_PANE_WIDTH_PERCENT = 30;
const RESIZE_HANDLE_WIDTH_PX = 6;

const mdQuery = '(min-width: 768px)';

const Notes = () => {
  // Track if viewport is at least md to apply resizable width only on md+
  const [isMd, setIsMd] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      // assume md on SSR to avoid layout shift
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

  // Resizable split state
  const notesContainerRef = useRef<HTMLDivElement | null>(null);
  const [leftPaneWidthPercent, setLeftPaneWidthPercent] = useState<number>(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_LEFT_PANE_WIDTH_PERCENT;
    }

    const savedWidthRaw = Storage.get(StorageKeys.NotesLeftPaneWidth, null);
    const savedWidthParsed = savedWidthRaw ? parseFloat(savedWidthRaw) : NaN;
    if (isNaN(savedWidthParsed)) {
      return DEFAULT_LEFT_PANE_WIDTH_PERCENT;
    }

    return Math.min(
      MAX_LEFT_PANE_WIDTH_PERCENT,
      Math.max(MIN_LEFT_PANE_WIDTH_PERCENT, savedWidthParsed),
    );
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (clientX: number) => {
    const container = notesContainerRef.current;
    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const available = rect.width - RESIZE_HANDLE_WIDTH_PX;
    const xWithin = Math.min(Math.max(clientX - rect.left, 0), available);
    const percent = (xWithin / available) * 100;
    const clamped = Math.min(
      MAX_LEFT_PANE_WIDTH_PERCENT,
      Math.max(MIN_LEFT_PANE_WIDTH_PERCENT, percent),
    );
    setLeftPaneWidthPercent(clamped);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !isDragging) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => handleMouseMove(e.clientX);
    const onMouseUp = () => {
      setIsDragging(false);
      Storage.set(StorageKeys.NotesLeftPaneWidth, String(leftPaneWidthPercent));
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseleave', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseleave', onMouseUp);
    };
  }, [isDragging, leftPaneWidthPercent]);

  const leftPaneStyle = useMemo(
    () => ({ width: `${leftPaneWidthPercent}%` }),
    [leftPaneWidthPercent],
  );

  return (
    <div
      ref={notesContainerRef}
      className="md:h-screen flex flex-col md:flex-row w-full bg-bg-main overflow-auto md:overflow-hidden"
    >
      {/* Left pane (days) */}
      <div
        className="w-full md:flex-none md:overflow-auto md:min-h-0 flex flex-col"
        style={isMd ? leftPaneStyle : undefined}
      >
        <h2>LEFT PANE</h2>
      </div>

      {/* Separator with resize handle */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize planner panes"
        className="hidden md:block md:shrink-0 md:cursor-col-resize md:bg-transparent"
        style={{ width: RESIZE_HANDLE_WIDTH_PX, touchAction: 'none' }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        <div className="h-full w-px mx-auto bg-gray-600" />
      </div>

      {/* Right pane (agendas) */}
      <div className="w-full md:flex-1 overflow-auto min-h-0 px-8 py-5">
        <h2>RIGHT PANE</h2>
      </div>
    </div>
  );
};

export default Notes;
