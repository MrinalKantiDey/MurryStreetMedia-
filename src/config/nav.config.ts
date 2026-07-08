/**
 * Navigation Configuration
 *
 * Defines which pages appear in the site navigation and their display order.
 * Astro handles routing via the filesystem — this only controls nav menus.
 */

export interface NavItem {
  label: string;
  href: string;
  order: number;
}

export const navItems: NavItem[] = [
  { label: 'Approach', href: '/#approach', order: 1 },
  { label: 'Services', href: '/services', order: 2 },
  { label: 'Pricing', href: '/pricing', order: 3 },
  { label: 'Track Record', href: '/#track-record', order: 4 },
  { label: 'About', href: '/about', order: 5 },
  { label: 'Contact', href: '/contact', order: 6 },
];

/**
 * Get navigation items sorted by order
 */
export function getNavItems(): NavItem[] {
  return [...navItems].sort((a, b) => a.order - b.order);
}
