import type { SVGProps } from 'react';

const ExternalLinkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7 17 17 7M9 7h8v8"
    />
  </svg>
);
export default ExternalLinkIcon;
