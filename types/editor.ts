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
