import { NextResponse } from 'next/server';
import { db } from '@/db';
import { passages } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [passage] = await db
    .select()
    .from(passages)
    .orderBy(sql`RANDOM()`)
    .limit(1);

  if (!passage) {
    return NextResponse.json({ error: 'No passages' }, { status: 404 });
  }

  return NextResponse.json({
    ...passage,
    tags: JSON.parse(passage.tags),
  });
}
