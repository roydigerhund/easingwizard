import React, { useState } from 'react';
import { classNames } from '~/utils/class-names';

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
    }
  }

  function handlePointerMove(e: React.PointerEvent<SVGCircleElement>) {
    if (element.active) {
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
  }

  return (
    <g
      className={classNames('relative group cursor-grab active:cursor-grabbing', className)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      <circle
        className={classNames(
          'opacity-0 stroke-current',
          'transition-[stroke-width,opacity]',
          'ease-in duration-[300ms]',
          'group-hover:duration-[1500ms] group-hover:ease-spring',
          'group-hover:stroke-[6] group-hover:opacity-50',
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
