import type { APIRoute } from 'astro';
import type Stripe from 'stripe';
import { STRIPE_WEBHOOK_SECRET } from 'astro:env/server';
import { getStripe } from '@/lib/stripe';
import { getProduct, resolveSlugsFromLineItems } from '@/lib/products';
import { sendFulfillmentEmail } from '@/lib/resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return new Response('Webhook not configured', { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }

  // Raw body is required for signature verification - must not call
  // request.json() first, a Request body can only be consumed once.
  const rawBody = await request.text();

  let stripe;
  let event: Stripe.Event;
  try {
    stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error('Stripe webhook signature verification failed:', error);
    return new Response('Invalid signature', { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  try {
    if (session.payment_status !== 'paid') {
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    const email = session.customer_details?.email;
    if (!email) {
      console.error(`No customer email on session ${session.id}`);
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product'],
    });
    const slugs = resolveSlugsFromLineItems(lineItems);

    const products = [];
    for (const slug of slugs) {
      const product = await getProduct(slug);
      if (product) products.push(product);
    }

    if (products.length === 0) {
      console.error(`No known products resolved for session ${session.id}`);
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    const origin = new URL(request.url).origin;
    await sendFulfillmentEmail({ to: email, sessionId: session.id, origin, products });

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error(`Error fulfilling session ${session.id}:`, error);
    // Non-2xx so Stripe retries - fulfillment email uses an idempotency key,
    // so a retry can't result in a duplicate send.
    return new Response('Fulfillment failed', { status: 500 });
  }
};
