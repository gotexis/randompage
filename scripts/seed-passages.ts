import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { passages } from '../src/db/schema';
import passagesData from '../src/data/passages.json' with { type: 'json' };

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client);

async function seed() {
  console.log(`Seeding ${passagesData.length} passages...`);

  for (const p of passagesData) {
    await db.insert(passages).values({
      id: p.id,
      text: p.text,
      bookTitle: p.bookTitle,
      author: p.author,
      chapter: (p as Record<string, unknown>).chapter as string | undefined ?? null,
      tags: JSON.stringify(p.tags),
      language: p.language,
    }).onConflictDoNothing();
  }

  console.log('Done!');
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
