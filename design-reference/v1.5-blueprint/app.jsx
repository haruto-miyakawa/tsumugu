// app.jsx — top-level wiring: DesignCanvas with all artboards + TweaksPanel

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#E84B7C",
  "editorLayout": "two-pane",
  "aiPosition": "sidebar"
}/*EDITMODE-END*/;

const ACCENT_OPTIONS = [
  '#E84B7C',  // pink (default — bluehamham-flavored)
  '#2BC4A5',  // mint
  '#E27A2D',  // amber/clay
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const accent = t.accent;
  const editorLayout = t.editorLayout;
  const aiPosition = t.aiPosition;

  return (
    <>
      <DesignCanvas>
        {/* ── Desktop screens ─────────────────────────────── */}
        <DCSection id="desktop"
          title="つむぐ · デスクトップ"
          subtitle="3画面 — ホーム / エディタ / プレビュー · Tweaksでレイアウトを切替">
          <DCArtboard id="dash" label="A · ホーム (Dashboard)" width={1280} height={820}>
            <DashboardScreen accent={accent} />
          </DCArtboard>
          <DCArtboard id="editor" label="B · エディタ (Editor)" width={1280} height={820}>
            <EditorScreen accent={accent} editorLayout={editorLayout} aiPosition={aiPosition} />
          </DCArtboard>
          <DCArtboard id="preview" label="C · プレビュー (note風)" width={1280} height={820}>
            <PreviewScreen accent={accent} />
          </DCArtboard>
        </DCSection>

        {/* ── Mobile screens ─────────────────────────────── */}
        <DCSection id="mobile"
          title="つむぐ · モバイル"
          subtitle="iPhone想定 · 親指で書ける片手UIと、ふきだしのつむぎ">
          <DCArtboard id="m-dash" label="A · ホーム" width={360} height={780}>
            <MobileDashboardScreen accent={accent} />
          </DCArtboard>
          <DCArtboard id="m-editor" label="B · エディタ" width={360} height={780}>
            <MobileEditorScreen accent={accent} aiPosition={aiPosition} />
          </DCArtboard>
          <DCArtboard id="m-preview" label="C · プレビュー" width={360} height={780}>
            <MobilePreviewScreen accent={accent} />
          </DCArtboard>
        </DCSection>

        {/* ── Design system note ─────────────────────────── */}
        <DCSection id="ds"
          title="つむぐ · デザインシステム"
          subtitle="原典・素材・参考とした感触の覚え書き">
          <DCArtboard id="tokens" label="Tokens · 色とタイポ" width={760} height={520}>
            <TokensCard accent={accent} />
          </DCArtboard>
          <DCArtboard id="mascot" label="マスコット つむぎ" width={520} height={520}>
            <MascotCard accent={accent} />
          </DCArtboard>
          <DCArtboard id="notes" label="Notes · 設計メモ" width={520} height={520}>
            <NotesCard accent={accent} editorLayout={editorLayout} aiPosition={aiPosition} />
          </DCArtboard>
        </DCSection>

        <DCPostIt top={-30} left={60} rotate={-3} width={210}>
          Tweaksでアクセント色 / エディタ <br />
          レイアウト / AIアシスト位置を <br />
          切り替えられます ✦
        </DCPostIt>
      </DesignCanvas>

      <TweaksPanel title="つむぐ · Tweaks">
        <TweakSection label="ブランド">
          <TweakColor
            label="アクセント"
            value={accent}
            options={ACCENT_OPTIONS}
            onChange={(v) => setTweak('accent', v)}
          />
        </TweakSection>

        <TweakSection label="エディタ">
          <TweakRadio
            label="レイアウト"
            value={editorLayout}
            options={[
              { value: 'two-pane', label: '2ペイン' },
              { value: 'focus', label: '集中' },
              { value: 'three-col', label: '3カラム' },
            ]}
            onChange={(v) => setTweak('editorLayout', v)}
          />
          <TweakRadio
            label="AIアシスト位置"
            value={aiPosition}
            options={[
              { value: 'sidebar', label: 'サイド' },
              { value: 'inline', label: 'インライン' },
              { value: 'floating', label: 'フロート' },
            ]}
            onChange={(v) => setTweak('aiPosition', v)}
          />
        </TweakSection>

        <TweakSection label="プリセット">
          <TweakButton label="① クラシック編集者 (2ペイン+サイド)"
            onClick={() => setTweak({ editorLayout: 'two-pane', aiPosition: 'sidebar' })} />
          <TweakButton label="② 集中モード (フロート)" secondary
            onClick={() => setTweak({ editorLayout: 'focus', aiPosition: 'floating' })} />
          <TweakButton label="③ パワーユーザー (3カラム+インライン)" secondary
            onClick={() => setTweak({ editorLayout: 'three-col', aiPosition: 'inline' })} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

// ─── Helper card components for the Design-system section ───
function TokensCard({ accent }) {
  const colors = [
    { v: T.bg, n: 'bg', code: '#F0EEE9' },
    { v: T.paper, n: 'paper', code: '#FFFFFF' },
    { v: T.surface, n: 'surface', code: '#FBF8F1' },
    { v: T.rule, n: 'rule', code: '#E6E0D2' },
    { v: T.ink, n: 'ink', code: '#1B1A17' },
    { v: T.mute, n: 'mute', code: '#807A6E' },
    { v: accent, n: 'accent', code: accent },
    { v: T.highlight, n: 'marker', code: '#FFF6BE' },
  ];
  return (
    <div style={{ height: '100%', padding: 30, background: T.paper, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ font: `400 10px/1 ${T.display}`, letterSpacing: '0.22em', color: T.mute, marginBottom: 6 }}>DESIGN TOKENS</div>
        <div style={{ font: `500 22px/1.3 ${T.serif}`, color: T.ink }}>色と書体 — note の落ち着きに、bluehamham の遊び心を一滴</div>
      </div>

      {/* swatches */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {colors.map((c) => (
          <div key={c.n} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{
              height: 48, background: c.v, border: `1px solid ${T.rule}`, borderRadius: 2,
            }} />
            <div style={{ font: `500 11px/1 ${T.sans}`, color: T.ink }}>{c.n}</div>
            <div style={{ font: `400 10px/1 ${T.mono}`, color: T.mute }}>{c.code}</div>
          </div>
        ))}
      </div>

      {/* type */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: T.surface, border: `1px solid ${T.rule}`, padding: 16, borderRadius: 2 }}>
          <div style={{ font: `400 10px/1 ${T.display}`, letterSpacing: '0.2em', color: T.mute, marginBottom: 6 }}>SERIF · 本文 / 見出し</div>
          <div style={{ font: `500 22px/1.3 ${T.serif}`, color: T.ink }}>あの日の七分間</div>
          <div style={{ font: `400 13px/1.6 ${T.serif}`, color: T.inkSoft, marginTop: 4 }}>Noto Serif JP — 余白に向き合うための読み物書体</div>
        </div>
        <div style={{ background: T.surface, border: `1px solid ${T.rule}`, padding: 16, borderRadius: 2 }}>
          <div style={{ font: `400 10px/1 ${T.display}`, letterSpacing: '0.2em', color: T.mute, marginBottom: 6 }}>DISPLAY · ラベル</div>
          <div style={{ font: `400 32px/1 ${T.display}`, color: accent, letterSpacing: '0.04em' }}>SEVEN MIN.</div>
          <div style={{ font: `400 11px/1.5 ${T.mono}`, color: T.mute, marginTop: 6 }}>Bebas Neue · JetBrains Mono</div>
        </div>
      </div>
    </div>
  );
}

function MascotCard({ accent }) {
  const moods = ['idle', 'happy', 'thinking', 'wink', 'writing'];
  return (
    <div style={{ height: '100%', padding: 30, background: T.paper, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <div style={{ font: `400 10px/1 ${T.display}`, letterSpacing: '0.22em', color: T.mute, marginBottom: 6 }}>MASCOT</div>
        <div style={{ font: `500 22px/1.3 ${T.serif}`, color: T.ink }}>つむぎ — 言葉を紡ぐ、まる豆</div>
        <div style={{ font: `400 12px/1.6 ${T.sans}`, color: T.mute, marginTop: 4 }}>
          AIアシスタントの人格。原典なし／オリジナル。線は細く、頭の結び目に「紡ぐ」の意。
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: 8 }}>
        {moods.map((m) => (
          <div key={m} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <Tsumugi size={80} mood={m} accent={accent} />
            <span style={{ font: `400 10px/1 ${T.mono}`, color: T.mute, letterSpacing: '0.06em' }}>{m}</span>
          </div>
        ))}
      </div>
      <div style={{ background: T.surface, padding: '10px 14px', borderRadius: 2, border: `1px solid ${T.rule}` }}>
        <div style={{ font: `400 12px/1.65 ${T.serif}`, color: T.inkSoft }}>
          「<span style={{ background: T.highlight }}>段落が3つ続いていて、少し息が詰まりそう。</span>短い一文を挟みませんか？」
        </div>
        <div style={{ font: `400 10px/1 ${T.mono}`, color: T.mute, marginTop: 6 }}>— つむぎ · 編集者モード</div>
      </div>
    </div>
  );
}

function NotesCard({ accent, editorLayout, aiPosition }) {
  const presetName = (() => {
    if (editorLayout === 'two-pane' && aiPosition === 'sidebar') return '① クラシック編集者';
    if (editorLayout === 'focus' && aiPosition === 'floating') return '② 集中モード';
    if (editorLayout === 'three-col' && aiPosition === 'inline') return '③ パワーユーザー';
    return 'カスタム';
  })();
  return (
    <div style={{ height: '100%', padding: 30, background: T.paper, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <div style={{ font: `400 10px/1 ${T.display}`, letterSpacing: '0.22em', color: T.mute, marginBottom: 6 }}>NOTES</div>
        <div style={{ font: `500 22px/1.3 ${T.serif}`, color: T.ink }}>設計の覚え書き</div>
      </div>
      <ul style={{ font: `400 13px/1.8 ${T.serif}`, color: T.inkSoft, margin: 0, paddingLeft: 18 }}>
        <li>テーマ一行 → 構成案 + 本文 を一筆書きで。引っかかったところだけ手を入れる。</li>
        <li>AIアシストUIは生活シーンで切り替わるべき：通勤(フロート)、深掘り(サイド)、推敲(インライン)。</li>
        <li>note記事は「読み物」なので、エディタは余白とセリフ書体を優先。</li>
        <li>マスコットつむぎは「編集者」。批評はせず、観察した事実だけ伝える口調。</li>
      </ul>
      <div style={{
        marginTop: 'auto', padding: '12px 14px', background: T.surface, border: `1px solid ${T.rule}`,
        borderRadius: 2, display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 8, height: 36, background: accent, borderRadius: 1,
        }} />
        <div>
          <div style={{ font: `400 9px/1 ${T.display}`, letterSpacing: '0.2em', color: T.mute, marginBottom: 4 }}>CURRENT PRESET</div>
          <div style={{ font: `500 14px/1.2 ${T.serif}`, color: T.ink }}>{presetName}</div>
          <div style={{ font: `400 10px/1 ${T.mono}`, color: T.mute, marginTop: 4 }}>
            layout: {editorLayout} · ai: {aiPosition}
          </div>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
