// 記事生成フォームの enum と「READMEから自動入力」API の型を一元定義する。
// GenerateForm.tsx もこのモジュールから import する（enum 定義を二箇所に持たない）。

export const GENRES = ["エッセイ", "ハウツー", "体験記", "レビュー", "コラム"] as const;
export const TONES = ["です・ます", "カジュアル", "詩的"] as const;
export const STRUCTURES = ["起承転結", "結論先出し", "散文"] as const;
export const LENGTH_PREFERENCES = ["short", "medium", "long"] as const;
export const PLATFORMS = ["note", "qiita", "zenn"] as const;

export type Genre = typeof GENRES[number];
export type Tone = typeof TONES[number];
export type Structure = typeof STRUCTURES[number];
export type LengthPreference = typeof LENGTH_PREFERENCES[number];
export type Platform = typeof PLATFORMS[number];

// source は将来 URL 対応のために discriminated union で持つ。
// スプリント1 では type: "text" のみ実装。
export type FromReadmeSource = { type: "text"; readmeText: string };

export type FromReadmeRequest = {
  source: FromReadmeSource;
  platform: Platform;
};

export type FromReadmeResponse = {
  theme: string;
  episode: string;
  genre: Genre;
  tone: Tone;
  structure: Structure;
  lengthPreference: LengthPreference;
  targetReader: string;
  additionalNotes: string;
};
