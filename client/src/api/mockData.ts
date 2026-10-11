import { User, Category, Article, Video, Report, Feedback } from '../types';

export const mockUsers: (User & { password?: string })[] = [
  {
    _id: '660000000000000000000001',
    name: 'Editorial & Compliance Team',
    email: 'admin@scaletrix.com',
    password: 'admin123456',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    bio: 'Scaletrix Lead Editors and Verified Legal & Marketing Compliance Council.',
    channelName: 'Scaletrix Official',
    followersCount: 15400,
    followingCount: 3,
    isVerified: true,
    isSuspended: false,
  },
  {
    _id: '660000000000000000000002',
    name: 'Priya Sharma',
    email: 'priya.sharma@scaletrix.com',
    password: 'creator123',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bio: 'Digital Marketing Strategist & Brand Growth Coach. Mentored 2,500+ small businesses across Southeast Asia and India.',
    channelName: 'GrowthCraft Marketing',
    website: 'https://growthcraft.example.com',
    followersCount: 3840,
    followingCount: 12,
    isVerified: true,
    isSuspended: false,
  },
  {
    _id: '660000000000000000000003',
    name: 'Aravind Menon',
    email: 'aravind.menon@scaletrix.com',
    password: 'creator123',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Commercial Photographer specializing in food styling and ecommerce product visuals for emerging retail brands.',
    channelName: 'Lens & Commercial Studio',
    website: 'https://lenscommercial.example.com',
    followersCount: 2190,
    followingCount: 8,
    isVerified: true,
    isSuspended: false,
  },
  {
    _id: '660000000000000000000004',
    name: 'CA Neha Kapoor',
    email: 'neha.kapoor@scaletrix.com',
    password: 'creator123',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    bio: 'Chartered Accountant educating small business owners on GST, MSME Udyam, FSSAI, and smart legal setup.',
    channelName: 'Tax & Compliance for Startups',
    website: 'https://taxstart.example.com',
    followersCount: 4720,
    followingCount: 5,
    isVerified: true,
    isSuspended: false,
  },
  {
    _id: '660000000000000000000005',
    name: 'Vikram Patel',
    email: 'vikram.patel@scaletrix.com',
    password: 'user123456',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: 'Aspiring entrepreneur starting an artisanal home spices brand in Pune.',
    followersCount: 42,
    followingCount: 15,
    isVerified: false,
    isSuspended: false,
  },
];

export const mockCategories: Category[] = [
  {
    _id: 'cat_01',
    name: 'Digital Marketing',
    slug: 'digital-marketing',
    description: 'Comprehensive digital strategy, performance ads, funnels, and organic reach.',
    icon: 'TrendingUp',
    color: '#0284c7',
    guideSection: 'marketing',
    topicsCount: 18,
  },
  {
    _id: 'cat_02',
    name: 'Social Media Marketing',
    slug: 'social-media-marketing',
    description: 'Engaging content formats, algorithm insights, reels, and community building.',
    icon: 'Share2',
    color: '#ec4899',
    guideSection: 'marketing',
    topicsCount: 14,
  },
  {
    _id: 'cat_03',
    name: 'Branding & Brand Strategy',
    slug: 'branding-strategy',
    description: 'Visual identity, tone of voice, positioning, and storytelling for lasting recall.',
    icon: 'Sparkles',
    color: '#8b5cf6',
    guideSection: 'branding_photo',
    topicsCount: 12,
  },
  {
    _id: 'cat_04',
    name: 'Small Business Growth',
    slug: 'small-business-growth',
    description: 'Bootstrapping roadmaps, unit economics, customer loyalty, and local dominance.',
    icon: 'Briefcase',
    color: '#10b981',
    guideSection: 'business',
    topicsCount: 22,
  },
  {
    _id: 'cat_05',
    name: 'Product & Food Photography',
    slug: 'photography',
    description: 'Smartphone lighting, props, angles, composition, and high-conversion catalog shots.',
    icon: 'Camera',
    color: '#f59e0b',
    guideSection: 'branding_photo',
    topicsCount: 16,
  },
  {
    _id: 'cat_06',
    name: 'GST & Business Registration',
    slug: 'gst-business-registration',
    description: 'Indian legal structures, Udyam MSME, GST filings, FSSAI, and trade licenses.',
    icon: 'FileText',
    color: '#0d9488',
    guideSection: 'legal',
    topicsCount: 15,
  },
  {
    _id: 'cat_07',
    name: 'Influencer Marketing',
    slug: 'influencer-marketing',
    description: 'Finding creator partners, proposal templates, negotiating deliverables, and FTC/ASCI ethics.',
    icon: 'Users',
    color: '#6366f1',
    guideSection: 'influencer',
    topicsCount: 11,
  },
  {
    _id: 'cat_08',
    name: 'Content Creation',
    slug: 'content-creation',
    description: 'Writing scripts, editing short-form video, copywriting, and visual assets.',
    icon: 'Edit3',
    color: '#f43f5e',
    guideSection: 'marketing',
    topicsCount: 10,
  },
  {
    _id: 'cat_09',
    name: 'Sales & Customer Acquisition',
    slug: 'sales-customer-acquisition',
    description: 'Converting leads, objection handling, WhatsApp sales funnels, and repeat purchases.',
    icon: 'Target',
    color: '#14b8a6',
    guideSection: 'marketing',
    topicsCount: 13,
  },
  {
    _id: 'cat_10',
    name: 'Entrepreneurship',
    slug: 'entrepreneurship',
    description: 'Ideation, mindset, validation, team building, and cash flow management.',
    icon: 'Compass',
    color: '#3b82f6',
    guideSection: 'business',
    topicsCount: 20,
  },
];

export const mockArticles: Article[] = [
  {
    _id: '661100000000000000000001',
    title: 'The Comprehensive Guide to Marketing Fundamentals: The 4Ps, 7Ps & STP Framework',
    slug: 'marketing-fundamentals-4ps-7ps-stp-framework',
    excerpt: 'Master the foundational building blocks of modern commerce. Learn how Product, Price, Place, and Promotion interact with Segmentation, Targeting, and Positioning to generate predictable demand.',
    category: 'Digital Marketing',
    subcategory: 'Marketing Fundamentals',
    tags: ['Marketing Fundamentals', '4Ps', '7Ps', 'STP', 'Strategy'],
    guideSection: 'marketing_hub',
    difficulty: 'beginner',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    author: mockUsers[1],
    readTime: 12,
    isFeatured: true,
    status: 'published',
    viewsCount: 4210,
    likesCount: 384,
    commentsCount: 24,
    createdAt: '2026-02-10T00:00:00.000Z',
    content: `
## Why Marketing Fundamentals Determine 90% of Startup Survival

Before spending a single rupee on Meta advertisements or Google PPC, an entrepreneur must understand the psychological mechanics of exchange. Marketing is not merely advertising; advertising is simply the loudspeaker, whereas marketing is the message, the product architecture, the pricing psychology, and the distribution conduit combined.

### Marketing vs Advertising vs Sales: The Vital Distinction
- **Marketing:** The systematic process of researching what real humans need, designing a compelling value proposition, and guiding prospects through an awareness journey.
- **Advertising:** The paid dissemination of targeted messages across defined media channels (Instagram, billboards, search engines).
- **Sales:** The direct transactional conversion of an interested lead into a paying customer.

---

### The Classic 4Ps Framework for Physical Products
1. **Product:** Does it solve a genuine bleeding-neck problem or satisfy a deep aspiration? Include packaging, warranties, and after-sales service.
2. **Price:** Cost-plus pricing vs value-based pricing. If your customer perceives ₹1,000 of value, pricing at ₹299 triggers skepticism; pricing at ₹699 captures healthy gross margin.
3. **Place (Distribution):** Direct-to-Consumer (D2C website), marketplace (Amazon/Flipkart), or localized brick-and-mortar shelf space.
4. **Promotion:** The holistic mix of organic content, influencer endorsements, search engine discovery, and referral incentives.

### The Extended 7Ps for Service & Digital Businesses
To scale modern services (consulting, digital agencies, cloud tools), add:
- **People:** The team delivering customer interactions.
- **Process:** The frictionless workflow from onboarding to support.
- **Physical Evidence:** Trust signals, reviews, case studies, certificates, and invoices.

---

### STP: Segmentation, Targeting, and Positioning
Without STP, you market to "everyone," which in practice means converting nobody.
- **Segmentation:** Divide your potential market by demographics, geography, psychographics (mindset), and behavioral triggers.
- **Targeting:** Pick the single segment with the highest willingness to pay and lowest acquisition cost.
- **Positioning:** The distinct real estate your brand occupies in the consumer's mind relative to substitutes. Example: *“The 15-minute healthy meal kit for busy working mothers.”*
`,
    checklists: [
      { item: 'Map out the 4Ps or 7Ps on a single page for your core offering.' },
      { item: 'Identify 3 clear buyer personas with their primary daily frustration.' },
      { item: 'Draft a one-sentence positioning statement using the formula: For [Target] who [Need], [Brand] is [Category] that [Benefit].' },
      { item: 'Audit current pricing to verify a minimum 50% gross margin.' }
    ],
    tools: [
      { name: 'Google Trends', url: 'https://trends.google.com', description: 'Validate regional search demand over time.' },
      { name: 'AnswerThePublic', url: 'https://answerthepublic.com', description: 'Discover exact consumer questions and search queries.' }
    ],
    faq: [
      { question: 'What is the most common mistake first-time marketers make?', answer: 'Assuming product quality alone drives sales without investing in distribution and clear positioning.' },
      { question: 'Should a small business start with 4Ps or jump straight to digital ads?', answer: 'Always clarify 4Ps first; running ads on an unvalidated product or unclear offer leads to wasted ad spend.' }
    ],
    commonMistakes: [
      'Underpricing to compete on price with established corporate incumbents.',
      'Broadcasting generic messaging that appeals to nobody specifically.',
      'Confusing vanity metrics (likes, impressions) with cash flow and qualified leads.'
    ]
  },
  {
    _id: '661100000000000000000002',
    title: 'The 12-Step Roadmap to Launching a Profitable Business From Scratch on a Budget',
    slug: '12-step-roadmap-launching-profitable-business-budget',
    excerpt: 'A pragmatic, battle-tested playbook for bootstrapping your first enterprise from home with under ₹25,000 capital. From idea validation to first 100 paying customers.',
    category: 'Small Business Growth',
    subcategory: 'Startup Playbook',
    tags: ['Startup', 'Bootstrapping', 'Small Business', 'Home Business', 'Cash Flow'],
    guideSection: 'startup_academy',
    difficulty: 'beginner',
    coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
    author: mockUsers[1],
    readTime: 15,
    isFeatured: true,
    status: 'published',
    viewsCount: 6180,
    likesCount: 512,
    commentsCount: 39,
    createdAt: '2026-02-12T00:00:00.000Z',
    content: `
## Starting With Little or No Initial Capital: The Bootstrapper's Advantage

Contrary to popular startup myths, you do not need venture capital or millions in debt to establish a sustainable, highly lucrative business. In fact, severe resource constraints force hyper-focus on profitability and genuine customer delight.

### The 12-Step Sequential Execution Path

#### Phase 1: Foundation & Customer Validation
1. **Identify High-Urgency Problems:** Look for tasks people hate doing, inefficiencies in local markets, or products people already buy with poor customer service.
2. **Conduct Competitor Secret-Shopping:** Order from 3 existing players. Analyze their reviews: what do 1-star and 2-star complaints consistently mention? That is your product differentiation.
3. **Define Your Initial Target Tribe:** Select 100 specific prospective customers. Talk to 15 of them before manufacturing or stocking inventory.
4. **Calculate Lean Startup Budget:** List fixed costs (packaging, initial raw supplies, basic tools) vs variable costs. Keep initial overhead under ₹15,000 to ₹25,000.

#### Phase 2: Identity, Operations & Setup
5. **Craft a Memorable Brand Identity:** Pick a simple name that is easy to spell, check domain and trademark availability, and select a cohesive 2-color palette.
6. **Obtain Foundational Compliances:** Secure your PAN, Udyam Registration (free and instant), and basic local municipal trade license or FSSAI registration if dealing with food items.
7. **Pricing for Resilience:** Formula: *(Cost of Goods Sold + Packaging + Labor) × 2.2 = Retail Price*. Never compromise on gross margins early on.
8. **Draft Your 30-Day Marketing Blueprint:** Focus on 2 organic acquisition channels: localized WhatsApp broadcast groups + Instagram Reels demonstration videos.

#### Phase 3: Launch, Customers & Scale
9. **Pre-Sell to First 20 Customers:** Secure deposits or upfront orders from friends, family, and local community members to validate proof-of-demand.
10. **Deliver Beyond Expectations:** Include a handwritten thank-you card, premium sample, or customized gift to turn first buyers into vocal advocates.
11. **Collect Video & Photo Testimonials:** Social proof is the greatest conversion catalyst. Request feedback via WhatsApp within 48 hours of delivery.
12. **Reinvest 70% of Profits into Working Capital:** Maintain positive cash flow before taking personal drawings or expanding physical overhead.
`,
    checklists: [
      { item: 'Complete competitor review teardown for 3 local or online alternatives.' },
      { item: 'Draft a spreadsheet itemizing all startup expenses down to individual packaging tape and labels.' },
      { item: 'Secure first 5 pre-orders or committed buyers before bulk inventory purchase.' },
      { item: 'Set up an official business WhatsApp account with an organized product catalog.' }
    ],
    tools: [
      { name: 'Canva', url: 'https://canva.com', description: 'Design logos, product labels, and social graphics for free.' },
      { name: 'Google Sheets', url: 'https://sheets.google.com', description: 'Manage cash flow, unit economics, and inventory trackers.' }
    ],
    faq: [
      { question: 'Can I start a home business without quitting my full-time job?', answer: 'Yes! Dedicate 2 hours each evening and Saturdays to validate sales before considering full-time transition.' }
    ]
  },
  {
    _id: '661100000000000000000003',
    title: 'Product & Food Photography on a Smartphone: Lighting, Composition & Color Grading',
    slug: 'smartphone-product-food-photography-masterclass',
    excerpt: 'Create high-converting, professional commercial catalog and social media imagery using only your smartphone and budget DIY lighting techniques.',
    category: 'Product & Food Photography',
    subcategory: 'Commercial Visuals',
    tags: ['Photography', 'Smartphone', 'Lighting', 'Food Styling', 'Visuals'],
    guideSection: 'branding_photography',
    difficulty: 'beginner',
    coverImage: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80',
    author: mockUsers[2],
    readTime: 10,
    isFeatured: true,
    status: 'published',
    viewsCount: 5410,
    likesCount: 468,
    commentsCount: 31,
    createdAt: '2026-02-15T00:00:00.000Z',
    content: `
## Why High-End Photography Multiplies Sales by 300%

In online commerce, the customer cannot touch, smell, or physically inspect your merchandise. **Your photo is the product.** A mediocre photo makes a premium ₹1,500 candle look like cheap street wax; a crisp, elegantly styled photograph allows you to charge premium prices with zero hesitation.

### Camera & Smartphone Fundamentals
- **Clean the Lens:** 50% of blurry smartphone shots are caused by pocket lint and fingerprint grease. Always wipe the camera lens with a microfiber cloth before shooting.
- **Lock Focus and Exposure:** Tap and hold on the subject on your screen (AE/AF Lock). Slide the exposure sun icon down slightly to preserve highlights.
- **Use 2x or 3x Optical Zoom:** Avoid wide-angle 1x distortion on small products. Stepping back 3 feet and using 2x optical zoom creates flattering, realistic perspective.

---

### Lighting Setups That Cost Under ₹1,500
1. **The Window Light Setup (Free):** Position shooting table 90 degrees to a north-facing window. Morning diffuse daylight creates soft shadows.
2. **The White Foam Board Reflector (₹80):** Place a white foam core board directly opposite the window to bounce light back into shadows.
3. **Diffuser Sheet (₹150):** Tape baking parchment paper or sheer white curtain fabric over the glass.
`,
    checklists: [
      { item: 'Enable camera grid lines in phone settings.' },
      { item: 'Purchase 2 white foam core boards from an art store for bounce reflectors.' },
      { item: 'Test shoot identical product with window backlight vs side-light.' }
    ],
    tools: [
      { name: 'Snapseed', url: 'https://support.google.com/snapseed', description: 'Free professional mobile photo editor by Google.' },
      { name: 'Lightroom Mobile', url: 'https://adobe.com', description: 'Industry standard for color grading and preset management.' }
    ],
    faq: [
      { question: 'Do I need an expensive DSLR camera?', answer: 'Not at all. Modern smartphones shot with proper lighting produce indistinguishable results.' }
    ]
  },
  {
    _id: '661100000000000000000004',
    title: 'Business Registration in India Explained: Sole Proprietorship vs LLP vs Private Limited',
    slug: 'business-registration-india-proprietorship-llp-pvt-ltd',
    excerpt: 'Demystifying Indian business incorporation. Understand liability protection, compliance overheads, Udyam MSME, and when to transition structures.',
    category: 'GST & Business Registration',
    subcategory: 'Legal Compliance',
    tags: ['GST', 'Udyam', 'MSME', 'Sole Proprietorship', 'LLP', 'Pvt Ltd', 'Legal'],
    guideSection: 'legal_gst',
    difficulty: 'intermediate',
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    author: mockUsers[3],
    readTime: 14,
    isFeatured: true,
    status: 'published',
    viewsCount: 7850,
    likesCount: 670,
    commentsCount: 54,
    createdAt: '2026-02-18T00:00:00.000Z',
    content: `
## Choosing the Right Legal Vehicle for Your Enterprise

Starting a business in India requires choosing between simplicity and liability protection. Many founders spend ₹20,000 prematurely on a Private Limited company before making their first sale, or operate as an informal sole proprietorship without understanding liability risks.

> **Disclaimer:** This guide is for educational purposes and should not be construed as legal or tax advice. Consult a practicing Chartered Accountant for your specific situation.

---

### Comparative Structural Overview

| Feature | Sole Proprietorship | Limited Liability Partnership (LLP) | Private Limited Company (Pvt Ltd) |
|---|---|---|---|
| **Best For** | Solo bootstrapped beginners, home creators | Partnerships, boutique agencies | High-growth startups seeking venture funding |
| **Initial Cost** | ₹0 – ₹2,000 | ₹6,000 – ₹10,000 | ₹7,000 – ₹15,000 |
| **Personal Liability** | Unlimited (personal assets at risk) | Limited to partner capital | Limited to share capital |
| **Annual Compliances** | Minimal (Individual ITR) | Moderate (Form 11 & Form 8) | High (Audited accounts, AGM, ROC filings) |
| **Separate Legal Entity** | No | Yes | Yes |

---

### The Udyam MSME Registration (Mandatory for Indian Entrepreneurs)
- **Portal:** [udyamregistration.gov.in](https://udyamregistration.gov.in)
- **Cost:** 100% Free (Beware of fraudulent third-party payment portals charging ₹1,500).
- **Documents Required:** Aadhaar Card linked to Mobile, PAN Card, business address details.
`,
    checklists: [
      { item: 'Verify your Aadhaar card is updated with an active mobile number.' },
      { item: 'Register on official government Udyam portal (zero fees).' },
      { item: 'Open a dedicated Current Account in your business name.' }
    ],
    tools: [
      { name: 'MCA Portal', url: 'https://mca.gov.in', description: 'Ministry of Corporate Affairs portal.' },
      { name: 'Udyam Registration', url: 'https://udyamregistration.gov.in', description: 'Official free MSME registration.' }
    ],
    officialLinks: [
      { title: 'Official Udyam MSME Portal', url: 'https://udyamregistration.gov.in', isGovernmentPortal: true },
      { title: 'Ministry of Corporate Affairs (MCA)', url: 'https://www.mca.gov.in', isGovernmentPortal: true },
      { title: 'GST Official Portal', url: 'https://www.gst.gov.in', isGovernmentPortal: true }
    ],
    faq: [
      { question: 'Is a Private Limited company mandatory to sell online?', answer: 'No! You can sell on Amazon, Flipkart, or your own Shopify store as a Sole Proprietor with GST and Udyam.' }
    ]
  },
  {
    _id: '661100000000000000000005',
    title: 'Influencer Marketing & Brand Collaborations: Proposal Templates, Rate Cards & Legal Disclosures',
    slug: 'influencer-marketing-brand-collaborations-outreach-templates',
    excerpt: 'How emerging brands collaborate with micro and nano creators for high-ROI campaigns. Includes tested outreach email scripts and ASCI disclosure guidelines.',
    category: 'Influencer Marketing',
    subcategory: 'Partnerships',
    tags: ['Influencer Marketing', 'Collaboration', 'Pitch Templates', 'ASCI', 'Outreach'],
    guideSection: 'influencer_collab',
    difficulty: 'intermediate',
    coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    author: mockUsers[1],
    readTime: 11,
    isFeatured: false,
    status: 'published',
    viewsCount: 3820,
    likesCount: 295,
    commentsCount: 19,
    createdAt: '2026-02-22T00:00:00.000Z',
    content: `
## Why Micro-Influencers Outperform Celebrity Endorsements for Small Brands

Celebrity endorsements cost lakhs with vanity reach and low engagement. In contrast, nano-influencers (1,000 to 10,000 followers) and micro-influencers (10,000 to 50,000 followers) maintain tight-knit, high-trust communities.

### Vetting Genuine Engagement vs Fake Followers
- Calculate engagement rate: *(Total Likes + Comments on last 10 posts / Total Followers) × 100*. Healthy is 3% to 7%.
- Inspect comment quality: Do comments ask specific questions about the product, or are they bot emojis?
`,
    checklists: [
      { item: 'Build a list of 25 niche-aligned micro-creators in your city.' },
      { item: 'Calculate their engagement percentage on their last 10 reels.' }
    ],
    tools: [
      { name: 'Modash', url: 'https://modash.io', description: 'Analyze fake follower percentage and demographics.' }
    ],
    faq: [
      { question: 'What is a typical fee for a micro-influencer reel?', answer: 'For nano creators, product gifting or ₹2,000–₹5,000 is common. Micro creators charge ₹5,000–₹15,000.' }
    ]
  },
  {
    _id: '661100000000000000000010',
    title: 'Search Engine Optimization (SEO) Architecture: The Zero-to-100 Organic Traffic Engine',
    slug: 'seo-architecture-organic-traffic-engine',
    excerpt: 'A complete tactical blueprint to ranking #1 on Google without paid ad spend. Learn keyword research, search intent mapping, technical Core Web Vitals, and authoritative link building.',
    category: 'Digital Marketing',
    subcategory: 'Search Engine Optimization',
    tags: ['SEO', 'Organic Growth', 'Google Ranking', 'Keyword Intent'],
    guideSection: 'marketing_hub',
    difficulty: 'intermediate',
    coverImage: 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?auto=format&fit=crop&w=1200&q=80',
    author: mockUsers[1],
    readTime: 14,
    isFeatured: true,
    status: 'published',
    viewsCount: 3920,
    likesCount: 342,
    commentsCount: 18,
    createdAt: '2026-02-23T00:00:00.000Z',
    content: `
## SEO Architecture: Dominating Organic Search

Search engine optimization is the highest ROI marketing channel in existence. Unlike paid ads where traffic stops the second you turn off your credit card, well-architected SEO assets generate compound organic visits for years.
`,
    checklists: [
      { item: 'Audit website load speed with Google PageSpeed Insights.' },
      { item: 'Ensure every key page has unique meta title, description, and H1 tag.' }
    ]
  }
];

export const mockVideos: Video[] = [
  {
    _id: '662200000000000000000001',
    title: 'Mastering the 4Ps of Marketing in 10 Minutes (With Real Brand Case Studies)',
    slug: 'mastering-4ps-marketing-real-case-studies',
    description: 'In this high-yield educational lesson, we break down the 4Ps of marketing: Product, Price, Place, and Promotion. See how brands like Apple, Paper Boat, and local homegrown businesses structure their go-to-market strategies.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    duration: '10:14',
    category: 'Digital Marketing',
    tags: ['Marketing', 'Business Strategy', '4Ps', 'Branding'],
    creator: mockUsers[1],
    viewsCount: 3840,
    likesCount: 290,
    commentsCount: 18,
    status: 'published',
    isFeatured: true,
    learningObjectives: [
      'Understand the core 4Ps framework and real-world trade-offs',
      'Learn value-based pricing strategies vs cost-plus models',
      'Design an omnichannel distribution pipeline for physical products'
    ],
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    _id: '662200000000000000000002',
    title: 'Step-by-Step Smartphone Product Photography Tutorial (Budget Lighting Setup)',
    slug: 'smartphone-product-photography-budget-lighting',
    description: 'Complete studio walkthrough! Learn how to transform an ordinary dining table and a simple desk lamp or window into a professional commercial photography studio for your online store.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80',
    duration: '14:22',
    category: 'Product & Food Photography',
    tags: ['Photography', 'Smartphone', 'Ecommerce', 'Lighting'],
    creator: mockUsers[2],
    viewsCount: 5210,
    likesCount: 440,
    commentsCount: 34,
    status: 'published',
    isFeatured: true,
    learningObjectives: [
      'Master optical vs digital zoom on modern mobile phones',
      'Use white foam board reflectors to eliminate harsh shadows',
      'Color grade catalog photos using free mobile editing applications'
    ],
    createdAt: '2026-02-04T00:00:00.000Z',
  },
  {
    _id: '662200000000000000000003',
    title: 'GST Portal Walkthrough: How to File GSTR-1 & Generate Compliant Invoices',
    slug: 'gst-portal-walkthrough-gstr1-compliant-invoices',
    description: 'Chartered Accountant Neha Kapoor walks through the official GST government portal screen-by-screen. Learn B2B vs B2C invoice classification, HSN codes, and avoiding late penalty fees.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    duration: '18:45',
    category: 'GST & Business Registration',
    tags: ['GST', 'Tax', 'Invoicing', 'Compliance', 'India'],
    creator: mockUsers[3],
    viewsCount: 7890,
    likesCount: 680,
    commentsCount: 52,
    status: 'published',
    isFeatured: true,
    learningObjectives: [
      'Navigate the government gst.gov.in dashboard without confusion',
      'Create legally compliant tax invoices with proper HSN and CGST/SGST splits',
      'Avoid the top 5 mistakes that trigger tax notices for new businesses'
    ],
    createdAt: '2026-02-07T00:00:00.000Z',
  },
];

export const mockReports: Report[] = [
  {
    _id: 'rep_01',
    reporter: mockUsers[4],
    targetType: 'comment',
    targetId: 'comm_01',
    reason: 'Spam promotional link',
    details: 'User posted an unauthorized telegram referral link in the comments.',
    status: 'pending',
    createdAt: '2026-02-28T00:00:00.000Z',
  },
  {
    _id: 'rep_02',
    reporter: mockUsers[4],
    targetType: 'video',
    targetId: '662200000000000000000001',
    reason: 'Audio sync glitch',
    details: 'Small audio delay between 03:15 and 04:20.',
    status: 'reviewed',
    resolutionNotes: 'Verified audio track; re-encoded master file.',
    createdAt: '2026-02-27T00:00:00.000Z',
  },
];

export const mockFeedbacks: Feedback[] = [
  {
    _id: 'fb_01',
    user: mockUsers[4],
    name: 'Vikram Patel',
    email: 'vikram.patel@scaletrix.com',
    restaurantName: 'Spice & Clay Handi Kitchen',
    businessType: 'Cloud Kitchen',
    category: 'tool_suggestion',
    rating: 5,
    title: 'Batch Cooking & Sub-Recipe Yields in Food-Cost Calculator',
    message: 'The Food-Cost calculator has been indispensable for calculating our Biryani handi plates. It would be amazing if we could save bulk marinades and mother-gravies as reusable sub-recipes that flow automatically into individual menu dish calculations!',
    tags: ['Food Cost', 'Batch Yield', 'Sub-recipes', 'Cloud Kitchen'],
    status: 'planned',
    upvotes: 34,
    upvotedBy: ['660000000000000000000001', '660000000000000000000002'],
    adminResponse: 'Excellent suggestion! Our product team is actively developing a Sub-Recipe & Prep-Yield extension for the Business Tools suite.',
    isPublic: true,
    createdAt: '2026-02-28T10:00:00.000Z',
  },
  {
    _id: 'fb_02',
    name: 'Ananya Deshmukh',
    email: 'ananya@kafeindore.in',
    restaurantName: 'Cafe Malwa Roasters',
    businessType: 'Cafe / Bistro',
    category: 'user_experience',
    rating: 5,
    title: 'Commission Traps Audit saved our cafe ₹35,000 this month!',
    message: 'Before Scaletrix, we were blindly pouring 24% + GST commissions into aggregator match campaigns without realizing our net plate margin was barely 4%. The 6-Month Growth Planner helped us launch WhatsApp direct ordering for our regular breakfast patrons.',
    tags: ['Direct Ordering', 'Growth Planner', 'High ROI'],
    status: 'completed',
    upvotes: 42,
    upvotedBy: ['660000000000000000000005'],
    adminResponse: 'Congratulations Ananya! Shifting even 20% of orders to direct delivery changes your bottom line completely.',
    isPublic: true,
    createdAt: '2026-03-05T14:30:00.000Z',
  },
  {
    _id: 'fb_03',
    name: 'Chef Harpreet Singh',
    email: 'harpreet@dhabastop.com',
    restaurantName: 'Highway Zaika Express',
    businessType: 'QSR / Street Food',
    category: 'content_idea',
    rating: 5,
    title: 'FSSAI Oil Discard & Kitchen SOPs are pure gold',
    message: 'Most online resources only give generic US/UK advice that does not match Indian regulatory realities. The specific 25% Total Polar Compound (TPC) frying oil discard standards and hygiene audits in the Learning Hub saved us during our official inspection last week.',
    tags: ['FSSAI', 'Hygiene SOP', 'Oil Discard'],
    status: 'reviewed',
    upvotes: 28,
    upvotedBy: [],
    adminResponse: 'Strict adherence to food safety is the highest competitive advantage. Glad our checklists helped!',
    isPublic: true,
    createdAt: '2026-03-12T09:15:00.000Z',
  },
  {
    _id: 'fb_04',
    name: 'Meera Nambiar',
    email: 'meera.bakes@gmail.com',
    restaurantName: 'Crumbs & Crust Artisan Bakes',
    businessType: 'Bakery / Dessert',
    category: 'feature_request',
    rating: 4,
    title: 'Export Recipe Costing Cards as Printable PDF',
    message: 'Would love an option to generate a printable, formatted recipe card with grams and costs to laminate and hang over each preparation workstation for our baking assistants.',
    tags: ['Export PDF', 'Recipe Card', 'Bakery'],
    status: 'planned',
    upvotes: 31,
    upvotedBy: [],
    adminResponse: 'Printable laminated SOP cards and PDF export are on our current release roadmap!',
    isPublic: true,
    createdAt: '2026-03-18T16:45:00.000Z',
  },
  {
    _id: 'fb_05',
    name: 'Rohan Mehra',
    email: 'rohan@urbanbowl.co',
    restaurantName: 'Urban Bowl Salad Bar',
    businessType: 'Cloud Kitchen',
    category: 'general',
    rating: 5,
    title: 'The cleanest financial toolkit for food entrepreneurs in India',
    message: 'Found Scaletrix while struggling to calculate whether offering free delivery on Swiggy was profitable. Within 20 minutes, I completely restructured our combo prices. Immensely grateful this platform is free!',
    tags: ['Combo Pricing', 'Pricing Strategy', 'Game Changer'],
    status: 'reviewed',
    upvotes: 19,
    upvotedBy: [],
    isPublic: true,
    createdAt: '2026-03-22T11:20:00.000Z',
  },
];

