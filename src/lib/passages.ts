export interface Passage {
  id: string;
  text: string;
  bookTitle: string;
  author: string;
  chapter?: string;
  tags: string[];
  language: "en" | "zh";
}

const passages: Passage[] = [
  {
    id: "1",
    text: "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
    bookTitle: "A Tale of Two Cities",
    author: "Charles Dickens",
    chapter: "Chapter 1",
    tags: ["historical", "classic", "literature"],
    language: "en",
  },
  {
    id: "2",
    text: "All happy families are alike; each unhappy family is unhappy in its own way. Everything was in confusion in the Oblonskys' house. The wife had discovered that the husband was carrying on an intrigue with a French girl, who had been a governess in their family.",
    bookTitle: "Anna Karenina",
    author: "Leo Tolstoy",
    chapter: "Part 1, Chapter 1",
    tags: ["literature", "russian", "classic"],
    language: "en",
  },
  {
    id: "3",
    text: "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation.",
    bookTitle: "Moby-Dick",
    author: "Herman Melville",
    chapter: "Chapter 1: Loomings",
    tags: ["adventure", "classic", "literature"],
    language: "en",
  },
  {
    id: "4",
    text: "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since. 'Whenever you feel like criticizing anyone,' he told me, 'just remember that all the people in this world haven't had the advantages that you've had.'",
    bookTitle: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    chapter: "Chapter 1",
    tags: ["literature", "american", "classic"],
    language: "en",
  },
  {
    id: "5",
    text: "Man is condemned to be free; because once thrown into the world, he is responsible for everything he does. It is up to you to give life a meaning.",
    bookTitle: "Existentialism Is a Humanism",
    author: "Jean-Paul Sartre",
    chapter: "Lecture",
    tags: ["philosophy", "existentialism"],
    language: "en",
  },
  {
    id: "6",
    text: "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.",
    bookTitle: "The Stranger",
    author: "Albert Camus",
    tags: ["philosophy", "existentialism", "french"],
    language: "en",
  },
  {
    id: "7",
    text: "He who has a why to live for can bear almost any how. That which does not kill us makes us stronger. There are no facts, only interpretations.",
    bookTitle: "Twilight of the Idols",
    author: "Friedrich Nietzsche",
    tags: ["philosophy", "german", "classic"],
    language: "en",
  },
  {
    id: "8",
    text: "The mind is its own place, and in itself can make a heaven of hell, a hell of heaven. Better to reign in Hell, than to serve in Heaven.",
    bookTitle: "Paradise Lost",
    author: "John Milton",
    chapter: "Book 1",
    tags: ["poetry", "classic", "epic"],
    language: "en",
  },
  {
    id: "9",
    text: "I have no special talents. I am only passionately curious. Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.",
    bookTitle: "Letters",
    author: "Albert Einstein",
    tags: ["science", "philosophy", "letters"],
    language: "en",
  },
  {
    id: "10",
    text: "The unexamined life is not worth living. I know that I know nothing. The only true wisdom is in knowing you know nothing.",
    bookTitle: "Apology / Various Dialogues",
    author: "Socrates (via Plato)",
    tags: ["philosophy", "greek", "classic"],
    language: "en",
  },
];

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
