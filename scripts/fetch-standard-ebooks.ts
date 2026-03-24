/**
 * Fetch books from Standard Ebooks, extract text, split into passages.
 * Usage: npx tsx scripts/fetch-standard-ebooks.ts
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE = "https://standardebooks.org";
const OUT_DIR = join(__dirname, "..", "src", "data");
const OUT_FILE = join(OUT_DIR, "passages.json");

// Curated list of great books on Standard Ebooks (public domain)
const BOOKS = [
  { path: "/ebooks/jane-austen/pride-and-prejudice", author: "Jane Austen", title: "Pride and Prejudice" },
  { path: "/ebooks/fyodor-dostoevsky/crime-and-punishment/constance-garnett", author: "Fyodor Dostoevsky", title: "Crime and Punishment" },
  { path: "/ebooks/oscar-wilde/the-picture-of-dorian-gray", author: "Oscar Wilde", title: "The Picture of Dorian Gray" },
  { path: "/ebooks/mary-shelley/frankenstein", author: "Mary Shelley", title: "Frankenstein" },
  { path: "/ebooks/franz-kafka/the-metamorphosis/david-wyllie", author: "Franz Kafka", title: "The Metamorphosis" },
  { path: "/ebooks/virginia-woolf/mrs-dalloway", author: "Virginia Woolf", title: "Mrs Dalloway" },
  { path: "/ebooks/herman-melville/moby-dick", author: "Herman Melville", title: "Moby-Dick" },
  { path: "/ebooks/charles-dickens/a-tale-of-two-cities", author: "Charles Dickens", title: "A Tale of Two Cities" },
  { path: "/ebooks/leo-tolstoy/anna-karenina/constance-garnett", author: "Leo Tolstoy", title: "Anna Karenina" },
  { path: "/ebooks/f-scott-fitzgerald/the-great-gatsby", author: "F. Scott Fitzgerald", title: "The Great Gatsby" },
  { path: "/ebooks/marcus-aurelius/meditations/george-long", author: "Marcus Aurelius", title: "Meditations" },
  { path: "/ebooks/sun-tzu/the-art-of-war/lionel-giles", author: "Sun Tzu", title: "The Art of War" },
  { path: "/ebooks/niccolo-machiavelli/the-prince/w-k-marriott", author: "Niccolò Machiavelli", title: "The Prince" },
  { path: "/ebooks/voltaire/candide/the-modern-library", author: "Voltaire", title: "Candide" },
  { path: "/ebooks/albert-camus/the-stranger/stuart-gilbert", author: "Albert Camus", title: "The Stranger" },
  { path: "/ebooks/homer/the-odyssey/william-cullen-bryant", author: "Homer", title: "The Odyssey" },
  { path: "/ebooks/plato/dialogues/benjamin-jowett", author: "Plato", title: "Dialogues" },
  { path: "/ebooks/charlotte-bronte/jane-eyre", author: "Charlotte Brontë", title: "Jane Eyre" },
  { path: "/ebooks/edgar-allan-poe/short-fiction", author: "Edgar Allan Poe", title: "Short Fiction" },
  { path: "/ebooks/h-g-wells/the-time-machine", author: "H. G. Wells", title: "The Time Machine" },
];

interface Passage {
  id: string;
  text: string;
  bookTitle: string;
  author: string;
  tags: string[];
  language: "en";
}

function extractTextFromHtml(html: string): string[] {
  // Extract <p> tag contents, strip HTML tags
  const paragraphs: string[] = [];
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = pRegex.exec(html)) !== null) {
    const text = match[1]
      .replace(/<[^>]+>/g, "") // strip tags
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&rsquo;/g, "\u2019")
      .replace(/&lsquo;/g, "\u2018")
      .replace(/&rdquo;/g, "\u201D")
      .replace(/&ldquo;/g, "\u201C")
      .replace(/&mdash;/g, "\u2014")
      .replace(/&ndash;/g, "\u2013")
      .replace(/&hellip;/g, "\u2026")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (text.length > 0) paragraphs.push(text);
  }
  return paragraphs;
}

function splitIntoPassages(paragraphs: string[], minLen = 100, maxLen = 600): string[] {
  const passages: string[] = [];
  let buffer = "";

  for (const p of paragraphs) {
    if (buffer.length + p.length + 1 <= maxLen) {
      buffer = buffer ? buffer + " " + p : p;
    } else {
      if (buffer.length >= minLen) {
        passages.push(buffer);
      }
      buffer = p.length <= maxLen ? p : p.slice(0, maxLen);
    }
  }
  if (buffer.length >= minLen) {
    passages.push(buffer);
  }
  return passages;
}

function pickBestPassages(passages: string[], count = 5): string[] {
  // Pick evenly distributed passages from the book
  if (passages.length <= count) return passages;
  const step = Math.floor(passages.length / count);
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(passages[i * step]);
  }
  return result;
}

async function fetchBook(bookPath: string): Promise<string | null> {
  const url = `${BASE}${bookPath}/text/single-page`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "RandomPage/1.0 (book passage extractor)" },
    });
    if (!res.ok) {
      console.error(`  ❌ ${res.status} for ${url}`);
      return null;
    }
    return await res.text();
  } catch (e) {
    console.error(`  ❌ Fetch error for ${url}:`, e);
    return null;
  }
}

async function main() {
  const allPassages: Passage[] = [];
  let idCounter = 1;

  for (const book of BOOKS) {
    console.log(`📚 Fetching: ${book.title} by ${book.author}`);
    const html = await fetchBook(book.path);
    if (!html) continue;

    const paragraphs = extractTextFromHtml(html);
    console.log(`  → ${paragraphs.length} paragraphs extracted`);

    const chunks = splitIntoPassages(paragraphs);
    console.log(`  → ${chunks.length} passage candidates`);

    const best = pickBestPassages(chunks, 5);
    console.log(`  → Selected ${best.length} passages`);

    for (const text of best) {
      allPassages.push({
        id: String(idCounter++),
        text,
        bookTitle: book.title,
        author: book.author,
        tags: [],
        language: "en",
      });
    }

    // Be polite - 1s delay between requests
    await new Promise((r) => setTimeout(r, 1000));
  }

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(allPassages, null, 2));
  console.log(`\n✅ Wrote ${allPassages.length} passages to ${OUT_FILE}`);
}

main().catch(console.error);
