// No PageContainer — uses the same max-w-3xl mx-auto structure as /settings
// so both page titles align at the same horizontal position.

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-sans text-[15px] font-semibold text-ink tracking-wide">
        {title}
      </h2>
      <div className="bg-paper border border-rule rounded-md shadow-card p-5 md:p-6 space-y-3">
        {children}
      </div>
    </section>
  );
}

function Step({ n, label, desc }: { n: number; label: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-paper text-[11px] font-display flex items-center justify-center leading-none">
        {n}
      </span>
      <div>
        <p className="text-[13px] font-sans font-medium text-ink">{label}</p>
        <p className="text-[12px] font-sans text-mute mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function Kv({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 py-2.5 border-b border-rule last:border-0">
      <p className="text-[12px] font-mono text-mute">{k}</p>
      <p className="text-[13px] font-sans text-ink-sub leading-relaxed">{v}</p>
    </div>
  );
}

export default function InfoPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 pt-8 pb-28 md:pb-12">

      {/* Page header — same structure as /settings */}
      <div className="mb-10">
        <p className="font-mono text-[10px] tracking-widest text-mute uppercase mb-1">
          INFO
        </p>
        <h1 className="font-display text-[40px] md:text-[52px] leading-none text-ink">
          使い方
        </h1>
      </div>

      <div className="space-y-8">

        {/* つむぐとは */}
        <Section title="つむぐとは">
          <p className="text-[13px] font-sans text-ink-sub leading-relaxed">
            つむぐは、note クリエイターの記事作成を支援する半自動ツールです。
            テーマとエピソードを入力するだけで、AIが文章の骨格を生成します。
          </p>
          <p className="text-[13px] font-sans text-ink-sub leading-relaxed">
            生成した原稿はエディタで自由に仕上げられます。右パネルの「つむぎ」に
            段落を選択して話しかけると、口調の調整や具体例の追加を提案してもらえます。
            仕上がったらプレビューで note 風の見た目を確認し、コピーして貼り付けるだけです。
          </p>
        </Section>

        {/* 基本フロー */}
        <Section title="基本フロー">
          <div className="space-y-4">
            <Step n={1} label="テーマから自動生成"
              desc="ホーム画面の「テーマから自動生成」ボタンから /generate へ。テーマ・エピソード・ジャンルを入力するとAIが下書きを作成します。" />
            <Step n={2} label="エディタで仕上げる"
              desc="ホームの DRAFTS 欄から記事を開くと /editor に入ります。本文の直接編集、見出しの追加・変更、AIつむぎへの相談ができます。" />
            <Step n={3} label="プレビューで確認"
              desc="エディタの「プレビュー」ボタン、またはライブラリ画面から /preview を開きます。note.com 風の紙面イメージで仕上がりを確認できます。" />
            <Step n={4} label="整形してnoteに貼り付け"
              desc="プレビュー画面下部の「NOTE 準備ツール」から「整形する」を押してHTML形式にコピーします。noteのエディタに貼り付けると書式が再現されます。" />
          </div>
        </Section>

        {/* 主要機能 */}
        <Section title="主要機能">
          <div className="divide-y divide-rule -mx-1">
            <Kv k="ホーム画面" v="連続作成日数・公開数・週間文字数の統計と、直近4件の下書き一覧を表示します。クイック入力欄からそのままテーマを入力して生成を始めることもできます。" />
            <Kv k="エディタ" v="3カラム構成。左の OUTLINE で記事構造を把握、中央で本文を直接編集、右のAIつむぎに段落を選択して話しかけるとリライト提案が来ます。" />
            <Kv k="AIつむぎの使い方" v="本文で書き換えたい段落を選択すると、右パネルの入力欄が有効になります。「もっと柔らかく」などクイックアクションを押すか、自由に指示を入力して「→」を押します。AIが提案を出したら「選択範囲を置き換える」で反映します。" />
            <Kv k="スタイル設定" v="設定画面でフォーム式に文体・構成・語彙を定義できます。既存のnote記事を貼り付けてAIに解析してもらい、自分のスタイルを自動検出する機能もあります。" />
            <Kv k="ライブラリ" v="生成・編集した記事の一覧です。進捗バーで目標文字数に対する達成度が確認できます。カードをクリックすると /preview に進みます。" />
          </div>
        </Section>

        {/* 既知の制限・よくある質問 */}
        <Section title="困ったときは">
          <div className="space-y-3">
            <div>
              <p className="text-[12px] font-mono text-mute uppercase tracking-widest mb-1">
                Q. 「noteに公開」ボタンが押せない
              </p>
              <p className="text-[13px] font-sans text-ink-sub leading-relaxed">
                note への直接投稿機能は現在準備中です。プレビュー画面下部の「HTMLコピー」を使って
                note エディタに貼り付けてください。
              </p>
            </div>
            <div className="border-t border-rule pt-3">
              <p className="text-[12px] font-mono text-mute uppercase tracking-widest mb-1">
                Q. 画像配置 AI の提案機能は？
              </p>
              <p className="text-[13px] font-sans text-ink-sub leading-relaxed">
                プレビュー画面の「画像配置」セクションから画像をアップロードすると、
                AIが記事内の最適な配置箇所を提案します。
              </p>
            </div>
            <div className="border-t border-rule pt-3">
              <p className="text-[12px] font-mono text-mute uppercase tracking-widest mb-1">
                Q. 生成に時間がかかる
              </p>
              <p className="text-[13px] font-sans text-ink-sub leading-relaxed">
                記事生成は AIの応答待ちが 30 秒〜1 分かかることがあります。
                画面を閉じないでそのままお待ちください。
              </p>
            </div>
            <div className="border-t border-rule pt-3">
              <p className="text-[12px] font-mono text-mute uppercase tracking-widest mb-1">
                Q. データはどこに保存される？
              </p>
              <p className="text-[13px] font-sans text-ink-sub leading-relaxed">
                記事データはこのサーバーの <code className="text-[11px] font-mono bg-surface border border-rule px-1.5 py-0.5 rounded-sm">data/articles/</code> ディレクトリに
                JSON形式で保存されます。ブラウザを閉じてもデータは消えません。
              </p>
            </div>
          </div>
        </Section>

      </div>
    </main>
  );
}
