export interface ArticleImage {
  filename: string;
  originalName: string;
  placementAfter: string;
  altText: string;
}

export type ArticleStatus = "draft" | "formatted" | "copied";

export interface ArticleData {
  id: string;
  createdAt: string;
  updatedAt: string;

  input: {
    theme: string;
    episode: string;
    targetReader?: string;
    lengthPreference: "short" | "medium" | "long";
    additionalNotes?: string;
    genre?: string;
    tone?: string;
    structure?: string;
  };

  output: {
    selectedTitle: string;
    titleCandidates: string[];
    markdown: string;
    formattedText?: string;
  };

  images: ArticleImage[];
  status: ArticleStatus;
  headerImage?: string; // filename served via /api/images/[filename]
}

export interface ArticleSummary {
  id: string;
  title: string;
  theme: string;
  createdAt: string;
  status: ArticleStatus;
}
