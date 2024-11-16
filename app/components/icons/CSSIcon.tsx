import type { SVGProps } from 'react';

const CSSIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="m19 6-2 11.5-6.978 2.5L4 17.5l.612-2.963h2.563l-.25 1.27 3.638 1.387 4.19-1.388.588-3.034H4.92l.5-2.563H15.85l.328-1.646H5.76L6.27 6z"
    />
  </svg>
);
export default CSSIcon;
