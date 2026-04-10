import { NextResponse } from 'next/server';
import { db } from '@/db';
import { passages } from '@/db/schema';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const allPassages = await db.select().from(passages);

  return NextResponse.json(
    allPassages.map((p: { tags: string; [key: string]: unknown }) => ({
      ...p,
      tags: JSON.parse(p.tags),
    }))
  );
}
