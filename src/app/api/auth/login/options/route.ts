import { NextResponse } from 'next/server';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { rpID } from '@/lib/webauthn';
import { db } from '@/db';
import { credentials } from '@/db/schema';

export const loginChallengeStore = new Map<string, string>();

export async function POST() {
  const allCreds = await db.select().from(credentials);

  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: allCreds.map((c: { credentialId: string }) => ({
      id: c.credentialId,
    })),
    userVerification: 'preferred',
  });

  const challengeId = crypto.randomUUID();
  loginChallengeStore.set(challengeId, options.challenge);

  return NextResponse.json({ options, challengeId });
}
