import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { pushSubscriptions, pushHistory } from '@/db/schema';
import { sendPush } from '@/lib/push';
import { eq } from 'drizzle-orm';
import { getWeightedPassage } from '@/lib/preferences';

export const dynamic = 'force-dynamic';

// POST /api/push/send — manual trigger (Product Pod / admin) to push
// a personalized passage to every subscriber.
// Mirrors /api/cron/daily-push logic to honor:
//   - deprecated #10 (no global RANDOM)
//   - deprecated #11 (no shared passage across users)
// Protected by PUSH_SECRET header.
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-push-secret');
  if (!secret || secret !== process.env.PUSH_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const allSubs = await db.select().from(pushSubscriptions);
  if (allSubs.length === 0) {
    return NextResponse.json({ sent: 0, failed: 0, personalized: [] });
  }

  // Group subscriptions by user
  const userSubs: Record<string, typeof allSubs> = {};
  for (const sub of allSubs) {
    if (!userSubs[sub.userId]) userSubs[sub.userId] = [];
    userSubs[sub.userId].push(sub);
  }

  let sent = 0;
  let failed = 0;
  const results: { userId: string; passageId: string }[] = [];

  for (const [userId, subs] of Object.entries(userSubs)) {
    // Avoid repeats — exclude already-pushed passages for this user
    const history = await db
      .select({ passageId: pushHistory.passageId })
      .from(pushHistory)
      .where(eq(pushHistory.userId, userId));
    const excludeIds = history.map((h) => h.passageId);

    // L1 personalized weighted pick
    const passage = await getWeightedPassage(userId, excludeIds);
    if (!passage) continue;

    const snippet =
      passage.text.length > 80 ? passage.text.slice(0, 77) + '...' : passage.text;

    for (const sub of subs) {
      try {
        await sendPush(sub, {
          title: `📖 ${passage.bookTitle}`,
          body: snippet,
          url: `/?passageId=${passage.id}`,
          tag: 'daily-passage',
        });
        await db.insert(pushHistory).values({
          id: crypto.randomUUID(),
          userId: sub.userId,
          passageId: passage.id,
          sentAt: new Date(),
        });
        sent++;
      } catch {
        await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, sub.id));
        failed++;
      }
    }
    results.push({ userId, passageId: passage.id });
  }

  return NextResponse.json({ sent, failed, personalized: results });
}
