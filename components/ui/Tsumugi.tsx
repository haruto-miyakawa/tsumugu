import { ReactNode } from "react";

type Mood = "idle" | "happy" | "thinking" | "wink" | "writing";

const FACES: Record<Mood, { eyes: ReactNode; mouth: ReactNode }> = {
  idle: {
    eyes: (
      <>
        <circle cx="28" cy="48" r="4" fill="#1B1A17" />
        <circle cx="44" cy="48" r="4" fill="#1B1A17" />
        <circle cx="29.5" cy="46" r="1.8" fill="white" />
        <circle cx="45.5" cy="46" r="1.8" fill="white" />
      </>
    ),
    mouth: <path d="M29 62 Q36 68 43 62" stroke="#1B1A17" strokeWidth="2" fill="none" strokeLinecap="round" />,
  },
  happy: {
    eyes: (
      <>
        <path d="M24 49 Q28 44 32 49" stroke="#1B1A17" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M40 49 Q44 44 48 49" stroke="#1B1A17" strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    ),
    mouth: <path d="M27 61 Q36 70 45 61" stroke="#1B1A17" strokeWidth="2" fill="none" strokeLinecap="round" />,
  },
  thinking: {
    eyes: (
      <>
        <circle cx="28" cy="48" r="4" fill="#1B1A17" />
        <ellipse cx="44" cy="47" rx="4" ry="3" fill="#1B1A17" />
        <circle cx="29.5" cy="46" r="1.8" fill="white" />
        <circle cx="45.5" cy="46" r="1.5" fill="white" />
      </>
    ),
    mouth: <path d="M31 63 Q34 62 40 65" stroke="#1B1A17" strokeWidth="2" fill="none" strokeLinecap="round" />,
  },
  wink: {
    eyes: (
      <>
        <path d="M24 48 Q28 44 32 48" stroke="#1B1A17" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="44" cy="48" r="4" fill="#1B1A17" />
        <circle cx="45.5" cy="46" r="1.8" fill="white" />
      </>
    ),
    mouth: <path d="M29 62 Q36 68 43 62" stroke="#1B1A17" strokeWidth="2" fill="none" strokeLinecap="round" />,
  },
  writing: {
    eyes: (
      <>
        <ellipse cx="28" cy="49" rx="3.5" ry="4.5" fill="#1B1A17" />
        <ellipse cx="44" cy="49" rx="3.5" ry="4.5" fill="#1B1A17" />
        <circle cx="29" cy="47" r="1.5" fill="white" />
        <circle cx="45" cy="47" r="1.5" fill="white" />
      </>
    ),
    mouth: <line x1="30" y1="62" x2="42" y2="62" stroke="#1B1A17" strokeWidth="2" strokeLinecap="round" />,
  },
};

interface TsumugiProps {
  size?: number;
  mood?: Mood;
  accent?: string;
  className?: string;
}

export function Tsumugi({ size = 72, mood = "idle", accent = "#E27A2D", className = "" }: TsumugiProps) {
  const { eyes, mouth } = FACES[mood];
  return (
    <svg
      width={size}
      height={Math.round(size * (88 / 72))}
      viewBox="0 0 72 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Body */}
      <ellipse cx="36" cy="56" rx="26" ry="30" fill="#FBF8F1" stroke="#1B1A17" strokeWidth="2.5" />
      {/* Bow — left lobe */}
      <ellipse cx="27" cy="22" rx="8" ry="5.5" fill={accent} stroke="#1B1A17" strokeWidth="1.8" transform="rotate(-20 27 22)" />
      {/* Bow — right lobe */}
      <ellipse cx="45" cy="22" rx="8" ry="5.5" fill={accent} stroke="#1B1A17" strokeWidth="1.8" transform="rotate(20 45 22)" />
      {/* Bow — center knot */}
      <circle cx="36" cy="24" r="5" fill={accent} stroke="#1B1A17" strokeWidth="1.8" />
      <circle cx="36" cy="24" r="2" fill="#1B1A17" />
      {/* Cheeks */}
      <ellipse cx="14" cy="60" rx="8" ry="6" fill="#E84B7C" fillOpacity="0.2" />
      <ellipse cx="58" cy="60" rx="8" ry="6" fill="#E84B7C" fillOpacity="0.2" />
      {/* Expression */}
      {eyes}
      {mouth}
    </svg>
  );
}

export function TsumugiTiny({ size = 24, accent = "#E27A2D", className = "" }: { size?: number; accent?: string; className?: string }) {
  return (
    <svg
      width={size}
      height={Math.round(size * (88 / 72))}
      viewBox="0 0 72 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <ellipse cx="36" cy="56" rx="26" ry="30" fill="#FBF8F1" stroke="#1B1A17" strokeWidth="2.5" />
      <ellipse cx="27" cy="22" rx="8" ry="5.5" fill={accent} stroke="#1B1A17" strokeWidth="1.8" transform="rotate(-20 27 22)" />
      <ellipse cx="45" cy="22" rx="8" ry="5.5" fill={accent} stroke="#1B1A17" strokeWidth="1.8" transform="rotate(20 45 22)" />
      <circle cx="36" cy="24" r="5" fill={accent} stroke="#1B1A17" strokeWidth="1.8" />
      <circle cx="36" cy="24" r="2" fill="#1B1A17" />
      <circle cx="28" cy="48" r="3.5" fill="#1B1A17" />
      <circle cx="44" cy="48" r="3.5" fill="#1B1A17" />
      <circle cx="29.5" cy="46" r="1.5" fill="white" />
      <circle cx="45.5" cy="46" r="1.5" fill="white" />
      <path d="M29 62 Q36 68 43 62" stroke="#1B1A17" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
