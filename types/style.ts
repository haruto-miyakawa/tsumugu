export interface StyleConfig {
  version: 1;
  updatedAt: string;

  tone: {
    formality: "casual" | "neutral" | "formal";
    humor: "none" | "light" | "frequent";
    perspective: "first_person" | "third_person" | "mixed";
    enthusiasm: "restrained" | "moderate" | "high";
    description: string;
  };

  structure: {
    opening: "hook" | "question" | "anecdote" | "direct";
    closing: "summary" | "cta" | "question" | "reflection";
    headingFrequency: "few" | "moderate" | "many";
    paragraphLength: "short" | "medium" | "long";
    usesBulletPoints: boolean;
    usesNumberedLists: boolean;
    typicalSections: string[];
  };

  vocabulary: {
    preferredExpressions: string[];
    avoidedExpressions: string[];
    jargonLevel: "none" | "some" | "heavy";
    emojiUsage: "none" | "minimal" | "frequent";
  };

  noteSpecific: {
    targetLength: number;
    hashTags: string[];
    categoryHint: string;
  };
}

export const DEFAULT_STYLE: StyleConfig = {
  version: 1,
  updatedAt: new Date().toISOString(),
  tone: {
    formality: "casual",
    humor: "light",
    perspective: "first_person",
    enthusiasm: "moderate",
    description: "",
  },
  structure: {
    opening: "anecdote",
    closing: "reflection",
    headingFrequency: "moderate",
    paragraphLength: "medium",
    usesBulletPoints: false,
    usesNumberedLists: false,
    typicalSections: [],
  },
  vocabulary: {
    preferredExpressions: [],
    avoidedExpressions: [],
    jargonLevel: "some",
    emojiUsage: "minimal",
  },
  noteSpecific: {
    targetLength: 2000,
    hashTags: [],
    categoryHint: "",
  },
};
