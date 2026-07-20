import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from 'astro:env/server';

let client: Stripe | undefined;

/** Lazily-constructed Stripe client. Throws only when actually used without a configured key. */
export function getStripe(): Stripe {
  if (!STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  if (!client) {
    client = new Stripe(STRIPE_SECRET_KEY);
  }
  return client;
}
