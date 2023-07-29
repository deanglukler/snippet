import React from 'react';

const AnimatedBorderBox: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="box-outer">
      <div className="main-box list-card">
        <div className="bar top" />
        <div className="bar right delay" />
        <div className="bar bottom delay" />
        <div className="bar left" />
        {children}
      </div>
    </div>
  );
};

export default AnimatedBorderBox;
