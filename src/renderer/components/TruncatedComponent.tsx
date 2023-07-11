import { ReactNode, useRef, useState, useEffect } from 'react';

interface TruncatedComponentProps {
  children: ReactNode;
  height: number;
  bgColor?: string;
}

export default function TruncatedComponent({
  children,
  height,
  bgColor,
}: TruncatedComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      setIsTruncated(containerHeight > height);
    }
  }, [height]);

  return (
    <div
      style={{
        position: 'relative',
        maxHeight: `${height}px`,
        overflow: 'hidden',
      }}
    >
      <div ref={containerRef}>{children}</div>
      {isTruncated && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '70px',
            background: `linear-gradient(to top, ${bgColor}, 30%, transparent`,
          }}
        />
      )}
    </div>
  );
}
