import type { Point } from '~/types';
import type { BezierInput } from '~/validations/easing';

export const generateBezierSVGPath = ({ x1, y1, x2, y2 }: BezierInput) => {
  return `M0,100 C${x1 * 100},${100 - y1 * 100} ${x2 * 100},${100 - y2 * 100} 100,0`;
};

export const generateSpringSVGPolyline = (points: Point[]) => {
  return points.map((point) => `${point.x},${point.y / 2 + 50}`).join(' ');
};

export const generateBounceSVGPolyline = (points: Point[]) => {
  return points.map((point) => `${point.x},${100 - point.y}`).join(' ');
};

export const generateWiggleSVGPolyline = (points: Point[]) => {
  return points.map((point) => `${point.x},${point.y / 2}`).join(' ');
};

export const generateOvershootSVGPolyline = (points: Point[]) => {
  return points.map((point) => `${point.x},${point.y / 2 + 25}`).join(' ');
};
