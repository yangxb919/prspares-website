export type QuoteLine = {
  model: string;
  category: string;
  name: string;
  source: string;
  image: string;
  tiers: readonly [string, string, string];
  note: string;
};

export type ProductCategoryPageData = {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  heroImage: string;
  quoteProduct: string;
  metrics: ReadonlyArray<{
    value: string;
    label: string;
    detail: string;
  }>;
  coverage: ReadonlyArray<{
    title: string;
    value: string;
    text: string;
  }>;
  quoteLines: ReadonlyArray<QuoteLine>;
  buyingNotes: ReadonlyArray<string>;
  workflow: ReadonlyArray<{
    title: string;
    text: string;
  }>;
};

export const productCategoryPages = {
  screens: {
    slug: 'screens',
    eyebrow: 'Screen Catalog',
    title: 'Wholesale iPhone & Samsung Screens — LCD, OLED, Incell from $9',
    intro:
      'Screen inventory should be presented by buyer workflow, not by retail product cards. This page uses the April 2026 catalog to show screen depth, quality lanes and representative quote options.',
    heroImage: '/hero/products-screens.jpg',
    quoteProduct: 'LCD and OLED Screens',
    metrics: [
      { value: '5,263', label: 'screen SKUs', detail: 'Screen Assembly plus Screen Assembly with Frame' },
      { value: '4,493', label: 'assemblies', detail: 'LCD, OLED, Incell, TFT and original options' },
      { value: '770', label: 'with-frame SKUs', detail: 'Useful for faster shop installation workflows' },
      { value: '10/50/200', label: 'price tiers', detail: 'Tiered wholesale quote logic' },
    ],
    coverage: [
      { title: 'Apple iPhone', value: 'iPhone 17 to legacy', text: 'iPhone Pro Max, Pro, Plus, Air and older series organized for grade comparison.' },
      { title: 'Samsung Galaxy', value: 'A / S / Tab / Z', text: 'High-volume Galaxy A SKUs plus premium S, foldable and tablet repair demand.' },
      { title: 'Android long tail', value: 'Google, Xiaomi, OPPO, Vivo', text: 'Pixel, Redmi, POCO, Reno, Vivo X/Y and OnePlus screen SKUs for mixed orders.' },
      { title: 'Quality lanes', value: 'OLED / TFT / Incell', text: 'The page explains buying lanes so buyers can ask for grade, MOQ and warranty together.' },
    ],
    quoteLines: [
      {
        model: 'Apple iPhone 16 Pro Max',
        category: 'Screen Assembly',
        name: 'Original LTPO Super Retina XDR OLED LCD Assembly',
        source: 'iPhone catalog / iPhone 16 Pro Max',
        image: 'https://pub-3d088e9c8cac4da89ab00382fa664592.r2.dev/products/IP6P0048.jpg',
        tiers: ['$242.31', '$238.62', '$238.62'],
        note: 'Hot iPhone flagship screen line for premium repair orders.',
      },
      {
        model: 'Samsung Galaxy S24 Ultra',
        category: 'Screen Assembly',
        name: 'Original LCD Touch Assembly',
        source: 'Samsung catalog / Galaxy S24 Ultra',
        image: '/images/home-redesign/category-screens.png',
        tiers: ['$182.23', '$179.45', '$179.45'],
        note: 'Samsung S Ultra SKU added from the Galaxy hot model catalog.',
      },
      {
        model: 'Xiaomi Redmi Note 10 Pro',
        category: 'Screen Assembly',
        name: 'Original OLED LCD Touch Assembly',
        source: 'Xiaomi catalog / Redmi Note line',
        image: 'https://pub-3d088e9c8cac4da89ab00382fa664592.r2.dev/products/SPS2642.jpg',
        tiers: ['$67.47', '$65.76', '$65.76'],
        note: 'Redmi Note is a high-volume Android repair family for mixed orders.',
      },
      {
        model: 'OPPO Reno13',
        category: 'Screen Assembly',
        name: 'Original AMOLED LCD Touch Assembly',
        source: 'Vivo-OPPO catalog / OPPO Reno Series',
        image: 'https://pub-3d088e9c8cac4da89ab00382fa664592.r2.dev/products/RPS0914.jpg',
        tiers: ['$48.89', '$47.89', '$47.40'],
        note: 'Reno series is shown as a hot OPPO buying lane.',
      },
      {
        model: 'Google Pixel 9 Pro',
        category: 'Screen Assembly',
        name: 'Original OLED LCD Touch Assembly',
        source: 'Google catalog / Pixel 9 Series',
        image: 'https://pub-3d088e9c8cac4da89ab00382fa664592.r2.dev/products/EDA006982803.jpg',
        tiers: ['$144.80', '$142.59', '$142.59'],
        note: 'Pixel 9 Pro keeps Google flagship buyers visible on the screen page.',
      },
    ],
    buyingNotes: [
      'Ask buyers to send model, screen grade, frame requirement and target quantity in one list.',
      'Show screen grades as procurement choices instead of standalone retail products.',
      'Keep final availability and warranty confirmation inside the quote conversation.',
    ],
    workflow: [
      { title: 'Collect model list', text: 'Buyer sends iPhone, Samsung and Android models with expected monthly quantity.' },
      { title: 'Match grade lane', text: 'Sales maps each model to OLED, Incell, TFT, original or with-frame options.' },
      { title: 'Confirm quote', text: 'Quote returns 10+ / 50+ / 200+ tiers, packing detail and dispatch plan.' },
    ],
  },
  batteries: {
    slug: 'batteries',
    eyebrow: 'Battery Catalog',
    title: 'Wholesale Phone Batteries — iPhone, Samsung, Huawei from $4.62',
    intro:
      'Battery pages need to show model depth, packing discussion and quote tiers. This design keeps batteries as a procurement lane instead of a retail listing.',
    heroImage: '/hero/products-batteries.jpg',
    quoteProduct: 'Phone Batteries',
    metrics: [
      { value: '1,500', label: 'battery SKUs', detail: 'Battery SKUs across product and device catalogs' },
      { value: '432', label: 'battery models', detail: 'Dedicated phone-battery model coverage' },
      { value: 'Apple + Android', label: 'brand coverage', detail: 'iPhone, Samsung, Huawei, Xiaomi, Google and more' },
      { value: 'DG route', label: 'packing logic', detail: 'Battery quotes need shipping and documentation confirmation' },
    ],
    coverage: [
      { title: 'iPhone batteries', value: '15 Pro Max and older', text: 'Standard and high-capacity SKUs can be quoted from the same buyer list.' },
      { title: 'Samsung batteries', value: 'Galaxy A / S / Tab', text: 'Repair shops can add common Galaxy battery SKUs to screen orders.' },
      { title: 'Android batteries', value: 'Google, Xiaomi, Huawei', text: 'Pixel, Mi, Redmi, Honor and Huawei SKUs support long-tail repair demand.' },
      { title: 'Packing support', value: 'UN38.3 discussion', text: 'Keep route, quantity, carton and documentation as part of the quote flow.' },
    ],
    quoteLines: [
      {
        model: 'iPhone 15 Pro Max',
        category: 'Battery',
        name: '4422mAh Replacement Battery',
        source: 'Phone-Battery catalog / Other Brands Battery',
        image: 'https://pub-3d088e9c8cac4da89ab00382fa664592.r2.dev/products/EDA006362401.jpg',
        tiers: ['$9.48', '$9.28', '$9.09'],
        note: 'Flagship iPhone SKU with clear 10+ / 50+ / 200+ tiers.',
      },
      {
        model: 'Samsung Galaxy S23 FE',
        category: 'Battery',
        name: '4370mAh Battery EB-BS711ABY',
        source: 'Phone-Battery catalog / Other Brands Battery',
        image: 'https://pub-3d088e9c8cac4da89ab00382fa664592.r2.dev/products/SPA4337.jpg',
        tiers: ['$4.62', '$4.52', '$4.43'],
        note: 'Samsung FE battery line is more relevant than the previous A03 sample.',
      },
      {
        model: 'Xiaomi Redmi Note 10 Pro',
        category: 'Battery',
        name: 'BM57 5020mAh Li-Polymer Battery',
        source: 'Phone-Battery catalog / Xiaomi Battery',
        image: 'https://pub-3d088e9c8cac4da89ab00382fa664592.r2.dev/products/EDA003356913.jpg',
        tiers: ['$6.00', '$6.00', '$6.00'],
        note: 'Redmi Note battery SKU represents a common Android repair family.',
      },
      {
        model: 'Google Pixel 9 Pro XL',
        category: 'Battery',
        name: '5060mAh Original Battery',
        source: 'Phone-Battery catalog / Google Battery',
        image: 'https://pub-3d088e9c8cac4da89ab00382fa664592.r2.dev/products/SPS9839.jpg',
        tiers: ['$7.85', '$7.69', '$7.53'],
        note: 'Pixel 9 battery SKUs help capture newer Google repair demand.',
      },
      {
        model: 'Huawei Mate 50 Pro',
        category: 'Battery',
        name: 'HB546779EGW 4600mAh Original Replacement Battery',
        source: 'Phone-Battery catalog / Huawei Battery',
        image: 'https://pub-3d088e9c8cac4da89ab00382fa664592.r2.dev/products/EDA008039301.jpg',
        tiers: ['$11.37', '$11.14', '$11.02'],
        note: 'Huawei Mate line keeps regional hot-selling battery demand visible.',
      },
    ],
    buyingNotes: [
      'Battery buyers should include model number, target capacity, destination country and preferred shipping route.',
      'The page avoids instant checkout because DG packing and route confirmation affect the final quote.',
      'Battery SKUs are best paired with screen and small-part stock replenishment lists.',
    ],
    workflow: [
      { title: 'Check destination', text: 'Confirm country, quantity and whether the shipment needs DG documentation.' },
      { title: 'Match model SKUs', text: 'Map buyer models to Apple, Samsung, Google, Xiaomi and other battery catalogs.' },
      { title: 'Quote route and tiers', text: 'Return unit tiers with packing note, dispatch window and carrier options.' },
    ],
  },
  smallParts: {
    slug: 'small-parts',
    eyebrow: 'Small Parts Catalog',
    title: 'Wholesale Phone Small Parts — Cameras, Charging Ports & Flex Cables',
    intro:
      'Small parts are the deepest part of the catalog, so the page needs a structured procurement map: flex, camera, charging, housing, SIM tray and speaker SKUs.',
    heroImage: '/hero/products-small-parts.jpg',
    quoteProduct: 'Small Parts',
    metrics: [
      { value: '14,000+', label: 'small-part SKUs', detail: 'Largest operational category in the catalog' },
      { value: '2,861', label: 'flex SKUs', detail: 'Power, volume, LCD, antenna and internal flex cables' },
      { value: '2,797', label: 'housing SKUs', detail: 'Back cover, frame, mid-frame and adhesive options' },
      { value: '1,886', label: 'charging SKUs', detail: 'Charging ports plus charging port boards' },
    ],
    coverage: [
      { title: 'Cameras', value: 'Rear, front, lens', text: 'Rear camera, front camera and camera lens SKUs for common repair faults.' },
      { title: 'Charging', value: 'Ports and boards', text: 'Charging sub boards, connector ports and related flex SKUs.' },
      { title: 'Housing', value: 'Back cover and frame', text: 'Back covers, mid frames, camera rings and adhesive options.' },
      { title: 'High-frequency smalls', value: 'SIM, speaker, flex', text: 'SIM trays, loudspeakers, earpieces, power and volume flex lines.' },
    ],
    quoteLines: [
      {
        model: 'Apple iPhone 16 Pro Max',
        category: 'Rear Camera',
        name: 'iPhone 16 Pro Max Rear Camera',
        source: 'iPhone catalog / iPhone 16 Pro Max',
        image: 'https://pub-3d088e9c8cac4da89ab00382fa664592.r2.dev/products/EDA007201704.jpg',
        tiers: ['$45.13', '$44.21', '$43.75'],
        note: 'High-value camera SKU for premium repair shops.',
      },
      {
        model: 'Samsung Galaxy S24 Ultra',
        category: 'Charging Port',
        name: 'Original Charging Port Board',
        source: 'Samsung catalog / Galaxy S24 Ultra',
        image: '/images/home-redesign/category-small-parts.png',
        tiers: ['$11.30', '$11.07', '$10.95'],
        note: 'S24 Ultra charging board adds Samsung flagship demand to small parts.',
      },
      {
        model: 'OPPO Reno13 Pro',
        category: 'Charging Port Board',
        name: 'Original Charging Port Sub Board Card',
        source: 'Vivo-OPPO catalog / OPPO Reno Series',
        image: 'https://pub-3d088e9c8cac4da89ab00382fa664592.r2.dev/products/EDA008436002.jpg',
        tiers: ['$7.45', '$7.30', '$7.14'],
        note: 'Charging board SKUs help show OPPO/Vivo coverage depth.',
      },
      {
        model: 'Xiaomi Redmi Note 10 Pro',
        category: 'Back Cover / Housing',
        name: 'Original Back Battery Cover',
        source: 'Xiaomi catalog / Redmi Note line',
        image: 'https://pub-3d088e9c8cac4da89ab00382fa664592.r2.dev/products/SPS2193LL.jpg',
        tiers: ['$5.88', '$5.76', '$5.64'],
        note: 'Redmi Note housing SKUs are common add-ons for Android repair shops.',
      },
      {
        model: 'Google Pixel 9 Pro',
        category: 'Rear Camera',
        name: 'Original Camera Set + Rear Main Camera',
        source: 'Google catalog / Pixel 9 Series',
        image: 'https://pub-3d088e9c8cac4da89ab00382fa664592.r2.dev/products/SPA4742.jpg',
        tiers: ['$33.85', '$33.16', '$32.81'],
        note: 'Pixel camera parts are high-value long-tail items for mixed quotes.',
      },
    ],
    buyingNotes: [
      'Use the page to guide buyers into category-based mixed lists rather than one-off SKU browsing.',
      'Small parts should be quoted with model, color/version, grade and expected repeat quantity.',
      'The strongest CTA is to upload or paste a repair-shop replenishment list.',
    ],
    workflow: [
      { title: 'Group by fault type', text: 'Buyer lists charging, camera, flex, speaker, SIM and housing requirements.' },
      { title: 'Confirm model version', text: 'Sales checks compatible model, color/version and region-specific part differences.' },
      { title: 'Build mixed quote', text: 'Quote combines low-value smalls with high-value screens or cameras for efficient shipping.' },
    ],
  },
  iphoneCameras: {
    slug: 'iphone-rear-camera-wholesale',
    eyebrow: 'Small Parts / Camera Modules',
    title: 'Wholesale iPhone Camera Modules and Lens Parts',
    intro:
      'Camera parts belong inside the small-parts buying lane. This page turns the iPhone catalog into a focused quote page for rear camera modules, front cameras, camera lenses and ring-frame parts.',
    heroImage: '/images/home-redesign/category-small-parts.png',
    quoteProduct: 'iPhone Camera Modules',
    metrics: [
      { value: 'iPhone 11-16', label: 'model families', detail: 'Camera SKUs grouped for current repair-shop demand' },
      { value: '2,522', label: 'camera-related SKUs', detail: 'Rear camera, front camera, lens and camera categories' },
      { value: '772', label: 'rear camera SKUs', detail: 'High-value camera modules across phone catalogs' },
      { value: '10/50/200', label: 'price tiers', detail: 'Tiered wholesale quote logic' },
    ],
    coverage: [
      { title: 'Rear modules', value: 'Pro / Pro Max demand', text: 'High-value rear camera modules need exact model confirmation before quote.' },
      { title: 'Front cameras', value: 'Face ID workflow', text: 'Front camera SKUs should be discussed with repair workflow and compatibility notes.' },
      { title: 'Lens and rings', value: 'Low-cost repeat parts', text: 'Camera lens, ring frame and bracket SKUs are useful add-ons for mixed small-part lists.' },
      { title: 'Small-part bundles', value: 'Camera + housing', text: 'Camera orders often pair with back covers, adhesive, brackets and tools for one repair batch.' },
    ],
    quoteLines: [
      {
        model: 'Apple iPhone 16 Pro Max',
        category: 'Rear Camera',
        name: 'iPhone 16 Pro Max Rear Camera',
        source: 'iPhone catalog / iPhone 16 Pro Max',
        image: 'https://pub-3d088e9c8cac4da89ab00382fa664592.r2.dev/products/EDA007201704.jpg',
        tiers: ['$45.13', '$44.21', '$43.75'],
        note: 'Current flagship camera module SKU for premium repair shops.',
      },
      {
        model: 'Apple iPhone 16 Pro / 16 Pro Max',
        category: 'Rear Camera Lens',
        name: 'Rear Camera Lens Replacement',
        source: 'iPhone catalog / iPhone 16 Pro Max',
        image: 'https://pub-3d088e9c8cac4da89ab00382fa664592.r2.dev/products/IP6P0041.jpg',
        tiers: ['$0.70', '$0.67', '$0.65'],
        note: 'Low-cost lens cover SKU that repair shops often add to camera and housing orders.',
      },
      {
        model: 'Apple iPhone 16 Pro Max',
        category: 'Front Camera',
        name: 'iPhone 16 Pro Max Front Camera',
        source: 'iPhone catalog / iPhone 16 Pro Max',
        image: 'https://pub-3d088e9c8cac4da89ab00382fa664592.r2.dev/products/EDA007201801.jpg',
        tiers: ['$18.01', '$17.64', '$17.46'],
        note: 'Front camera demand should be quoted with compatibility and repair workflow notes.',
      },
      {
        model: 'Apple iPhone 14 Pro Max',
        category: 'Rear Camera',
        name: 'Original Rear Camera',
        source: 'iPhone catalog / iPhone 14 Pro Max',
        image: 'https://pub-3d088e9c8cac4da89ab00382fa664592.r2.dev/products/IP4P0050.jpg',
        tiers: ['$41.37', '$40.52', '$40.10'],
        note: 'Mature Pro Max model with steady repair-shop replacement demand.',
      },
      {
        model: 'Apple iPhone 13 Pro Max',
        category: 'Rear Camera',
        name: 'iPhone 13 Pro Max Rear Camera',
        source: 'iPhone catalog / iPhone 13 Pro Max',
        image: 'https://pub-3d088e9c8cac4da89ab00382fa664592.r2.dev/products/IP130045.jpg',
        tiers: ['$57.13', '$55.68', '$55.68'],
        note: 'High-value older flagship SKU for shops that still service heavy iPhone 13 volume.',
      },
      {
        model: 'Apple iPhone 16 Pro Max',
        category: 'Camera Ring Frame',
        name: 'Original Camera Ring Frame with Lens',
        source: 'iPhone catalog / iPhone 16 Pro Max',
        image: 'https://pub-3d088e9c8cac4da89ab00382fa664592.r2.dev/products/SPS8627B.jpg',
        tiers: ['$5.06', '$4.95', '$4.85'],
        note: 'Useful small add-on line when buyers also request back covers or camera lens parts.',
      },
    ],
    buyingNotes: [
      'Ask camera buyers for exact iPhone model, rear/front position, lens-only or full-module need and target quantity.',
      'Keep this page quote-led because camera compatibility, pull grade and testing status affect the final offer.',
      'Camera modules are best presented as a small-parts subcategory, not a standalone ecommerce collection.',
    ],
    workflow: [
      { title: 'Separate module from lens', text: 'Confirm whether the buyer needs a complete camera module, front camera, lens cover or ring frame.' },
      { title: 'Check exact model', text: 'Pro, Pro Max, Plus and base models can use different camera parts, so model matching comes first.' },
      { title: 'Build small-part quote', text: 'Combine camera SKUs with adhesive, brackets, housing and tools when the buyer sends a mixed repair list.' },
    ],
  },
  tabletWatch: {
    slug: 'tablet-watch',
    eyebrow: 'Tablet & Watch Catalog',
    title: 'Wholesale Tablet & Smartwatch Repair Parts — iPad, Galaxy Tab, Apple Watch',
    intro:
      'Tablet and smartwatch repair buyers need exact model matching before price confirmation. This page groups iPad, Galaxy Tab, Apple Watch and Android wearable parts into one quote-ready lane.',
    heroImage: '/hero/products-tablet-watch.jpg',
    quoteProduct: 'Tablet & Smartwatch Repair Parts',
    metrics: [
      { value: '1,800+', label: 'tablet & watch SKUs', detail: 'iPad, Galaxy Tab and smartwatch repair coverage' },
      { value: '1,000', label: 'iPad SKUs', detail: 'Screens, batteries, flex cables and camera parts' },
      { value: '800', label: 'smartwatch SKUs', detail: 'Apple Watch, Galaxy Watch, Huawei, Garmin and Fitbit lines' },
      { value: '10/50/200', label: 'price tiers', detail: 'Tiered wholesale quote logic' },
    ],
    coverage: [
      { title: 'iPad repair parts', value: 'Pro / Air / mini', text: 'Screens, batteries, flex cables, housings and camera parts for Apple tablet repair demand.' },
      { title: 'Galaxy Tab parts', value: 'Tab S / A lines', text: 'Samsung tablet displays, batteries, charging parts and flex cables for mixed repair lists.' },
      { title: 'Apple Watch parts', value: 'Display and battery', text: 'Smartwatch repair orders need model, size, generation and display version confirmed before quote.' },
      { title: 'Android wearables', value: 'Galaxy / Huawei / Garmin', text: 'Long-tail smartwatch demand can be bundled with tablet or phone repair replenishment orders.' },
    ],
    quoteLines: [
      // TODO: Replace quote placeholders with exact tablet/watch prices when verified source catalog data is available.
      {
        model: 'Apple iPad Pro',
        category: 'Tablet Screen / Battery',
        name: 'iPad Pro display, battery and flex cable repair parts',
        source: 'Tablet catalog / iPad Pro',
        image: '/images/ipad-screens.jpg',
        tiers: ['Quote', 'Quote', 'Quote'],
        note: 'iPad Pro buyers should send exact generation, size and part type for confirmed availability.',
      },
      {
        model: 'Apple iPad Air / mini',
        category: 'Tablet Battery',
        name: 'iPad Air and iPad mini battery replacement parts',
        source: 'Tablet catalog / iPad battery families',
        image: '/images/tablet-batteries.jpg',
        tiers: ['Quote', 'Quote', 'Quote'],
        note: 'Battery quotes need model, capacity, route and packing confirmation before final offer.',
      },
      {
        model: 'Samsung Galaxy Tab',
        category: 'Tablet Display / Flex',
        name: 'Galaxy Tab display assemblies, charging parts and flex cables',
        source: 'Samsung catalog / Galaxy Tab Series',
        image: '/hero/products-tablet-watch.jpg',
        tiers: ['Quote', 'Quote', 'Quote'],
        note: 'Galaxy Tab demand can be combined with Samsung phone screens and small parts in one quote.',
      },
      {
        model: 'Apple Watch',
        category: 'Smartwatch Display',
        name: 'Apple Watch display and battery repair parts',
        source: 'Smartwatch catalog / Apple Watch',
        image: '/images/smart-device-batteries.jpg',
        tiers: ['Quote', 'Quote', 'Quote'],
        note: 'Apple Watch parts require size, generation and version matching before quote confirmation.',
      },
      {
        model: 'Samsung / Huawei Watch',
        category: 'Smartwatch Parts',
        name: 'Galaxy Watch and Huawei Watch displays, batteries and flex parts',
        source: 'Smartwatch catalog / Android wearable lines',
        image: '/images/smart-device-batteries.jpg',
        tiers: ['Quote', 'Quote', 'Quote'],
        note: 'Android wearable demand is best handled as an add-on lane for tablet and phone repair buyers.',
      },
    ],
    buyingNotes: [
      'Ask buyers to include exact model, screen size, watch case size, generation and target quantity.',
      'Keep final price and stock confirmation inside the quote conversation because tablet and watch compatibility changes by version.',
      'Bundle tablet and smartwatch SKUs with phone screens, batteries or small parts to simplify shipping planning.',
    ],
    workflow: [
      { title: 'Confirm device family', text: 'Separate iPad, Galaxy Tab, Apple Watch and Android wearable requirements before matching SKUs.' },
      { title: 'Check exact version', text: 'Sales confirms size, generation, cellular/Wi-Fi version and display or battery specification.' },
      { title: 'Build mixed quote', text: 'Quote returns availability, MOQ, packing note and 10+ / 50+ / 200+ tiers where verified pricing exists.' },
    ],
  },
  repairTools: {
    slug: 'repair-tools',
    eyebrow: 'Tools & IC Catalog',
    title: 'Phone Repair Tools, IC Chips & Programmers Wholesale',
    intro:
      'The tools page should feel like a workshop procurement list: IC chips, power test cables, programmers, screwdriver sets and tool kits grouped by repair workflow.',
    heroImage: '/hero/products-repair-tools.jpg',
    quoteProduct: 'Repair Tools and IC Chips',
    metrics: [
      { value: '2,080', label: 'tool & IC SKUs', detail: 'IC chips, repair tools and programmer coverage' },
      { value: '652', label: 'screwdriver SKUs', detail: 'Drivers, screw sets and precision repair kits' },
      { value: '399', label: 'power cable SKUs', detail: 'Battery and power test cable coverage' },
      { value: '185', label: 'IC chip SKUs', detail: 'Board-level repair support for advanced shops' },
    ],
    coverage: [
      { title: 'Programmers', value: 'NAND and function tools', text: 'Programmer SKUs support iPhone, iPad and board-level workflows.' },
      { title: 'Power testing', value: 'Cable and sub-board SKUs', text: 'Power test cable stock for diagnostic benches and repair labs.' },
      { title: 'Hand tools', value: 'Screwdriver sets', text: 'Precision screwdriver, screw and opening tool SKUs for shop replenishment.' },
      { title: 'IC chips', value: 'Apple and Android', text: 'iPhone, iPad, Huawei and other IC SKUs for micro-repair buyers.' },
    ],
    quoteLines: [
      {
        model: 'Programmer',
        category: 'Programmer',
        name: 'JC PRO1000S NAND Programmer Repair Tool',
        source: 'IC-Chips-Tools catalog / Programmers',
        image: 'https://pub-3d088e9c8cac4da89ab00382fa664592.r2.dev/products/SPT0176.jpg',
        tiers: ['$324.07', '$319.13', '$319.13'],
        note: 'High-ticket bench tool SKU for advanced repair shops.',
      },
      {
        model: 'Power Test Cable',
        category: 'Rear Camera',
        name: 'iPhone 16 Pro / Pro Max JC Rear Camera Flex Cable',
        source: 'IC-Chips-Tools catalog / Power Test Cables',
        image: 'https://pub-3d088e9c8cac4da89ab00382fa664592.r2.dev/products/EDA008381401.jpg',
        tiers: ['$19.93', '$19.53', '$19.32'],
        note: 'iPhone 16 test flex keeps newer Apple repair workflows visible.',
      },
      {
        model: 'Screwdriver',
        category: 'Screwdriver',
        name: 'JAKEMY JM-6098 66 in 1 Set',
        source: 'IC-Chips-Tools catalog / Screwdrivers',
        image: 'https://pub-3d088e9c8cac4da89ab00382fa664592.r2.dev/products/ETP6568.jpg',
        tiers: ['$9.60', '$9.41', '$9.21'],
        note: 'Shop consumable SKU for technician bench replenishment.',
      },
      {
        model: 'iPhone IC',
        category: 'IC Chip',
        name: '339S00647 WiFi IC for iPhone 11 Series',
        source: 'IC-Chips-Tools catalog / iPhone IC Chips',
        image: 'https://pub-3d088e9c8cac4da89ab00382fa664592.r2.dev/products/ICCP5686.jpg',
        tiers: ['$3.15', '$3.08', '$3.02'],
        note: 'iPhone WiFi IC SKUs represent high-frequency board-level repairs.',
      },
    ],
    buyingNotes: [
      'Tool and IC buyers need compatibility, tool version and use case before quote confirmation.',
      'The page should guide buyers to send a bench-stock list instead of browsing unrelated tools.',
      'High-ticket programmers should remain quote-led because availability and firmware version matter.',
    ],
    workflow: [
      { title: 'Identify repair workflow', text: 'Buyer separates diagnostic tools, hand tools, programmers and IC chip demand.' },
      { title: 'Check compatibility', text: 'Sales confirms device series, tool version and replacement part compatibility.' },
      { title: 'Quote mixed bench stock', text: 'Quote combines high-value tools with consumable screws, cables and chips.' },
    ],
  },
} as const satisfies Record<string, ProductCategoryPageData>;
