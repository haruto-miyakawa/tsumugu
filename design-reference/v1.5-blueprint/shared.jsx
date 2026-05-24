// shared.jsx — design tokens, icons, and small primitives used across screens.

const T = {
  bg: '#F7F4EE',          // warm cream
  paper: '#FFFFFF',
  ink: '#1B1A17',
  inkSoft: '#3A372F',
  mute: '#807A6E',
  muteSoft: '#B4AEA0',
  rule: '#E6E0D2',
  ruleSoft: '#EFEAD E'.replace(' ', ''),
  surface: '#FBF8F1',
  surface2: '#F1ECDF',
  highlight: '#FFF6BE',   // marker-yellow for AI suggestions
  // accents (set per accent palette by Tweaks; defaults below)
  accent: '#E84B7C',
  accentSoft: '#FFD9E5',
  mint: '#2BC4A5',
  serif: '"Noto Serif JP", "Hiragino Mincho ProN", serif',
  sans: '"Noto Sans JP", -apple-system, system-ui, "Hiragino Kaku Gothic ProN", sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
  display: '"Bebas Neue", "Oswald", sans-serif',
};

// ── Icons (minimal stroke set, 1.6 stroke, currentColor) ─────────────────
function Icon({ name, size = 18, stroke = 1.6, style }) {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round',
    style: { display: 'block', flex: '0 0 auto', ...style },
  };
  switch (name) {
    case 'plus': return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'search': return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>;
    case 'sparkle': return <svg {...props}><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><path d="M19 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></svg>;
    case 'pen': return <svg {...props}><path d="M4 20l4-1 11-11-3-3L5 16l-1 4z"/><path d="M14 6l3 3"/></svg>;
    case 'eye': return <svg {...props}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'list': return <svg {...props}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>;
    case 'menu': return <svg {...props}><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
    case 'arrow-right': return <svg {...props}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case 'arrow-left': return <svg {...props}><path d="M19 12H5M11 5l-7 7 7 7"/></svg>;
    case 'check': return <svg {...props}><path d="M5 12l5 5L20 7"/></svg>;
    case 'x': return <svg {...props}><path d="M18 6L6 18M6 6l12 12"/></svg>;
    case 'image': return <svg {...props}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-7 8"/></svg>;
    case 'tag': return <svg {...props}><path d="M3 12V4h8l10 10-8 8L3 12z"/><circle cx="8" cy="8" r="1.4" fill="currentColor"/></svg>;
    case 'heart': return <svg {...props}><path d="M12 21s-7-4.5-9.5-9C.7 8.5 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.3 4.5 4.5 8-2.5 4.5-9.5 9-9.5 9z"/></svg>;
    case 'comment': return <svg {...props}><path d="M21 12a8 8 0 0 1-12 7l-5 1 1-5A8 8 0 1 1 21 12z"/></svg>;
    case 'send': return <svg {...props}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>;
    case 'wand': return <svg {...props}><path d="M15 4l-1 3-3 1 3 1 1 3 1-3 3-1-3-1z"/><path d="M3 21l9-9"/><path d="M12 12l3 3"/></svg>;
    case 'reload': return <svg {...props}><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></svg>;
    case 'bell': return <svg {...props}><path d="M18 16V11a6 6 0 1 0-12 0v5l-2 2h16l-2-2z"/><path d="M10 21h4"/></svg>;
    case 'folder': return <svg {...props}><path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z"/></svg>;
    case 'calendar': return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>;
    case 'settings': return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8L4.2 7a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>;
    case 'dots': return <svg {...props}><circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/></svg>;
    case 'h1': return <svg {...props}><path d="M4 4v16M14 4v16M4 12h10"/><path d="M18 9l2-1v12"/></svg>;
    case 'h2': return <svg {...props}><path d="M4 4v16M14 4v16M4 12h10"/><path d="M18 10c0-1 1-2 2-2s2 1 2 2-4 4-4 6h4"/></svg>;
    case 'quote': return <svg {...props}><path d="M7 7h4v4a4 4 0 0 1-4 4M14 7h4v4a4 4 0 0 1-4 4"/></svg>;
    case 'bold': return <svg {...props}><path d="M6 4h6a4 4 0 0 1 0 8H6zM6 12h7a4 4 0 0 1 0 8H6z"/></svg>;
    case 'italic': return <svg {...props}><path d="M19 4h-9M14 20H5M15 4l-6 16"/></svg>;
    default: return null;
  }
}

// ── Placeholder image — striped SVG with monospace caption ──────────
function ImgPlaceholder({ w = '100%', h = 180, label = 'image', tone = T.surface2, accent = T.accent, radius = 4 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: radius, position: 'relative', overflow: 'hidden',
      background: `repeating-linear-gradient(135deg, ${tone} 0 8px, ${T.surface} 8px 16px)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: `1px dashed ${T.rule}`,
    }}>
      <div style={{
        background: T.paper, padding: '4px 8px', borderRadius: 2,
        font: `500 10px/1.2 ${T.mono}`, color: T.mute, letterSpacing: '0.04em',
        textTransform: 'uppercase', boxShadow: `inset 0 0 0 1px ${T.rule}`,
      }}>{label}</div>
    </div>
  );
}

// ── Buttons ──────────────────────────────────────────────────
function Btn({ children, kind = 'primary', size = 'md', icon, iconRight, style, accent = T.accent }) {
  const sz = size === 'sm'
    ? { h: 30, px: 12, fs: 12 } : size === 'lg' ? { h: 46, px: 22, fs: 14 } : { h: 36, px: 16, fs: 13 };
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6, height: sz.h, padding: `0 ${sz.px}px`,
    font: `500 ${sz.fs}px/1 ${T.sans}`, borderRadius: 999, border: '1.5px solid', cursor: 'pointer',
    letterSpacing: '0.01em', whiteSpace: 'nowrap',
  };
  const styles = {
    primary: { background: T.ink, color: T.paper, borderColor: T.ink },
    ghost: { background: 'transparent', color: T.ink, borderColor: T.ink },
    soft: { background: T.surface, color: T.ink, borderColor: T.rule },
    accent: { background: accent, color: T.paper, borderColor: accent },
    quiet: { background: 'transparent', color: T.mute, borderColor: 'transparent' },
  }[kind];
  return (
    <button style={{ ...base, ...styles, ...style }}>
      {icon && <Icon name={icon} size={sz.fs + 2} />}
      {children}
      {iconRight && <Icon name={iconRight} size={sz.fs + 2} />}
    </button>
  );
}

// ── Chip / Tag ───────────────────────────────────────────────
function Chip({ children, active = false, accent = T.accent, style }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '5px 10px', borderRadius: 999,
      font: `500 11px/1 ${T.sans}`, letterSpacing: '0.02em',
      background: active ? accent : T.surface,
      color: active ? T.paper : T.inkSoft,
      border: `1px solid ${active ? accent : T.rule}`,
      ...style,
    }}>{children}</span>
  );
}

// ── App Window Chrome (browser bar for desktop frames) ─────────────
function WindowChrome({ url = 'app.tsumugu.jp', children, accent = T.accent, frameBg = T.bg }) {
  return (
    <div style={{ width: '100%', height: '100%', background: frameBg, display: 'flex', flexDirection: 'column' }}>
      <div style={{
        height: 36, background: '#EFEAD E'.replace(' ', ''), borderBottom: `1px solid ${T.rule}`,
        display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, flex: '0 0 auto',
      }}>
        <span style={{ width: 10, height: 10, borderRadius: 5, background: '#FF5F57' }} />
        <span style={{ width: 10, height: 10, borderRadius: 5, background: '#FEBC2E' }} />
        <span style={{ width: 10, height: 10, borderRadius: 5, background: '#28C840' }} />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{
            background: T.paper, borderRadius: 6, padding: '4px 14px', minWidth: 280,
            font: `500 11px/1 ${T.mono}`, color: T.mute, textAlign: 'center',
            border: `1px solid ${T.rule}`,
          }}>{url}</div>
        </div>
        <Icon name="dots" size={14} style={{ color: T.mute }} />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>{children}</div>
    </div>
  );
}

// ── App Top Bar (inside the chrome) ──────────────────────────
function AppTopBar({ active = 'dashboard', accent = T.accent, compact = false }) {
  const Tab = ({ id, label }) => (
    <div style={{
      padding: '8px 0', position: 'relative',
      font: `500 13px/1 ${T.sans}`,
      color: active === id ? T.ink : T.mute,
    }}>
      {label}
      {active === id && (
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: -1, height: 2, background: T.ink,
        }} />
      )}
    </div>
  );
  return (
    <div style={{
      height: compact ? 56 : 68, padding: '0 32px', borderBottom: `1px solid ${T.rule}`,
      background: T.paper, display: 'flex', alignItems: 'center', gap: 28, flex: '0 0 auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{
          font: `400 28px/1 ${T.serif}`, letterSpacing: '0.04em', color: T.ink,
        }}>つむぐ</span>
        <span style={{ font: `500 10px/1 ${T.mono}`, color: T.mute, letterSpacing: '0.08em' }}>BETA</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 22, height: '100%' }}>
        <Tab id="dashboard" label="ホーム" />
        <Tab id="editor" label="エディタ" />
        <Tab id="library" label="ライブラリ" />
        <Tab id="settings" label="設定" />
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: T.inkSoft }}>
        <Icon name="search" size={18} />
        <Icon name="bell" size={18} />
        <div style={{
          width: 32, height: 32, borderRadius: 16, background: T.surface,
          border: `1px solid ${T.rule}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <TsumugiTiny size={28} accent={accent} />
        </div>
      </div>
    </div>
  );
}

// ── Big Display Number (Bebas) ─────────────────────────────
function BigNum({ children, size = 56, color = T.ink }) {
  return (
    <div style={{
      font: `400 ${size}px/0.9 ${T.display}`, letterSpacing: '0.02em', color,
      fontVariantNumeric: 'tabular-nums',
    }}>{children}</div>
  );
}

// ── Section heading combo (kicker + Japanese serif title) ─────────
function SectionHead({ kicker, title, right, color = T.ink }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 18 }}>
      <div>
        <div style={{
          font: `400 11px/1 ${T.display}`, letterSpacing: '0.22em', color: T.mute,
          marginBottom: 6, textTransform: 'uppercase',
        }}>{kicker}</div>
        <div style={{
          font: `500 22px/1.2 ${T.serif}`, color, letterSpacing: '0.01em',
        }}>{title}</div>
      </div>
      {right}
    </div>
  );
}

Object.assign(window, { T, Icon, ImgPlaceholder, Btn, Chip, WindowChrome, AppTopBar, BigNum, SectionHead });
