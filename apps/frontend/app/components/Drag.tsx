import React, { useState } from 'react';
import { classNames } from '~/css/class-names';

type DragElement = {
  active: boolean;
  xOffset: number;
  yOffset: number;
};

type DragProps = {
  x: number;
  y: number;
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
  onChange: (x: number, y: number) => void;
  className: string;
};

export default function Drag(props: DragProps) {
  const elementRef = React.createRef<SVGCircleElement>();
  const { x, y, minX = -Infinity, maxX = Infinity, minY = -Infinity, maxY = Infinity, onChange, className } = props;

  const [element, setElement] = useState<DragElement>({
    active: false,
    xOffset: 0,
    yOffset: 0,
  });

  function handlePointerDown(e: React.PointerEvent<SVGCircleElement>) {
    const svg = e.currentTarget.ownerSVGElement;
    if (svg) {
      e.stopPropagation();
      e.preventDefault();
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());

      setElement({
        ...element,
        xOffset: svgPt.x - x,
        yOffset: svgPt.y - y,
        active: true,
      });

      e.currentTarget.setPointerCapture(e.pointerId);

      document.body.classList.add('lock-scroll');
    }
  }

  function handlePointerMove(e: React.PointerEvent<SVGCircleElement>) {
    if (element.active) {
      e.stopPropagation();
      e.preventDefault();
      const svg = e.currentTarget.ownerSVGElement;
      if (svg) {
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());

        let newX = svgPt.x - element.xOffset;
        let newY = svgPt.y - element.yOffset;

        // Apply constraints
        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));

        if (onChange) {
          onChange(newX, newY);
        }
      }
    }
  }

  function handlePointerUp() {
    setElement({ ...element, active: false });

    document.body.classList.remove('lock-scroll');
  }

  return (
    <g
      ref={elementRef}
      className={classNames('group relative cursor-grab touch-none select-none active:cursor-grabbing', className)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <circle
        className={classNames(
          'stroke-current opacity-0',
          'transition-[stroke-width,opacity]',
          'duration-300 ease-in',
          'group-hover:duration-1500 group-hover:ease-spring',
          'group-hover:stroke-6 group-hover:opacity-50',
        )}
        cx={x}
        cy={y}
        r={2}
        strokeWidth={2}
        fill="none"
      />
      <circle className={classNames('fill-zinc-950 stroke-current')} cx={x} cy={y} r={3} strokeWidth={1} />
    </g>
  );
}
