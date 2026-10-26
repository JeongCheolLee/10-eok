export function AppLogo({ className = "logo" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" aria-hidden="true">
      <rect width="128" height="128" rx="30" fill="#00A56B" />
      <path d="M25 45L40 34H48V94H34V52L25 58Z" fill="white" />
      <rect x="61" y="34" width="42" height="60" rx="21" fill="white" />
      <rect x="75" y="47" width="14" height="34" rx="7" fill="#00A56B" />
    </svg>
  );
}
