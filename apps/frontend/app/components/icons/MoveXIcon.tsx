import type { SVGProps } from 'react';

const MoveXIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7.5 16.5 3 12m0 0 4.5-4.5M3 12h5m8.5-4.5L21 12m0 0-4.5 4.5M21 12h-5"
    />
    <path fill="currentColor" d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
  </svg>
);
export default MoveXIcon;
