// Single source of truth for Hitch Studio site content.
// Pricing comes from the Hitch Studio Business Plan, "Offer and pricing" section.
// Prices are shown on /pricing only.
// Hitch does two things: websites, and AI implemented inside existing businesses.

export const site = {
  name: 'Hitch Studio',
  url: 'https://hitch.build',
  email: 'hello@hitch.build',
  // Open decision in the brief: phone and/or WhatsApp, and which market's number.
  // Set these and the header and footer will show click-to-call links.
  phone: null as string | null,
  whatsapp: null as string | null,
  positioning: 'Websites and AI, built into the business you already run.',
  signoff: 'Built without a hitch.',
  endorsement: 'A Rope Digital studio.',
  ropeUrl: 'https://ropedigital.co',
  // Cal.com booking link for Rope's existing account. Set it to embed the real calendar.
  calLink: null as string | null,
};

export const nav = [
  { href: '/work', label: 'Work' },
  { href: '/#sectors', label: 'Websites', match: ['/trades', '/clinics', '/property', '/tools', '/how-it-works'] },
  { href: '/ai', label: 'AI' },
  { href: '/tools', label: 'Tools' },
  { href: '/pricing', label: 'Pricing' },
];

export type SectorKey = 'trades' | 'clinics' | 'property';

export const markets = ['Australia', 'United Kingdom', 'United States'];

export const packages = [
  {
    key: 'essential',
    name: 'Essential',
    price: 1500,
    pages: 'Up to 5',
    pagesShort: '5 pages',
    for: 'One location, simple services.',
    delivery: '2 working days',
    days: 2,
    copy: 'Included',
    form: 'Included',
    booking: null,
    gbp: 'Included',
    seo: 'Included',
    revisions: '1',
  },
  {
    key: 'growth',
    name: 'Growth',
    price: 2500,
    pages: 'Up to 10',
    pagesShort: '10 pages',
    for: 'Several services. Wants more leads.',
    delivery: '3 working days',
    days: 3,
    copy: 'Included',
    form: 'Included',
    booking: 'Included',
    gbp: 'Included',
    seo: 'Included',
    revisions: '2',
  },
  {
    key: 'pro',
    name: 'Pro',
    price: 3900,
    pages: 'Up to 20',
    pagesShort: '20 pages',
    for: 'Multi-location or many services. Competing hard on Google.',
    delivery: '4 working days',
    days: 4,
    copy: 'Included, plus service-area pages',
    form: 'Included, with routing by service',
    booking: 'Included',
    gbp: 'Included, up to 3 locations',
    seo: 'Included, plus schema and location pages',
    revisions: '2',
  },
] as const;

export const everyPackage = [
  'Domain connection and SSL',
  'Analytics set up and tested',
  'Mobile-first design from the sector kit',
  'Speed tuning to a 90+ Lighthouse score',
  'Handover training',
];

export const care = [
  {
    name: 'Care',
    price: 69,
    hosting: 'Included',
    edits: '30 minutes a month',
    gbp: null,
    report: null,
    response: '1 business day',
  },
  {
    name: 'Care+',
    price: 139,
    hosting: 'Included',
    edits: '2 hours a month',
    gbp: '4 posts a month, plus review replies',
    report: 'Included',
    response: '4 hours',
  },
];

export const tools = [
  {
    key: 'S',
    name: 'Tool S',
    price: 400,
    screens: '1',
    example: 'Cost calculator, savings estimator, "which service do I need?" quiz.',
    data: 'No',
    integrations: 'None',
    time: '+2 working days',
    care: 15,
  },
  {
    key: 'M',
    name: 'Tool M',
    price: 1200,
    screens: 'Up to 3',
    example: 'Multi-step quote builder that emails a PDF quote. Intake form with conditional logic.',
    data: 'Submissions saved and emailed',
    integrations: '1 (Google Sheets, CRM or email tool)',
    time: '+5 working days',
    care: 25,
  },
  {
    key: 'L',
    name: 'Tool L',
    price: 2100,
    screens: 'Up to 6',
    example: 'Booking or job-request flow with an admin view. A tool that reads and writes to your CRM.',
    data: 'Stored, with a simple admin view',
    integrations: 'Up to 2, or one API',
    time: '+10 working days',
    care: 45,
  },
];

export const addons = [
  { name: 'Extra language', detail: 'Translated by a professional, checked by you.', price: '25% of the package price, per language' },
  { name: 'Extra page', detail: "Up to the package's 20-page ceiling.", price: 'US$150' },
  { name: 'AI enquiry assistant', detail: 'An agent on your site that answers questions from your own content and books or routes the enquiry. Scoped as an AI Pilot.', price: 'See AI pricing' },
];

export const included = [
  { title: 'Design', body: 'A design from Rope’s design team and your sector kit. Not a public template.' },
  { title: 'Copy', body: 'We write every word from one recorded call. You check them.' },
  { title: 'Photos', body: 'We source and grade the images from your phone, your socials and our library.' },
  { title: 'Google Business Profile', body: 'Set up, verified and linked, so you show up on Maps.' },
  { title: 'Hosting', body: 'Fast global hosting, SSL, backups and uptime monitoring.' },
  { title: 'Care', body: 'A named contact, monthly edits and a fixed response time.' },
];

export const process = [
  {
    key: 'call',
    name: 'Call',
    when: 'Day −5 to 0',
    time: '20 minutes',
    short: 'A 20-minute call. You get a fixed quote from the menu.',
    body: 'We look at your current site and Google profile together. You get one package recommended and a fixed price on the call. Sign and pay the 50% deposit through one link.',
    you: 'Join a 20-minute video call. Have your current site and Google profile open.',
  },
  {
    key: 'content',
    name: 'Content',
    when: 'Day 0',
    time: '45 minutes',
    short: 'One recorded call. We collect everything we need.',
    body: 'A 45-minute recorded call using your sector questionnaire. We gather your logo, photos, services, areas, reviews and logins in the same call.',
    you: 'Talk about your business. That’s it. No forms, no homework.',
  },
  {
    key: 'build',
    name: 'Build',
    when: 'Days 1–4',
    time: '2–4 working days',
    short: 'We write, design and connect it all.',
    body: 'The writer drafts copy from the call. The designer builds from your sector kit. The developer connects forms, booking, analytics and your Google Business Profile.',
    you: 'Nothing. We’ll message you if we need a detail.',
  },
  {
    key: 'live',
    name: 'Live',
    when: 'Launch day',
    time: 'One review',
    short: 'You review one link. We launch.',
    body: 'You review one staging link, with the revision rounds your package allows. We launch, take the final 50% and start your care plan.',
    you: 'Review one link and tell us what to change.',
  },
  {
    key: 'care',
    name: 'Care',
    when: 'Month 1 onwards',
    time: 'Monthly',
    short: 'We look after it.',
    body: 'Monthly edits, updates and security. On Care+, Google Business Profile posts and a monthly report. A 30-day check-in call offers upgrades.',
    you: 'Send changes when you need them. We handle the rest.',
  },
];

export const standards = [
  'Mobile-first, with a 90+ Lighthouse performance score and 95+ accessibility score.',
  'Click-to-call, a map and a contact or quote form above the fold on mobile.',
  'A unique title and meta description on every page, plus LocalBusiness schema.',
  'Google Business Profile verified and linked. Analytics and form notifications tested.',
  "Copy checked against your sector's rules, such as each market's health advertising rules for clinics.",
];

export const needFromYou = [
  'Your logo, if you have one.',
  'Any photos of your team, premises or work.',
  'Your list of services and the areas you cover.',
  'Logins for your domain and Google Business Profile.',
  'One hour, across two calls.',
];

export type Case = {
  slug: string;
  client: string;
  sector: SectorKey;
  sectorLabel: string;
  market: string;
  city: string;
  problem: string;
  summary: string;
  results: string[];
  quote: string;
  quoteBy: string;
  pkg: string;
  tools: string[];
  url: string; // the live site; points to the demo for now
  video: string;
  oldUrl: string;
  headline: string;
};

// Launch case studies are an open decision (client permission pending).
// Until then, the three sector demo sites are the portfolio, clearly labelled as demos.
// Swap these entries for real clients once permission is in.
export const cases: Case[] = [
  {
    slug: 'ironbark-builders',
    client: 'Ironbark Builders',
    sector: 'trades',
    sectorLabel: 'Trades',
    market: 'Australia',
    city: 'Melbourne',
    problem: 'Great reviews, and a website that couldn’t take a quote request on a phone.',
    summary: 'A project-led site with a gallery of finished jobs and a quote form that asks the right questions up front.',
    results: ['Live in 3 days', '10 pages', 'Quote form on every page'],
    quote: 'One call’s worth of notes. Three days later, a site we’re proud to send people to.',
    quoteBy: 'Owner, Ironbark Builders',
    pkg: 'Growth',
    tools: ['Quote builder (Tool M)'],
    url: '/tools#quote',
    video: 'case-flexia',
    oldUrl: 'ironbark-builders.com.au',
    headline: 'Built for builders.',
  },
  {
    slug: 'northside-physio',
    client: 'Northside Physio',
    sector: 'clinics',
    sectorLabel: 'Clinics',
    market: 'United Kingdom',
    city: 'Manchester',
    problem: 'A busy clinic taking bookings by phone only, with a site patients couldn’t read on mobile.',
    summary: 'A calm, clear clinic site with online booking linked to the practice software and every treatment explained.',
    results: ['Live in 4 days', 'Online booking', 'Copy checked to ASA rules'],
    quote: 'Patients book themselves now. The front desk noticed in the first week.',
    quoteBy: 'Practice manager, Northside Physio',
    pkg: 'Pro',
    tools: ['Intake form (Tool M)'],
    url: '/tools#intake',
    video: 'case-4s',
    oldUrl: 'northsidephysio.co.uk',
    headline: 'Booked, not phoned.',
  },
  {
    slug: 'harbourline-strata',
    client: 'Harbourline Strata',
    sector: 'property',
    sectorLabel: 'Property',
    market: 'Australia',
    city: 'Sydney',
    problem: 'A strata manager whose site said nothing about the buildings it looks after.',
    summary: 'A portfolio-first site with one page per building, a committee proposal form and the team up front.',
    results: ['Live in 3 days', '14 pages', '3 locations on Google'],
    quote: 'It finally looks like the buildings we manage. Committees take us seriously before the first meeting.',
    quoteBy: 'Director, Harbourline Strata',
    pkg: 'Pro',
    tools: [],
    url: '/property',
    video: 'case-nexus',
    oldUrl: 'harbourlinestrata.com.au',
    headline: 'The buildings, front and centre.',
  },
];

export type Sector = {
  key: SectorKey;
  label: string;
  path: string;
  title: string; // meta title
  description: string; // meta description
  eyebrow: string;
  headline: string;
  hlWord: string;
  lede: string;
  cardLine: string;
  video: string;
  card: string;
  popular: 'essential' | 'growth' | 'pro';
  demoName: string;
  demoHeadline: string;
  demoCta: string;
  problems: { problem: string; fix: string }[];
  features: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  localTerms?: { market: string; term: string }[];
};

export const sectors: Sector[] = [
  {
    key: 'trades',
    label: 'Trades',
    path: '/trades',
    title: 'Trades and construction website design | Hitch Studio',
    description: 'Websites for builders, electricians, plumbers and contractors in Australia, the UK and the US. Fixed price, live in days, with quote forms and project galleries.',
    eyebrow: '01 — Trades and construction',
    headline: "Websites for builders who'd rather be building.",
    hlWord: 'building.',
    lede: 'Builders, electricians, plumbers, landscapers and contractors. A site that shows the work, takes the quote request and gets you called. Live in days.',
    cardLine: 'Builders, electricians, plumbers and contractors.',
    video: 'trades',
    card: 'card-trades',
    popular: 'growth',
    demoName: 'Ironbark Builders',
    demoHeadline: 'Built right. Built on time.',
    demoCta: 'Get a quote',
    problems: [
      { problem: 'Your work is great. Your website doesn’t show it.', fix: 'A project gallery up front, with before and after photos from real jobs.' },
      { problem: 'People ring at 9pm, or not at all.', fix: 'A quote form that works on a phone and asks for the details you need to price the job.' },
      { problem: 'Competitors with worse reviews rank above you.', fix: 'Service and area pages, a linked Google Business Profile and local SEO foundations.' },
    ],
    features: [
      { title: 'Quote forms', body: 'Job type, location, photos and budget in one short form. Routed to the right person.' },
      { title: 'Project galleries', body: 'Finished jobs, grouped by service and suburb, easy to add from your phone.' },
      { title: 'Service-area pages', body: 'One page per area you cover, so you show up where you work.' },
      { title: 'Licences and insurance', body: 'Your licence numbers, insurance and memberships, shown where customers look.' },
      { title: 'Click-to-call', body: 'A call button above the fold on every page, on every phone.' },
      { title: 'Reviews', body: 'Your Google reviews pulled onto the site, kept up to date.' },
    ],
    faqs: [
      { q: 'How fast can my site be live?', a: 'Two to four working days after our content call, depending on the package. Most trades sites go live in three.' },
      { q: 'I don’t have good photos of my work. Is that a problem?', a: 'No. We source and grade images from your phone, your socials and our library.' },
      { q: 'Can people request a quote with photos of the job?', a: 'Yes. Every package includes an enquiry or quote form. A multi-step quote builder that emails a PDF quote is available as a custom tool.' },
      { q: 'Will it help me show up on Google Maps?', a: 'Yes. We set up and verify your Google Business Profile, link it to your site and build local SEO foundations into every page.' },
      { q: 'Do I own the website?', a: 'Yes. If you ever leave care after the first 12 months, you get a full export of your site. We never hold a site hostage.' },
      { q: 'I already have a website. Can you replace it?', a: 'Yes. Most of our trades clients are replacing a slow or dated site. We move your domain and keep your best content.' },
    ],
  },
  {
    key: 'clinics',
    label: 'Clinics',
    path: '/clinics',
    title: 'Clinic and allied health website design | Hitch Studio',
    description: 'Websites for GP, physio, dental, chiro and allied health clinics in Australia, the UK and the US. Online booking, practice-software links and compliant copy. Live in days.',
    eyebrow: '02 — Health and allied health',
    headline: 'Websites that fill the appointment book.',
    hlWord: 'book.',
    lede: 'GP clinics, physio, dental, chiro, psychology and skin clinics. A calm, clear site that patients trust and book from. Live in days.',
    cardLine: 'GP, physio, dental, chiro and allied health.',
    video: 'clinics',
    card: 'card-clinics',
    popular: 'growth',
    demoName: 'Northside Physio',
    demoHeadline: 'Move better. Book today.',
    demoCta: 'Book online',
    problems: [
      { problem: 'Patients can’t book outside opening hours.', fix: 'Online booking linked to your practice software, on every page.' },
      { problem: 'Your site is hard to read on a phone.', fix: 'A mobile-first layout with services, practitioners and fees laid out plainly.' },
      { problem: 'You’re worried about what you’re allowed to say.', fix: 'Copy checked against your market’s health advertising rules before launch.' },
    ],
    features: [
      { title: 'Online booking', body: 'Links to Cliniko, HotDoc, Jane, Nookal and most practice software.' },
      { title: 'Practitioner profiles', body: 'Each clinician with their photo, qualifications and the conditions they treat.' },
      { title: 'Service pages', body: 'One page per treatment, written for patients, not search engines.' },
      { title: 'Intake forms', body: 'New-patient forms with conditional questions, sent before the first visit.' },
      { title: 'Fees and funding', body: 'Fees, rebates, insurance and funding schemes explained in one place.' },
      { title: 'Compliant copy', body: 'No testimonials where the rules forbid them. No claims we can’t back.' },
    ],
    faqs: [
      { q: 'Which booking systems do you connect to?', a: 'Cliniko, HotDoc, HealthEngine, Jane, Nookal, Halaxy, Dentally and most others with a booking link or widget. Booking links are included in Growth and Pro.' },
      { q: 'Do you know the health advertising rules?', a: 'Yes. Clinic copy is checked against the rules for your market before launch, including AHPRA guidance in Australia and CQC and ASA guidance in the UK.' },
      { q: 'Can we show each practitioner?', a: 'Yes. Practitioner profiles are standard on every clinic site, with photo, qualifications and areas of interest.' },
      { q: 'How long does it take?', a: 'Two to four working days after the content call. Most clinic sites go live in three or four.' },
      { q: 'Can patients fill in intake forms online?', a: 'Yes. An intake form with conditional logic is available as a Tool M. Try the demo on the Tools page.' },
      { q: 'Is patient data stored on the website?', a: 'No. Booking happens in your practice software. Intake tools send submissions securely to you and don’t keep clinical records on the site.' },
    ],
  },
  {
    key: 'property',
    label: 'Property',
    path: '/property',
    title: 'Strata, block and HOA management website design | Hitch Studio',
    description: 'Websites for strata managers (AU), block management firms (UK), HOA management companies (US), property managers and agencies. Fixed price, live in days.',
    eyebrow: '03 — Property services',
    headline: 'Websites for the people who look after buildings.',
    hlWord: 'buildings.',
    lede: 'Strata and owners corporation managers, block management firms, HOA management companies, property managers and boutique agencies. Live in days.',
    cardLine: 'Strata, block and HOA management, agencies and maintenance.',
    video: 'property',
    card: 'card-property',
    popular: 'pro',
    demoName: 'Harbourline Strata',
    demoHeadline: 'Buildings, well looked after.',
    demoCta: 'Request a proposal',
    localTerms: [
      { market: 'Australia', term: 'Strata and owners corporation management' },
      { market: 'United Kingdom', term: 'Block management' },
      { market: 'United States', term: 'HOA management' },
    ],
    problems: [
      { problem: 'Owners committees judge you before they call.', fix: 'A site that shows your buildings, your team and how you report, before the first meeting.' },
      { problem: 'Residents ring the office for everything.', fix: 'Clear pages for repairs, levies and documents, with forms that route to the right person.' },
      { problem: 'You cover several areas and only rank in one.', fix: 'Location pages and up to three Google Business Profiles on the Pro package.' },
    ],
    features: [
      { title: 'Proposal requests', body: 'A form for committees and owners that captures the building, lots and current manager.' },
      { title: 'Repair requests', body: 'A simple maintenance form residents can use from a phone, routed by building.' },
      { title: 'Portfolio pages', body: 'The buildings you look after, with photos and the services you provide.' },
      { title: 'Location pages', body: 'One page per area you manage in, so you show up where you work.' },
      { title: 'Document links', body: 'Links to your owner portal, levy notices and by-laws. No logins on the site.' },
      { title: 'Team profiles', body: 'Your managers, their buildings and how to reach them.' },
    ],
    faqs: [
      { q: 'Do you work with strata, block and HOA managers?', a: 'Yes. We build for strata and owners corporation managers in Australia, block management firms in the UK and HOA management companies in the US, plus property managers and boutique agencies.' },
      { q: 'Can residents log in to see documents?', a: 'Hitch sites don’t include logins. We link to your existing owner portal. Client portals go to Rope Digital, our parent studio.' },
      { q: 'Can maintenance requests go to the right manager?', a: 'Yes. Pro includes routing by service. A full job-request flow with an admin view is available as a Tool L.' },
      { q: 'We manage buildings in several areas. Can we rank in each?', a: 'Yes. Pro includes location pages and up to three Google Business Profile locations.' },
      { q: 'How long does it take?', a: 'Two to four working days after the content call. Most property sites go live in three or four.' },
      { q: 'Can you list our properties for sale or rent?', a: 'We link to your listings on the major portals. Large listing feeds go to Rope Digital.' },
    ],
  },
];

export const pricingFaqs = [
  { q: 'How do I pay?', a: '50% when you sign, 50% at launch. You pay Rope Digital LLC, trading as Hitch Studio, in USD by card or bank transfer through a Stripe link sent with your quote.' },
  { q: 'Why are prices in USD?', a: 'One price list for Australia, the UK and the US keeps things fair and simple. Your bank converts at the day’s rate. All prices on this site are in US dollars.' },
  { q: 'Is care required?', a: 'Yes, for the first 12 months. It covers hosting, security, backups and edits. After 12 months, care rolls monthly with 30 days’ notice.' },
  { q: 'What happens if I leave care?', a: 'You get a full export of your site. We never hold a site hostage.' },
  { q: 'What isn’t included?', a: 'Hitch does websites and AI, nothing else. So no paid ads, ongoing SEO campaigns, social media, branding, photo shoots or online shops. Custom tools and AI work are priced separately.' },
  { q: 'What goes to Rope Digital?', a: 'Sites over 20 pages, online shops, web apps, client portals and logins, and tools larger than Tool L. Rope Digital is our parent studio and quotes those separately.' },
  { q: 'Do you offer discounts?', a: 'No. Everyone pays the same fair price. If budget is tight, we’ll recommend a smaller package or a staged add-on.' },
  { q: 'Can I upgrade later?', a: 'Yes. An Essential client can move to Growth within 6 months and pay only the difference.' },
  { q: 'Do prices include GST or VAT?', a: 'Prices are shown before any local sales tax. Your quote shows exactly what applies in your market.' },
];

export const toolChecklist = [
  { q: 'How many screens or steps?', s: '1', m: 'Up to 3', l: 'Up to 6' },
  { q: 'Does it save data?', s: 'No', m: 'Saved and emailed', l: 'Stored, with an admin view' },
  { q: 'How many integrations?', s: 'None', m: '1', l: 'Up to 2, or one API' },
];

export const sectorByKey = Object.fromEntries(sectors.map((s) => [s.key, s])) as Record<SectorKey, Sector>;

// ---------------------------------------------------------------------------
// AI implementation: embedding AI agents and automation into existing businesses.
// OPEN DECISION: set prices. Each stage shows "Quoted after the audit" until a
// number is set here (USD, same as the website menu).
// ---------------------------------------------------------------------------

export const aiStages = [
  {
    key: 'audit',
    name: 'Audit',
    time: '1–2 weeks',
    price: null as number | null,
    priceNote: 'Fixed price, credited to the pilot',
    short: 'We find the jobs AI should be doing in your business.',
    body: 'We sit with your team, map how work really moves, and look at your systems, inbox and data. You get a ranked list of workflows to automate, with the hours each one saves, the risk and a fixed price for the first pilot.',
    you: 'Two or three short sessions with the people who do the work. Read-only access to the tools involved.',
  },
  {
    key: 'pilot',
    name: 'Pilot',
    time: '2–4 weeks',
    price: null as number | null,
    priceNote: 'Fixed price, agreed at the audit',
    short: 'One agent, one workflow, live with real work.',
    body: 'We build one AI agent for the top workflow, connect it to your real systems and run it alongside your team with a person approving every action. We measure it against the baseline from the audit.',
    you: 'One owner on your side who reviews the agent’s work for a few minutes a day.',
  },
  {
    key: 'embed',
    name: 'Embed',
    time: '4–8 weeks',
    price: null as number | null,
    priceNote: 'Fixed price per workflow',
    short: 'Roll it out, connect it up, train the team.',
    body: 'Once the pilot proves itself, we widen it: more workflows, more systems, approval rules that match your risk, and training so your team knows how to work with it, correct it and switch it off.',
    you: 'A training session per team. Sign-off on what the agent can do without asking.',
  },
  {
    key: 'run',
    name: 'Run',
    time: 'Monthly',
    price: null as number | null,
    priceNote: 'Monthly, per agent',
    short: 'We watch it, test it and keep improving it.',
    body: 'Monitoring, monthly accuracy tests against real cases, model and prompt updates, new integrations as your tools change, and a monthly report on hours saved and errors caught.',
    you: 'Flag anything odd. We handle the rest.',
  },
];

export const aiUseCases = [
  { title: 'Enquiries and leads', body: 'An agent that answers website, email and phone enquiries from your own content, qualifies them and books the call or routes the job.' },
  { title: 'Inbox and admin', body: 'Reads incoming email and documents, sorts them, drafts replies and files the details into the right system.' },
  { title: 'Quotes and paperwork', body: 'Turns a call, a form or a site photo into a draft quote, report or proposal for a person to check and send.' },
  { title: 'Internal knowledge', body: 'An assistant trained on your procedures, policies and past jobs, so new staff stop asking the same five questions.' },
  { title: 'Data entry and handoffs', body: 'Moves information between your CRM, accounting, practice or job software, so nobody retypes it.' },
  { title: 'Reporting', body: 'Pulls numbers from your systems into a plain-English weekly summary, with the exceptions flagged.' },
];

export const aiPrinciples = [
  'We start with the work, not the tech. If a workflow doesn’t need AI, we tell you.',
  'A person approves every action until the numbers say otherwise, and you decide when that is.',
  'Built into the tools you already pay for. No new platform for your team to learn.',
  'Your data stays in your accounts. We use providers that don’t train on it, and log every action the agent takes.',
  'Every agent has an off switch, a named owner and a monthly accuracy test.',
  'You own the prompts, workflows and integrations we build. Leave, and you take them with you.',
];

export const aiFaqs = [
  { q: 'What does “agentic AI” actually mean?', a: 'An AI that does a job, not just answers a question. It reads the email, checks the CRM, drafts the reply and books the call, inside rules you set and with a person approving what matters.' },
  { q: 'Do we need a Hitch website to use this?', a: 'No. AI implementation is a separate service for existing businesses, whatever your website. If we built your site, the enquiry agent plugs straight into it.' },
  { q: 'Which systems can you connect to?', a: 'Most tools with an API or a solid integration: Google Workspace and Microsoft 365, HubSpot, Salesforce and most CRMs, Xero and QuickBooks, Slack and Teams, practice software such as Cliniko, and job tools such as ServiceM8, Tradify and simPRO. We confirm every integration at the audit.' },
  { q: 'Which AI models do you use?', a: 'Whichever suits the job, from the major providers, on business terms that don’t train on your data. We can switch models later without rebuilding the workflow.' },
  { q: 'What about privacy and compliance?', a: 'Data stays in your accounts where possible, access is limited to what the agent needs, and every action is logged. For clinics and other regulated work we design around your market’s rules, and keep clinical decisions with clinicians.' },
  { q: 'What if the AI gets something wrong?', a: 'That’s why a person approves actions during the pilot, and why we test accuracy every month. Mistakes get caught, logged and used to tighten the rules.' },
  { q: 'Will this replace our staff?', a: 'It replaces the retyping, chasing and sorting. Most clients use the hours to answer customers faster and take on more work with the team they have.' },
  { q: 'How do we start?', a: 'Book a call. If there’s a fit, we start with the audit, which gives you a fixed price for the pilot before you commit to anything more.' },
];
