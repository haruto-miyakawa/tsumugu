// mascot.jsx — つむぎ (Tsumugi) the original mascot for the "tsumugu" app.
// A soft bean/drop creature with a thread-knot on top (a nod to spinning/weaving words).
// Original design — not based on any existing IP.

function Tsumugi({ size = 72, mood = 'idle', accent = '#E84B7C', tone = '#F4ECD8' }) {
  const s = { width: size, height: size, display: 'block', flex: '0 0 auto' };
  const stroke = '#1B1A17';
  const sw = 2.2;
  return (
    <svg viewBox="0 0 100 110" style={s} xmlns="http://www.w3.org/2000/svg">
      {/* shadow */}
      <ellipse cx="50" cy="102" rx="22" ry="3" fill="#1B1A17" opacity="0.08" />
      {/* knot/whisp on top — the "thread" motif */}
      <path d="M44 22 C 44 12, 56 12, 56 22 C 56 28, 50 28, 50 22 C 50 16, 44 16, 44 22 Z"
            fill={accent} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M50 28 L 50 34" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      {/* body — soft drop shape */}
      <path d="M50 34
               C 22 34, 16 60, 22 78
               C 28 96, 72 96, 78 78
               C 84 60, 78 34, 50 34 Z"
            fill={tone} stroke={stroke} strokeWidth={sw + 0.2} strokeLinejoin="round" />
      {/* cheeks */}
      <ellipse cx="32" cy="68" rx="4.5" ry="3" fill={accent} opacity="0.55" />
      <ellipse cx="68" cy="68" rx="4.5" ry="3" fill={accent} opacity="0.55" />
      {/* eyes by mood */}
      {mood === 'idle' && (
        <g fill={stroke}>
          <circle cx="40" cy="58" r="2.8" />
          <circle cx="60" cy="58" r="2.8" />
        </g>
      )}
      {mood === 'thinking' && (
        <g fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round">
          <path d="M36 60 q4 -4 8 0" />
          <path d="M56 60 q4 -4 8 0" />
        </g>
      )}
      {mood === 'happy' && (
        <g fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round">
          <path d="M36 60 q4 -5 8 0" />
          <path d="M56 60 q4 -5 8 0" />
        </g>
      )}
      {mood === 'wink' && (
        <g stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill={stroke}>
          <circle cx="40" cy="58" r="2.8" />
          <path d="M55 58 q5 -3 10 0" fill="none" />
        </g>
      )}
      {mood === 'writing' && (
        <g fill={stroke}>
          <circle cx="40" cy="58" r="2.2" />
          <circle cx="60" cy="58" r="2.2" />
          <rect x="62" y="64" width="22" height="3" rx="1.5" transform="rotate(20 62 64)" fill="#1B1A17"/>
          <rect x="80" y="62" width="6" height="5" rx="1" transform="rotate(20 80 62)" fill={accent}/>
        </g>
      )}
      {/* mouth */}
      {mood !== 'writing' && (
        <path d="M44 74 q6 5 12 0" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      )}
      {mood === 'writing' && (
        <path d="M46 75 q4 2 8 0" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

// Tiny inline version: just the head shape without the knot, for small badges/avatars.
function TsumugiTiny({ size = 24, accent = '#E84B7C', tone = '#F4ECD8' }) {
  const stroke = '#1B1A17';
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} style={{ display: 'block', flex: '0 0 auto' }}>
      <circle cx="20" cy="20" r="17" fill={tone} stroke={stroke} strokeWidth="1.6" />
      <circle cx="14" cy="20" r="1.6" fill={stroke} />
      <circle cx="26" cy="20" r="1.6" fill={stroke} />
      <path d="M16 26 q4 3 8 0" stroke={stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <ellipse cx="11" cy="24" rx="2" ry="1.4" fill={accent} opacity="0.6" />
      <ellipse cx="29" cy="24" rx="2" ry="1.4" fill={accent} opacity="0.6" />
    </svg>
  );
}

Object.assign(window, { Tsumugi, TsumugiTiny });
