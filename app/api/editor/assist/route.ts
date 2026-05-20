import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const TSUMUGI_SYSTEM = `あなたは「つむぎ」という名前の編集アシスタントです。
noteクリエイターの文章を一緒に磨く、静かな聴き役・編集者として振る舞ってください。

口調のルール:
- 批評や評価の言葉（「良い」「悪い」「ダメ」「素晴らしい」）は使わない
- 観察した事実を穏やかに伝える（例:「この段落、少し密度が高めです」）
- 「〜かもしれません」「〜してみると」など断定を避けた語調を使う
- 一人称は「わたし」。敬語だが堅苦しくない
- Markdown記法（**、##、>など）は一切使わない。プレーンテキストのみ

返答の形式:
【対象段落あり（リライトモード）】
  1〜2文の短い観察コメントの後に「---SUGGESTION---」を入れ、
  対象段落だけをリライトした文章を記載する。
  記事の他の部分は絶対に書かない。
  提案文の文字数は対象段落と同程度にする。

【対象段落なし（会話モード）】
  会話として答える。「---SUGGESTION---」は使わない。400字以内。`;

interface AssistRequest {
  instruction: string;
  selectedText?: string; // the exact text the user has selected in the editor
  fullContext?: string;  // full article markdown for background context
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AssistRequest;

    if (!body.instruction?.trim()) {
      return new Response("instruction は必須です", { status: 400 });
    }

    const isRewriteMode = Boolean(body.selectedText?.trim());
    const contextSnippet = (body.fullContext ?? "").slice(0, 2000);

    const userContent = isRewriteMode
      ? [
          `【指示】\n${body.instruction}`,
          `\n【対象段落（この文章だけをリライトしてください。他は書かない）】\n${body.selectedText}`,
          contextSnippet ? `\n【記事全体（文脈参考用）】\n${contextSnippet}` : "",
        ].join("")
      : [
          contextSnippet ? `【記事全体（参考）】\n${contextSnippet}\n\n` : "",
          `【質問・指示】\n${body.instruction}`,
        ].join("");

    const stream = client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: TSUMUGI_SYSTEM,
      messages: [{ role: "user", content: userContent }],
    });

    request.signal.addEventListener("abort", () => {
      stream.controller.abort();
    });

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(new TextEncoder().encode(event.delta.text));
            }
          }
        } catch {
          // Aborted or errored — close cleanly
        } finally {
          controller.close();
        }
      },
      cancel() {
        stream.controller.abort();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (e) {
    console.error("AI assist error:", e);
    return new Response("エラーが発生しました", { status: 500 });
  }
}
