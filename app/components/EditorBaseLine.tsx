import { ReactNode } from 'react';

export default function EditorBaseLine({ children }: { children: ReactNode }) {
  return (
    <svg
      className="absolute inset-0 z-20 overflow-visible"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
      stroke="url(#curve-gradient)"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id="curve-gradient">
          <stop offset="0%" stopColor="var(--svg-line-gradient-from)" />
          <stop offset="50%" stopColor="var(--svg-line-gradient-via)" />
          <stop offset="100%" stopColor="var(--svg-line-gradient-to)" />
        </linearGradient>
        <filter id="f1" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={4} />
        </filter>
      </defs>
      {children}
    </svg>
  );
}
