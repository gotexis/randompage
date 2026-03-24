import passagesData from "@/data/passages.json";

export interface Passage {
  id: string;
  text: string;
  bookTitle: string;
  author: string;
  chapter?: string;
  tags: string[];
  language: "en" | "zh";
}

const passages: Passage[] = passagesData as Passage[];

let lastPassageId: string | null = null;

export function getRandomPassage(): Passage {
  if (passages.length <= 1) return passages[0];
  let candidate: Passage;
  do {
    candidate = passages[Math.floor(Math.random() * passages.length)];
  } while (candidate.id === lastPassageId);
  lastPassageId = candidate.id;
  return candidate;
}

export function getAllPassages(): Passage[] {
  return passages;
}
