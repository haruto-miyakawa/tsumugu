export interface GenerateRequest {
  theme: string;
  episode: string;
  targetReader?: string;
  lengthPreference: "short" | "medium" | "long";
  additionalNotes?: string;
  genre?: string;
  tone?: string;
  structure?: string;
}

export interface StyleAnalyzeRequest {
  text: string;
}

export interface ImageInfo {
  filename: string;
  originalName: string;
  url: string;
}

export interface PlacementSuggestion {
  imageFilename: string;
  afterHeading: string;
  reason: string;
}

export interface ApiError {
  error: string;
}
