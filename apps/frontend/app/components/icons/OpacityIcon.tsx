import type { SVGProps } from 'react';

const OpacityIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M10 4h4m-4 16h4M4 14v-4m16 4v-4M4 7V6a2 2 0 0 1 2-2h1m10 0h1a2 2 0 0 1 2 2v1m0 10v1a2 2 0 0 1-2 2h-1M7 20H6a2 2 0 0 1-2-2v-1"
    />
  </svg>
);
export default OpacityIcon;
