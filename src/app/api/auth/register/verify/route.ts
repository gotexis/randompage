import { NextResponse } from 'next/server';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { rpID, origin } from '@/lib/webauthn';
import { db } from '@/db';
import { users, credentials } from '@/db/schema';
import { createSession } from '@/lib/auth';
import { challengeStore } from '../options/route';

export async function POST(request: Request) {
  const body = await request.json();
  const { userId, credential, displayName } = body;

  const expectedChallenge = challengeStore.get(userId);
  if (!expectedChallenge) {
    return NextResponse.json({ error: 'Challenge expired' }, { status: 400 });
  }

  try {
    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
    }

    const { credential: regCred } = verification.registrationInfo;

    // Check if first user
    const allUsers = await db.select().from(users);

    // Store user
    await db.insert(users).values({
      id: userId,
      displayName: displayName || 'User',
      createdAt: new Date(),
    });

    // Store credential — v13 uses base64url strings
    await db.insert(credentials).values({
      id: crypto.randomUUID(),
      userId,
      credentialId: regCred.id,
      publicKey: Buffer.from(regCred.publicKey).toString('base64url'),
      counter: regCred.counter,
      createdAt: new Date(),
    });

    challengeStore.delete(userId);

    await createSession(userId);

    return NextResponse.json({
      verified: true,
      isFirstUser: allUsers.length === 0,
    });
  } catch (error) {
    console.error('Registration verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
  }
}
