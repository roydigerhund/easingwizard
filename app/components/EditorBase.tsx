import { ReactNode, useState } from 'react';
import { classNames } from '~/utils/class-names';

export default function EditorBase({ children }: { children: ReactNode }) {
  const [extraSpaceTop, setExtraSpaceTop] = useState(false);
  const [extraSpaceBottom, setExtraSpaceBottom] = useState(false);

  return (
    <div>
      <div
        className={classNames(
          extraSpaceTop && 'aspect-square',
          'p-4 border-t border-x border-gray-300 dark:border-gray-700 text-center',
        )}
        role="button"
        tabIndex={0}
        onClick={() => setExtraSpaceTop(!extraSpaceTop)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setExtraSpaceTop(!extraSpaceTop);
          }
        }}
      >
        {extraSpaceTop ? '-' : '+'}
      </div>
      <div className="relative z-10 select-none">
        {/* SVG Background */}
        <svg
          className="w-full text-gray-300 dark:text-gray-700"
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
        <div className="absolute -inset-0.5 z-10 bg-[radial-gradient(circle_at_100%_0%,var(--tw-gradient-stops))] from-transparent to-white/80 dark:to-gray-950/80" />
        {/* Children */}
        {children}
      </div>
      <div
        className={classNames(
          extraSpaceBottom && 'aspect-square',
          'p-4 border-b border-x border-gray-300 dark:border-gray-700 text-center',
        )}
        role="button"
        tabIndex={0}
        onClick={() => setExtraSpaceBottom(!extraSpaceBottom)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setExtraSpaceBottom(!extraSpaceBottom);
          }
        }}
      >
        {extraSpaceBottom ? '-' : '+'}
      </div>
    </div>
  );
}
