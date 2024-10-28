type Props = {
  children: React.ReactNode;
};

export default function MeshBase({ children }: Props) {
  return (
    <div className="relative aspect-square w-full">
      <svg
        className="absolute inset-0 w-full border-t border-b border-zinc-800 text-zinc-700"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.25"
        strokeLinecap="square"
        style={{
          maskImage: 'radial-gradient(circle at 100% 0%,rgba(0,0,0,1),rgba(0,0,0,0.1))',
        }}
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={i} x1="0" y1={(i + 1) * 12.5} x2="100" y2={(i + 1) * 12.5} />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={i} x1={(i + 1) * 12.5} y1="0" x2={(i + 1) * 12.5} y2="100" />
        ))}
      </svg>
      {/* <div className="absolute -inset-0.5 z-10 bg-[radial-gradient(circle_at_100%_0%,var(--tw-gradient-stops))] from-transparent to-zinc-950/80" /> */}
      {children}
    </div>
  );
}
