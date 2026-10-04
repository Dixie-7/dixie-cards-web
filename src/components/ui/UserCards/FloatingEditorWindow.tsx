import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from 'react';

interface FloatingEditorWindowProps {
  title: string;
  description: string;
  children: ReactNode;
  avoidSelector?: string | null;
  onClose: () => void;
}

interface Position {
  x: number;
  y: number;
}

interface DragState {
  offsetX: number;
  offsetY: number;
}

const viewportPadding = 16;
const defaultWidth = 460;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getClampedPosition(position: Position, width: number, height: number) {
  const maxX = Math.max(viewportPadding, window.innerWidth - width - viewportPadding);
  const maxY = Math.max(viewportPadding, window.innerHeight - height - viewportPadding);

  return {
    x: clamp(position.x, viewportPadding, maxX),
    y: clamp(position.y, viewportPadding, maxY),
  };
}

function getDefaultPosition(panel: HTMLDivElement, avoidSelector?: string | null) {
  const panelRect = panel.getBoundingClientRect();
  const width = panelRect.width || Math.min(defaultWidth, window.innerWidth - viewportPadding * 2);
  const height = panelRect.height || Math.min(720, window.innerHeight - viewportPadding * 2);
  const fallback = getClampedPosition(
    {
      x: window.innerWidth - width - viewportPadding,
      y: 96,
    },
    width,
    height,
  );

  if (!avoidSelector) {
    return fallback;
  }

  const target = document.querySelector(avoidSelector);

  if (!(target instanceof HTMLElement)) {
    return fallback;
  }

  const targetRect = target.getBoundingClientRect();
  const candidates = [
    {
      x: targetRect.right + viewportPadding,
      y: targetRect.top,
    },
    {
      x: targetRect.left - width - viewportPadding,
      y: targetRect.top,
    },
    {
      x: window.innerWidth - width - viewportPadding,
      y: viewportPadding,
    },
    {
      x: viewportPadding,
      y: viewportPadding,
    },
    {
      x: window.innerWidth - width - viewportPadding,
      y: window.innerHeight - height - viewportPadding,
    },
    {
      x: viewportPadding,
      y: window.innerHeight - height - viewportPadding,
    },
  ];

  const firstClearPosition = candidates
    .map((candidate) => getClampedPosition(candidate, width, height))
    .find((candidate) => {
      const candidateRect = {
        left: candidate.x,
        right: candidate.x + width,
        top: candidate.y,
        bottom: candidate.y + height,
      };

      return (
        candidateRect.right < targetRect.left ||
        candidateRect.left > targetRect.right ||
        candidateRect.bottom < targetRect.top ||
        candidateRect.top > targetRect.bottom
      );
    });

  return firstClearPosition ?? fallback;
}

export default function FloatingEditorWindow({
  title,
  description,
  children,
  avoidSelector = null,
  onClose,
}: FloatingEditorWindowProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);

  useEffect(() => {
    const panel = panelRef.current;

    if (!panel) {
      return;
    }

    setPosition(getDefaultPosition(panel, avoidSelector));
  }, [avoidSelector, title]);

  useEffect(() => {
    const handleResize = () => {
      const panel = panelRef.current;

      if (!panel) {
        return;
      }

      const panelRect = panel.getBoundingClientRect();

      setPosition((currentPosition) =>
        currentPosition
          ? getClampedPosition(currentPosition, panelRect.width, panelRect.height)
          : getDefaultPosition(panel, avoidSelector),
      );
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [avoidSelector]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !panelRef.current) {
      return;
    }

    const panelRect = panelRef.current.getBoundingClientRect();

    event.currentTarget.setPointerCapture(event.pointerId);
    setDragState({
      offsetX: event.clientX - panelRect.left,
      offsetY: event.clientY - panelRect.top,
    });
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragState || !panelRef.current) {
      return;
    }

    const panelRect = panelRef.current.getBoundingClientRect();

    setPosition(
      getClampedPosition(
        {
          x: event.clientX - dragState.offsetX,
          y: event.clientY - dragState.offsetY,
        },
        panelRect.width,
        panelRect.height,
      ),
    );
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setDragState(null);
  };

  return (
    <aside
      ref={panelRef}
      className="fixed z-50 flex max-h-[calc(100vh-2rem)] w-[calc(100vw_-_2rem)] max-w-[29rem] flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white text-left shadow-2xl shadow-zinc-950/20 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/40"
      style={{
        left: position?.x ?? viewportPadding,
        top: position?.y ?? 96,
      }}
      aria-label={title}
    >
      <div
        className="flex cursor-grab touch-none items-start justify-between gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-3 active:cursor-grabbing dark:border-zinc-800 dark:bg-zinc-900"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div>
          <p className="text-sm font-semibold text-zinc-950 dark:text-white">
            {title}
          </p>
          <p className="mt-0.5 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        </div>
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={onClose}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition hover:border-cyan-300 dark:border-zinc-800 dark:text-zinc-300"
          aria-label="Close editor"
          title="Close"
        >
          <XMarkIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="overflow-y-auto p-4">
        {children}
      </div>
    </aside>
  );
}
