import { CSSProperties, PropsWithChildren } from 'react';

export default function NotWide({
  children,
  style = {},
}: PropsWithChildren<{ style?: CSSProperties }>) {
  return <div style={{ maxWidth: '300px', ...style }}>{children}</div>;
}
