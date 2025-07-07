import type { SVGProps } from 'react';

const InfinityIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M14 15.742A4.5 4.5 0 1 0 16.5 7.5C14.015 7.5 13 9.515 12 12s-2.015 4.5-4.5 4.5A4.5 4.5 0 1 1 10 8.258"
    />
  </svg>
);
export default InfinityIcon;
