/**
 * Cart state, backed by localStorage (persisted + synced across tabs).
 *
 * Import this only from client-side <script> tags or islands - never from
 * .astro frontmatter - since it touches localStorage at module load time.
 */
import { computed } from 'nanostores';
import { persistentJSON } from '@nanostores/persistent';

export interface CartItem {
  slug: string;
  qty: number;
}

const MAX_QTY = 10;

export const $cartItems = persistentJSON<CartItem[]>('cart', []);

export const $cartCount = computed($cartItems, (items) =>
  items.reduce((sum, item) => sum + item.qty, 0)
);

export function addItem(slug: string, qty = 1): void {
  const items = $cartItems.get();
  const existing = items.find((item) => item.slug === slug);

  if (existing) {
    $cartItems.set(
      items.map((item) =>
        item.slug === slug ? { ...item, qty: Math.min(item.qty + qty, MAX_QTY) } : item
      )
    );
  } else {
    $cartItems.set([...items, { slug, qty: Math.min(qty, MAX_QTY) }]);
  }
}

export function removeItem(slug: string): void {
  $cartItems.set($cartItems.get().filter((item) => item.slug !== slug));
}

export function setQty(slug: string, qty: number): void {
  if (qty <= 0) {
    removeItem(slug);
    return;
  }
  $cartItems.set(
    $cartItems.get().map((item) =>
      item.slug === slug ? { ...item, qty: Math.min(qty, MAX_QTY) } : item
    )
  );
}

export function clear(): void {
  $cartItems.set([]);
}
