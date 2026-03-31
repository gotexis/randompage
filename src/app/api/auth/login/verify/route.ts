import { NextResponse } from 'next/server';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { rpID, origin } from '@/lib/webauthn';
import { db } from '@/db';
import { credentials } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createSession } from '@/lib/auth';
import { loginChallengeStore } from '../options/route';

export async function POST(request: Request) {
  const { challengeId, credential } = await request.json();

  const expectedChallenge = loginChallengeStore.get(challengeId);
  if (!expectedChallenge) {
    return NextResponse.json({ error: 'Challenge expired' }, { status: 400 });
  }

  // Find the credential in DB — v13 uses base64url string IDs
  const credentialId = credential.id;
  const [storedCred] = await db
    .select()
    .from(credentials)
    .where(eq(credentials.credentialId, credentialId));

  if (!storedCred) {
    return NextResponse.json({ error: 'Credential not found' }, { status: 400 });
  }

  try {
    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: storedCred.credentialId,
        publicKey: Buffer.from(storedCred.publicKey, 'base64url'),
        counter: storedCred.counter,
      },
    });

    if (!verification.verified) {
      return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
    }

    // Update counter
    await db
      .update(credentials)
      .set({ counter: verification.authenticationInfo.newCounter })
      .where(eq(credentials.id, storedCred.id));

    loginChallengeStore.delete(challengeId);

    await createSession(storedCred.userId);

    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error('Login verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
  }
}
