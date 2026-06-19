import type { SVGProps } from 'react';

const CurlyBracesIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 4c-1.5 0-2.25.75-2.25 2.25V9c0 1.5-.75 2.25-2.25 3 1.5.75 2.25 1.5 2.25 3v2.75C5.75 19.25 6.5 20 8 20M16 4c1.5 0 2.25.75 2.25 2.25V9c0 1.5.75 2.25 2.25 3-1.5.75-2.25 1.5-2.25 3v2.75C18.25 19.25 17.5 20 16 20"
    />
  </svg>
);
export default CurlyBracesIcon;
