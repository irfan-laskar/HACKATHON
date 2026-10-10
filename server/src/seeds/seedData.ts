import User from '../models/User';
import Category from '../models/Category';
import Article from '../models/Article';
import Video from '../models/Video';
import { isMongooseReady } from '../services/dataStore';

export const seedInitialData = async () => {
  try {
    if (!isMongooseReady()) {
      return;
    }
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('🌱 Database already populated. Skipping automatic seeding.');
      return;
    }

    console.log('🌱 Database is empty. Seeding rich educational content for MarketSphere...');

    // 1. Create Users
    const admin = await User.create({
      name: 'Editorial & Compliance Team',
      email: 'admin@marketsphere.com',
      password: 'admin123456',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      bio: 'MarketSphere Lead Editors and Verified Legal & Marketing Compliance Council.',
      channelName: 'MarketSphere Official',
      isVerified: true,
    });

    const creatorPriya = await User.create({
      name: 'Priya Sharma',
      email: 'priya.sharma@marketsphere.com',
      password: 'creator123',
      role: 'creator',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      bio: 'Digital Marketing Strategist & Brand Growth Coach. Mentored 2,500+ small businesses across Southeast Asia and India.',
      channelName: 'GrowthCraft Marketing',
      website: 'https://growthcraft.example.com',
      isVerified: true,
      followersCount: 1420,
    });

    const creatorAravind = await User.create({
      name: 'Aravind Menon',
      email: 'aravind.menon@marketsphere.com',
      password: 'creator123',
      role: 'creator',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Commercial Photographer specializing in food styling and ecommerce product visuals for emerging retail brands.',
      channelName: 'Lens & Commercial Studio',
      website: 'https://lenscommercial.example.com',
      isVerified: true,
      followersCount: 980,
    });

    const creatorNeha = await User.create({
      name: 'CA Neha Kapoor',
      email: 'neha.kapoor@marketsphere.com',
      password: 'creator123',
      role: 'creator',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      bio: 'Chartered Accountant educating small business owners on GST, MSME Udyam, FSSAI, and smart legal setup.',
      channelName: 'Tax & Compliance for Startups',
      website: 'https://taxstart.example.com',
      isVerified: true,
      followersCount: 3100,
    });

    const regularUser = await User.create({
      name: 'Vikram Patel',
      email: 'vikram.patel@marketsphere.com',
      password: 'user123456',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      bio: 'Aspiring entrepreneur starting an artisanal home spices brand in Pune.',
      followersCount: 45,
    });

    // 2. Create Categories
    const categoriesData = [
      {
        name: 'Digital Marketing',
        slug: 'digital-marketing',
        description: 'Comprehensive digital strategy, performance ads, funnels, and organic reach.',
        icon: 'TrendingUp',
        color: '#0284c7',
        guideSection: 'marketing',
        topicsCount: 18,
      },
      {
        name: 'Social Media Marketing',
        slug: 'social-media-marketing',
        description: 'Engaging content formats, algorithm insights, reels, and community building.',
        icon: 'Share2',
        color: '#ec4899',
        guideSection: 'marketing',
        topicsCount: 14,
      },
      {
        name: 'Branding & Brand Strategy',
        slug: 'branding-strategy',
        description: 'Visual identity, tone of voice, positioning, and storytelling for lasting recall.',
        icon: 'Sparkles',
        color: '#8b5cf6',
        guideSection: 'branding_photo',
        topicsCount: 12,
      },
      {
        name: 'Small Business Growth',
        slug: 'small-business-growth',
        description: 'Bootstrapping roadmaps, unit economics, customer loyalty, and local dominance.',
        icon: 'Briefcase',
        color: '#10b981',
        guideSection: 'business',
        topicsCount: 22,
      },
      {
        name: 'Product & Food Photography',
        slug: 'photography',
        description: 'Smartphone lighting, props, angles, composition, and high-conversion catalog shots.',
        icon: 'Camera',
        color: '#f59e0b',
        guideSection: 'branding_photo',
        topicsCount: 16,
      },
      {
        name: 'GST & Business Registration',
        slug: 'gst-business-registration',
        description: 'Indian legal structures, Udyam MSME, GST filings, FSSAI, and trade licenses.',
        icon: 'FileText',
        color: '#0d9488',
        guideSection: 'legal',
        topicsCount: 15,
      },
      {
        name: 'Influencer Marketing',
        slug: 'influencer-marketing',
        description: 'Finding creator partners, proposal templates, negotiating deliverables, and FTC/ASCI ethics.',
        icon: 'Users',
        color: '#6366f1',
        guideSection: 'influencer',
        topicsCount: 11,
      },
      {
        name: 'Content Creation',
        slug: 'content-creation',
        description: 'Writing scripts, editing short-form video, copywriting, and visual assets.',
        icon: 'Edit3',
        color: '#f43f5e',
        guideSection: 'marketing',
        topicsCount: 10,
      },
      {
        name: 'Sales & Customer Acquisition',
        slug: 'sales-customer-acquisition',
        description: 'Converting leads, objection handling, WhatsApp sales funnels, and repeat purchases.',
        icon: 'Target',
        color: '#14b8a6',
        guideSection: 'marketing',
        topicsCount: 13,
      },
      {
        name: 'Entrepreneurship',
        slug: 'entrepreneurship',
        description: 'Ideation, mindset, validation, team building, and cash flow management.',
        icon: 'Compass',
        color: '#3b82f6',
        guideSection: 'business',
        topicsCount: 20,
      },
    ];

    await Category.insertMany(categoriesData);

    // 3. Create Rich Articles
    const articlesData = [
      {
        title: 'The Comprehensive Guide to Marketing Fundamentals: The 4Ps, 7Ps & STP Framework',
        slug: 'marketing-fundamentals-4ps-7ps-stp-framework',
        excerpt: 'Master the foundational building blocks of modern commerce. Learn how Product, Price, Place, and Promotion interact with Segmentation, Targeting, and Positioning to generate predictable demand.',
        category: 'Digital Marketing',
        subcategory: 'Marketing Fundamentals',
        guideSection: 'marketing_hub',
        difficulty: 'beginner',
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        author: creatorPriya._id,
        readTime: 12,
        isFeatured: true,
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
        title: 'The 12-Step Roadmap to Launching a Profitable Business From Scratch on a Budget',
        slug: '12-step-roadmap-launching-profitable-business-budget',
        excerpt: 'A pragmatic, battle-tested playbook for bootstrapping your first enterprise from home with under ₹25,000 capital. From idea validation to first 100 paying customers.',
        category: 'Small Business Growth',
        subcategory: 'Startup Playbook',
        guideSection: 'startup_academy',
        difficulty: 'beginner',
        coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
        author: creatorPriya._id,
        readTime: 15,
        isFeatured: true,
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
          { question: 'Can I start a home business without quitting my full-time job?', answer: 'Yes! Dedicate 2 hours each evening and Saturdays to validate sales before considering full-time transition.' },
          { question: 'What if someone copies my business idea?', answer: 'Ideas are cheap; execution, customer service speed, and personal brand loyalty are what competitors cannot copy.' }
        ]
      },
      {
        title: 'Product & Food Photography on a Smartphone: Lighting, Composition & Color Grading',
        slug: 'smartphone-product-food-photography-masterclass',
        excerpt: 'Create high-converting, professional commercial catalog and social media imagery using only your smartphone and budget DIY lighting techniques.',
        category: 'Product & Food Photography',
        subcategory: 'Commercial Visuals',
        guideSection: 'branding_photography',
        difficulty: 'beginner',
        coverImage: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80',
        author: creatorAravind._id,
        readTime: 10,
        isFeatured: true,
        content: `
## Why High-End Photography Multiplies Sales by 300%

In online commerce, the customer cannot touch, smell, or physically inspect your merchandise. **Your photo is the product.** A mediocre photo makes a premium ₹1,500 candle look like cheap street wax; a crisp, elegantly styled photograph allows you to charge premium prices with zero hesitation.

### Camera & Smartphone Fundamentals
- **Clean the Lens:** 50% of blurry smartphone shots are caused by pocket lint and fingerprint grease. Always wipe the camera lens with a microfiber cloth before shooting.
- **Lock Focus and Exposure:** Tap and hold on the subject on your screen (AE/AF Lock). Slide the exposure sun icon down slightly to preserve highlights and prevent blown-out whites.
- **Use 2x or 3x Optical Zoom:** Avoid wide-angle 1x distortion on small products. Stepping back 3 feet and using 2x optical zoom creates flattering, realistic perspective without fish-eye distortion.

---

### Lighting Setups That Cost Under ₹1,500
1. **The Window Light Setup (Free):** Position your shooting table 90 degrees to a north-facing window. Morning diffuse daylight creates soft, creamy shadows.
2. **The White Foam Board Reflector (₹80):** Place a white foam core board directly opposite the window. It bounces light back into the shadows, removing harsh contrast.
3. **Diffuser Sheet (₹150):** If direct sunlight enters the window, tape baking parchment paper or sheer white curtain fabric over the glass.

---

### Composition Secrets for Catalog & Social Media
- **Rule of Thirds:** Enable grid lines on your phone camera settings. Place the focal highlight of your product at the intersection points.
- **Depth & Props:** Use contextual props (raw coffee beans for coffee mugs, fresh eucalyptus for bath soaps, textured linen for bakery items). Keep props muted so the hero product remains dominant.
- **The Flat Lay (90 Degrees):** Ideal for apparel, stationery, skincare routines, and plates of food. Keep phone parallel to the table.
- **The 45-Degree Angle:** Matches human eye perspective at a dining table. Ideal for gourmet burgers, beverages, and textured pastries.
`,
        checklists: [
          { item: 'Enable camera grid lines in phone settings.' },
          { item: 'Purchase 2 white foam core boards from an art store for bounce reflectors.' },
          { item: 'Test shoot identical product with window backlight vs side-light.' },
          { item: 'Export edited photos in sRGB color profile at 1080x1350 for Instagram & 2000x2000 for web catalogs.' }
        ],
        tools: [
          { name: 'Snapseed', url: 'https://support.google.com/snapseed', description: 'Free professional mobile photo editor by Google with selective brush and curve tuning.' },
          { name: 'Lightroom Mobile', url: 'https://adobe.com', description: 'Industry standard for color grading, clarity adjustment, and preset management.' }
        ],
        faq: [
          { question: 'Do I need an expensive DSLR camera to shoot for an online store?', answer: 'Not at all. Modern smartphones shot with proper lighting produce indistinguishable results for social media and website galleries.' },
          { question: 'How do I avoid yellow or green color casts?', answer: 'Turn off all warm overhead ceiling lamps in the room when shooting near natural window light to avoid mixed color temperatures.' }
        ]
      },
      {
        title: 'Business Registration in India Explained: Sole Proprietorship vs LLP vs Private Limited',
        slug: 'business-registration-india-proprietorship-llp-pvt-ltd',
        excerpt: 'Demystifying Indian business incorporation. Understand liability protection, compliance overheads, Udyam MSME, and when to transition structures.',
        category: 'GST & Business Registration',
        subcategory: 'Legal Compliance',
        guideSection: 'legal_gst',
        difficulty: 'intermediate',
        coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
        author: creatorNeha._id,
        readTime: 14,
        isFeatured: true,
        content: `
## Choosing the Right Legal Vehicle for Your Enterprise

Starting a business in India requires choosing between simplicity and liability protection. Many founders either spend ₹20,000 unnecessarily on a Private Limited company before making their first sale, or operate as an informal sole proprietorship without understanding personal liability risks.

> **Disclaimer:** This guide is for educational purposes and should not be construed as legal or tax advice. Legal guidelines and thresholds evolve; always consult a practicing Chartered Accountant or Company Secretary for your specific situation.

---

### Comparative Structural Overview

| Feature | Sole Proprietorship | Limited Liability Partnership (LLP) | Private Limited Company (Pvt Ltd) |
|---|---|---|---|
| **Best For** | Solo bootstrapped beginners, home creators, local service providers | Partnerships, boutique agencies, medium consultancies | High-growth startups seeking venture funding, equity sharing |
| **Initial Cost** | ₹0 – ₹2,000 | ₹6,000 – ₹10,000 | ₹7,000 – ₹15,000 |
| **Personal Liability** | Unlimited (personal assets at risk) | Limited to partner capital contribution | Limited to share capital |
| **Annual Compliances** | Minimal (Individual ITR) | Moderate (Form 11 & Form 8 MCA filings) | High (Audited accounts, AGM, ROC filings, director KYC) |
| **Separate Legal Entity** | No | Yes | Yes |

---

### The Udyam MSME Registration (Mandatory for Indian Entrepreneurs)
- **Portal:** [udyamregistration.gov.in](https://udyamregistration.gov.in)
- **Cost:** 100% Free (Beware of fraudulent third-party payment portals charging ₹1,500).
- **Documents Required:** Aadhaar Card linked to Mobile, PAN Card, basic business address details.
- **Key Benefits:**
  1. Priority sector bank lending with collateral exemptions.
  2. 50% government subsidy on trademark filing fees.
  3. Strict statutory protection against delayed payments from corporate buyers under the MSMED Act.
`,
        checklists: [
          { item: 'Verify your Aadhaar card is updated with an active mobile number for OTP verification.' },
          { item: 'Register on the official government Udyam portal (zero fees).' },
          { item: 'Open a dedicated Current Account in your business name to maintain clean bookkeeping separation.' },
          { item: 'Review if your sector requires specialized licenses (e.g. FSSAI for food, Shop & Establishment for physical premises).' }
        ],
        officialLinks: [
          { title: 'Official Udyam MSME Portal', url: 'https://udyamregistration.gov.in', isGovernmentPortal: true },
          { title: 'Ministry of Corporate Affairs (MCA)', url: 'https://www.mca.gov.in', isGovernmentPortal: true },
          { title: 'GST Official Portal', url: 'https://www.gst.gov.in', isGovernmentPortal: true }
        ],
        faq: [
          { question: 'Is a Private Limited company mandatory to start selling online on Amazon or Shopify?', answer: 'No! You can sell on Amazon, Flipkart, or your own Shopify store as a Sole Proprietor with GST and Udyam.' },
          { question: 'What is the turnover threshold where GST registration becomes mandatory?', answer: 'For physical goods in most states, the threshold is ₹40 Lakhs turnover; for services, it is ₹20 Lakhs. However, inter-state ecommerce sellers typically require GST regardless of turnover.' }
        ]
      },
      {
        title: 'Influencer Marketing & Brand Collaborations: Proposal Templates, Rate Cards & Legal Disclosures',
        slug: 'influencer-marketing-brand-collaborations-outreach-templates',
        excerpt: 'How emerging brands collaborate with micro and nano creators for high-ROI campaigns. Includes tested outreach email scripts and ASCI disclosure guidelines.',
        category: 'Influencer Marketing',
        subcategory: 'Partnerships',
        guideSection: 'influencer_collab',
        difficulty: 'intermediate',
        coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
        author: creatorPriya._id,
        readTime: 11,
        isFeatured: false,
        content: `
## Why Micro-Influencers Outperform Celebrity Endorsements for Small Brands

Celebrity endorsements cost lakhs with vanity reach and low engagement. In contrast, nano-influencers (1,000 to 10,000 followers) and micro-influencers (10,000 to 50,000 followers) maintain tight-knit, high-trust communities. Their audiences view recommendations as authentic tips from a close friend rather than corporate advertising.

### Step 1: Vetting Genuine Engagement vs Fake Followers
Before reaching out to any creator:
- Calculate engagement rate: *(Total Likes + Comments on last 10 posts / Total Followers) × 100*. A healthy engagement rate is 3% to 7% for micro-creators.
- Inspect comment quality: Do comments say "Nice photo 🔥" (bots) or do they ask specific questions: "Where did you get that linen shirt?" (authentic community).

---

### Ready-To-Use Outreach Script (High Conversion)
\`\`\`text
Subject: Collaboration with [Your Brand] x [Creator Name] — Loving your [Specific Post Topic]!

Hi [Creator Name],

I've been following your page for a while, especially loved your recent breakdown on [mention a specific video or photo they created].

I'm [Your Name], founder of [Brand Name]. We craft [1-sentence unique value proposition, e.g. organic cold-pressed almond butter with zero refined sugars]. 

Given your community's focus on healthy lifestyle habits, we'd love to send you our signature [Product Name] gift box with no strings attached. 

If you love it as much as we think you will, we'd be thrilled to discuss a partnered reel or sponsored story sequence for our upcoming seasonal drop.

Can I confirm your preferred shipping address?

Warm regards,
[Your Name]
Founder, [Brand Name]
[Link to Instagram / Website]
\`\`\`

---

### Legal and Compliance Guidelines (ASCI & FTC)
Whenever sending paid products or sponsored compensation:
- The creator must prominently include **#Ad**, **#Sponsored**, or **#Collaboration** within the first two lines of the caption.
- Video content must display the "Paid Partnership" banner overlay throughout the initial 5 seconds.
`,
        checklists: [
          { item: 'Build a list of 25 niche-aligned micro-creators in your city.' },
          { item: 'Calculate their engagement percentage on their last 10 reels.' },
          { item: 'Send 10 personalized outreach messages using the gift box approach.' },
          { item: 'Agree on explicit deliverable deadlines and usage rights before sending payment.' }
        ],
        tools: [
          { name: 'Modash', url: 'https://modash.io', description: 'Analyze fake follower percentage and creator audience demographics.' },
          { name: 'Notion', url: 'https://notion.so', description: 'Organize influencer outreach pipelines and deliverable tracking.' }
        ],
        faq: [
          { question: 'What is a typical fee for a micro-influencer reel?', answer: 'For nano creators (under 10k), product gifting or ₹2,000–₹5,000 is common. Micro creators (10k–50k) generally charge ₹5,000–₹15,000 depending on niche and production quality.' }
        ]
      },
      {
        title: 'Local Dominance: Google Business Profile Optimization & Local Search Secrets for Retail',
        slug: 'google-business-profile-local-seo-retail-shops',
        excerpt: 'How cafes, retail shops, and local artisans rank #1 on Google Maps in their neighborhood without paying for expensive advertising agencies.',
        category: 'Small Business Growth',
        subcategory: 'Local SEO',
        guideSection: 'startup_academy',
        difficulty: 'beginner',
        coverImage: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1200&q=80',
        author: creatorPriya._id,
        readTime: 9,
        isFeatured: false,
        content: `
## Capturing High-Intent "Near Me" Searches

When a local customer searches *"best sourdough bakery near me"* or *"organic clothing store in Indiranagar"*, they are ready to buy within the next 2 hours. Ranking in the Google 3-Pack (the top 3 map results) delivers more foot traffic than any social media advertisement.

### 5 Non-Negotiable GBP Optimization Actions
1. **Accurate Category Selection:** Pick the primary category with laser precision (e.g., "Bakery" vs "Cafe"). Add secondary categories that represent specific offerings.
2. **Weekly Photo Uploads:** Upload 5 high-resolution photos weekly. Google favors active businesses that show real interior atmosphere, storefront signage, and menu items.
3. **The 5-Star Review Engine:** Create a direct Google review short link with a QR code displayed at checkout. Train staff to ask happy customers to review right at the counter.
4. **Respond to Every Review:** Reply to both positive and negative reviews within 24 hours. Naturally weave localized keywords into your replies.
`,
        checklists: [
          { item: 'Claim and verify your Google Business Profile via video or postcard.' },
          { item: 'Print a clean acrylic QR code stand for your counter linking directly to your Google review link.' },
          { item: 'Upload 10 exterior, interior, and product photos.' }
        ],
        faq: [
          { question: 'How do I handle an unfair 1-star review on Google?', answer: 'Respond calmly and professionally acknowledging concern, provide a direct email/phone to resolve, and bury it under 10 genuine 5-star customer reviews.' }
        ]
      },
      {
        title: 'Search Engine Optimization (SEO) Architecture: The Zero-to-100 Organic Traffic Engine',
        slug: 'seo-architecture-organic-traffic-engine',
        excerpt: 'A complete tactical blueprint to ranking #1 on Google without paid ad spend. Learn keyword research, search intent mapping, technical Core Web Vitals, and authoritative link building.',
        category: 'Digital Marketing',
        subcategory: 'Search Engine Optimization',
        tags: ['SEO', 'Organic Growth', 'Google Ranking', 'Keyword Intent', 'Content Strategy'],
        guideSection: 'marketing_hub',
        difficulty: 'intermediate',
        coverImage: 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?auto=format&fit=crop&w=1200&q=80',
        author: creatorPriya._id,
        readTime: 14,
        isFeatured: true,
        content: `
## Why Organic Search Is the Highest ROI Growth Channel in Modern Marketing

Unlike paid Meta or Google Ads where your traffic halts the millisecond you stop funding campaigns, Search Engine Optimization (SEO) creates compounding equity. An article ranking in position #1 for high commercial intent search queries will generate qualified buyer inquiries 24 hours a day, 365 days a year for free.

---

### Phase 1: Search Intent Mapping (The 4 Query Types)
Google's primary directive is to satisfy user intent. If your page does not align with what the searcher expects, Google will demote your ranking regardless of backlink volume.
1. **Informational Intent:** *“What is the difference between sole proprietorship and LLP?”* (User wants to learn; deliver structured guides).
2. **Navigational Intent:** *“MarketSphere login”* (User wants to reach a specific destination).
3. **Commercial Investigation:** *“Best email marketing tool for small business”* (User is comparing options before purchase).
4. **Transactional Intent:** *“Buy smartphone ring light online India”* (User has credit card ready; direct to product page).

---

### Phase 2: On-Page Architecture & Semantic Keyword Silos
- **The Golden URL Rule:** Keep URLs short, lowercased, and containing only the primary keyword (e.g., \`/seo-architecture-guide\`).
- **Title Tag CTR Optimization:** Front-load your core keyword and add an emotional or specificity modifier: *“SEO Guide 2026: 7 Steps to 10x Organic Traffic (With Case Study)”*.
- **H1, H2, and H3 Hierarchy:** Only use one H1 per page. Use H2 for major conceptual modules and H3 for sub-points.
- **Topical Silos (Topic Clusters):** Create one comprehensive "Pillar Page" (e.g., "Digital Marketing Guide") linking downward to 6 granular cluster articles ("SEO", "Copywriting", "Paid Ads"), which all link back up to the pillar. This signals overwhelming topical authority to Google crawlers.

---

### Phase 3: Technical Core Web Vitals & Crawlability
Google penalizes slow, clunky websites:
- **LCP (Largest Contentful Paint):** Main content must load within 2.5 seconds. Convert all images to WebP and enable browser caching.
- **CLS (Cumulative Layout Shift):** Elements must not jump around while loading (always set explicit width and height on images and ads).
- **INP (Interaction to Next Paint):** Clicks and interactions must respond under 200ms.
- **Mobile First Indexing:** Over 72% of modern search traffic originates on smartphones. Audit touch targets and viewport responsiveness.

---

### Phase 4: High-Authority Link Building Without Black-Hat Spam
Google evaluates backlinks like academic citations. High-quality references elevate your Domain Rating:
1. **Digital PR & Original Data:** Survey 50 customers or publish an industry benchmark. Journalists and bloggers will cite your data organically.
2. **Resource Page Infiltration:** Search for \`"keyword" + "helpful resources"\` and email the curator offering your comprehensive guide as an added value item.
3. **Podcast & Expert Guest Mentions:** Appear on niche trade podcasts or guest contribute to respected industry publications with a relevant author bio citation.
`,
        checklists: [
          { item: 'Verify Google Search Console and submit your XML sitemap.' },
          { item: 'Ensure every page has a unique Title Tag under 60 characters and Meta Description under 155 characters.' },
          { item: 'Compress all images to WebP format with descriptive alt text containing semantic keywords.' },
          { item: 'Implement structured schema markup (Article, FAQPage, or Product schema).' },
          { item: 'Verify all internal links point to valid 200 OK responses with zero broken redirects.' }
        ],
        tools: [
          { name: 'Google Search Console', url: 'https://search.google.com/search-console', description: 'Monitor impressions, ranking positions, and crawl errors.' },
          { name: 'Ahrefs Webmaster Tools', url: 'https://ahrefs.com/webmaster-tools', description: 'Free diagnostic tool for finding backlink gaps and broken links.' },
          { name: 'Google PageSpeed Insights', url: 'https://pagespeed.web.dev', description: 'Benchmark your site Core Web Vitals on mobile and desktop.' }
        ],
        faq: [
          { question: 'How long does SEO take to produce measurable revenue?', answer: 'For a new domain, meaningful rankings typically take 3 to 6 months. For an established domain publishing authoritative cluster content, results often appear in 4 to 8 weeks.' },
          { question: 'Should I buy backlinks from Fiverr or link vendors?', answer: 'Never. Google algorithmically detects and penalizes private blog networks (PBNs) and paid link schemes. Focus on topical depth and authentic digital PR citations.' }
        ]
      },
      {
        title: 'High-Conversion Copywriting & Psychological Sales Triggers: The AIDA & PAS Blueprint',
        slug: 'high-conversion-copywriting-sales-pages',
        excerpt: 'Turn casual scrollers into enthusiastic paying customers. Master psychological copywriting frameworks, hypnotic headlines, objection handling, and risk reversal.',
        category: 'Digital Marketing',
        subcategory: 'Copywriting & Conversions',
        tags: ['Copywriting', 'Sales Pages', 'AIDA', 'PAS Framework', 'Conversion Rate'],
        guideSection: 'marketing_hub',
        difficulty: 'beginner',
        coverImage: 'https://images.unsplash.com/photo-1542744094-3a31727221eb?auto=format&fit=crop&w=1200&q=80',
        author: creatorPriya._id,
        readTime: 11,
        isFeatured: true,
        content: `
## Copywriting Is Salesmanship in Print (and Pixels)

Most websites fail not because their product is deficient, but because their copy talks about the product instead of the customer's transformation. Copywriting is the art of translating raw product features into urgent emotional benefits that dissolve psychological resistance.

---

### The Fundamental Rule: Features Tell, Benefits Sell, Transformations Close
- **Feature (What it is):** *“Smartphone ring light with 3 color temperatures.”*
- **Benefit (What it does):** *“Gives your face warm, professional studio lighting anywhere.”*
- **Transformation (Who they become):** *“Stop feeling awkward on camera. Film high-converting Reels that position you as the definitive authority in your niche.”*

---

### Framework 1: The PAS Model (Problem, Agitate, Solve)
The PAS formula is the undisputed champion of high-converting landing pages:
1. **Problem:** Identify the acute frustration your prospect experiences today. Example: *“Tired of posting daily reels that only get 40 views from your friends?”*
2. **Agitate:** Amplify the emotional and financial cost of leaving this problem unsolved. Example: *“Every day your content gets ignored is another day your competitors capture your ideal clients, leaving your bank balance stagnant while your calendar stays empty.”*
3. **Solve:** Introduce your offering as the only logical relief valve. Example: *“Meet MarketSphere Academy: the step-by-step organic blueprint to generate 50 qualified inbound buyer inquiries each week.”*

---

### Framework 2: The AIDA Funnel (Attention, Interest, Desire, Action)
Use AIDA to structure long-form sales letters, email pitches, and landing page wireframes:
- **Attention (Hero Section):** A disruptive headline that shatters expectations.
- **Interest (The Bridge):** Fascinating facts, relatable stories, or surprising industry metrics.
- **Desire (The Transformation):** Before/after case studies, social proof, and vivid sensory descriptions of life after using your solution.
- **Action (The Call to Action):** A single, crystal-clear directive with zero friction: *“Claim Your Free Growth Blueprint Now”* instead of *“Submit”*.
`,
        checklists: [
          { item: 'Audit your homepage hero headline using the 5-second test.' },
          { item: 'Replace passive "We provide" language with active "You get" value propositions.' },
          { item: 'Place customer reviews directly adjacent to purchase buttons.' }
        ],
        faq: [
          { question: 'What is the biggest mistake in landing page copy?', answer: 'Focusing on technical features rather than how the customer feels after using your solution.' }
        ]
      },
      {
        title: 'Social Media Algorithm Mastery: The 3-Second Hook & Short-Form Video Growth',
        slug: 'social-media-algorithms-short-form-video-growth',
        excerpt: 'Crack the recommendation algorithms on Instagram Reels and YouTube Shorts. Learn how to engineer high-retention hooks, structure scripts, and turn views into warm inbound leads.',
        category: 'Social Media Marketing',
        subcategory: 'Short-Form Video Strategy',
        tags: ['Instagram Reels', 'YouTube Shorts', 'Viral Hooks', 'Social Media', 'Engagement'],
        guideSection: 'marketing_hub',
        difficulty: 'intermediate',
        coverImage: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1200&q=80',
        author: creatorPriya._id,
        readTime: 13,
        isFeatured: true,
        content: `
## How Short-Form Algorithms Actually Decide What Goes Viral

Algorithms are not mysterious dice rolls; they are mathematical prediction engines designed to maximize platform retention. Both Instagram and YouTube prioritize a single core metric above all else: **Average Percentage Viewed (Retention Rate)** and **Completion Rate**.

---

### The Anatomy of the 3-Second Pattern Interrupt Hook
The opening 3 seconds dictate 90% of your video's fate:
1. **The Negative Hook (FOMO / Loss Aversion):** Humans are psychologically twice as motivated to avoid loss as they are to seek gain.
2. **The Curiosity Gap:** Pose a question whose answer is withheld until the climax.
3. **The Visual Pattern Interrupt:** Start mid-motion, change the camera angle every 4 seconds, and always add dynamic text captions on-screen because 70% of mobile users watch with audio muted.
`,
        checklists: [
          { item: 'Draft 3 hook variations before shooting.' },
          { item: 'Add dynamic center captions to ensure viewers on mute retain the core message.' }
        ],
        faq: [
          { question: 'How long should an educational Reel be?', answer: 'Between 20 and 35 seconds for maximum retention and replay percentage.' }
        ]
      },
      {
        title: 'Meta Ads (Facebook & Instagram) Architecture: From ₹500/day to Scaling High-ROAS',
        slug: 'meta-ads-masterclass-profitable-roas-scaling',
        excerpt: 'Step-by-step masterclass on launching profitable Meta ad campaigns. Learn campaign budget optimization, creative testing matrices, broad targeting, and scaling without burning cash.',
        category: 'Digital Marketing',
        subcategory: 'Performance Marketing',
        tags: ['Meta Ads', 'Paid Marketing', 'ROAS', 'Performance Marketing', 'Advantage+'],
        guideSection: 'marketing_hub',
        difficulty: 'advanced',
        coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
        author: creatorPriya._id,
        readTime: 16,
        isFeatured: true,
        content: `
## Stop Wasting Money Boosting Posts: Professional Meta Ad Architecture

Clicking "Boost Post" on Instagram is donating money to Meta with minimal return. Professional performance marketers use Ads Manager to architect structured sales funnels that systematically acquire customers at a predictable Customer Acquisition Cost (CAC).

---

### The Modern Paradigm: Creative Is the New Targeting
In the post-iOS14 advertising landscape, granular interest stacking is dead. Today, your creative ad asset itself does the targeting.

### The 3-Tier Campaign Structure
1. **Dynamic Creative Testing (DCT)** for uncovering winning hooks.
2. **Advantage+ Scaling Campaigns** for budget efficiency.
3. **Retargeting & Social Proof Stacking** for closing high-intent visitors.
`,
        checklists: [
          { item: 'Set up Meta Pixel and Conversions API.' },
          { item: 'Calculate Breakeven ROAS: 1 / Gross Margin.' }
        ],
        faq: [
          { question: 'What daily budget is best to test?', answer: '₹500 to ₹1,000 per day allows algorithms sufficient volume to test creative hooks.' }
        ]
      },
      {
        title: 'WhatsApp Conversational Sales Funnels & Automated High-Touch Checkout',
        slug: 'whatsapp-conversational-sales-funnels',
        excerpt: 'Discover how modern brands generate 40%+ conversion rates by routing traffic into WhatsApp. Learn consultative closing scripts, catalog integration, and broadcast retention.',
        category: 'Sales & Customer Acquisition',
        subcategory: 'Conversational Commerce',
        tags: ['WhatsApp Marketing', 'Sales Funnels', 'Conversational Commerce', 'Closing Deals'],
        guideSection: 'marketing_hub',
        difficulty: 'intermediate',
        coverImage: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=1200&q=80',
        author: creatorPriya._id,
        readTime: 12,
        isFeatured: false,
        content: `
## Why WhatsApp Is the Secret Weapon of Emerging Indian & Asian Brands

Traditional e-commerce websites suffer from average conversion rates of 1.5% to 3%. In contrast, WhatsApp conversational funnels routinely achieve 30% to 50% closing rates. WhatsApp possesses a 98% message open rate.

---

### The 4-Stage Consultative Closing Script
1. **Acknowledge & Validate:** Greet warmly within 5 minutes.
2. **Diagnostic Question:** Uncover their primary daily frustration.
3. **Tailored Prescription:** Connect your solution directly to their problem.
4. **Frictionless Payment Dispatch:** Send instant UPI or card checkout links.
`,
        checklists: [
          { item: 'Set up official WhatsApp Business catalog.' },
          { item: 'Create 10 pre-saved Quick Replies for common pricing and delivery questions.' }
        ],
        faq: [
          { question: 'How quickly should I reply to WhatsApp leads?', answer: 'Within 5 minutes for highest conversion probability.' }
        ]
      },
      {
        title: 'Customer Retention & Lifecycle Email Marketing: Maximizing Lifetime Value (LTV)',
        slug: 'retention-lifecycle-email-marketing-ltv',
        excerpt: 'Acquisition gets customers; retention creates wealth. Master the 5 essential automated email sequences that turn one-time buyers into lifelong repeat brand advocates.',
        category: 'Digital Marketing',
        subcategory: 'Email Marketing & Retention',
        tags: ['Email Marketing', 'Customer Retention', 'LTV', 'Klaviyo', 'Automations'],
        guideSection: 'marketing_hub',
        difficulty: 'intermediate',
        coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
        author: creatorPriya._id,
        readTime: 14,
        isFeatured: false,
        content: `
## Why the Most Profitable Businesses Focus on Retention Over Acquisition

It costs 5x to 7x more to acquire a new customer than to retain an existing one. Email marketing is an owned audience channel that cannot be turned off by platform algorithms.

---

### The 5 Essential Automated Flows
1. **The Indoctrination Welcome Series** (Origin story + value).
2. **The Abandoned Cart Flow** (Progressive urgency).
3. **Post-Purchase Education** (How to get maximum results).
4. **Replenishment / Re-order Trigger**.
5. **Win-Back Inactive Campaign**.
`,
        checklists: [
          { item: 'Authenticate domain with DKIM, SPF, and DMARC.' },
          { item: 'Deploy a 3-part abandoned cart sequence.' }
        ],
        faq: [
          { question: 'What is a good email open rate?', answer: '30% to 45% is considered strong in modern e-commerce.' }
        ]
      },
      {
        title: 'Brand Positioning & Psychological Pricing: How to Charge 3x Your Competitors',
        slug: 'brand-positioning-psychological-pricing',
        excerpt: 'Stop competing in a race to the bottom. Discover how premium brands command higher prices through category design, psychological anchoring, and defensible competitive moats.',
        category: 'Branding & Brand Strategy',
        subcategory: 'Brand Strategy & Pricing',
        tags: ['Brand Positioning', 'Pricing Psychology', 'Competitive Moat', 'Premium Branding'],
        guideSection: 'marketing_hub',
        difficulty: 'advanced',
        coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
        author: creatorPriya._id,
        readTime: 13,
        isFeatured: true,
        content: `
## Escaping the Commodity Trap: Price Is a Function of Positioning

When you compete on price, you enter an unwinnable race to the bottom where the prize is bankruptcy. Premium brands do not sell commodities; they sell identity, status, reliability, and peace of mind.

---

### Psychological Pricing Levers
1. **Price Anchoring (The Decoy Effect):** Introduce a higher tier to make your core package feel affordable.
2. **Left-Digit Charm Pricing:** ₹999 feels like ₹900 rather than ₹1,000.
3. **Framing by Contrast:** Compare price against an everyday expense (e.g. ₹50/day coffee).
`,
        checklists: [
          { item: 'Implement a 3-tier Good-Better-Best pricing model.' },
          { item: 'Draft a one-sentence positioning statement.' }
        ],
        faq: [
          { question: 'Will higher prices hurt sales volume?', answer: 'Targeted premium positioning increases perceived quality and customer commitment.' }
        ]
      },
      {
        title: 'Growth Analytics, GA4 Attribution & The Mathematics of Sustainable Scaling',
        slug: 'marketing-analytics-ga4-attribution-unit-economics',
        excerpt: 'Demystify marketing metrics. Learn how to track end-to-end customer journeys in Google Analytics 4, understand multi-touch attribution, and balance CAC to LTV for predictable profit.',
        category: 'Digital Marketing',
        subcategory: 'Growth Analytics & Metrics',
        tags: ['Analytics', 'GA4', 'Unit Economics', 'Attribution', 'CAC', 'ROAS'],
        guideSection: 'marketing_hub',
        difficulty: 'advanced',
        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        author: creatorPriya._id,
        readTime: 15,
        isFeatured: false,
        content: `
## What Gets Measured Gets Managed: The Growth Analytics Operating System

Growth is not magic; growth is simple mathematics. If you acquire a customer for ₹500 (CAC) and that customer generates ₹2,000 of gross profit across their lifetime (LTV), you possess an infinite growth engine.

---

### The Fundamental Growth Equation: LTV:CAC Ratio
- **Customer Acquisition Cost (CAC):** Total sales & marketing spend / new customers.
- **Customer Lifetime Value (LTV):** Average gross profit x repeat order frequency.
- **Target Golden Ratio:** 3:1 to 5:1.

---

### GA4 & Standardized UTM Taxonomy
Always append source, medium, campaign, and content tags to all outbound URLs to ensure complete attribution modeling.
`,
        checklists: [
          { item: 'Verify GA4 tag fires across 100% of website pages.' },
          { item: 'Standardize UTM tracking link generation for all social and email campaigns.' }
        ],
        faq: [
          { question: 'What is a healthy CAC:LTV ratio?', answer: 'Aim for at least 3:1 for sustainable, profitable scaling.' }
        ]
      }
    ];

    await Article.insertMany(articlesData);

    // 4. Create Educational Videos
    const videosData = [
      {
        title: 'Mastering the 4Ps of Marketing in 10 Minutes (With Real Brand Case Studies)',
        slug: 'mastering-4ps-marketing-real-case-studies',
        description: 'In this high-yield educational lesson, we break down the 4Ps of marketing: Product, Price, Place, and Promotion. See how brands like Apple, Paper Boat, and local homegrown businesses structure their go-to-market strategies.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
        duration: '10:14',
        category: 'Digital Marketing',
        tags: ['Marketing', 'Business Strategy', '4Ps', 'Branding'],
        creator: creatorPriya._id,
        viewsCount: 3840,
        likesCount: 290,
        commentsCount: 18,
        status: 'published',
        isFeatured: true,
        learningObjectives: [
          'Understand the core 4Ps framework and real-world trade-offs',
          'Learn value-based pricing strategies vs cost-plus models',
          'Design an omnichannel distribution pipeline for physical products'
        ]
      },
      {
        title: 'Step-by-Step Smartphone Product Photography Tutorial (Budget Lighting Setup)',
        slug: 'smartphone-product-photography-budget-lighting',
        description: 'Complete studio walkthrough! Learn how to transform an ordinary dining table and a simple desk lamp or window into a professional commercial photography studio for your online store.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80',
        duration: '14:22',
        category: 'Product & Food Photography',
        tags: ['Photography', 'Smartphone', 'Ecommerce', 'Lighting'],
        creator: creatorAravind._id,
        viewsCount: 5210,
        likesCount: 440,
        commentsCount: 34,
        status: 'published',
        isFeatured: true,
        learningObjectives: [
          'Master optical vs digital zoom on modern mobile phones',
          'Use white foam board reflectors to eliminate harsh shadows',
          'Color grade catalog photos using free mobile editing applications'
        ]
      },
      {
        title: 'GST Portal Walkthrough: How to File GSTR-1 & Generate Compliant Invoices',
        slug: 'gst-portal-walkthrough-gstr1-compliant-invoices',
        description: 'Chartered Accountant Neha Kapoor walks through the official GST government portal screen-by-screen. Learn B2B vs B2C invoice classification, HSN codes, and avoiding late penalty fees.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
        duration: '18:45',
        category: 'GST & Business Registration',
        tags: ['GST', 'Tax', 'Invoicing', 'Compliance', 'India'],
        creator: creatorNeha._id,
        viewsCount: 7890,
        likesCount: 680,
        commentsCount: 52,
        status: 'published',
        isFeatured: true,
        learningObjectives: [
          'Navigate the government gst.gov.in dashboard without confusion',
          'Create legally compliant tax invoices with proper HSN and CGST/SGST splits',
          'Avoid the top 5 mistakes that trigger tax notices for new businesses'
        ]
      },
      {
        title: 'Zero-Budget Digital Marketing: 5 Organic Strategies That Attract First 100 Customers',
        slug: 'zero-budget-digital-marketing-first-100-customers',
        description: 'Tired of burning cash on paid ads with zero return? Learn 5 organic acquisition flywheels that generate real inbound inquiries without any ad spend.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        duration: '12:05',
        category: 'Small Business Growth',
        tags: ['Zero Budget', 'Digital Marketing', 'Startup', 'Customers'],
        creator: creatorPriya._id,
        viewsCount: 4120,
        likesCount: 315,
        commentsCount: 22,
        status: 'published',
        isFeatured: false,
        learningObjectives: [
          'Leverage hyper-local community groups and WhatsApp channels',
          'Craft short-form demonstration content that naturally attracts leads',
          'Set up customer referral systems with zero software cost'
        ]
      },
      {
        title: 'Brand Positioning Masterclass: How to Stand Out in a Saturated Market',
        slug: 'brand-positioning-masterclass-stand-out-saturated-market',
        description: 'How do you convince customers to buy from you when there are already 50 competitors selling similar products? Deep dive into the psychology of positioning.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80',
        duration: '11:30',
        category: 'Branding & Brand Strategy',
        tags: ['Branding', 'Positioning', 'Marketing Strategy', 'Differentiation'],
        creator: creatorPriya._id,
        viewsCount: 2940,
        likesCount: 210,
        commentsCount: 14,
        status: 'published',
        isFeatured: false,
        learningObjectives: [
          'Identify the single core differentiator of your brand',
          'Write a crisp value proposition that converts visitors in 5 seconds',
          'Build customer trust using authentic storytelling'
        ]
      },
      {
        title: 'Influencer Outreach Masterclass: The Exact Email Pitch Template That Converts',
        slug: 'influencer-outreach-masterclass-pitch-template-converts',
        description: 'Stop sending cold DMs that get left on read. Watch our breakdown of successful brand-creator collaboration emails and see real case studies.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
        duration: '09:50',
        category: 'Influencer Marketing',
        tags: ['Influencer Marketing', 'Outreach', 'Collaboration', 'Email Template'],
        creator: creatorPriya._id,
        viewsCount: 3450,
        likesCount: 275,
        commentsCount: 19,
        status: 'published',
        isFeatured: false,
        learningObjectives: [
          'Structure a 3-paragraph outreach email that creators actually answer',
          'Calculate fair market compensation for nano and micro influencers',
          'Ensure adherence to advertising disclosure laws'
        ]
      }
    ];

    await Video.insertMany(videosData);

    console.log('✅ Successfully seeded MarketSphere database with:');
    console.log('   - 5 Users (1 Admin, 3 Creators, 1 Learner)');
    console.log('   - 10 Educational Categories');
    console.log('   - 6 Comprehensive Educational Articles');
    console.log('   - 6 Educational Videos with playable streams');
  } catch (error) {
    console.error('❌ Error during initial data seeding:', error);
  }
};
