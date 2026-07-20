import { createHmac, timingSafeEqual } from 'node:crypto';
import { DOWNLOAD_TOKEN_SECRET } from 'astro:env/server';

const SEVEN_DAYS = 60 * 60 * 24 * 7;

interface TokenPayload {
  slug: string;
  sessionId: string;
}

function sign(payload: string): string {
  return createHmac('sha256', DOWNLOAD_TOKEN_SECRET ?? '').update(payload).digest('base64url');
}

/**
 * Creates a signed, expiring download token. Deterministic for a given
 * (slug, sessionId, secret) — both the Stripe webhook and the /order/success
 * page compute the identical token independently, so neither has to wait on
 * the other to hand out a working download link.
 */
export function createDownloadToken({
  slug,
  sessionId,
  expiresInSeconds = SEVEN_DAYS,
}: TokenPayload & { expiresInSeconds?: number }): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const payload = `${slug}.${sessionId}.${exp}`;
  const payloadEncoded = Buffer.from(payload, 'utf8').toString('base64url');
  return `${payloadEncoded}.${sign(payload)}`;
}

export function verifyDownloadToken(token: string): TokenPayload | null {
  if (!DOWNLOAD_TOKEN_SECRET) return null;

  const [payloadEncoded, signature] = token.split('.');
  if (!payloadEncoded || !signature) return null;

  let payload: string;
  try {
    payload = Buffer.from(payloadEncoded, 'base64url').toString('utf8');
  } catch {
    return null;
  }

  const expectedSignature = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  const [slug, sessionId, expStr] = payload.split('.');
  const exp = Number(expStr);
  if (!slug || !sessionId || !Number.isFinite(exp)) return null;
  if (exp <= Math.floor(Date.now() / 1000)) return null;

  return { slug, sessionId };
}
