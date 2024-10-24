import { ReactNode, useState } from 'react';

export default function EditorBase({ children }: { children: ReactNode }) {
  const [extraSpaceTop, setExtraSpaceTop] = useState(false);
  const [extraSpaceBottom, setExtraSpaceBottom] = useState(false);

  return (
    <div>
      <div className="relative z-10 select-none">
        {/* SVG Background */}
        <svg
          className="w-full text-zinc-700"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.25"
        >
          <rect x="0" y="0" width="100" height="100" />
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={i} x1="0" y1={i * 10} x2="100" y2={i * 10} />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={i} x1={i * 10} y1="0" x2={i * 10} y2="100" />
          ))}
        </svg>
        {/* Gradient Overlay */}
        <div className="absolute -inset-0.5 z-10 bg-[radial-gradient(circle_at_100%_0%,var(--tw-gradient-stops))] from-transparent to-zinc-950/80" />
        {/* Children */}
        {children}
      </div>
    </div>
  );
}
