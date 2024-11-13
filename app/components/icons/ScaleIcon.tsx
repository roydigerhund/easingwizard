import type { SVGProps } from 'react';

const ScaleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M10 8a2 2 0 0 0-2 2m6-2a2 2 0 0 1 2 2m0 4a2 2 0 0 1-2 2m-4 0a2 2 0 0 1-2-2M4 9V6a2 2 0 0 1 2-2h2m7 0h3a2 2 0 0 1 2 2v3m0 6v3a2 2 0 0 1-2 2h-3m-6 0H6a2 2 0 0 1-2-2v-3"
    />
  </svg>
);
export default ScaleIcon;
