import _ from 'lodash';
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import mousePosition from '../mousePosition';

interface Props {
  anchorRef: React.RefObject<HTMLElement>;
  content: React.ReactNode;
  onBlur?: () => void;
}

function getPopoverPosition(anchor: HTMLElement, popover: HTMLElement) {
  const popoverWidth = popover.offsetWidth;

  const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = anchor;

  const position = {
    x: offsetLeft + offsetWidth / 2 - popoverWidth / 2,
    y: offsetTop + offsetHeight + 10,
  };

  if (position.x + popoverWidth > window.innerWidth - 10) {
    position.x = window.innerWidth - popoverWidth - 10;
  }
  if (position.x < 10) {
    position.x = 10;
  }
  return position;
}

const Popover: React.FC<PropsWithChildren<Props>> = ({
  content,
  children,
  anchorRef,
  onBlur,
}) => {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [popOverPosition, setPopOverPosition] = useState({
    x: 0,
    y: 0,
  });

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fadeOut) {
      setTimeout(() => {
        setShow(false);
        setFadeOut(false);
        if (onBlur) {
          onBlur();
        }
      }, 250);
    }
  }, [fadeOut, onBlur]);

  useEffect(() => {
    const debounceCheckIfMouseGone = _.debounce(function () {
      if (!anchorRef.current || !popoverRef.current) {
        return console.error('ref is missing :S');
      }

      if (
        !mouseIsHoveringElement(anchorRef.current, {
          position: { x: mousePosition.getX(), y: mousePosition.getY() },
        }) &&
        !mouseIsHoveringElement(popoverRef.current, {
          position: { x: mousePosition.getX(), y: mousePosition.getY() },
        })
      ) {
        setFadeOut(true);
      }
    }, 200);

    const debounceHandleMouseOverAnchor = _.debounce(function () {
      if (!anchorRef.current || !popoverRef.current) {
        return console.error('ref element missing :S');
      }
      if (
        !mouseIsHoveringElement(anchorRef.current, {
          position: { x: mousePosition.getX(), y: mousePosition.getY() },
        })
      ) {
        return;
      }

      const anchor = anchorRef.current;
      const popover = popoverRef.current;

      setPopOverPosition(getPopoverPosition(anchor, popover));
      setShow(true);
      return;
    }, 400);

    const onMouseEvent = (event: MouseEvent) => {
      if (!anchorRef.current) {
        return console.error('anchorRef Element missing :S');
      }
      if (mouseIsHoveringElement(anchorRef.current, { mouseEvent: event })) {
        debounceHandleMouseOverAnchor();
      }
      if (show) {
        debounceCheckIfMouseGone();
      }
    };

    window.addEventListener('mousemove', onMouseEvent);

    return () => {
      window.removeEventListener('mousemove', onMouseEvent);
    };
  }, [anchorRef, show]);

  return (
    <>
      <div
        ref={popoverRef}
        style={{
          visibility: `${show ? 'visible' : 'hidden'}`,
          opacity: `${!fadeOut ? 1 : 0}`,
          transition: 'opacity 0.1s ease-in-out',
          position: 'fixed',
          zIndex: 1000,
          left: popOverPosition.x,
          top: `${show ? popOverPosition.y : -10000}px`,
        }}
      >
        {content}
      </div>
      {children}
    </>
  );
};

export default Popover;

function mouseIsHoveringElement(
  element: HTMLElement,
  position: {
    mouseEvent?: MouseEvent;
    position?: { x: number; y: number };
  }
): boolean {
  const { mouseEvent, position: mpos } = position;

  if (mouseEvent) {
    const { clientX, clientY } = mouseEvent;

    return (
      clientX >= element.offsetLeft &&
      clientX <= element.offsetLeft + element.offsetWidth &&
      clientY >= element.offsetTop &&
      clientY <= element.offsetTop + element.offsetHeight
    );
  }

  if (mpos) {
    const { x, y } = mpos;

    return (
      x >= element.offsetLeft &&
      x <= element.offsetLeft + element.offsetWidth &&
      y >= element.offsetTop &&
      y <= element.offsetTop + element.offsetHeight
    );
  }

  return false;
}
