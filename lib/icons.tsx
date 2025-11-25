export function chooseIcon(type: string) {
  switch (type) {
    case "shield":
      return <ShieldIcon />;
    case "check":
      return <CheckIcon />;
    case "thumb":
      return <ThumbIcon />;
    default:
      return <TagIcon />;
  }
}

function ShieldIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3 4 6v6c0 5.25 4 9.5 8 10 4-0.5 8-4.75 8-10V6l-8-3Z"
        stroke="#0047AB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="#0047AB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path
        d="m6 12 4 4 8-8"
        stroke="#0047AB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ThumbIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path
        d="M10 21h8.5a2.5 2.5 0 0 0 2.45-2.05l1-6A2.5 2.5 0 0 0 19.5 10H14V5.5a2.5 2.5 0 0 0-5 0V7l-4 5v9h5Z"
        stroke="#0047AB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 12h3v9H4z"
        stroke="#0047AB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 11.5 11.5 3H19a2 2 0 0 1 2 2v7.5L12.5 21a2 2 0 0 1-2.83 0L3 14.33a2 2 0 0 1 0-2.83Z"
        stroke="#0047AB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="15" cy="7.5" r="1.25" fill="#0047AB" />
    </svg>
  );
}

