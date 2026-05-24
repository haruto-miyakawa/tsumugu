import type { CSSProperties } from "react";

export type IconName =
  | "plus"
  | "search"
  | "sparkle"
  | "pen"
  | "eye"
  | "list"
  | "menu"
  | "arrow-right"
  | "arrow-left"
  | "check"
  | "x"
  | "image"
  | "tag"
  | "heart"
  | "comment"
  | "send"
  | "wand"
  | "reload"
  | "bell"
  | "folder"
  | "calendar"
  | "settings"
  | "dots"
  | "h1"
  | "h2"
  | "quote"
  | "bold"
  | "italic";

interface IconProps {
  name: IconName;
  size?: number;
  stroke?: number;
  className?: string;
  style?: CSSProperties;
}

export function Icon({ name, size = 18, stroke = 1.6, className, style }: IconProps) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
    style: { display: "block", flex: "0 0 auto", ...style },
  };

  switch (name) {
    case "plus":
      return <svg {...props}><path d="M12 5v14M5 12h14" /></svg>;
    case "search":
      return <svg {...props}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>;
    case "sparkle":
      return <svg {...props}><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" /><path d="M19 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" /></svg>;
    case "pen":
      return <svg {...props}><path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" /><path d="M14 6l3 3" /></svg>;
    case "eye":
      return <svg {...props}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>;
    case "list":
      return <svg {...props}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>;
    case "menu":
      return <svg {...props}><path d="M3 6h18M3 12h18M3 18h18" /></svg>;
    case "arrow-right":
      return <svg {...props}><path d="M5 12h14M13 5l7 7-7 7" /></svg>;
    case "arrow-left":
      return <svg {...props}><path d="M19 12H5M11 5l-7 7 7 7" /></svg>;
    case "check":
      return <svg {...props}><path d="M5 12l5 5L20 7" /></svg>;
    case "x":
      return <svg {...props}><path d="M18 6L6 18M6 6l12 12" /></svg>;
    case "image":
      return <svg {...props}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-7 8" /></svg>;
    case "tag":
      return <svg {...props}><path d="M3 12V4h8l10 10-8 8L3 12z" /><circle cx="8" cy="8" r="1.4" fill="currentColor" /></svg>;
    case "heart":
      return <svg {...props}><path d="M12 21s-7-4.5-9.5-9C.7 8.5 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.3 4.5 4.5 8-2.5 4.5-9.5 9-9.5 9z" /></svg>;
    case "comment":
      return <svg {...props}><path d="M21 12a8 8 0 0 1-12 7l-5 1 1-5A8 8 0 1 1 21 12z" /></svg>;
    case "send":
      return <svg {...props}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>;
    case "wand":
      return <svg {...props}><path d="M15 4l-1 3-3 1 3 1 1 3 1-3 3-1-3-1z" /><path d="M3 21l9-9" /><path d="M12 12l3 3" /></svg>;
    case "reload":
      return <svg {...props}><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" /></svg>;
    case "bell":
      return <svg {...props}><path d="M18 16V11a6 6 0 1 0-12 0v5l-2 2h16l-2-2z" /><path d="M10 21h4" /></svg>;
    case "folder":
      return <svg {...props}><path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" /></svg>;
    case "calendar":
      return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></svg>;
    case "settings":
      return <svg {...props}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8L4.2 7a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>;
    case "dots":
      return <svg {...props}><circle cx="5" cy="12" r="1.4" fill="currentColor" /><circle cx="12" cy="12" r="1.4" fill="currentColor" /><circle cx="19" cy="12" r="1.4" fill="currentColor" /></svg>;
    case "h1":
      return <svg {...props}><path d="M4 4v16M14 4v16M4 12h10" /><path d="M18 9l2-1v12" /></svg>;
    case "h2":
      return <svg {...props}><path d="M4 4v16M14 4v16M4 12h10" /><path d="M18 10c0-1 1-2 2-2s2 1 2 2-4 4-4 6h4" /></svg>;
    case "quote":
      return <svg {...props}><path d="M7 7h4v4a4 4 0 0 1-4 4M14 7h4v4a4 4 0 0 1-4 4" /></svg>;
    case "bold":
      return <svg {...props}><path d="M6 4h6a4 4 0 0 1 0 8H6zM6 12h7a4 4 0 0 1 0 8H6z" /></svg>;
    case "italic":
      return <svg {...props}><path d="M19 4h-9M14 20H5M15 4l-6 16" /></svg>;
    default:
      return null;
  }
}
