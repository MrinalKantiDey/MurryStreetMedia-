import { readFile } from 'node:fs/promises';
import { Resend } from 'resend';
import { RESEND_API_KEY, RESEND_FROM_EMAIL } from 'astro:env/server';
import { getProductFilePath, formatPrice, type Product } from './products';
import { createDownloadToken } from './download-token';

let client: Resend | undefined;

function getResend(): Resend {
  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  if (!client) {
    client = new Resend(RESEND_API_KEY);
  }
  return client;
}

interface FulfillmentItem {
  product: Product;
  downloadUrl: string;
}

function buildEmailHtml(items: FulfillmentItem[]): string {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid #e5e5e5;">
            <p style="margin: 0 0 4px; font-weight: 600; color: #231F20;">${item.product.data.name}</p>
            <p style="margin: 0 0 12px; color: #57534e; font-size: 14px;">${item.product.data.shortDescription}</p>
            <a href="${item.downloadUrl}"
               style="display: inline-block; background: #DFE11D; color: #231F20; font-weight: 700; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px;">
              Download your PDF
            </a>
          </td>
        </tr>`
    )
    .join('');

  return `
    <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
      <div style="background: #231F20; padding: 24px; border-radius: 8px 8px 0 0;">
        <p style="margin: 0; color: #DFE11D; font-weight: 800; font-size: 18px; letter-spacing: 0.02em;">MURRY STREET MEDIA</p>
      </div>
      <div style="border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px; padding: 24px;">
        <h1 style="font-size: 20px; margin: 0 0 8px; color: #231F20;">Thanks for your purchase!</h1>
        <p style="margin: 0 0 24px; color: #57534e; font-size: 14px;">
          Your PDF${items.length > 1 ? 's are' : ' is'} attached to this email, and you can also download
          ${items.length > 1 ? 'them' : 'it'} directly using the button${items.length > 1 ? 's' : ''} below.
          Links stay active for 7 days.
        </p>
        <table style="width: 100%; border-collapse: collapse;">${rows}</table>
        <p style="margin: 24px 0 0; color: #a8a29e; font-size: 12px;">
          Questions? Just reply to this email.
        </p>
      </div>
    </div>`;
}

/**
 * Sends the post-purchase fulfillment email: a download link + the PDF as a
 * direct attachment, per product purchased. Uses Resend's idempotency key
 * (keyed to the Stripe session) so a retried webhook delivery within
 * Resend's 24h idempotency window can't send a duplicate email.
 */
export async function sendFulfillmentEmail({
  to,
  sessionId,
  origin,
  products,
}: {
  to: string;
  sessionId: string;
  origin: string;
  products: Product[];
}): Promise<void> {
  const resend = getResend();

  const items: FulfillmentItem[] = products.map((product) => {
    const token = createDownloadToken({ slug: product.id, sessionId });
    return { product, downloadUrl: `${origin}/api/download/${token}` };
  });

  const attachments = await Promise.all(
    products.map(async (product) => ({
      filename: `${product.data.name}.pdf`,
      content: await readFile(getProductFilePath(product)),
    }))
  );

  const subject =
    products.length === 1
      ? `Your download: ${products[0].data.name}`
      : `Your ${products.length} downloads from Murry Street Media`;

  await resend.emails.send(
    {
      from: RESEND_FROM_EMAIL || 'orders@murrystreetmedia.com',
      to,
      subject,
      html: buildEmailHtml(items),
      attachments,
    },
    { idempotencyKey: `checkout-fulfillment-${sessionId}` }
  );
}

export function orderTotalLabel(products: Product[]): string {
  const totalCents = products.reduce((sum, p) => sum + p.data.priceCents, 0);
  return formatPrice(totalCents, products[0]?.data.currency);
}
