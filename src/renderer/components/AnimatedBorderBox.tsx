import React from 'react';
import { useTheme } from '../hooks';

const AnimatedBorderBox: React.FC<React.PropsWithChildren> = ({ children }) => {
  const theme = useTheme();

  const animationBgColor = theme.token.colorPrimary;

  return (
    <div className="box-outer">
      <div
        className="main-box list-card"
        style={{ borderColor: theme.token.colorBgContainer }}
      >
        <div className="bar top" style={{ background: animationBgColor }} />
        <div
          className="bar right delay"
          style={{ background: animationBgColor }}
        />
        <div
          className="bar bottom delay"
          style={{ background: animationBgColor }}
        />
        <div className="bar left" style={{ background: animationBgColor }} />
        {children}
      </div>
    </div>
  );
};

export default AnimatedBorderBox;
