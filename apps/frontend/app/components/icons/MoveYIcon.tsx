import type { SVGProps } from 'react';

const MoveYIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7.5 7.5 12 3m0 0 4.5 4.5M12 3v5m4.5 8.5L12 21m0 0-4.5-4.5M12 21v-5"
    />
    <path fill="currentColor" d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
  </svg>
);
export default MoveYIcon;
