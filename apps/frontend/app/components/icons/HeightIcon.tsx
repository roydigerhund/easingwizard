import type { SVGProps } from 'react';

const HeightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7.5 7.5 12 3m0 0 4.5 4.5M12 3v18m4.5-4.5L12 21m0 0-4.5-4.5"
    />
  </svg>
);
export default HeightIcon;
