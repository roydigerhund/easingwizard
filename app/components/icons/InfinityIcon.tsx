import type { SVGProps } from 'react';

const InfinityIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M14 15.242A4.5 4.5 0 1 0 16.5 7C14.015 7 13 9.015 12 11.5S9.985 16 7.5 16A4.5 4.5 0 1 1 10 7.758"
    />
  </svg>
);
export default InfinityIcon;
