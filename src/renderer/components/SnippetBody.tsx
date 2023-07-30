import { ReactNode, useRef, useState, useEffect } from 'react';
import { Button } from 'antd';
import './SnippetBody.css';

const SnippetBody: React.FC<{
  body: string;
  theme: any;
  truncateHeight?: number;
  refToScrollOnCollapse?: React.RefObject<HTMLDivElement>;
}> = ({ body, theme, truncateHeight = 170, refToScrollOnCollapse }) => {
  return (
    <TruncatedComponent
      height={truncateHeight}
      bgColor={theme.token.colorBgContainer}
      refToScrollOnCollapse={refToScrollOnCollapse}
    >
      <pre
        style={{
          whiteSpace: 'pre-wrap',
          fontSize: '0.9rem',
          lineHeight: '1.4',
        }}
      >
        {body}
      </pre>
    </TruncatedComponent>
  );
};

interface TruncatedComponentProps {
  children: ReactNode;
  height: number;
  bgColor?: string;
  refToScrollOnCollapse?: React.RefObject<HTMLElement>;
}

function TruncatedComponent({
  children,
  height,
  bgColor,
  refToScrollOnCollapse,
}: TruncatedComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isConsummingViewport, setIsConsummingViewport] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      setIsTruncated(containerHeight > height);
    }
  }, [height]);

  useEffect(() => {
    const checkConsummingViewportTimer = setInterval(() => {
      const clientRect = containerRef.current?.getBoundingClientRect();
      if (!clientRect) return null;
      if (clientRect.top < 70 && window.innerHeight - clientRect.bottom < 70) {
        setIsConsummingViewport(true);
      } else {
        setIsConsummingViewport(false);
      }
      return null;
    }, 300);

    return () => {
      clearInterval(checkConsummingViewportTimer);
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        maxHeight: expanded ? 'unset' : `${height}px`,
        overflow: 'hidden',
      }}
      className="snippet-body"
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
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {!expanded && (
            <Button
              type="primary"
              className="expand-button"
              onClick={() => {
                setExpanded(true);
              }}
            >
              Expand
            </Button>
          )}
          {expanded && (
            <Button
              type="primary"
              style={{
                position: isConsummingViewport ? 'fixed' : 'relative',
                bottom: isConsummingViewport ? 30 : 5,
              }}
              onClick={() => {
                setExpanded(false);
                if (refToScrollOnCollapse) {
                  refToScrollOnCollapse.current?.scrollIntoView();
                } else {
                  containerRef.current?.scrollIntoView();
                }
              }}
            >
              Collapse
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default SnippetBody;
