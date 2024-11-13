import type { SVGProps } from 'react';

const PlayIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 6.08a1 1 0 0 1 1.625-.78l7.399 5.92a1 1 0 0 1 0 1.56l-7.4 5.92A1 1 0 0 1 8 17.92z"
    />
  </svg>
);
export default PlayIcon;
