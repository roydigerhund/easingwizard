import type { SVGProps } from 'react';

const CSSIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="m20 5-2.133 12.267-7.444 2.666L4 17.267l.653-3.16h2.734L7.12 15.46 11 16.94l4.47-1.48.627-3.237H4.983l.534-2.733H16.64l.35-1.757H5.877L6.42 5z"
    />
  </svg>
);
export default CSSIcon;
