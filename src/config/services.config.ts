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
      'End-to-end strategic management, optimization, and monitoring of paid advertising campaigns across authorized networks (e.g., Meta, TikTok). Includes custom audience architecture, tracking pixel deployment validation, budget pacing management, algorithmic optimization, and strategic copywriting variations.',
    obligation: 'Provide all final, production-ready creative assets (video, imagery, graphics).',
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
      'Oversight of strategy, development, management, and continuous optimization of paid search engine marketing campaigns (e.g., Google Ads, Microsoft Ads). Encompasses keyword research, negative keyword pruning, search query analysis, bidding strategy management, text-based ad copy formulation, and landing page relevance consulting.',
    obligation: 'Provide platform billing credentials, target URL destinations, and brand guidelines.',
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
      'Deployment and management of real-time bidding (RTB) programmatic media campaigns across display, native, and digital video channels using advanced Demand-Side Platforms (DSPs). Services include audience targeting framework design, inventory quality curation, fraud mitigation protocols, and cross-channel performance optimization.',
    obligation: 'Provide finalized banner assets, video files, and destination links.',
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
      'Strategic procurement and execution agent for Out-of-Home (OOH) media campaigns. Scope scales by spend bracket and includes market inventory sourcing, publisher contract negotiations, traffic/impression data reviews, competitive market auditing, multi-location mapping, production coordination, and final proof-of-performance verification.',
    obligation: 'Provide high-resolution, print-ready or digital-ready creative assets built to exact publisher specifications.',
    pricing: 'Structured as a flat strategic procurement fee or a visible percentage of total media costs, subject to a strict minimum project floor fee.',
    overageLabel: 'Financial Rule',
    overage: 'All approved OOH commitments are non-cancelable by the Client and must be 100% pre-funded 14 business days prior to vendor deadlines.',
  },
  {
    slug: 'organic-social',
    number: '05',
    icon: 'layout',
    title: 'Organic Social Media Scheduling & Distribution',
    description:
      'Structural calendar assembly, distribution, and native publication scheduling of your organic content assets across approved social media profiles (e.g., Meta, Instagram, LinkedIn, TikTok). Includes scheduling tool configuration, copy optimization for organic reach, hashtag architecture implementation, and profile presentation maintenance.',
    obligation: 'Bears absolute responsibility for providing all finalized creative assets (videos, photography, graphics, design files). Scope is strictly limited to distribution.',
    pricing: 'Baseline scope is strictly limited to a clear maximum number of post distributions per week across a maximum number of brand profiles.',
    overageLabel: 'Overage Governance',
    overage: 'Requests for publishing frequencies or networks exceeding the baseline cap are subject to an explicit Change Order and additional management fees.',
  },
  {
    slug: 'community-management',
    number: '06',
    icon: 'users',
    title: 'Social Media Community Management',
    description:
      'Frontline brand monitor across designated social media channels, overseeing asynchronous incoming audience interactions. Scope includes monitoring public post comments, managing direct message (DM) inquiries, hiding or reporting spam/troll interactions per your guidelines, and escalating high-value customer service issues or partnership inquiries.',
    obligation: 'Provide a designated internal point of contact to receive escalated technical support, billing, or complex customer service inquiries.',
    pricing: 'Active community monitoring is bound strictly to a defined maximum number of hours per week/day, with operational coverage windows limited to standard business hours (e.g., Monday through Friday, 9:00 AM – 5:00 PM CST). Utilizes a mutually approved "Brand Voice & FAQ Matrix."',
    overageLabel: '',
    overage: '',
  },
];
