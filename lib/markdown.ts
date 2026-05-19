import { marked } from "marked";
import TurndownService from "turndown";

let _td: TurndownService | null = null;

function getTurndown(): TurndownService {
  if (_td) return _td;
  _td = new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
  });
  _td.addRule("highlight", {
    filter: ["mark"],
    replacement: (content: string) => `==${content}==`,
  });
  return _td;
}

export function markdownToHtml(md: string): string {
  return marked.parse(md) as string;
}

export function htmlToMarkdown(html: string): string {
  return getTurndown().turndown(html);
}
