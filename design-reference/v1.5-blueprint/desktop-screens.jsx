// desktop-screens.jsx — Dashboard, Editor (3 layouts × 3 AI positions), Preview

// ─────────────────────────────────────────────────────────────
// Shared dummy content (sample article: コーヒーと朝の習慣について)
// ─────────────────────────────────────────────────────────────
const SAMPLE_TITLE = 'コーヒーが冷めるまでの、朝の七分間';
const SAMPLE_SUBTITLE = '小さな儀式が、一日の解像度を上げる';
const SAMPLE_AUTHOR = 'いとう ことの';
const SAMPLE_DATE = '2025年5月18日';

const SAMPLE_PARAGRAPHS = [
  '朝の七分間というのは、コーヒーが飲める温度に冷めるまでの時間のことだ。私はこの時間を、世界で一番贅沢な余白だと思っている。',
  'スマホは伏せて、椅子に深く座る。窓の外の音だけが、部屋に入り込んでくる。ベランダの植木鉢、隣の家のラジオ、遠くの電車。それぞれが、別々の速度で鳴っている。',
  '何か特別なことを考えるわけではない。むしろ、考えないようにしている。「今日やること」を頭の中に並べはじめると、せっかくの余白がすぐに埋まってしまう。',
  'カップに手を添えると、まだ熱い。「もう少しだけ待っていてね」と心の中で言う。コーヒーに話しかけている自分がおかしくて、少しだけ笑う。',
  '七分。これは私の経験則で、コーヒーが80度から65度に下がるのにかかる時間だ。',
];

const SAMPLE_OUTLINE = [
  { label: 'はじめに', kind: 'intro', state: 'done' },
  { label: '朝の七分間とは', kind: 'h2', state: 'done' },
  { label: '余白を埋めない練習', kind: 'h2', state: 'writing' },
  { label: '温度と感覚の話', kind: 'h2', state: 'idea' },
  { label: 'まとめ — 明日も七分', kind: 'outro', state: 'todo' },
];

const SAMPLE_TAGS = ['朝の習慣', 'コーヒー', 'エッセイ', '#つむぐで書いた'];

// ─────────────────────────────────────────────────────────────
// 1) Dashboard
// ─────────────────────────────────────────────────────────────
function DashboardScreen({ accent = T.accent }) {
  return (
    <WindowChrome url="app.tsumugu.jp/home" accent={accent}>
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: T.bg }}>
        <AppTopBar active="dashboard" accent={accent} />

        {/* hero — greeting from つむぎ */}
        <div style={{ padding: '36px 48px 28px', display: 'flex', alignItems: 'center', gap: 28 }}>
          <Tsumugi size={108} mood="happy" accent={accent} />
          <div style={{ flex: 1 }}>
            <div style={{ font: `400 11px/1 ${T.display}`, letterSpacing: '0.22em', color: T.mute, marginBottom: 6 }}>
              GOOD MORNING, KOTONO
            </div>
            <div style={{ font: `500 30px/1.25 ${T.serif}`, color: T.ink, letterSpacing: '0.01em' }}>
              今日はどんな話を、紡ぎましょうか？
            </div>
            <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
              <Btn kind="accent" icon="sparkle" size="md" accent={accent}>テーマから自動生成</Btn>
              <Btn kind="ghost" icon="pen" size="md">白紙から書く</Btn>
              <Btn kind="quiet" icon="folder" size="md">下書きを開く</Btn>
            </div>
          </div>
          {/* streak + stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'auto auto auto', gap: 28,
            padding: '14px 22px', background: T.paper, border: `1px solid ${T.rule}`, borderRadius: 4,
          }}>
            <div>
              <div style={{ font: `400 10px/1 ${T.display}`, letterSpacing: '0.18em', color: T.mute, marginBottom: 4 }}>STREAK</div>
              <BigNum size={36}>12</BigNum>
              <div style={{ font: `400 10px/1 ${T.mono}`, color: T.mute, marginTop: 2 }}>days</div>
            </div>
            <div>
              <div style={{ font: `400 10px/1 ${T.display}`, letterSpacing: '0.18em', color: T.mute, marginBottom: 4 }}>PUBLISHED</div>
              <BigNum size={36}>23</BigNum>
              <div style={{ font: `400 10px/1 ${T.mono}`, color: T.mute, marginTop: 2 }}>articles</div>
            </div>
            <div>
              <div style={{ font: `400 10px/1 ${T.display}`, letterSpacing: '0.18em', color: T.mute, marginBottom: 4 }}>WORDS / WK</div>
              <BigNum size={36} color={accent}>8.4<span style={{ fontSize: 16 }}>K</span></BigNum>
              <div style={{ font: `400 10px/1 ${T.mono}`, color: T.mute, marginTop: 2 }}>+12% wow</div>
            </div>
          </div>
        </div>

        {/* main grid */}
        <div style={{ flex: 1, minHeight: 0, padding: '0 48px 32px', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 32, overflow: 'hidden' }}>
          {/* drafts list */}
          <div>
            <SectionHead
              kicker="DRAFTS · 進行中"
              title="書きかけの物語が、4つあります"
              right={<div style={{ display: 'flex', gap: 6 }}>
                <Chip>すべて</Chip>
                <Chip active accent={accent}>下書き</Chip>
                <Chip>予約</Chip>
                <Chip>公開済</Chip>
              </div>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <DraftRow accent={accent} pct={62} title="コーヒーが冷めるまでの、朝の七分間" sub="エッセイ · 2,341字 · AI下書き 60%" date="今 編集中" mood="writing" hot />
              <DraftRow accent={accent} pct={20} title="ひとり時間を「習慣」にする三つの工夫" sub="ハウツー · 712字 · 構成案" date="昨日 22:14" mood="thinking" />
              <DraftRow accent={accent} pct={88} title="夜の散歩で見つけた、街灯の俳句" sub="フォトエッセイ · 1,820字 · 仕上げ" date="2日前" mood="happy" />
              <DraftRow accent={accent} pct={5} title="新しいノートを買った日" sub="メモ · 90字" date="先週" mood="idle" />
            </div>
          </div>

          {/* right column — quick start + AI suggestions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, minHeight: 0 }}>
            <div style={{
              background: T.paper, border: `1px solid ${T.rule}`, borderRadius: 4, padding: '20px 22px',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: -10, right: -10, font: `400 80px/1 ${T.display}`,
                color: T.surface2, letterSpacing: '0.02em', userSelect: 'none', opacity: 0.5,
              }}>NEW</div>
              <div style={{ font: `400 10px/1 ${T.display}`, letterSpacing: '0.2em', color: accent, marginBottom: 10 }}>QUICK START</div>
              <div style={{ font: `500 18px/1.35 ${T.serif}`, color: T.ink, marginBottom: 12 }}>
                テーマを一行、教えてください。<br />
                つむぎが構成案と下書きを用意します。
              </div>
              <div style={{
                background: T.surface, border: `1px solid ${T.rule}`, borderRadius: 4,
                padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{ flex: 1, font: `400 14px/1.3 ${T.serif}`, color: T.inkSoft }}>
                  例) 朝のコーヒーをゆっくり飲む、七分間の話<span style={{ marginLeft: 1, animation: 'blink 1s steps(1) infinite' }}>|</span>
                </div>
                <Btn kind="primary" size="sm" iconRight="arrow-right">生成</Btn>
              </div>
              <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Chip>#エッセイ</Chip>
                <Chip>#1500字</Chip>
                <Chip>#やさしい口調</Chip>
                <Chip>+ 設定</Chip>
              </div>
            </div>

            {/* suggestions */}
            <div style={{
              background: T.surface, border: `1px solid ${T.rule}`, borderRadius: 4,
              padding: '18px 20px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <TsumugiTiny size={24} accent={accent} />
                <div style={{ font: `500 12px/1 ${T.sans}`, color: T.inkSoft }}>つむぎから</div>
                <div style={{ flex: 1 }} />
                <Icon name="reload" size={14} style={{ color: T.mute }} />
              </div>
              <div style={{ font: `500 15px/1.5 ${T.serif}`, color: T.ink, marginBottom: 12 }}>
                「<span style={{ background: T.highlight, padding: '0 3px' }}>朝のコーヒー</span>」の話、続編にちょうどいい題材を3つ見つけました。
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                <Suggestion num="01" text="お気に入りのマグカップを買い替えた日のこと" />
                <Suggestion num="02" text="休日と平日で、コーヒーの淹れ方は変えていますか？" />
                <Suggestion num="03" text="冷めたコーヒーを飲み干したあとの、机の風景" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </WindowChrome>
  );
}

function DraftRow({ title, sub, date, pct, mood = 'idle', accent, hot }) {
  return (
    <div style={{
      background: T.paper, border: `1px solid ${T.rule}`, borderRadius: 4,
      padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 18,
      position: 'relative', overflow: 'hidden',
    }}>
      {hot && (
        <div style={{
          position: 'absolute', left: -1, top: -1, bottom: -1, width: 4, background: accent,
        }} />
      )}
      <TsumugiTiny size={36} accent={accent} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          font: `500 16px/1.3 ${T.serif}`, color: T.ink, marginBottom: 4,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{title}</div>
        <div style={{ font: `400 12px/1 ${T.sans}`, color: T.mute }}>{sub}</div>
      </div>
      <div style={{ width: 130, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, whiteSpace: 'nowrap' }}>
          <BigNum size={20}>{pct}</BigNum>
          <span style={{ font: `400 10px/1 ${T.display}`, color: T.mute, letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>% DONE</span>
        </div>
        <div style={{ height: 3, background: T.surface2, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: pct + '%', height: '100%', background: accent }} />
        </div>
      </div>
      <div style={{ width: 110, textAlign: 'right' }}>
        <div style={{ font: `400 11px/1 ${T.mono}`, color: T.mute }}>{date}</div>
      </div>
      <Icon name="arrow-right" size={16} style={{ color: T.ink }} />
    </div>
  );
}

function Suggestion({ num, text }) {
  return (
    <div style={{
      background: T.paper, border: `1px solid ${T.rule}`, borderRadius: 4,
      padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
    }}>
      <div style={{ font: `400 14px/1 ${T.display}`, color: T.mute, letterSpacing: '0.1em', width: 22 }}>{num}</div>
      <div style={{ flex: 1, font: `400 13px/1.4 ${T.sans}`, color: T.inkSoft }}>{text}</div>
      <Icon name="plus" size={14} style={{ color: T.mute }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2) Editor — adapts to {editorLayout} × {aiPosition}
// ─────────────────────────────────────────────────────────────
function EditorScreen({ accent = T.accent, editorLayout = 'two-pane', aiPosition = 'sidebar' }) {
  // column visibility logic
  const showOutline = editorLayout !== 'focus';
  const showRightCol = editorLayout === 'three-col' || aiPosition === 'sidebar';
  // when three-col + sidebar: right col is AI; preview merges into writing
  // when three-col + inline/floating: right col is preview
  // when two-pane + sidebar: right col is AI
  // when focus + sidebar: right col is AI (and outline hidden)
  const rightColKind = aiPosition === 'sidebar' ? 'ai' : 'preview';

  return (
    <WindowChrome url="app.tsumugu.jp/editor/morning-coffee" accent={accent}>
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: T.bg }}>
        <AppTopBar active="editor" accent={accent} />

        {/* doc bar */}
        <div style={{
          height: 48, padding: '0 28px', borderBottom: `1px solid ${T.rule}`, background: T.paper,
          display: 'flex', alignItems: 'center', gap: 14, flex: '0 0 auto',
        }}>
          <Icon name="arrow-left" size={16} style={{ color: T.mute }} />
          <div style={{ font: `500 13px/1 ${T.sans}`, color: T.ink }}>コーヒーが冷めるまでの、朝の七分間</div>
          <span style={{ font: `400 11px/1 ${T.mono}`, color: T.mute }}>· 自動保存 14:22</span>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ font: `400 11px/1 ${T.mono}`, color: T.mute }}>
              <span style={{ color: T.ink, fontSize: 13 }}>2,341</span> / 1,800字
            </span>
            <span style={{ width: 1, height: 14, background: T.rule }} />
            <Btn size="sm" kind="ghost" icon="eye">プレビュー</Btn>
            <Btn size="sm" kind="accent" iconRight="send" accent={accent}>noteに送る</Btn>
          </div>
        </div>

        {/* main 3-col body */}
        <div style={{
          flex: 1, minHeight: 0, display: 'grid',
          gridTemplateColumns: [
            showOutline ? '220px' : null,
            '1fr',
            showRightCol ? '320px' : null,
          ].filter(Boolean).join(' '),
          background: T.bg, position: 'relative',
        }}>
          {/* outline col */}
          {showOutline && <OutlineCol accent={accent} />}

          {/* writing col */}
          <WritingCol
            accent={accent}
            wide={editorLayout === 'focus'}
            withInlineAI={aiPosition === 'inline'}
            withFloatingAI={aiPosition === 'floating'}
          />

          {/* right col — AI sidebar OR Preview */}
          {showRightCol && (rightColKind === 'ai'
            ? <AISidebar accent={accent} />
            : <PreviewCol accent={accent} mini />
          )}
        </div>
      </div>
    </WindowChrome>
  );
}

function OutlineCol({ accent }) {
  return (
    <div style={{
      borderRight: `1px solid ${T.rule}`, background: T.surface, padding: '20px 18px',
      display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ font: `400 10px/1 ${T.display}`, letterSpacing: '0.2em', color: T.mute }}>OUTLINE</div>
        <Icon name="plus" size={14} style={{ color: T.mute }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {SAMPLE_OUTLINE.map((it, i) => (
          <OutlineRow key={i} item={it} active={it.state === 'writing'} accent={accent} />
        ))}
      </div>
      <div style={{ marginTop: 'auto', padding: '12px 12px', background: T.paper, borderRadius: 4, border: `1px solid ${T.rule}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Icon name="sparkle" size={12} style={{ color: accent }} />
          <span style={{ font: `500 10px/1 ${T.display}`, letterSpacing: '0.18em', color: accent }}>AI · OUTLINE</span>
        </div>
        <div style={{ font: `400 11px/1.5 ${T.sans}`, color: T.inkSoft }}>
          見出しを4→5に増やすと読者の離脱が下がりそう。「温度」の章を分割しますか？
        </div>
      </div>
    </div>
  );
}

function OutlineRow({ item, active, accent }) {
  const dotColor = {
    done: T.mute, writing: accent, idea: T.mint, todo: T.muteSoft,
  }[item.state] || T.mute;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px',
      borderRadius: 4, background: active ? T.paper : 'transparent',
      boxShadow: active ? `inset 0 0 0 1px ${T.rule}` : 'none',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 3, background: dotColor, flex: '0 0 auto' }} />
      <span style={{
        flex: 1, font: `${active ? 500 : 400} 12px/1.3 ${T.sans}`,
        color: item.state === 'done' ? T.mute : T.ink,
        textDecoration: item.state === 'done' ? 'line-through' : 'none',
      }}>{item.label}</span>
      {active && <span style={{ font: `400 9px/1 ${T.display}`, letterSpacing: '0.1em', color: accent }}>NOW</span>}
    </div>
  );
}

function FmtBar({ accent }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 2, background: T.paper, padding: 4,
      borderRadius: 999, border: `1px solid ${T.rule}`, boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
    }}>
      {['h1', 'h2', 'quote', 'bold', 'italic', 'image', 'tag'].map((n, i) => (
        <div key={n} style={{
          width: 26, height: 26, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: i === 1 ? T.paper : T.inkSoft, background: i === 1 ? T.ink : 'transparent',
        }}>
          <Icon name={n} size={13} />
        </div>
      ))}
      <span style={{ width: 1, height: 14, background: T.rule, margin: '0 4px' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 6px' }}>
        <Icon name="sparkle" size={12} style={{ color: accent }} />
        <span style={{ font: `500 11px/1 ${T.sans}`, color: accent }}>AI</span>
      </div>
    </div>
  );
}

function WritingCol({ accent, wide = false, withInlineAI = false, withFloatingAI = false }) {
  return (
    <div style={{
      background: T.paper, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        padding: wide ? '32px 12% 80px' : '32px 64px 80px', flex: 1, overflow: 'hidden', position: 'relative',
      }}>
        {/* Floating fmt bar */}
        <div style={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', zIndex: 4 }}>
          <FmtBar accent={accent} />
        </div>

        {/* Kicker / title / meta */}
        <div style={{ marginTop: 36, marginBottom: 22 }}>
          <div style={{
            font: `400 10px/1 ${T.display}`, letterSpacing: '0.22em', color: T.mute, marginBottom: 14,
          }}>ESSAY · COFFEE & MORNINGS</div>
          <div contentEditable suppressContentEditableWarning style={{
            font: `600 36px/1.3 ${T.serif}`, color: T.ink, letterSpacing: '0.005em', outline: 'none',
          }}>{SAMPLE_TITLE}</div>
          <div style={{ marginTop: 8, font: `400 16px/1.5 ${T.serif}`, color: T.mute, fontStyle: 'italic' }}>
            {SAMPLE_SUBTITLE}
          </div>
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12, font: `400 11px/1 ${T.mono}`, color: T.mute }}>
            <span>{SAMPLE_AUTHOR}</span>
            <span>·</span>
            <span>{SAMPLE_DATE}</span>
            <span>·</span>
            <span>下書き</span>
          </div>
        </div>

        {/* Paragraphs */}
        <Para>{SAMPLE_PARAGRAPHS[0]}</Para>
        <Para>{SAMPLE_PARAGRAPHS[1]}</Para>

        {/* H2 */}
        <H2 highlight accent={accent}>余白を埋めない練習</H2>
        <Para>
          何か特別なことを考えるわけではない。むしろ、考えないようにしている。
          <span style={{ background: T.highlight, padding: '0 1px', borderRadius: 1 }}>「今日やること」を頭の中に並べはじめると、せっかくの余白がすぐに埋まってしまう</span>
          。
        </Para>

        {withInlineAI && <InlineAIAssist accent={accent} />}

        <Para>{SAMPLE_PARAGRAPHS[3]}</Para>

        {/* Image placeholder */}
        <div style={{ margin: '24px 0' }}>
          <ImgPlaceholder h={220} label="MORNING_TABLE.jpg · ドラッグで画像を追加" />
          <div style={{ font: `400 11px/1.5 ${T.serif}`, color: T.mute, marginTop: 6, fontStyle: 'italic' }}>
            写真：朝の机、湯気の立つマグカップ
          </div>
        </div>

        <Para>{SAMPLE_PARAGRAPHS[4]}</Para>

        {/* AI suggestion ghost text after cursor */}
        <div style={{ font: `400 17px/1.95 ${T.serif}`, color: T.muteSoft, marginTop: 16 }}>
          <span style={{ borderLeft: `2px solid ${accent}`, paddingLeft: 0, marginRight: 4 }}>|</span>
          だから私は、湯気をできるだけ長く眺めるようにしている。湯気は…
          <span style={{
            display: 'inline-block', marginLeft: 8, padding: '2px 8px', background: T.surface,
            border: `1px dashed ${T.rule}`, borderRadius: 4, font: `500 10px/1 ${T.mono}`, color: T.mute,
            letterSpacing: '0.08em',
          }}>TAB で続きを受け入れる</span>
        </div>

        {/* Tags */}
        <div style={{ marginTop: 28, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SAMPLE_TAGS.map((t, i) => <Chip key={i}>{t}</Chip>)}
        </div>
      </div>

      {withFloatingAI && <FloatingAI accent={accent} />}
    </div>
  );
}

function H2({ children, highlight, accent }) {
  return (
    <h2 style={{
      font: `600 24px/1.4 ${T.serif}`, color: T.ink, margin: '32px 0 16px',
      letterSpacing: '0.005em', position: 'relative', paddingLeft: highlight ? 14 : 0,
    }}>
      {highlight && (
        <span style={{
          position: 'absolute', left: 0, top: 6, bottom: 6, width: 4, background: accent, borderRadius: 2,
        }} />
      )}
      {children}
    </h2>
  );
}

function Para({ children, muted, dim }) {
  return (
    <p style={{
      font: `400 17px/1.95 ${T.serif}`, color: dim ? T.muteSoft : (muted ? T.inkSoft : T.ink),
      margin: '0 0 18px', textWrap: 'pretty',
    }}>{children}</p>
  );
}

// ── Inline AI Assist card ─────────────────────────────────
function InlineAIAssist({ accent }) {
  return (
    <div style={{
      margin: '6px 0 22px', position: 'relative', paddingLeft: 28,
    }}>
      <div style={{
        position: 'absolute', left: 0, top: 4,
        width: 22, height: 22, borderRadius: 11, background: T.surface,
        border: `1px solid ${T.rule}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <TsumugiTiny size={18} accent={accent} />
      </div>
      <div style={{
        background: T.surface, border: `1px solid ${T.rule}`, borderRadius: 4, padding: '12px 14px',
        position: 'relative',
      }}>
        <div style={{ font: `400 10px/1 ${T.display}`, letterSpacing: '0.2em', color: accent, marginBottom: 6 }}>
          ✦ つむぎの提案 · INLINE
        </div>
        <div style={{ font: `400 14px/1.7 ${T.serif}`, color: T.inkSoft }}>
          ここで「読者への問いかけ」を一行入れると、温度感が出そうです：<br />
          <span style={{ color: T.ink, background: T.highlight, padding: '1px 4px' }}>
            あなたにとっての「七分間」は、いつ訪れますか？
          </span>
        </div>
        <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
          <Btn size="sm" kind="primary" icon="check">採用</Btn>
          <Btn size="sm" kind="soft" icon="reload">別案</Btn>
          <Btn size="sm" kind="quiet" icon="x">却下</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Floating AI bubble ─────────────────────────────────
function FloatingAI({ accent }) {
  return (
    <div style={{
      position: 'absolute', right: 24, bottom: 24, width: 280, zIndex: 5,
      background: T.paper, border: `1.5px solid ${T.ink}`, borderRadius: 4,
      boxShadow: `6px 6px 0 ${T.ink}`,
      padding: 16,
    }}>
      <div style={{ position: 'absolute', top: -28, left: -10 }}>
        <Tsumugi size={56} mood="thinking" accent={accent} />
      </div>
      <div style={{ marginLeft: 50, marginBottom: 8 }}>
        <div style={{ font: `400 10px/1 ${T.display}`, letterSpacing: '0.18em', color: accent }}>つむぎ · 思考中</div>
      </div>
      <div style={{ font: `400 13px/1.7 ${T.serif}`, color: T.ink }}>
        段落が3つ続いていて、少し息が詰まりそう。短い一文を挟むと呼吸が戻ります。
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 6, alignItems: 'center' }}>
        <div style={{
          flex: 1, background: T.surface, border: `1px solid ${T.rule}`, borderRadius: 999,
          padding: '6px 12px', font: `400 12px/1 ${T.sans}`, color: T.mute,
        }}>つむぎに話しかける…</div>
        <div style={{
          width: 28, height: 28, borderRadius: 14, background: T.ink,
          color: T.paper, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon name="send" size={13} /></div>
      </div>
    </div>
  );
}

// ── AI Sidebar (chat with つむぎ) ─────────────────────
function AISidebar({ accent }) {
  return (
    <div style={{
      borderLeft: `1px solid ${T.rule}`, background: T.surface, display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* head */}
      <div style={{
        padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: `1px solid ${T.rule}`, background: T.paper,
      }}>
        <Tsumugi size={36} mood="idle" accent={accent} />
        <div style={{ flex: 1 }}>
          <div style={{ font: `500 13px/1 ${T.sans}`, color: T.ink }}>つむぎ</div>
          <div style={{ font: `400 10px/1 ${T.mono}`, color: T.mute, marginTop: 4 }}>聞き役 · 編集者モード</div>
        </div>
        <Chip>v2.4</Chip>
      </div>

      {/* chat */}
      <div style={{ flex: 1, padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>
        <ChatMsg from="ai" accent={accent}>
          おかえりなさい。<br />前回の続き、<b>「余白を埋めない練習」</b>の章からですね。
        </ChatMsg>
        <ChatMsg from="me">「七分」という数字に納得感がほしい。理由を補強できる？</ChatMsg>
        <ChatMsg from="ai" accent={accent}>
          経験則として書かれていますが、湯気の温度推移を1行入れると説得力が増しそうです。
          <div style={{
            marginTop: 8, padding: 10, background: T.surface, borderRadius: 3,
            font: `400 13px/1.6 ${T.serif}`, color: T.inkSoft, borderLeft: `3px solid ${accent}`,
          }}>
            「私の経験則で、コーヒーが80度から65度に下がるのにかかる時間だ。」
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
            <Btn size="sm" kind="primary" icon="check">挿入</Btn>
            <Btn size="sm" kind="soft" icon="reload">書き直し</Btn>
          </div>
        </ChatMsg>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
          <Chip>もっと柔らかく</Chip>
          <Chip>具体例を3つ</Chip>
          <Chip>結びを書く</Chip>
        </div>
      </div>

      {/* input */}
      <div style={{ padding: '12px 14px', borderTop: `1px solid ${T.rule}`, background: T.paper }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: T.surface, border: `1px solid ${T.rule}`, borderRadius: 999, padding: '6px 6px 6px 14px',
        }}>
          <div style={{ flex: 1, font: `400 12px/1 ${T.sans}`, color: T.mute }}>つむぎに頼む…</div>
          <Icon name="sparkle" size={14} style={{ color: T.mute }} />
          <div style={{
            width: 26, height: 26, borderRadius: 13, background: T.ink, color: T.paper,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="send" size={12} /></div>
        </div>
      </div>
    </div>
  );
}

function ChatMsg({ from, accent, children }) {
  const me = from === 'me';
  return (
    <div style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start' }}>
      <div style={{
        maxWidth: '90%', padding: '10px 12px', borderRadius: 4,
        background: me ? T.ink : T.paper, color: me ? T.paper : T.ink,
        border: me ? 'none' : `1px solid ${T.rule}`,
        font: `400 13px/1.65 ${T.serif}`,
      }}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3) Preview (note-style read view)
// ─────────────────────────────────────────────────────────────
function PreviewScreen({ accent = T.accent }) {
  return (
    <WindowChrome url="note.com/kotono/n/morning-coffee · プレビュー" accent={accent}>
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: T.paper }}>
        {/* slim chrome: site bar */}
        <div style={{
          height: 52, padding: '0 32px', borderBottom: `1px solid ${T.rule}`, background: T.paper,
          display: 'flex', alignItems: 'center', gap: 18, flex: '0 0 auto',
        }}>
          <span style={{ font: `400 22px/1 ${T.serif}`, color: T.ink }}>note</span>
          <span style={{ font: `400 10px/1 ${T.display}`, letterSpacing: '0.18em', color: T.mute }}>· つむぐ プレビュー</span>
          <div style={{ flex: 1 }} />
          <Chip>下書き</Chip>
          <Btn size="sm" kind="ghost" icon="pen">エディタに戻る</Btn>
          <Btn size="sm" kind="accent" iconRight="send" accent={accent}>noteに公開</Btn>
        </div>

        {/* read column */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
          <PreviewCol accent={accent} />
        </div>
      </div>
    </WindowChrome>
  );
}

function PreviewCol({ accent, mini = false }) {
  const pad = mini ? '20px 20px 40px' : '40px 64px 80px';
  const tFs = mini ? 22 : 36;
  return (
    <div style={{
      maxWidth: mini ? '100%' : 720, width: '100%', height: '100%', overflow: 'hidden',
      padding: pad, background: T.paper, borderLeft: mini ? `1px solid ${T.rule}` : 'none',
    }}>
      {mini && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ font: `400 10px/1 ${T.display}`, letterSpacing: '0.2em', color: T.mute }}>LIVE PREVIEW</div>
          <Icon name="eye" size={13} style={{ color: T.mute }} />
        </div>
      )}

      <div style={{ font: `400 11px/1 ${T.display}`, letterSpacing: '0.22em', color: T.mute, marginBottom: 12 }}>
        ESSAY · COFFEE & MORNINGS
      </div>
      <div style={{ font: `600 ${tFs}px/1.4 ${T.serif}`, color: T.ink, letterSpacing: '0.005em' }}>
        {SAMPLE_TITLE}
      </div>
      <div style={{ marginTop: 8, font: `400 ${mini ? 13 : 16}px/1.5 ${T.serif}`, color: T.mute, fontStyle: 'italic' }}>
        {SAMPLE_SUBTITLE}
      </div>

      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <TsumugiTiny size={mini ? 24 : 32} accent={accent} />
        <div>
          <div style={{ font: `500 ${mini ? 11 : 13}px/1 ${T.sans}`, color: T.ink }}>{SAMPLE_AUTHOR}</div>
          <div style={{ font: `400 10px/1 ${T.mono}`, color: T.mute, marginTop: 4 }}>{SAMPLE_DATE} · 約4分</div>
        </div>
        {!mini && <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Btn size="sm" kind="ghost">フォロー</Btn>
        </div>}
      </div>

      {!mini && <div style={{ margin: '24px 0' }}>
        <ImgPlaceholder h={280} label="MORNING_TABLE.jpg · ヘッダー画像" />
      </div>}
      {mini && <div style={{ margin: '14px 0' }}>
        <ImgPlaceholder h={110} label="header.jpg" />
      </div>}

      <div style={{ marginTop: 12, fontSize: mini ? 12 : 17, lineHeight: 1.95, color: T.ink, fontFamily: T.serif }}>
        <p style={{ margin: '0 0 1em' }}>{SAMPLE_PARAGRAPHS[0]}</p>
        <p style={{ margin: '0 0 1em' }}>{SAMPLE_PARAGRAPHS[1]}</p>

        <h2 style={{
          font: `600 ${mini ? 16 : 22}px/1.4 ${T.serif}`, color: T.ink,
          margin: mini ? '20px 0 12px' : '32px 0 16px', borderLeft: `4px solid ${accent}`, paddingLeft: 12,
        }}>余白を埋めない練習</h2>

        <p style={{ margin: '0 0 1em' }}>{SAMPLE_PARAGRAPHS[2]}</p>
        {!mini && <p style={{ margin: '0 0 1em' }}>{SAMPLE_PARAGRAPHS[3]}</p>}

        {!mini && (
          <blockquote style={{
            margin: '24px 0', padding: '12px 18px', borderLeft: `3px solid ${T.ink}`,
            font: `500 18px/1.7 ${T.serif}`, color: T.inkSoft, fontStyle: 'italic',
          }}>
            あなたにとっての「七分間」は、いつ訪れますか？
          </blockquote>
        )}

        {!mini && <p style={{ margin: '0 0 1em' }}>{SAMPLE_PARAGRAPHS[4]}</p>}
      </div>

      {/* tags + actions */}
      <div style={{
        marginTop: mini ? 18 : 28, paddingTop: mini ? 14 : 22, borderTop: `1px solid ${T.rule}`,
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
      }}>
        {SAMPLE_TAGS.slice(0, mini ? 2 : 4).map((t, i) => <Chip key={i}>{t}</Chip>)}
        {!mini && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, alignItems: 'center', color: T.mute }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, font: `500 13px/1 ${T.sans}` }}>
              <Icon name="heart" size={16} /> 248
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, font: `500 13px/1 ${T.sans}` }}>
              <Icon name="comment" size={16} /> 12
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, {
  DashboardScreen, EditorScreen, PreviewScreen,
  SAMPLE_TITLE, SAMPLE_SUBTITLE, SAMPLE_AUTHOR, SAMPLE_DATE, SAMPLE_PARAGRAPHS, SAMPLE_TAGS, SAMPLE_OUTLINE,
});
