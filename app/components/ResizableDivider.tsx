import { useRef, useEffect } from 'react';

interface ResizableDividerProps {
  onResize: (width: number) => void;
}

export default function ResizableDivider({ onResize }: ResizableDividerProps) {
  const dividerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = e.clientX - startX.current;
      const newWidth = startWidth.current + delta;
      if (newWidth >= 300 && newWidth <= 600) {
        onResize(newWidth);
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onResize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDragging.current = true;
    startX.current = e.clientX;
    const sidebarElement = dividerRef.current?.previousElementSibling;
    startWidth.current = sidebarElement?.getBoundingClientRect().width || 320;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  // Only show on desktop
  return (
    <div
      ref={dividerRef}
      className="w-1 hover:bg-blue-400 bg-gray-200 cursor-col-resize transition-colors h-[calc(100vh-4rem)] hidden md:block"
      onMouseDown={handleMouseDown}
    />
  );
}
