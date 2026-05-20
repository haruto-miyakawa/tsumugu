export interface EditorHeading {
  level: number;
  text: string;
}

export interface EditorUpdateData {
  html: string;
  charCount: number;
  headings: EditorHeading[];
}

export type SaveStatus = "saved" | "saving" | "unsaved";

export interface SelectionRange {
  from: number;
  to: number;
}

/** Top-level block type of the selection's first node (heading, paragraph, blockquote, …) */
export interface NodeTypeInfo {
  type: string;                       // Tiptap node type name
  attrs: Record<string, unknown>;     // e.g. { level: 2 } for headings
}
