import { useState, useRef, useEffect, CSSProperties } from 'react';

interface TruncatedTextProps {
  text: string;
  tag?: keyof JSX.IntrinsicElements;
  lineCount?: number;
  style?: CSSProperties;
}

export default function TruncatedText({
  text,
  tag = 'p',
  lineCount = 4,
  style,
}: TruncatedTextProps) {
  const [isTruncated, setIsTruncated] = useState(true);
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(getComputedStyle(textRef.current).lineHeight);
      const maxHeight = lineHeight * lineCount;
      const actualHeight = textRef.current.scrollHeight;
      setIsTruncated(actualHeight > maxHeight);
    }
  }, [text, lineCount]);

  const commonStyle: CSSProperties = {
    ...style,
  };

  const truncatedStyle: CSSProperties = {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    WebkitLineClamp: lineCount,
  };

  const TruncatedTag = tag;

  const truncatedText = isTruncated ? (
    <TruncatedTag style={{ ...truncatedStyle, ...commonStyle }} ref={textRef}>
      {text}
    </TruncatedTag>
  ) : (
    <TruncatedTag style={commonStyle} ref={textRef}>
      {text}
    </TruncatedTag>
  );

  return truncatedText;
}
