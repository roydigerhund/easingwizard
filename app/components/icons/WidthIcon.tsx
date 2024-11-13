import type { SVGProps } from 'react';

const WidthIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7.5 16.5 3 12m0 0 4.5-4.5M3 12h18m-4.5-4.5L21 12m0 0-4.5 4.5"
    />
  </svg>
);
export default WidthIcon;
