import path from 'node:path';
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type Stripe from 'stripe';
import { formatPrice } from './format';

export { formatPrice };

export type Product = CollectionEntry<'products'>;

/** All non-draft products, sorted by the `order` frontmatter field. */
export async function getAllProducts(): Promise<Product[]> {
  const products = await getCollection('products', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true
  );
  return products.sort((a, b) => a.data.order - b.data.order);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const product = await getEntry('products', slug);
  if (!product) return undefined;
  if (import.meta.env.PROD && product.data.draft) return undefined;
  return product;
}

/** Absolute path to a product's private PDF, bundled via the Vercel adapter's `includeFiles`. */
export function getProductFilePath(product: Product): string {
  return path.join(process.cwd(), 'private', 'downloads', product.data.pdfFile);
}

/** Maps a completed Stripe Checkout Session's line items back to unique catalog slugs. */
export function resolveSlugsFromLineItems(
  lineItems: Stripe.ApiList<Stripe.LineItem>
): string[] {
  const slugs = new Set<string>();

  for (const item of lineItems.data) {
    const product = item.price?.product;
    if (product && typeof product !== 'string' && !product.deleted) {
      const slug = (product as Stripe.Product).metadata?.slug;
      if (slug) slugs.add(slug);
    }
  }

  return [...slugs];
}
