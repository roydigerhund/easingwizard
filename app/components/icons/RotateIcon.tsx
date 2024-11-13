import type { SVGProps } from 'react';

const RotateIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M10.052 3.213a9 9 0 0 1 3.511-.079m7.224 6.918a9 9 0 0 1 .079 3.511m-6.918 7.224a9 9 0 0 1-3.511.079m-7.224-6.918a9 9 0 0 1-.079-3.511m16.457 6.399a9 9 0 0 1-2.428 2.538m-9.999.216a9 9 0 0 1-2.538-2.426m-.217-10a9 9 0 0 1 2.427-2.538M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
    <path fill="currentColor" d="M16.596 7.11a2.5 2.5 0 1 0 3.536-3.535 2.5 2.5 0 0 0-3.536 3.536" />
  </svg>
);
export default RotateIcon;
