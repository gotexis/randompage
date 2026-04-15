import { signIn } from '@logto/next/server-actions';
import { logtoConfig } from '@/lib/logto';

export async function GET() {
  // signIn calls redirect() internally — use default redirect URI (/callback)
  await signIn(logtoConfig);
}
