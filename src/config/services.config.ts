export interface ServiceItem {
  slug: string;
  number: string;
  icon: string;
  title: string;
  description: string;
  obligation: string;
  pricing: string;
  overageLabel: string;
  overage: string;
}

export const services: ServiceItem[] = [
  {
    slug: 'paid-social',
    number: '01',
    icon: 'share',
    title: 'Paid Social Media Management',
    description:
      'We turn scrollers into buyers. We build, manage, and optimize high-converting ad campaigns across Meta, TikTok, LinkedIn, and Reddit — including audience targeting, pixel tracking setup, budget pacing, writing high-converting ad copy, and on-going ad optimizations.',
    obligation:
      "Your finalized ad creatives (videos, images, graphics). Don't have them? We can bring in an expert editor to handle the production for an additional fee.",
    pricing: 'Billed transparently via flat monthly tiers aligned to your approved monthly media budget.',
    overageLabel: 'Overage Governance',
    overage: 'Requests exceeding assigned tier caps incur a clear $150/month per campaign fee and $50 per individual ad setup fee. No surprises.',
  },
  {
    slug: 'ppc-search',
    number: '02',
    icon: 'search',
    title: 'Pay-Per-Click (PPC) Search Management',
    description:
      "We capture high-intent buyers exactly when they are searching for what you sell — including keyword research, negative keyword filtering (so you don't waste money on bad clicks), bid adjustments, ad writing, and advice on making your website convert better.",
    obligation: 'Access to your ad account and your brand guidelines.',
    pricing: 'Governed strictly by your specific PPC spend tier based on your monthly budget.',
    overageLabel: 'Overage Governance',
    overage: 'Concurrent active campaigns exceeding assigned tier limits are billed at an overage rate of $150/month per campaign.',
  },
  {
    slug: 'programmatic',
    number: '03',
    icon: 'monitor',
    title: 'Programmatic Advertising Management',
    description:
      'Get your brand featured on premium streaming networks (like Connected TV), major websites, and digital video channels. We handle bidding on the best ad spaces, hyper-targeted audience framing, and fraud protection so your ads only show to real people.',
    obligation:
      'Your completed commercial files and banner graphics. If you need production support, we can source and manage a creative team to build them for you.',
    pricing: 'Billed transparently via a flat fee or a clear agency management percentage formula tied directly to your monthly programmatic spend tier. No hidden markups on inventory.',
    overageLabel: '',
    overage: '',
  },
  {
    slug: 'ooh',
    number: '04',
    icon: 'map-pin',
    title: 'Out-of-Home (OOH) Media Procurement',
    description:
      'Dominant physical presence. We source, negotiate, and execute massive real-world ad campaigns that blanket your target markets — sourcing billboard inventory, negotiating contracts, mapping locations, and delivering final proof that your ads went live.',
    obligation:
      'Your completed commercial files and banner graphics. If you need production support, we can source and manage a creative team to build them for you.',
    pricing: 'Structured as a flat strategic procurement fee or a visible percentage of total media costs, subject to a strict minimum project floor fee.',
    overageLabel: 'Financial Rule',
    overage: 'All approved OOH commitments are non-cancelable by the Client and must be 100% pre-funded 14 business days prior to vendor deadlines.',
  },
  {
    slug: 'fractional-cmo',
    number: '05',
    icon: 'layers',
    title: 'Fractional CMO',
    description:
      'Executive-level marketing leadership without the full-time C-suite salary. We bridge the gap between your high-level business goals and your daily marketing execution — covering growth strategy, senior alignment, and managing outside vendors. We can also connect you with our vetted network of trusted partners (like SEO pros, PR firms, and web developers) to act as a single, unified marketing force.',
    obligation:
      'Your current business metrics, past marketing data, and long-term growth targets.',
    pricing: 'Structured as a custom monthly retainer scoped to your growth targets and partner network needs — finalized during your Alignment Call.',
    overageLabel: '',
    overage: '',
  },
];
