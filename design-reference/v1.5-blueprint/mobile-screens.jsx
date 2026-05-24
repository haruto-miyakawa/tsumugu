// mobile-screens.jsx — Mobile versions of Dashboard, Editor, Preview

function PhoneFrame({ children, accent = T.accent, time = '7:42', notch = true }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: T.ink, padding: 8,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        flex: 1, background: T.bg, borderRadius: 28, overflow: 'hidden',
        display: 'flex', flexDirection: 'column', position: 'relative',
        boxShadow: 'inset 0 0 0 2px #2a2a26',
      }}>
        {/* status bar */}
        <div style={{
          height: 44, padding: '12px 22px 0', display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', flex: '0 0 auto', position: 'relative', zIndex: 2,
        }}>
          <div style={{ font: `600 14px/1 ${T.sans}`, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>{time}</div>
          {notch && <div style={{
            position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)',
            width: 110, height: 28, background: T.ink, borderRadius: 16,
          }} />}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center', color: T.ink }}>
            <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor"><path d="M1 7h2v3H1zm4-2h2v5H5zm4-2h2v7H9zm4-3h2v10h-2z"/></svg>
            <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><path d="M7 9a3 3 0 0 1 3-3 7 7 0 0 0-6 0 3 3 0 0 1 3 3z"/></svg>
            <div style={{
              width: 22, height: 10, border: `1px solid ${T.ink}`, borderRadius: 2, position: 'relative',
              padding: 1,
            }}>
              <div style={{ width: '75%', height: '100%', background: T.ink, borderRadius: 1 }} />
              <div style={{ position: 'absolute', right: -3, top: 2, width: 2, height: 4, background: T.ink, borderRadius: 1 }} />
            </div>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>{children}</div>
        {/* home indicator */}
        <div style={{
          height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
        }}>
          <div style={{ width: 120, height: 4, background: T.ink, borderRadius: 2 }} />
        </div>
      </div>
    </div>
  );
}

// ── Mobile Dashboard ─────────────────────────────────────
function MobileDashboardScreen({ accent = T.accent }) {
  return (
    <PhoneFrame accent={accent}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bg }}>
        {/* top bar */}
        <div style={{
          padding: '8px 18px 14px', display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto',
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ font: `400 26px/1 ${T.serif}`, color: T.ink, letterSpacing: '0.04em' }}>つむぐ</span>
          </div>
          <Icon name="search" size={20} style={{ color: T.ink }} />
          <Icon name="bell" size={20} style={{ color: T.ink }} />
        </div>

        {/* greeting card */}
        <div style={{ padding: '4px 18px 18px', flex: '0 0 auto' }}>
          <div style={{
            background: T.paper, border: `1px solid ${T.rule}`, borderRadius: 4,
            padding: '18px 18px 16px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: -8, top: -6 }}>
              <Tsumugi size={84} mood="happy" accent={accent} />
            </div>
            <div style={{ paddingRight: 90 }}>
              <div style={{ font: `400 10px/1 ${T.display}`, letterSpacing: '0.2em', color: T.mute, marginBottom: 6 }}>
                GOOD MORNING
              </div>
              <div style={{ font: `500 19px/1.4 ${T.serif}`, color: T.ink }}>
                今日はどんな話を、紡ぎましょうか？
              </div>
            </div>
            <div style={{
              marginTop: 14, display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 12px', background: T.surface, border: `1px solid ${T.rule}`, borderRadius: 999,
            }}>
              <Icon name="sparkle" size={14} style={{ color: accent }} />
              <span style={{ flex: 1, font: `400 12px/1 ${T.sans}`, color: T.mute }}>テーマを一行で…</span>
              <div style={{ width: 26, height: 26, borderRadius: 13, background: T.ink, color: T.paper, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="arrow-right" size={13} />
              </div>
            </div>
          </div>
        </div>

        {/* stats strip */}
        <div style={{
          margin: '0 18px 18px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
        }}>
          <StatTile label="STREAK" big="12" unit="days" />
          <StatTile label="PUBLISHED" big="23" unit="記事" />
          <StatTile label="WORDS/WK" big="8.4K" unit="+12%" accent={accent} />
        </div>

        {/* drafts */}
        <div style={{ padding: '0 18px', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ font: `400 10px/1 ${T.display}`, letterSpacing: '0.2em', color: T.mute }}>DRAFTS · 進行中</div>
            <span style={{ font: `400 11px/1 ${T.mono}`, color: T.mute }}>4</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <MobileDraftRow accent={accent} hot title="コーヒーが冷めるまでの、朝の七分間" pct={62} meta="2,341字 · 今 編集中" />
            <MobileDraftRow accent={accent} title="ひとり時間を「習慣」にする三つの工夫" pct={20} meta="712字 · 昨日" />
            <MobileDraftRow accent={accent} title="夜の散歩で見つけた、街灯の俳句" pct={88} meta="1,820字 · 2日前" />
          </div>
        </div>

        {/* tab bar */}
        <div style={{
          padding: '10px 22px 6px', borderTop: `1px solid ${T.rule}`, background: T.paper,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: '0 0 auto',
        }}>
          <TabIcon name="list" label="ホーム" active />
          <TabIcon name="folder" label="ライブラリ" />
          <div style={{
            width: 48, height: 48, borderRadius: 24, background: accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.paper,
            marginTop: -22, boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
            border: `2px solid ${T.paper}`,
          }}><Icon name="plus" size={22} /></div>
          <TabIcon name="bell" label="通知" />
          <TabIcon name="settings" label="設定" />
        </div>
      </div>
    </PhoneFrame>
  );
}

function StatTile({ label, big, unit, accent }) {
  return (
    <div style={{
      background: T.paper, border: `1px solid ${T.rule}`, borderRadius: 4, padding: '10px 12px',
    }}>
      <div style={{ font: `400 9px/1 ${T.display}`, letterSpacing: '0.18em', color: T.mute, marginBottom: 4 }}>{label}</div>
      <BigNum size={26} color={accent || T.ink}>{big}</BigNum>
      <div style={{ font: `400 10px/1 ${T.mono}`, color: T.mute, marginTop: 4 }}>{unit}</div>
    </div>
  );
}

function MobileDraftRow({ title, pct, meta, hot, accent }) {
  return (
    <div style={{
      background: T.paper, border: `1px solid ${T.rule}`, borderRadius: 4,
      padding: '12px 14px', position: 'relative', overflow: 'hidden',
    }}>
      {hot && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: accent }} />}
      <div style={{ font: `500 13px/1.4 ${T.serif}`, color: T.ink, marginBottom: 4 }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ font: `400 10px/1 ${T.mono}`, color: T.mute }}>{meta}</span>
        <div style={{ flex: 1, height: 2, background: T.surface2, borderRadius: 1, overflow: 'hidden' }}>
          <div style={{ width: pct + '%', height: '100%', background: accent }} />
        </div>
        <span style={{ font: `400 9px/1 ${T.display}`, letterSpacing: '0.1em', color: T.mute }}>{pct}%</span>
      </div>
    </div>
  );
}

function TabIcon({ name, label, active }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
      color: active ? T.ink : T.mute,
    }}>
      <Icon name={name} size={20} />
      <span style={{ font: `500 9px/1 ${T.sans}` }}>{label}</span>
    </div>
  );
}

// ── Mobile Editor ─────────────────────────────────────
function MobileEditorScreen({ accent = T.accent, aiPosition = 'floating' }) {
  return (
    <PhoneFrame accent={accent}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.paper, position: 'relative' }}>
        {/* head */}
        <div style={{
          padding: '4px 14px 10px', display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto',
          borderBottom: `1px solid ${T.rule}`,
        }}>
          <Icon name="arrow-left" size={18} style={{ color: T.ink }} />
          <div style={{ flex: 1, font: `400 10px/1.3 ${T.mono}`, color: T.mute, textAlign: 'center' }}>
            自動保存 14:22 · 2,341字
          </div>
          <Btn size="sm" kind="accent" accent={accent}>送る</Btn>
        </div>

        {/* writing body */}
        <div style={{ flex: 1, padding: '20px 22px 100px', overflow: 'hidden' }}>
          <div style={{ font: `400 9px/1 ${T.display}`, letterSpacing: '0.22em', color: T.mute, marginBottom: 10 }}>
            ESSAY · COFFEE & MORNINGS
          </div>
          <div style={{ font: `600 22px/1.4 ${T.serif}`, color: T.ink, marginBottom: 12 }}>
            {SAMPLE_TITLE}
          </div>
          <p style={{ font: `400 14px/1.85 ${T.serif}`, color: T.ink, margin: '0 0 14px' }}>
            {SAMPLE_PARAGRAPHS[0]}
          </p>
          <p style={{ font: `400 14px/1.85 ${T.serif}`, color: T.ink, margin: '0 0 14px' }}>
            {SAMPLE_PARAGRAPHS[1]}
          </p>
          {aiPosition === 'inline' && (
            <div style={{
              margin: '4px 0 14px', background: T.surface, border: `1px solid ${T.rule}`, borderRadius: 4,
              padding: '10px 12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <TsumugiTiny size={18} accent={accent} />
                <span style={{ font: `500 9px/1 ${T.display}`, letterSpacing: '0.18em', color: accent }}>✦ つむぎの提案</span>
              </div>
              <div style={{ font: `400 12px/1.6 ${T.serif}`, color: T.inkSoft }}>
                ここで読者への問いかけを一行：<br />
                <span style={{ background: T.highlight, padding: '1px 3px' }}>あなたにとっての「七分間」は？</span>
              </div>
            </div>
          )}
          <h2 style={{
            font: `600 16px/1.4 ${T.serif}`, color: T.ink, margin: '18px 0 10px',
            paddingLeft: 10, borderLeft: `3px solid ${accent}`,
          }}>余白を埋めない練習</h2>
          <p style={{ font: `400 14px/1.85 ${T.serif}`, color: T.ink, margin: '0 0 14px' }}>
            {SAMPLE_PARAGRAPHS[2]}
          </p>
          <p style={{ font: `400 14px/1.85 ${T.serif}`, color: T.muteSoft, margin: 0 }}>
            <span style={{ borderLeft: `2px solid ${accent}`, marginRight: 4 }}>|</span>
            だから私は、湯気をできるだけ長く眺めるように…
          </p>
        </div>

        {/* AI position variants */}
        {aiPosition === 'sidebar' && (
          <div style={{
            position: 'absolute', right: 0, top: 56, bottom: 130, width: 60,
            background: T.surface, borderLeft: `1px solid ${T.rule}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', gap: 14,
          }}>
            <Tsumugi size={36} mood="thinking" accent={accent} />
            {[{ i: 'sparkle' }, { i: 'wand' }, { i: 'h2' }, { i: 'quote' }, { i: 'image' }].map((x, i) => (
              <div key={i} style={{
                width: 36, height: 36, borderRadius: 18, background: i === 0 ? T.ink : T.paper,
                color: i === 0 ? T.paper : T.ink, border: `1px solid ${T.rule}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><Icon name={x.i} size={16} /></div>
            ))}
          </div>
        )}

        {aiPosition === 'floating' && (
          <div style={{
            position: 'absolute', right: 14, bottom: 124,
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8,
          }}>
            <div style={{
              background: T.paper, border: `1.5px solid ${T.ink}`, borderRadius: 4,
              boxShadow: `4px 4px 0 ${T.ink}`, padding: '8px 12px',
              font: `400 11px/1.5 ${T.serif}`, color: T.ink, maxWidth: 200,
            }}>
              湯気の温度の話、入れてみる？
            </div>
            <div style={{
              width: 56, height: 56, borderRadius: 28, background: T.paper,
              border: `2px solid ${T.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `3px 3px 0 ${T.ink}`,
            }}>
              <Tsumugi size={46} mood="happy" accent={accent} />
            </div>
          </div>
        )}

        {/* fmt bar at bottom */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          padding: '12px 14px 16px', background: T.surface, borderTop: `1px solid ${T.rule}`,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {['h1', 'h2', 'bold', 'quote', 'image', 'tag'].map((n) => (
            <div key={n} style={{
              width: 32, height: 32, borderRadius: 16, background: T.paper,
              border: `1px solid ${T.rule}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: T.inkSoft,
            }}>
              <Icon name={n} size={14} />
            </div>
          ))}
          <div style={{ flex: 1 }} />
          {aiPosition !== 'floating' && (
            <div style={{
              height: 32, padding: '0 12px', borderRadius: 16, background: T.ink, color: T.paper,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <Icon name="sparkle" size={13} />
              <span style={{ font: `500 11px/1 ${T.sans}` }}>AI</span>
            </div>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}

// ── Mobile Preview ─────────────────────────────────────
function MobilePreviewScreen({ accent = T.accent }) {
  return (
    <PhoneFrame accent={accent}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.paper }}>
        {/* head */}
        <div style={{
          padding: '4px 16px 10px', display: 'flex', alignItems: 'center', gap: 8,
          borderBottom: `1px solid ${T.rule}`, flex: '0 0 auto',
        }}>
          <Icon name="arrow-left" size={18} />
          <span style={{ font: `400 18px/1 ${T.serif}`, color: T.ink }}>note</span>
          <span style={{ font: `400 9px/1 ${T.display}`, color: T.mute, letterSpacing: '0.18em' }}>プレビュー</span>
          <div style={{ flex: 1 }} />
          <Icon name="dots" size={18} style={{ color: T.mute }} />
        </div>

        {/* read */}
        <div style={{ flex: 1, overflow: 'hidden', padding: '18px 20px 90px' }}>
          <ImgPlaceholder h={140} label="header.jpg" />
          <div style={{ font: `400 9px/1 ${T.display}`, letterSpacing: '0.2em', color: T.mute, margin: '14px 0 6px' }}>
            ESSAY · COFFEE & MORNINGS
          </div>
          <div style={{ font: `600 22px/1.4 ${T.serif}`, color: T.ink, letterSpacing: '0.005em' }}>
            {SAMPLE_TITLE}
          </div>
          <div style={{ marginTop: 6, font: `400 13px/1.5 ${T.serif}`, color: T.mute, fontStyle: 'italic' }}>
            {SAMPLE_SUBTITLE}
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TsumugiTiny size={24} accent={accent} />
            <span style={{ font: `500 11px/1 ${T.sans}`, color: T.ink }}>{SAMPLE_AUTHOR}</span>
            <span style={{ font: `400 10px/1 ${T.mono}`, color: T.mute }}>· {SAMPLE_DATE}</span>
          </div>
          <p style={{ font: `400 14px/1.95 ${T.serif}`, color: T.ink, margin: '18px 0 14px' }}>
            {SAMPLE_PARAGRAPHS[0]}
          </p>
          <p style={{ font: `400 14px/1.95 ${T.serif}`, color: T.ink, margin: '0 0 14px' }}>
            {SAMPLE_PARAGRAPHS[1]}
          </p>
          <h2 style={{
            font: `600 16px/1.4 ${T.serif}`, color: T.ink, margin: '20px 0 12px',
            borderLeft: `3px solid ${accent}`, paddingLeft: 10,
          }}>余白を埋めない練習</h2>
          <p style={{ font: `400 14px/1.95 ${T.serif}`, color: T.ink, margin: 0 }}>
            {SAMPLE_PARAGRAPHS[2]}
          </p>
        </div>

        {/* sticky action bar */}
        <div style={{
          position: 'absolute', left: 8, right: 8, bottom: 32,
          padding: '10px 14px', background: T.paper, border: `1px solid ${T.rule}`, borderRadius: 999,
          boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: T.mute, font: `500 12px/1 ${T.sans}` }}>
            <Icon name="heart" size={16} /> 248
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: T.mute, font: `500 12px/1 ${T.sans}` }}>
            <Icon name="comment" size={16} /> 12
          </div>
          <div style={{ flex: 1 }} />
          <Btn size="sm" kind="ghost">下書きへ</Btn>
          <Btn size="sm" kind="accent" accent={accent} iconRight="send">公開</Btn>
        </div>
      </div>
    </PhoneFrame>
  );
}

Object.assign(window, { MobileDashboardScreen, MobileEditorScreen, MobilePreviewScreen });
