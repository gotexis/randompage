import { NextResponse } from 'next/server';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { rpName, rpID } from '@/lib/webauthn';
import { db } from '@/db';
import { users, credentials } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Store challenges temporarily in memory (ok for single-instance)
export const challengeStore = new Map<string, string>();

export async function POST(request: Request) {
  const { displayName } = await request.json();
  if (!displayName || typeof displayName !== 'string') {
    return NextResponse.json({ error: 'displayName required' }, { status: 400 });
  }

  // Check if registration is allowed
  const allUsers = await db.select().from(users);
  const registrationOpen = process.env.REGISTRATION_OPEN !== 'false';
  if (allUsers.length > 0 && !registrationOpen) {
    return NextResponse.json({ error: 'Registration closed' }, { status: 403 });
  }

  const userId = crypto.randomUUID();

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName: displayName,
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
    },
  });

  // Store challenge for verification
  challengeStore.set(userId, options.challenge);

  return NextResponse.json({ options, userId });
}
