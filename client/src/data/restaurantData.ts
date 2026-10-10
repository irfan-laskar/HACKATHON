export interface RestaurantProblem {
  id: string;
  category: string;
  title: string;
  shortDesc: string;
  impactLevel: 'Critical' | 'High' | 'Moderate';
  marginLeakPercent: string;
  estimatedMonthlyLoss: string;
  rootCauses: string[];
  actionPlan: string[];
  recommendedToolPath?: string;
  recommendedToolName?: string;
  tags: string[];
}

export interface RestaurantSolution {
  id: string;
  category: string;
  title: string;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  keySteps: { title: string; desc: string }[];
  proTip: string;
  estimatedRoi: string;
  checklistItems: string[];
}

export interface GrowthTask {
  id: string;
  month: number;
  monthTitle: string;
  category: string;
  title: string;
  description: string;
  deadlineDays: number;
  impact: 'High' | 'Medium';
  completed: boolean;
}

export interface LearningArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  coverImage: string;
  excerpt: string;
  content: string;
  keyTakeaways: string[];
  checklist?: string[];
}

// 18 Problem Categories requested
export const PROBLEM_CATEGORIES = [
  'All',
  'Marketing',
  'Customer reach',
  'Brand awareness',
  'Budgeting',
  'Pricing',
  'Food costing',
  'Competition',
  'Delivery',
  'Location',
  'Market research',
  'Recipe standardization',
  'Inventory',
  'Staff management',
  'Raw-material costs',
  'Packaging',
  'Customer experience',
  'Time management',
  'Online visibility',
] as const;

export const RESTAURANT_PROBLEMS: RestaurantProblem[] = [
  {
    id: 'prob-food-costing',
    category: 'Food costing',
    title: 'Uncalculated Plate Costs & Inaccurate Ingredient Yields',
    shortDesc: 'Dishes priced based on competitors rather than actual ingredient purchase costs and cooking yields.',
    impactLevel: 'Critical',
    marginLeakPercent: '8% - 14%',
    estimatedMonthlyLoss: '₹28,000 - ₹55,000',
    rootCauses: [
      'Copying prices of established neighborhood rivals who enjoy bulk wholesale discounts.',
      'Failing to factor in vegetable peeling, meat de-boning, and oil absorption yield losses.',
      'Chefs using variable " अंदाज़ा " (eyeball estimation) instead of portion control spoons.',
    ],
    actionPlan: [
      'Weigh raw ingredients vs cooked yield for top 10 bestselling menu items.',
      'Calculate true plate cost and re-price to achieve a target food cost between 28% and 32%.',
      'Introduce standardized portion ladles and digital kitchen scales.',
    ],
    recommendedToolPath: '/tools?tab=food-cost',
    recommendedToolName: 'Food-Cost Calculator',
    tags: ['food cost', 'pricing', 'recipe', 'yield loss'],
  },
  {
    id: 'prob-delivery-commissions',
    category: 'Delivery',
    title: 'Aggregator Commission Trap (22-28% Zomato/Swiggy Cuts)',
    shortDesc: 'High delivery volume that generates impressive revenue but zero net profit due to platform deductions and discount funding.',
    impactLevel: 'Critical',
    marginLeakPercent: '15% - 25%',
    estimatedMonthlyLoss: '₹45,000 - ₹90,000',
    rootCauses: [
      'Charging identical menu prices on Swiggy/Zomato as dine-in while absorbing 24% commissions.',
      'Participating in compulsory 40% discount campaigns with zero platform subsidy.',
      'No mechanism to convert one-time online delivery buyers into direct repeat customers.',
    ],
    actionPlan: [
      'Set an optimized Online Delivery markup (+18% to 22%) to safeguard prime food margins.',
      'Insert printed QR-code cards in delivery bags offering 15% off on direct WhatsApp ordering.',
      'Establish a 3km direct delivery radius powered by in-house staff or local hyperlocal riders.',
    ],
    recommendedToolPath: '/tools?tab=menu-pricing',
    recommendedToolName: 'Menu-Pricing Calculator',
    tags: ['delivery', 'swiggy', 'zomato', 'commissions', 'pricing'],
  },
  {
    id: 'prob-inventory-wastage',
    category: 'Inventory',
    title: 'Daily Perishable Spoilage & Lack of Par-Level Stock Controls',
    shortDesc: 'Dairy, herbs, and proteins bought in excess without FIFO (First In, First Out) discipline ending up in the trash bin.',
    impactLevel: 'High',
    marginLeakPercent: '5% - 9%',
    estimatedMonthlyLoss: '₹18,000 - ₹34,000',
    rootCauses: [
      'Ordering raw materials without checking previous day closing stock sheets.',
      'Inadequate refrigeration temperatures and improper prep storage containers.',
      'No daily wastage log book in the kitchen.',
    ],
    actionPlan: [
      'Implement daily 5-minute morning stock audits using standard reorder levels.',
      'Enforce strict FIFO labeling with date tags on all prepped gravies and dairy.',
      'Repurpose day-old unsold prepped items into chef special daily combo broths or staff meals.',
    ],
    recommendedToolPath: '/tools?tab=inventory',
    recommendedToolName: 'Inventory Tracker',
    tags: ['inventory', 'spoilage', 'par level', 'fifo'],
  },
  {
    id: 'prob-recipe-standardization',
    category: 'Recipe standardization',
    title: 'Taste Inconsistency When the Head Chef Takes Leave',
    shortDesc: 'Food quality and spice balance vary drastically depending on which cook is on shift, resulting in negative reviews.',
    impactLevel: 'High',
    marginLeakPercent: '6% - 10%',
    estimatedMonthlyLoss: '₹22,000 - ₹40,000',
    rootCauses: [
      'No documented recipe cards with gram-level spice and sauce measurements.',
      'Head chef guarding secret recipes and cooking entirely from memory.',
      'Inconsistent prep timing leading to scorched gravies or rubbery paneer/chicken.',
    ],
    actionPlan: [
      'Document step-by-step Standard Operating Procedure (SOP) cards laminated on kitchen walls.',
      'Batch-prepare standard master spice blends (garam masala, biryani paste) weekly.',
      'Cross-train junior line cooks through timed preparation audits.',
    ],
    tags: ['recipe', 'chef', 'taste', 'sop'],
  },
  {
    id: 'prob-pricing-inflation',
    category: 'Pricing',
    title: 'Unadjusted Menu Pricing During Raw Material Price Surges',
    shortDesc: 'Cooking oil, LPG cylinders, and dairy prices rise 20% while menu prices remain frozen out of fear of customer backlash.',
    impactLevel: 'Critical',
    marginLeakPercent: '7% - 12%',
    estimatedMonthlyLoss: '₹25,000 - ₹48,000',
    rootCauses: [
      'Fear of losing regular customers by adjusting prices.',
      'Expensive printed paper menus that cannot be easily updated.',
      'Lack of monthly P&L audits to detect margin erosion early.',
    ],
    actionPlan: [
      'Adopt digital QR menus and dynamic acrylic display boards for rapid price flexibility.',
      'Re-engineer plate compositions: reduce protein portion by 10% while elevating vegetable/garnish presentation.',
      'Introduce value-added combos where margin is protected even if single items increase by ₹10-15.',
    ],
    recommendedToolPath: '/tools?tab=profit-tracker',
    recommendedToolName: 'Monthly Profit Tracker',
    tags: ['pricing', 'raw material', 'inflation', 'margins'],
  },
  {
    id: 'prob-online-visibility',
    category: 'Online visibility',
    title: 'Unclaimed or Dormant Google Business Profile (Map Absence)',
    shortDesc: 'Zero presence on local "restaurants near me" searches, losing high-intent neighborhood foot traffic.',
    impactLevel: 'High',
    marginLeakPercent: '10% - 18%',
    estimatedMonthlyLoss: '₹35,000 - ₹65,000',
    rootCauses: [
      'Google Maps listing unclaimed, phone number missing, or marked with incorrect opening hours.',
      'Under 20 customer reviews with an average rating below 3.9 stars.',
      'No photos of actual food dishes, cozy seating, or clean kitchen uploaded.',
    ],
    actionPlan: [
      'Claim and fully verify Google Business Profile with exact GPS pin and business hours.',
      'Place a sleek acrylic standee with Google Review QR code on every dine-in table.',
      'Upload 10 high-resolution photos of signature dishes under natural daylight.',
    ],
    tags: ['google maps', 'seo', 'local search', 'visibility'],
  },
  {
    id: 'prob-marketing-budget',
    category: 'Marketing',
    title: 'Wasting Money on Untargeted Boosted Instagram Posts',
    shortDesc: 'Spending ₹5,000 to ₹10,000 on Meta ad boosts that produce vanity likes from across India but zero local dine-in foot traffic.',
    impactLevel: 'Moderate',
    marginLeakPercent: '4% - 7%',
    estimatedMonthlyLoss: '₹12,000 - ₹25,000',
    rootCauses: [
      'Clicking "Boost Post" without radius targeting within 2-3km of the restaurant.',
      'Promoting generic food quotes instead of urgent, irresistible localized offers.',
      'No mechanism to capture contact information or track redemption at billing.',
    ],
    actionPlan: [
      'Stop wide boosts; restrict ad radius strictly to 2.5km surrounding your pin code.',
      'Run ads promoting a specific lunchtime combo with a trackable promo code.',
      'Reallocate ad budget into hyper-local micro-influencer tastings with genuine foodies.',
    ],
    tags: ['marketing', 'instagram', 'ads', 'roi'],
  },
  {
    id: 'prob-customer-experience',
    category: 'Customer experience',
    title: 'Slow Table Turnaround & Neglected Negative Review Recovery',
    shortDesc: 'Peak hour orders taking 35+ minutes, while angry Google/Zomato reviews are left unanswered, poisoning prospective customers.',
    impactLevel: 'High',
    marginLeakPercent: '8% - 14%',
    estimatedMonthlyLoss: '₹30,000 - ₹50,000',
    rootCauses: [
      'Kitchen bottlenecks during 8 PM - 10 PM rush due to lack of prep mise-en-place.',
      'Staff not trained to acknowledge delayed orders with complimentary amuse-bouche or tea.',
      'Ignoring 1-star reviews instead of offering courteous service recovery vouchers.',
    ],
    actionPlan: [
      'Establish a strict 3-hour pre-service mise-en-place prep routine before 12 PM and 7 PM.',
      'Train service staff on the "LAST" framework: Listen, Apologize, Solve, Thank.',
      'Respond publicly to every negative review within 12 hours with a sincere manager invite.',
    ],
    tags: ['customer service', 'reviews', 'table turnover', 'operations'],
  },
  {
    id: 'prob-staff-management',
    category: 'Staff management',
    title: 'High Kitchen Attrition & Absence of Structured Shift Scheduling',
    shortDesc: 'Cooks and service staff leaving every 2-3 months with zero notice, disrupting service and increasing training overhead.',
    impactLevel: 'High',
    marginLeakPercent: '6% - 10%',
    estimatedMonthlyLoss: '₹20,000 - ₹38,000',
    rootCauses: [
      'Excessive 14-hour daily shifts without proper weekly rest days.',
      'Salaries delayed by 10-15 days due to poor cash flow management.',
      'Lack of performance incentives linked to daily sales targets.',
    ],
    actionPlan: [
      'Implement structured split-shifts and fixed weekly rest days.',
      'Introduce a daily shift tip pool plus monthly ₹1,500 target completion bonuses.',
      'Pay salaries promptly on the 1st or 5th of every month without exception.',
    ],
    tags: ['staff', 'attrition', 'kitchen', 'hr'],
  },
  {
    id: 'prob-packaging',
    category: 'Packaging',
    title: 'Soggy Fried Items & Leaking Gravy in Delivery Bags',
    shortDesc: 'Cheap thin plastic containers causing food spillage, melted paper boxes, and instant 1-star delivery reviews.',
    impactLevel: 'Moderate',
    marginLeakPercent: '5% - 8%',
    estimatedMonthlyLoss: '₹15,000 - ₹28,000',
    rootCauses: [
      'Using unvented plastic containers for crispy items (fries, tikkis, dosas) that trap steam.',
      'Thin lid seals on liquid curries and dal makhani opening during bike transport.',
      'Failing to test packaging integrity on an actual 20-minute scooter ride.',
    ],
    actionPlan: [
      'Switch to tamper-evident, microwave-safe, spill-proof round containers for gravies.',
      'Use corrugated breathable craft boxes with vent holes for fried and tandoori starters.',
      'Conduct a mandatory 4km scooter bumpy-road test on every new packaging material.',
    ],
    tags: ['packaging', 'delivery', 'food quality', 'steam'],
  },
  {
    id: 'prob-brand-awareness',
    category: 'Brand awareness',
    title: 'Generic Unmemorable Identity in a Crowded Culinary Street',
    shortDesc: 'Branded as just another "Family Restaurant & Fast Food", blending into background noise with zero customer recall.',
    impactLevel: 'High',
    marginLeakPercent: '8% - 15%',
    estimatedMonthlyLoss: '₹26,000 - ₹48,000',
    rootCauses: [
      'Offering a bloated 180-item menu featuring South Indian, North Indian, Pizza, Chinese, and Burgers.',
      'No signature hero dish that food lovers travel across town to taste.',
      'Inconsistent visual branding between signboard, packaging, and digital profiles.',
    ],
    actionPlan: [
      'Prune the menu by 35%, cutting slow-moving, high-spoilage dishes.',
      'Crown 2 "Signature Hero Items" with unique secret seasonings and compelling backstories.',
      'Use our Brand Brainstormer to craft a laser-focused, memorable brand proposition.',
    ],
    recommendedToolPath: '/tools?tab=brand-name',
    recommendedToolName: 'Brand-Name Brainstorming Tool',
    tags: ['branding', 'menu engineering', 'hero dish', 'identity'],
  },
  {
    id: 'prob-budgeting',
    category: 'Budgeting',
    title: 'Muddling Personal Wallet with Restaurant Cash Register',
    shortDesc: 'Owner pulling daily cash from billing counter for household expenses without maintaining separate books.',
    impactLevel: 'Critical',
    marginLeakPercent: '10% - 16%',
    estimatedMonthlyLoss: '₹35,000 - ₹60,000',
    rootCauses: [
      'No formal separation between personal bank account and business current account.',
      'Lack of daily closing reconciliation between POS receipts and cash drawer.',
      'No fixed owner monthly salary, leading to accidental working capital drain.',
    ],
    actionPlan: [
      'Open a dedicated business Current Account; stop all UPI personal QR usage at billing.',
      'Assign the owner a fixed monthly drawing/salary and never touch counter cash.',
      'Run end-of-day Z-report tally comparing cash, UPI, card, and aggregator settlements.',
    ],
    recommendedToolPath: '/tools?tab=profit-tracker',
    recommendedToolName: 'Monthly Profit Tracker',
    tags: ['budgeting', 'cash flow', 'accounting', 'working capital'],
  },
];

export const RESTAURANT_SOLUTIONS: RestaurantSolution[] = [
  {
    id: 'sol-portion-control',
    category: 'Product Quality & Costing',
    title: 'The Gram-Precision Portioning Framework for 30% Food Cost',
    readTime: '6 min read',
    difficulty: 'Beginner',
    summary: 'How replacing open-hand seasoning with standardized ladles and color-coded kitchen spoons recovers 6-10% in pure gross margin within 14 days.',
    keySteps: [
      {
        title: 'Step 1: Plate Specification Sheet (Recipe Card)',
        desc: 'Photograph the ideal plate presentation. Document exact protein weight (e.g. 180g raw paneer), gravy volume (240ml), and garnish details on a laminated card in the kitchen.',
      },
      {
        title: 'Step 2: Dedicated Portion Utensils',
        desc: 'Ban standard table spoons. Provide 60ml, 120ml, and 240ml stainless steel ladles for gravies, and a digital ₹800 scale at the assembly station for meat and cheese.',
      },
      {
        title: 'Step 3: Yield Factor Testing',
        desc: 'Measure the shrinkage of onions when browned (typically 65% loss) and chicken when roasted. Account for real cooked cost instead of raw wholesale weight.',
      },
      {
        title: 'Step 4: Shift-End Waste Audit',
        desc: 'Inspect kitchen trash cans with the head chef every night. Weigh discarded prepped food and record the rupee value on a whiteboard.',
      },
    ],
    proTip: 'A cook over-portioning butter by just 10 grams per curry over 80 orders a day wastes ₹14,400 of Amul butter every month.',
    estimatedRoi: '₹22,000 - ₹45,000 saved per month',
    checklistItems: [
      'Purchase 2 commercial digital weighing scales with 1g precision.',
      'Equip sauce stations with volume-calibrated ladles.',
      'Create recipe cards for your top 8 revenue-driving dishes.',
      'Conduct a 10-minute daily inventory closing check with the head cook.',
    ],
  },
  {
    id: 'sol-direct-whatsapp-delivery',
    category: 'Online Presence & Delivery',
    title: 'Bypassing the 24% Swiggy/Zomato Trap with Direct WhatsApp Ordering',
    readTime: '8 min read',
    difficulty: 'Intermediate',
    summary: 'A complete step-by-step system to turn one-time marketplace delivery customers into direct repeat buyers using smart packaging inserts and WhatsApp catalogs.',
    keySteps: [
      {
        title: 'Step 1: The "Direct Advantage" Packaging Insert',
        desc: 'Place a high-quality postcard inside every Swiggy/Zomato delivery bag: "Love this meal? Order directly on our WhatsApp for 15% off + Free Dessert, always."',
      },
      {
        title: 'Step 2: WhatsApp Business Catalog Setup',
        desc: 'Organize your WhatsApp Business with a clean 20-item visual menu, prices, combo deals, and an automated greeting message with your UPI payment link.',
      },
      {
        title: 'Step 3: Hyper-Local Radius Logistics',
        desc: 'Use daytime staff (waiters during 3-6 PM lulls) or negotiate a flat ₹40-50 per drop with local Porter or Dunzo delivery riders within a 3km radius.',
      },
      {
        title: 'Step 4: Weekend WhatsApp Broadcast Retention',
        desc: 'Every Friday at 5:30 PM, send a mouthwatering photo and exclusive combo offer to your opted-in customer database before the dinner decision is made.',
      },
    ],
    proTip: 'Even if you give the customer a 15% discount for ordering direct, you still keep 9% more profit than giving 24% to delivery platforms.',
    estimatedRoi: '₹35,000 - ₹75,000 monthly commission savings',
    checklistItems: [
      'Print 1,000 dual-sided direct ordering bag insert cards.',
      'Set up WhatsApp Business profile with verified location & catalog.',
      'Integrate dynamic UPI payment QR links for instant zero-fee settlement.',
      'Set delivery rules: 3km radius, minimum order ₹299.',
    ],
  },
  {
    id: 'sol-google-maps-engine',
    category: 'Online Visibility & Customer Reach',
    title: 'Ranking in the Local Google Maps 3-Pack for "Restaurants Near Me"',
    readTime: '7 min read',
    difficulty: 'Beginner',
    summary: 'How neighborhood eateries generate 50-80 free walk-in covers every weekend by dominating local search without spending a single rupee on ads.',
    keySteps: [
      {
        title: 'Step 1: Category Precision & Keyword Optimization',
        desc: 'Set primary category accurately (e.g. "North Indian Restaurant", not just "Restaurant"). Add secondary categories: "Takeout Restaurant", "Family Restaurant".',
      },
      {
        title: 'Step 2: Tabletop QR Review Generator',
        desc: 'Generate a short Google review link (goo.gl format). Place an acrylic stand on tables: "Satisfied with your meal? Leave a quick review & receive a complimentary scoop of ice cream on your next visit."',
      },
      {
        title: 'Step 3: Weekly Photo Cadence',
        desc: 'Google algorithm rewards freshness. Upload 4 crisp smartphone photos every Thursday showing sizzling tandoori plates, fresh ingredients, and cheerful guests.',
      },
      {
        title: 'Step 4: Algorithmic Review Replies',
        desc: 'Reply to 100% of reviews within 24 hours. Naturally weave localized keywords into your reply: "So glad you enjoyed our Dal Makhani in Kothrud, Pune!"',
      },
    ],
    proTip: 'Businesses with 75+ Google reviews and a 4.2+ rating receive 4.5x more click-to-call directions than competitors with under 30 reviews.',
    estimatedRoi: '40 - 70 extra dine-in tables every month',
    checklistItems: [
      'Verify Google Business Profile address, phone, and active opening hours.',
      'Print clean QR review stands for every counter and table.',
      'Upload 10 high-resolution food and interior photographs.',
      'Commit to answering every review within 24 hours.',
    ],
  },
  {
    id: 'sol-menu-engineering',
    category: 'Pricing & Menu Strategy',
    title: 'The Menu Engineering Matrix: Maximizing High-Margin "Stars"',
    readTime: '9 min read',
    difficulty: 'Intermediate',
    summary: 'Categorize your menu into Stars, Plowhorses, Puzzles, and Dogs. Learn how to eliminate money-losing items and visually spotlight high-margin winners.',
    keySteps: [
      {
        title: 'Step 1: Calculate Gross Margin per Dish',
        desc: 'Selling Price minus True Plate Cost equals Contribution Margin in rupees. Rank every item from highest rupee profit to lowest.',
      },
      {
        title: 'Step 2: Classify into the 4 Quadrants',
        desc: 'Stars (High Profit, High Popularity), Plowhorses (Low Profit, High Popularity), Puzzles (High Profit, Low Popularity), Dogs (Low Profit, Low Popularity).',
      },
      {
        title: 'Step 3: Strategic Menu Placement',
        desc: 'Eyes naturally gravitate to the top-right corner and center of the menu. Place your Stars in bold framed boxes with mouthwatering descriptions.',
      },
      {
        title: 'Step 4: Kill the Dogs & Re-price the Plowhorses',
        desc: 'Remove the bottom 15% slow-selling dishes that clog cold storage. Raise Plowhorse prices by ₹15-20 or re-engineer their raw material cost.',
      },
    ],
    proTip: 'Never list prices in a neat column with dots (........₹280). That invites customers to compare numbers. Nestle the price discreetly at the end of the dish description.',
    estimatedRoi: '4% - 7% immediate bump in average ticket size',
    checklistItems: [
      'Export 30-day item sales volume from your billing counter software.',
      'Calculate contribution margin for each item.',
      'Identify and remove 5 low-selling, ingredient-heavy "Dog" dishes.',
      'Redesign menu layout to spotlight top 4 "Star" items.',
    ],
  },
  {
    id: 'sol-signature-branding',
    category: 'Branding & Hero Products',
    title: 'Crafting an Irresistible Brand Identity & Signature Hero Dishes',
    readTime: '6 min read',
    difficulty: 'Beginner',
    summary: 'How ordinary cafes and dhabas turn 1-2 hero dishes into city-famous culinary magnets with distinct storytelling, packaging, and presentation.',
    keySteps: [
      {
        title: 'Step 1: Crown 2 Unrivaled Signature Items',
        desc: 'Select 2 items with strong gross margins (>65%) that can be cooked consistently in under 8 minutes. Give them evocative, trademark-style names (e.g., "Dumdaar Old-Delhi Butter Chicken").',
      },
      {
        title: 'Step 2: Visual Theatrics and Presentation',
        desc: 'Elevate serving vessels — use clay handis, wooden platters, or sizzling cast iron skillets that compel customers to pull out their phones and post Instagram stories.',
      },
      {
        title: 'Step 3: The Sensory Origin Story',
        desc: 'Add a 2-line story on your menu cards about the secret slow-simmered 12-spice blend or generational recipe heritage.',
      },
      {
        title: 'Step 4: Consistent Visual Branding Across Touchpoints',
        desc: 'Standardize colors, font styles, logo stickers, and uniforms across dine-in bills, delivery tape, and social banners using our Brand Brainstormer tool.',
      },
    ],
    proTip: 'People do not remember menus with 120 dishes; they remember the one place that serves the juiciest seekh kebab or crispiest dosa in town.',
    estimatedRoi: '20% - 35% higher brand recall and word-of-mouth referral',
    checklistItems: [
      'Identify 2 items with highest customer praise and >65% gross margin.',
      'Design branded tape, stamp, or greaseproof wrapping paper.',
      'Conduct a 15-minute photo session under warm natural light.',
      'Train serving staff to recommend the signature item as default recommendation.',
    ],
  },
  {
    id: 'sol-gradual-expansion',
    category: 'Gradual Product Expansion',
    title: 'Smart Menu Expansion: Rolling Out New Items Without Kitchen Chaos',
    readTime: '8 min read',
    difficulty: 'Intermediate',
    summary: 'A disciplined framework for testing and scaling new menu offerings, meal boxes, and combos without increasing inventory spoilage or cooking complexity.',
    keySteps: [
      {
        title: 'Step 1: Cross-Utilization of Pantry Staples',
        desc: 'Every new dish must utilize at least 70% of ingredients already stocked in your kitchen. Never add 5 unique exotic raw ingredients for a single untested dish.',
      },
      {
        title: 'Step 2: Weekend "Chef Special" Pilot Testing',
        desc: 'Introduce new items as limited-quantity weekend specials on a standalone blackboard or WhatsApp flyer for 14 days before printing new physical menus.',
      },
      {
        title: 'Step 3: High-Margin Combo Bundling',
        desc: 'Bundle lower-margin proteins with high-margin sides (fries, beverage, dessert, garlic bread) to lift Average Order Value (AOV) by ₹70-120 per ticket.',
      },
      {
        title: 'Step 4: The "One In, One Out" Menu Rule',
        desc: 'For every new dish successfully added permanently to the menu, decommission the worst-performing legacy dish to keep kitchen prep times under control.',
      },
    ],
    proTip: 'Beverages and house-made coolers (e.g. Kokum fizz, Masala Chaas) carry 80-85% gross margins. Adding a signature drink to every combo doubles net profit.',
    estimatedRoi: '15% - 22% increase in Average Order Value (AOV)',
    checklistItems: [
      'Verify that 70%+ of ingredients for new items already exist in current inventory.',
      'Test prep and cook time during peak rush hours to ensure under 10-minute turnaround.',
      'Create combo bundles pairing bestselling mains with high-margin beverages.',
      'Enforce the "One In, One Out" rule to prevent inventory bloat.',
    ],
  },
  {
    id: 'sol-hyperlocal-collaboration',
    category: 'Collaboration & Local Growth',
    title: 'Hyperlocal Co-Marketing: Partnering with Offices, Gyms & Retailers',
    readTime: '5 min read',
    difficulty: 'Beginner',
    summary: 'Low-cost B2B partnerships that unlock consistent weekday footfall and bulk pre-orders without paying exorbitant digital ad fees.',
    keySteps: [
      {
        title: 'Step 1: Office Park & Coworking Meal Subscriptions',
        desc: 'Pitch nearby corporate offices and coworking spaces with pre-portioned, packaged executive lunch boxes and team meeting snack trays with on-time delivery.',
      },
      {
        title: 'Step 2: Cross-Promotion with Neighborhood Gyms & Salons',
        desc: 'Swap promotional vouchers: Gym members get 10% off high-protein grill meals; restaurant diners receive a 3-day guest gym pass.',
      },
      {
        title: 'Step 3: Event Catering & Community Societies',
        desc: 'Partner with local housing society management committees for festival weekend pop-ups, society carnivals, and birthday catering packages.',
      },
      {
        title: 'Step 4: Nano-Influencer Food Tastings (Zero-Fee Barter)',
        desc: 'Invite 5 local neighborhood food bloggers (5k-20k followers) for an authentic kitchen tasting in exchange for honest video reels showcasing hero dishes.',
      },
    ],
    proTip: 'One B2B corporate lunch agreement of 25 boxes a day generates ₹75,000+ in predictable monthly recurring revenue with zero aggregator commissions.',
    estimatedRoi: '₹50,000 - ₹1,20,000 in monthly weekday corporate revenue',
    checklistItems: [
      'Draft a 1-page Corporate Meal Box flyer with 3 price tiers.',
      'Visit 5 businesses within 1.5km radius and leave sample boxes for HR managers.',
      'Set up simple barter voucher exchanges with local non-competing businesses.',
      'Build a VIP catering WhatsApp group for instant bulk inquiries.',
    ],
  },
  {
    id: 'sol-monthly-goals',
    category: 'Monthly Goals & Unit Economics',
    title: 'Setting Achievable Monthly Targets & Daily Break-Even Thresholds',
    readTime: '7 min read',
    difficulty: 'Intermediate',
    summary: 'How to break down vague annual hopes into crystal-clear daily cover counts, prime cost targets, and cash flow milestones that keep your business resilient.',
    keySteps: [
      {
        title: 'Step 1: Calculate Your True Daily Break-Even Point',
        desc: 'Sum monthly Fixed Costs (Rent + Core Salaries + Electricity + AMC) divided by (Gross Margin % * 30 days). This gives the exact revenue needed every single day just to survive.',
      },
      {
        title: 'Step 2: Establish the 60% Prime Cost Ceiling',
        desc: 'Prime Cost (Raw Food Cost + Total Labor Cost) must never exceed 60% of total revenue. If food cost is 32%, labor must remain under 28%.',
      },
      {
        title: 'Step 3: Define 3 Monthly Key Performance Indicators',
        desc: 'Pick 3 metrics per month: e.g., 1) Reduce raw food cost to 30%, 2) Collect 40 Google reviews, 3) Acquire 50 direct WhatsApp delivery customers.',
      },
      {
        title: 'Step 4: Mid-Month Course Correction Audit',
        desc: 'On the 15th of every month, check if sales and expenses are tracking to budget. If rent is due in 10 days, initiate a weekend special promotion immediately.',
      },
    ],
    proTip: 'Knowing your daily break-even number (e.g. ₹9,200/day or 32 covers) removes financial anxiety and gives your shift manager a tangible target to hit every night.',
    estimatedRoi: 'Prevents sudden working capital collapse and overdrafts',
    checklistItems: [
      'Calculate exact monthly fixed overheads (rent, salaries, utilities).',
      'Determine daily break-even sales target and communicate to floor manager.',
      'Track prime cost (food + labor) weekly to ensure it stays below 60%.',
      'Schedule a 30-minute monthly financial review on the 1st of every month.',
    ],
  },
  {
    id: 'sol-business-tracking',
    category: 'Business Tracking & Daily Audits',
    title: 'The 10-Minute Daily Restaurant Closing Audit & Z-Report System',
    readTime: '6 min read',
    difficulty: 'Beginner',
    summary: 'A bulletproof end-of-day closing routine that eliminates register theft, tracks cash vs UPI payouts, and keeps food margins rock solid.',
    keySteps: [
      {
        title: 'Step 1: The Four-Way Tender Reconciliation',
        desc: 'Compare POS total against 4 payment buckets: 1) Cash in drawer, 2) UPI direct bank credits, 3) Card machine settlements, 4) Aggregator order slips. Variance should be under ₹100.',
      },
      {
        title: 'Step 2: Shift-End High-Value Inventory Count',
        desc: 'Count only the top 5 high-theft items nightly: Paneer blocks, raw chicken/mutton weight, cheese blocks, cooking oil cans, and draft syrups.',
      },
      {
        title: 'Step 3: Comp & Void Ticket Log',
        desc: 'Review every canceled bill, discount, and food replacement ticket. Staff must write down the exact customer reason (e.g., "Food cold" or "Wrong order").',
      },
      {
        title: 'Step 4: The 1-Page Manager Handover Sheet',
        desc: 'Shift manager logs: Daily Gross Sales, Total Customer Covers, High-Value Stock Count, Wastage in ₹, and Maintenance issues into a dedicated WhatsApp log.',
      },
    ],
    proTip: 'Unchecked void and canceled bills are where up to 8% of counter cash disappears. Requiring manager passcode approval for voids immediately curbs internal pilferage.',
    estimatedRoi: 'Recovers ₹18,000 - ₹35,000 monthly from unrecorded leaks',
    checklistItems: [
      'Enable mandatory manager authorization for all bill voids and discounts in POS.',
      'Count 5 high-cost ingredient staples every night at 11:00 PM.',
      'Reconcile UPI QR settlements with POS billed amounts daily.',
      'Maintain a digital or physical daily handover logbook.',
    ],
  },
];

export const SIX_MONTH_GROWTH_PLAN: GrowthTask[] = [
  // Month 1
  {
    id: 'm1-task-1',
    month: 1,
    monthTitle: 'Month 1: Foundation, Cost Audit & Recipe Standardization',
    category: 'Costing & Operations',
    title: 'Weigh and calculate raw plate costs for top 10 bestselling dishes',
    description: 'Break down raw ingredients, oil, spices, and yields to uncover true plate cost. Target 28-32% food cost.',
    deadlineDays: 7,
    impact: 'High',
    completed: false,
  },
  {
    id: 'm1-task-2',
    month: 1,
    monthTitle: 'Month 1: Foundation, Cost Audit & Recipe Standardization',
    category: 'Operations',
    title: 'Equip kitchen with 2 digital weighing scales & portion ladles',
    description: 'Standardize gravies, biryani rice, and protein cuts to stop kitchen over-portioning leaks.',
    deadlineDays: 14,
    impact: 'High',
    completed: false,
  },
  {
    id: 'm1-task-3',
    month: 1,
    monthTitle: 'Month 1: Foundation, Cost Audit & Recipe Standardization',
    category: 'Compliance & Safety',
    title: 'Audit FSSAI food safety licenses, kitchen hygiene & pest control logs',
    description: 'Ensure food safety compliance is up to date with clean storage labeling and pest control contracts.',
    deadlineDays: 21,
    impact: 'Medium',
    completed: false,
  },
  {
    id: 'm1-task-4',
    month: 1,
    monthTitle: 'Month 1: Foundation, Cost Audit & Recipe Standardization',
    category: 'Accounting',
    title: 'Separate personal bank account completely from billing POS cash',
    description: 'Open a dedicated Current Account; assign owner a fixed monthly salary instead of daily counter withdrawals.',
    deadlineDays: 28,
    impact: 'High',
    completed: false,
  },

  // Month 2
  {
    id: 'm2-task-1',
    month: 2,
    monthTitle: 'Month 2: Menu Engineering & Profit Margin Optimization',
    category: 'Menu Strategy',
    title: 'Perform Menu Engineering Matrix audit on POS sales data',
    description: 'Classify items into Stars, Plowhorses, Puzzles, and Dogs. Remove bottom 10% slow-moving ingredients.',
    deadlineDays: 35,
    impact: 'High',
    completed: false,
  },
  {
    id: 'm2-task-2',
    month: 2,
    monthTitle: 'Month 2: Menu Engineering & Profit Margin Optimization',
    category: 'Pricing',
    title: 'Adjust Online Delivery pricing by +18-20% to absorb platform cuts',
    description: 'Stop subsidizing aggregator commissions at dine-in margins. Re-price delivery items with packaging buffers.',
    deadlineDays: 42,
    impact: 'High',
    completed: false,
  },
  {
    id: 'm2-task-3',
    month: 2,
    monthTitle: 'Month 2: Menu Engineering & Profit Margin Optimization',
    category: 'Branding',
    title: 'Develop 2 Signature Hero Dishes with distinctive presentation',
    description: 'Create memorable culinary champions that people recommend by name and post on social media.',
    deadlineDays: 50,
    impact: 'Medium',
    completed: false,
  },

  // Month 3
  {
    id: 'm3-task-1',
    month: 3,
    monthTitle: 'Month 3: Local SEO, Google Maps & Review Engine',
    category: 'Local Search',
    title: 'Claim and optimize Google Business Profile with GPS pin & hours',
    description: 'Fill 100% profile fields, upload 15 bright photos of food & seating, and verify phone numbers.',
    deadlineDays: 65,
    impact: 'High',
    completed: false,
  },
  {
    id: 'm3-task-2',
    month: 3,
    monthTitle: 'Month 3: Local SEO, Google Maps & Review Engine',
    category: 'Reputation',
    title: 'Place tabletop acrylic QR stands to generate 50+ Google reviews',
    description: 'Train staff to invite satisfied guests to scan the QR code before paying for their meal.',
    deadlineDays: 75,
    impact: 'High',
    completed: false,
  },
  {
    id: 'm3-task-3',
    month: 3,
    monthTitle: 'Month 3: Local SEO, Google Maps & Review Engine',
    category: 'Customer Service',
    title: 'Respond to all historical reviews with professional service recovery',
    description: 'Turn past 1-star complaints into goodwill with thoughtful manager responses and return invitations.',
    deadlineDays: 85,
    impact: 'Medium',
    completed: false,
  },

  // Month 4
  {
    id: 'm4-task-1',
    month: 4,
    monthTitle: 'Month 4: Direct Ordering & WhatsApp Marketing Engine',
    category: 'Delivery Strategy',
    title: 'Print and insert direct-ordering discount cards in all delivery bags',
    description: 'Offer 15% off on direct WhatsApp orders to convert one-time platform users to direct regulars.',
    deadlineDays: 95,
    impact: 'High',
    completed: false,
  },
  {
    id: 'm4-task-2',
    month: 4,
    monthTitle: 'Month 4: Direct Ordering & WhatsApp Marketing Engine',
    category: 'Digital Reach',
    title: 'Set up WhatsApp Business profile with visual menu catalog & UPI link',
    description: 'Enable customers to browse dishes, place orders, and pay instantly via UPI in 3 taps.',
    deadlineDays: 105,
    impact: 'High',
    completed: false,
  },
  {
    id: 'm4-task-3',
    month: 4,
    monthTitle: 'Month 4: Direct Ordering & WhatsApp Marketing Engine',
    category: 'Packaging',
    title: 'Upgrade to spill-proof, heat-retentive leak-proof packaging',
    description: 'Test tamper-evident containers with vent holes to keep fried foods crispy and gravies sealed.',
    deadlineDays: 115,
    impact: 'Medium',
    completed: false,
  },

  // Month 5
  {
    id: 'm5-task-1',
    month: 5,
    monthTitle: 'Month 5: Customer Loyalty & Local Business Partnerships',
    category: 'Loyalty',
    title: 'Launch a simple digital repeat-visit loyalty incentive',
    description: 'Give customers a stamp card or phone-number reward: "5th visit gets complimentary starter."',
    deadlineDays: 130,
    impact: 'High',
    completed: false,
  },
  {
    id: 'm5-task-2',
    month: 5,
    monthTitle: 'Month 5: B2B Partnerships',
    category: 'Partnerships',
    title: 'Partner with 5 nearby offices or gyms for corporate lunch meal boxes',
    description: 'Offer structured healthy or thali box subscriptions with guaranteed weekday volume.',
    deadlineDays: 140,
    impact: 'High',
    completed: false,
  },
  {
    id: 'm5-task-3',
    month: 5,
    monthTitle: 'Month 5: Staff Growth',
    category: 'Human Resources',
    title: 'Implement daily tips distribution & monthly performance bonus pool',
    description: 'Link monthly gross revenue milestones to staff bonus pools to drastically slash kitchen turnover.',
    deadlineDays: 150,
    impact: 'Medium',
    completed: false,
  },

  // Month 6
  {
    id: 'm6-task-1',
    month: 6,
    monthTitle: 'Month 6: Catering, Cloud Expansion & Scaling',
    category: 'Growth & Scale',
    title: 'Standardize bulk party / catering menu packages (15-50 pax)',
    description: 'Package your top dishes for birthday parties, house warmings, and corporate team events.',
    deadlineDays: 165,
    impact: 'High',
    completed: false,
  },
  {
    id: 'm6-task-2',
    month: 6,
    monthTitle: 'Month 6: Catering, Cloud Expansion & Scaling',
    category: 'Financial Health',
    title: 'Conduct full 6-month unit economics & break-even re-audit',
    description: 'Review monthly net profit margins against the original baseline using our Dashboard & Tools.',
    deadlineDays: 175,
    impact: 'High',
    completed: false,
  },
  {
    id: 'm6-task-3',
    month: 6,
    monthTitle: 'Month 6: Catering, Cloud Expansion & Scaling',
    category: 'Expansion',
    title: 'Evaluate cloud kitchen outpost feasibility in adjacent delivery cluster',
    description: 'Map out whether expanding to a 2nd low-rent kitchen hub makes financial sense with current SOPs.',
    deadlineDays: 180,
    impact: 'Medium',
    completed: false,
  },
];

export const LEARNING_ARTICLES: LearningArticle[] = [
  {
    id: 'art-fssai-gst-guide',
    slug: 'fssai-gst-restaurant-compliance-india',
    title: 'Indian Restaurant Regulatory Playbook: FSSAI, 5% GST & Local Shop Act',
    category: 'Legal & Compliance',
    readTime: '8 min read',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Navigating Indian culinary regulations without panic. Understand FSSAI State vs Basic licenses, the 5% non-ITC GST structure, and fire safety norms.',
    content: `
## Why Regulatory Clarity Protects Your Working Capital

Small restaurant owners in India often live in constant fear of local health inspections and tax notices. The truth is that 95% of regulatory compliance is straightforward when organized systematically from day one.

### 1. FSSAI Registration vs State License
- **FSSAI Basic Registration:** Mandatory for food business operators (FBOs) with an annual turnover under ₹12 Lakhs. Fee is ₹100/year.
- **FSSAI State License:** Mandatory if annual turnover exceeds ₹12 Lakhs and is under ₹20 Crores. Requires floor plan diagram, water testing report, and list of food categories.
- **Golden Rule:** Always display your 14-digit FSSAI number prominently on billing receipts, signboards, and Swiggy/Zomato profiles.

### 2. The 5% GST Structure for Restaurants
- Indian restaurants operate under a flat **5% GST without Input Tax Credit (ITC)**.
- While you cannot claim ITC on your vegetable, dairy, or rent expenses, you also avoid complex rate splits.
- For alcohol-serving restaurants, separate VAT regimes apply on liquor sales while food remains at 5%.

### 3. Municipal Shop & Establishment (Gumasta)
- Procure your local municipal trade license before commercial electricity and water connections are activated.
`,
    keyTakeaways: [
      'Display your 14-digit FSSAI license on all bills and packaging.',
      'Maintain an updated water testing certificate from an accredited lab.',
      'Budget for 5% flat GST without counting on Input Tax Credit offsets.',
    ],
    checklist: [
      'Verify FSSAI license renewal date 60 days before expiry.',
      'Keep medical fitness certificates for all cooks and food handlers on file.',
      'Maintain labeled fire extinguishers with valid annual inspection tags.',
    ],
  },
  {
    id: 'art-cloud-vs-dinein',
    slug: 'cloud-kitchen-vs-dine-in-unit-economics',
    title: 'Cloud Kitchen vs Dine-In: Honest Unit Economics Comparison in 2026',
    category: 'Unit Economics',
    readTime: '10 min read',
    coverImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Is a cloud kitchen truly cheaper than a small 30-seater restaurant? A breakdown of hidden aggregator ad costs, packaging overheads, and rental math.',
    content: `
## Debunking the "Zero Cost" Cloud Kitchen Myth

The popular narrative suggests that cloud kitchens are effortlessly profitable because you avoid prime real estate rent and service staff. However, the unit economics reveal a very different reality.

### Comparative Unit Economics Breakdown (₹3,00,000 Monthly Revenue)

| Metric | 32-Seater Casual Dine-In | Dedicated Cloud Kitchen |
|---|---|---|
| **Rent & Maintenance** | ₹45,000 - ₹60,000 (18%) | ₹18,000 - ₹24,000 (7%) |
| **Raw Food Cost** | ₹90,000 (30%) | ₹90,000 (30%) |
| **Kitchen Staff** | ₹42,000 (14%) | ₹36,000 (12%) |
| **Service Staff** | ₹28,000 (9%) | ₹0 (0%) |
| **Aggregator Commissions (22-26%)** | ₹18,000 (Delivery is only 25% of sales) | ₹72,000 (Delivery is 95% of sales) |
| **Packaging & Containers** | ₹6,000 (2%) | ₹21,000 (7%) |
| **Platform Ads & Visibility spend** | ₹4,000 (1%) | ₹24,000 (8%) |
| **Estimated Net Profit** | **₹67,000 (22%)** | **₹39,000 (13%)** |

### The Verdict
While cloud kitchens require less initial upfront capex (₹4-6 Lakhs vs ₹12-18 Lakhs for dine-in), their ongoing margins are vulnerable to aggregator fee increases. The ideal hybrid model is a small 20-25 seater with a vibrant direct takeaway counter.
`,
    keyTakeaways: [
      'Cloud kitchens replace physical rent with aggregator commissions and digital ad fees.',
      'Dine-in outlets command higher average check sizes through beverages and desserts.',
      'The hybrid QSR model with direct pickup offers the most resilient gross margin.',
    ],
  },
  {
    id: 'art-biryani-oil-portioning',
    slug: 'how-pune-restaurant-cut-costs-18-percent',
    title: 'Case Study: How a Pune Casual Diner Cut Food Waste by 18% in 3 Weeks',
    category: 'Operational SOPs',
    readTime: '7 min read',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    excerpt: 'An inside look at how "The Spice Table" standardized gravies, introduced pre-portioned dairy bags, and unlocked ₹38,000 in monthly net profit.',
    content: `
## The Situation: High Sales, Disappearing Bank Balance

Rajesh, founder of a 36-seater Maharashtrian & North Indian diner in Pune, was clocking ₹4,20,000 monthly turnover but taking home less than ₹20,000 net profit. He was convinced his rent (₹48,000) was killing him.

### The Real Culprit: The Kitchen Eyeball Habit
An independent 3-day ingredient audit revealed shocking discrepancies:
- **Paneer:** Recipe called for 180g per Kadai Paneer. Cooks were routinely dropping 220g to 240g into the pan. Over 45 orders a day, that leaked 2.5 kg of paneer daily (₹950/day).
- **Cooking Oil:** Oil was poured directly from a 15-liter tin into the kadai without measuring cups, using 35% more oil than necessary.
- **Onion-Tomato Base Gravy:** Large batches cooked every 4 days often soured in the back of the walk-in cooler, wasting 8-10 liters weekly.

### The 3 Changes That Turned The Business Around
1. **Pre-bagged portions:** Every morning, junior prep staff sliced and bagged paneer and chicken into exact 180g airtight zip pouches using digital scales.
2. **Oil dispenser pumps:** Installed calibrated 30ml pump dispensers on oil containers.
3. **Daily batching:** Gravies reduced to 2-day shelf cycles with strict date labeling.

### The Result in 30 Days
- Food cost dropped from **38.4% down to 30.2%**.
- Monthly raw ingredient savings: **₹34,440**.
- Customer complaints about inconsistent thickness disappeared completely.
`,
    keyTakeaways: [
      'Over-portioning is rarely intentional; it is the natural consequence of lack of tools.',
      'Pre-portioning during morning prep hours eliminates rush-hour guessing.',
      'Saving 6-8% on raw food cost instantly doubles net profit for small restaurants.',
    ],
  },
];
