import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = {};
fs.readFileSync('.env.local','utf8').split(/\n/).forEach(line => {
  if (line.trim().startsWith('#') || !line.includes('=')) return;
  const idx = line.indexOf('=');
  env[line.slice(0,idx).trim()] = line.slice(idx+1).trim().replace(/^['"]|['"]$/g,'');
});

const c = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {auth:{persistSession:false}});

const updates = [
  {
    slug: 'oled-vs-lcd-comparison-guide',
    seo_title: 'OLED vs LCD Phone Screens: 2026 Technical Comparison Guide',
    seo_desc: 'Compare OLED vs LCD mobile displays across brightness, power, cost, lifespan and repair. See which screen tech wins for 2026 with data from 3,000+ tests.',
  },
  {
    slug: 'why-are-mobile-phone-battery-replacement-safety-standards-critical-for-your-device-and-personal-safety',
    seo_title: 'Phone Battery Safety Standards: UL 2054 vs IEC 62133 (2026)',
    seo_desc: '88% of aftermarket phone batteries fail key safety tests. See which standards (UL 2054, IEC 62133, UN 38.3) keep users safe and your business protected.',
  },
  {
    slug: 'why-risk-your-business-on-single-source-display-suppliers',
    seo_title: 'Phone LCD Multi-Source Supply: Cut Risk, Secure MOQ (2026)',
    seo_desc: 'One supplier delay = lost orders. See how multi-source LCD sourcing covers 500+ models at low MOQ with 2-day shipping. Real cost breakdown inside.',
  },
  {
    slug: 'are-chinese-phone-parts-suppliers-really-worth-the-risk-the-truth-about-quality-vs-cost-trade-offs',
    seo_title: 'China Phone Parts: 50% Cheaper but Worth the Risk?',
    seo_desc: 'Chinese phone parts run 50% cheaper than Western distributors, but defect rates vary 3–18%. See which supplier tiers deliver quality and which waste $10k+.',
  },
  {
    slug: 'are-substandard-mobile-batteries-killing-your-repair-business-the-complete-guide-to-sourcing-certified-mobile-phone-batteries-for-professional-success',
    seo_title: 'Certified Phone Batteries Sourcing Guide for Repair Shops',
    seo_desc: 'Substandard batteries cause 40% of repair callbacks. See exactly which IEC/UL certified battery suppliers pass QC and how to vet them in 5 minutes.',
  },
  {
    slug: 'how-do-you-choose-high-quality-screen-replacement-parts-for-your-phone',
    seo_title: 'How to Pick Quality Phone Screens: A $150 Lesson',
    seo_desc: 'Spent $150 on a bad phone screen? Learn the 7 checks pros use to identify OEM-grade screens before ordering. Real teardown photos included.',
  },
  {
    slug: 'how-can-you-capitalize-on-the-4552b-mobile-repair-boom-with-premium-wholesale-strategies',
    seo_title: '$45.52B Phone Repair Boom: Wholesale Strategy Guide 2026',
    seo_desc: 'Phone repair market hits $45.52B by 2035. See the wholesale parts strategy winning shops use to capture 30%+ margins before the boom peaks.',
  },
  {
    slug: 'how-can-you-find-trustworthy-wholesale-suppliers-for-mobile-phone-repair-parts-the-complete-quality-control-guide',
    seo_title: 'Trustworthy Phone Parts Wholesalers: 12-Point Vetting Guide',
    seo_desc: 'Use this 12-point supplier vetting checklist—certifications, defect rates, MOQ, warranty—to avoid the top 5 scams costing repair shops $5k+ per order.',
  },
  {
    slug: 'the-3-minute-iphone-oled-test-that-saved-me-12000-in-bad-screens',
    seo_title: '3-Minute iPhone OLED Test: Save $12K from Bad Screens',
    seo_desc: "A Huaqiangbei expert's 3-step test catches fake iPhone OLED screens in 3 minutes: black room + PWM + Chinese phrases. Saved 50 shops $12K each.",
  },
  {
    slug: 'iphone-screen-replacement-cost-uk-guide-2026',
    seo_title: 'iPhone Screen Repair Cost UK: £25–£599 by Model (2026)',
    seo_desc: 'iPhone screen replacement in the UK ranges from £25 (AppleCare+) to £599 (15 Pro Max). See every model’s repair cost: Apple, shop and wholesale.',
  },
  {
    slug: 'iphone-se-screen-replacement-budget-friendly-repair-guide',
    seo_title: 'iPhone SE Screen Replacement: From £5 (All 3 Generations)',
    seo_desc: '3 iPhone SE generations use 3 different screens. Order the wrong one = £10 waste per unit. See which SE you have and which screen fits in 30 seconds.',
  },
  {
    slug: 'samsung-galaxy-s24-screen-replacement-uk',
    seo_title: 'Samsung S24 Screen Replacement UK: £75 vs £225 True Cost',
    seo_desc: 'Cheap £75 Samsung S24 screens kill the ultrasonic fingerprint sensor, costing £150+ in callbacks. See which AMOLED grade saves money long-term.',
  },
];

console.log('Processing', updates.length, 'posts...\n');
let ok = 0, err = 0;
for (const u of updates) {
  const { data: cur } = await c.from('posts').select('meta').eq('slug', u.slug).maybeSingle();
  if (!cur) { console.log('❌ NOT FOUND:', u.slug.slice(0,60)); err++; continue; }
  const newMeta = {
    ...(cur.meta || {}),
    seo: { ...(cur.meta?.seo || {}), title: u.seo_title, description: u.seo_desc },
  };
  const { error } = await c.from('posts').update({ meta: newMeta }).eq('slug', u.slug);
  if (error) { console.log('❌ ERR:', u.slug.slice(0,60), error.message); err++; }
  else { console.log('✅', u.seo_title); ok++; }
}
console.log(`\nDone. ok=${ok} err=${err}`);
