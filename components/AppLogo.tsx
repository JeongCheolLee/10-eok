export function AppLogo({ className = "logo" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden>
      <rect width="64" height="64" rx="15" fill="#1ed760" />
      <g fill="none" stroke="#0b0b0b" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 26 l6 -4 v24" />
        <path d="M49 35 a11 11 0 1 0 -4 8" />
        <path d="M33 43 l6 -6 4 4 8 -9" />
        <path d="M46 27 h5 v5" />
      </g>
    </svg>
  );
}
