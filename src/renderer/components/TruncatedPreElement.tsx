import { useState, useEffect, useRef } from 'react';

interface TruncatedPreElementProps {
  text?: string;
  lineCount: number;
  style?: React.CSSProperties;
}

export default function TruncatedPreElement({
  text = '',
  lineCount,
  style,
}: TruncatedPreElementProps) {
  const [isTruncated, setIsTruncated] = useState(true);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (preRef.current) {
      const lineHeight = parseInt(getComputedStyle(preRef.current).lineHeight);
      const maxHeight = lineHeight * lineCount;
      const actualHeight = preRef.current.scrollHeight;
      setIsTruncated(actualHeight > maxHeight);
    }
  }, [text, lineCount]);

  return (
    <pre
      style={{ ...style, whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}
      ref={preRef}
    >
      {isTruncated
        ? `${text.split('\n').slice(0, lineCount).join('\n')}...`
        : text}
    </pre>
  );
}
