import type { APIRoute } from 'astro';
import { z } from 'astro/zod';
import { getStripe } from '@/lib/stripe';
import { getProduct } from '@/lib/products';

export const prerender = false;

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        slug: z.string().min(1),
        qty: z.number().int().min(1).max(10),
      })
    )
    .min(1)
    .max(20),
});

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }

  const result = checkoutSchema.safeParse(body);
  if (!result.success) {
    return new Response(JSON.stringify({ error: 'Invalid cart' }), { status: 400 });
  }

  // Re-derive every price/name/currency from the catalog server-side -
  // client-submitted amounts are never trusted for a Stripe line item.
  const lineItems = [];
  for (const { slug, qty } of result.data.items) {
    const product = await getProduct(slug);
    if (!product) {
      return new Response(JSON.stringify({ error: `Unknown product: ${slug}` }), { status: 400 });
    }

    lineItems.push({
      quantity: qty,
      price_data: {
        currency: product.data.currency,
        unit_amount: product.data.priceCents,
        product_data: {
          name: product.data.name,
          description: product.data.shortDescription,
          metadata: { slug: product.id },
        },
      },
    });
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch {
    return new Response(JSON.stringify({ error: 'Checkout is not configured yet' }), {
      status: 500,
    });
  }

  const origin = new URL(request.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart?canceled=1`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    return new Response(JSON.stringify({ error: 'Could not start checkout' }), { status: 500 });
  }
};
