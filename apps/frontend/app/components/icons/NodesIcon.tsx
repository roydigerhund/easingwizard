import type { SVGProps } from 'react';

const NodesIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
      <circle cx="5" cy="12" r="2.25" />
      <circle cx="18.5" cy="6" r="2.25" />
      <circle cx="18.5" cy="18" r="2.25" />
      <path d="m6.95 10.9 9.6-3.7M6.95 13.1l9.6 3.7" />
    </g>
  </svg>
);
export default NodesIcon;
