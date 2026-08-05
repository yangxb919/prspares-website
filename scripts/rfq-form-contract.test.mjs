import assert from 'node:assert/strict';
import test from 'node:test';
import {
  checkTrackingContract,
  discoverTargets,
} from './tracking-contract.mjs';
import {
  ALLOWED_CONTROL_NAMES,
  DEEPLINK_TEMPLATE_SENTENCE,
  LANDING_PAGE_PATH,
  OPTIONAL_CONTROL_NAMES,
  REMOVED_CONTROL_NAMES,
  REQUIRED_CONTROL_NAMES,
  REQUIRED_PAYLOAD_KEYS,
  SERVER_REQUIRED_FIELDS,
  WHOLESALE_INQUIRY_PATH,
  checkLandingPageForm,
  checkServerInvariants,
  checkWholesaleFormShape,
  checkWholesaleInquiryForm,
  describesModelTimesQuantity,
  extractClientRequiredFields,
  extractClearDeepLinkSelectionBody,
  extractDeepLinkEffect,
  extractFormControlNames,
  extractSelectValues,
  extractSubmitPayload,
  extractTemplateConstant,
  extractTextareaElement,
  extractTextareaInnerText,
  extractValidateBody,
  loadBuildProductInterest,
  loadBuildRfqMessage,
  loadClearDeepLinkParams,
  loadResolveDeepLink,
  payloadSendsKey,
  readSource,
} from './rfq-form-contract.mjs';

function codes(result) {
  return result.violations.map(({ code }) => code);
}

// ---------------------------------------------------------------------------
// A1 — all eight RFQ entry points still await their submit
// ---------------------------------------------------------------------------

test('A1: the eight RFQ entry points are all still present and awaited', async (t) => {
  const expected = [
    'src/app/id/wholesale/page.tsx',
    'src/app/th/wholesale/page.tsx',
    'src/app/wholesale-inquiry/page.tsx',
    'src/components/ContactFormEnhanced.tsx',
    'src/components/InquiryModal.tsx',
    'src/components/QuoteModal.tsx',
    'src/components/QuoteModalEnhanced.tsx',
    'src/components/features/ContactForm.tsx',
  ];
  const targets = discoverTargets();
  assert.deepEqual(targets, expected, 'an RFQ entry point was added, removed or renamed');

  for (const relativePath of targets) {
    await t.test(`${relativePath} awaits submitRfqAndNotify`, () => {
      const source = readSource(relativePath);
      assert.match(source, /await\s+submitRfqAndNotify\s*\(/, 'submit must stay awaited');
      const result = checkTrackingContract(source, relativePath);
      assert.equal(result.ok, true, JSON.stringify(result.violations, null, 2));
    });
  }
});

// ---------------------------------------------------------------------------
// A2 — generate_lead fires exactly once, only after a successful submit
// ---------------------------------------------------------------------------

test('A2: generate_lead fires exactly once after the awaited submit', async (t) => {
  for (const relativePath of discoverTargets()) {
    await t.test(relativePath, () => {
      const source = readSource(relativePath);
      const leadCalls = Array.from(source.matchAll(/\btrackEvent\s*\(\s*(['"])generate_lead\1/g));
      assert.equal(leadCalls.length, 1, 'exactly one generate_lead call expected');

      const submitIndex = /await\s+submitRfqAndNotify\s*\(/.exec(source).index;
      assert.ok(leadCalls[0].index > submitIndex, 'generate_lead must come after the awaited submit');

      // A rejected submit throws, so the lead call must sit inside the try
      // block rather than a finally/catch that would fire it regardless.
      const tail = source.slice(leadCalls[0].index);
      assert.doesNotMatch(
        tail.slice(0, tail.indexOf('trackEvent') + 1) || '',
        /finally\s*\{/,
        'generate_lead must not be reachable from a finally block',
      );
    });
  }
});

test('A2: the LP fires generate_lead once, gated behind response.ok', () => {
  const html = readSource(LANDING_PAGE_PATH);
  const result = checkLandingPageForm(html);
  const failures = codes(result).filter((code) => code === 'LEAD_COUNT' || code === 'LEAD_ORDER');
  assert.deepEqual(failures, [], JSON.stringify(result.violations, null, 2));
});

// ---------------------------------------------------------------------------
// A3 — the RFQ payload keeps the fields sales triage depends on
// ---------------------------------------------------------------------------

test('A3: wholesale-inquiry payload still sends name/email/message/productInterest/pageUrl', () => {
  const payload = extractSubmitPayload(readSource(WHOLESALE_INQUIRY_PATH));
  assert.notEqual(payload, '', 'submitRfqAndNotify payload not found');

  for (const key of REQUIRED_PAYLOAD_KEYS) {
    assert.ok(payloadSendsKey(payload, key), `payload must keep "${key}"`);
  }
});

test('A3: every RFQ entry point sends name, email and message', async (t) => {
  for (const relativePath of discoverTargets()) {
    await t.test(relativePath, () => {
      const payload = extractSubmitPayload(readSource(relativePath));
      assert.notEqual(payload, '', 'submitRfqAndNotify payload not found');
      for (const key of ['name', 'email', 'message']) {
        assert.ok(payloadSendsKey(payload, key), `payload must keep "${key}"`);
      }
    });
  }
});

// ---------------------------------------------------------------------------
// A4 — a ?product= deep link must never ghost-write the buyer's requirement
// ---------------------------------------------------------------------------

test('A4: the deep-link template sentence is gone from the form', () => {
  const source = readSource(WHOLESALE_INQUIRY_PATH);
  assert.equal(
    source.includes(DEEPLINK_TEMPLATE_SENTENCE),
    false,
    'the deep-link prefill sentence must not be written into the form',
  );
});

test('A4: the ?product= effect does not assign to message', () => {
  const effect = extractDeepLinkEffect(readSource(WHOLESALE_INQUIRY_PATH));
  assert.notEqual(effect, '', 'deep-link useEffect not found');
  assert.doesNotMatch(effect, /(^|[{,\s])message\s*:/, 'the deep-link effect must leave message untouched');
});

test('A4: a selected product line is still surfaced to the buyer', () => {
  const source = readSource(WHOLESALE_INQUIRY_PATH);
  assert.match(source, /setSelectedProductLine\(/, 'deep link must still record the selected product line');
  assert.match(source, /Selected product/i, 'the selected product must still be shown on the page');
});

// ---------------------------------------------------------------------------
// P0-1 — real inbound deep links must keep the product name; productUrl is
// only ever an optional source link. URLs below are taken verbatim from
// page_url values in Supabase contact_submissions.
// ---------------------------------------------------------------------------

const DEEP_LINK_FIXTURES = [
  {
    name: 'product + category, specific product line (no productUrl) — the P0 case',
    url: 'https://www.phonerepairspares.com/wholesale-inquiry?product=iPhone+13+Pro+Max+OLED+Screen+Assembly&category=LCD%2FOLED+Screens#quote-form',
    expectCategory: 'LCD/OLED Screens',
    expectProductName: 'iPhone 13 Pro Max OLED Screen Assembly',
    expectProductUrl: '',
  },
  {
    name: 'product-only, no category at all',
    url: 'https://www.phonerepairspares.com/wholesale-inquiry?product=OPPO+Reno13+Pro+-+Original+Charging+Port+Sub+Board+Card',
    expectCategory: '',
    expectProductName: 'OPPO Reno13 Pro - Original Charging Port Sub Board Card',
    expectProductUrl: '',
  },
  {
    name: 'product + productUrl keeps both',
    url: 'https://www.phonerepairspares.com/wholesale-inquiry?product=Apple+iPhone+16+Pro+Max+-+Original+LTPO+Super+Retina+XDR+OLED+LCD+Assembly&category=LCD%2FOLED+Screens&productUrl=%2Fproducts%2Fscreens%23line-apple-iphone-16-pro-max',
    expectCategory: 'LCD/OLED Screens',
    expectProductName: 'Apple iPhone 16 Pro Max - Original LTPO Super Retina XDR OLED LCD Assembly',
    expectProductUrl: '/products/screens#line-apple-iphone-16-pro-max',
  },
  {
    name: 'category alias in ?product= is a category hint, not a product',
    url: 'https://www.phonerepairspares.com/wholesale-inquiry?product=LCD%20and%20OLED%20Screens',
    expectCategory: 'LCD/OLED Screens',
    expectProductName: null,
    expectProductUrl: null,
  },
  {
    name: 'category alias Small Parts is a category hint, not a product',
    url: 'https://www.phonerepairspares.com/wholesale-inquiry?product=Small%20Parts',
    expectCategory: 'Small Parts',
    expectProductName: null,
    expectProductUrl: null,
  },
  {
    name: 'real producer category iPad Batteries canonicalises to Batteries',
    url: 'https://www.phonerepairspares.com/wholesale-inquiry?category=iPad+Batteries',
    expectCategory: 'Batteries',
    expectProductName: null,
    expectProductUrl: null,
  },
  {
    name: 'real producer category Screen canonicalises to LCD/OLED Screens',
    url: 'https://www.phonerepairspares.com/wholesale-inquiry?category=Screen',
    expectCategory: 'LCD/OLED Screens',
    expectProductName: null,
    expectProductUrl: null,
  },
  {
    name: 'real producer category Rear Camera canonicalises to Small Parts',
    url: 'https://www.phonerepairspares.com/wholesale-inquiry?category=Rear+Camera',
    expectCategory: 'Small Parts',
    expectProductName: null,
    expectProductUrl: null,
  },
  {
    name: 'real producer category Charging Port canonicalises to Small Parts',
    url: 'https://www.phonerepairspares.com/wholesale-inquiry?category=Charging+Port',
    expectCategory: 'Small Parts',
    expectProductName: null,
    expectProductUrl: null,
  },
  {
    name: 'unknown but explicit cleaned category is safely preserved',
    url: 'https://www.phonerepairspares.com/wholesale-inquiry?category=Tablet+Flex+Cables',
    expectCategory: 'Tablet Flex Cables',
    expectProductName: null,
    expectProductUrl: null,
  },
  {
    name: 'productUrl-only does not invent a product or category',
    url: 'https://www.phonerepairspares.com/wholesale-inquiry?productUrl=%2Fproducts%2Fscreens%23line-one',
    expectCategory: '',
    expectProductName: null,
    expectProductUrl: null,
  },
  {
    name: 'no deep-link params at all',
    url: 'https://www.phonerepairspares.com/wholesale-inquiry',
    expectCategory: '',
    expectProductName: null,
    expectProductUrl: null,
  },
];

test('P0-1: real inbound deep links resolve correctly', async (t) => {
  const resolveDeepLink = loadResolveDeepLink();

  for (const fixture of DEEP_LINK_FIXTURES) {
    await t.test(fixture.name, () => {
      const url = new URL(fixture.url);
      // Mirrors the page: productUrl is same-origin-normalised to a path.
      const rawProductUrl = url.searchParams.get('productUrl');
      const normalised = rawProductUrl
        ? (() => {
            const u = new URL(rawProductUrl, url.origin);
            return u.origin === url.origin ? `${u.pathname}${u.search}${u.hash}` : '';
          })()
        : '';

      const resolved = resolveDeepLink(
        url.searchParams.get('product') || '',
        url.searchParams.get('category') || '',
        normalised,
      );

      assert.equal(resolved.category, fixture.expectCategory, 'category mismatch');

      if (fixture.expectProductName === null) {
        assert.equal(resolved.selectedProduct, null, 'expected no selected product');
      } else {
        assert.notEqual(resolved.selectedProduct, null, 'product name was dropped');
        assert.equal(resolved.selectedProduct.name, fixture.expectProductName, 'product name mismatch');
        assert.equal(resolved.selectedProduct.url, fixture.expectProductUrl, 'product url mismatch');
      }
    });
  }
});

test('P0-1: a missing productUrl never suppresses the product name', () => {
  const resolveDeepLink = loadResolveDeepLink();
  const withUrl = resolveDeepLink('iPhone 13 Pro Max OLED Screen Assembly', 'LCD/OLED Screens', '/products/screens#x');
  const withoutUrl = resolveDeepLink('iPhone 13 Pro Max OLED Screen Assembly', 'LCD/OLED Screens', '');

  assert.equal(withUrl.selectedProduct.name, withoutUrl.selectedProduct.name);
  assert.equal(withoutUrl.selectedProduct.url, '', 'productUrl is optional and stays empty');
  assert.equal(withUrl.selectedProduct.url, '/products/screens#x');
});

test('P0-1: the page renders the source link only when a productUrl exists', () => {
  const source = readSource(WHOLESALE_INQUIRY_PATH);
  assert.match(
    source,
    /selectedProductLine\?\.url\s*&&\s*\(/,
    'the "View product source" link must stay conditional on a non-empty url',
  );
  assert.match(
    source,
    /selectedProductLine\?\.url\s*\?/,
    'the product source line in the message must stay conditional on a non-empty url',
  );
});

// ---------------------------------------------------------------------------
// A5 — a placeholder must never be submitted as if the buyer wrote it
// ---------------------------------------------------------------------------

test('A5: wholesale-inquiry message state starts empty and has no defaultValue', () => {
  const source = readSource(WHOLESALE_INQUIRY_PATH);
  assert.match(source, /message:\s*''/, 'message must initialise to an empty string');
  assert.doesNotMatch(
    source,
    /name="message"[\s\S]{0,400}?defaultValue=/,
    'the requirement textarea must not carry a defaultValue',
  );
});

test('A5: wholesale-inquiry placeholder shows a real model x quantity example', () => {
  const placeholder = extractTemplateConstant(readSource(WHOLESALE_INQUIRY_PATH), 'REQUIREMENT_PLACEHOLDER');
  assert.notEqual(placeholder, '', 'REQUIREMENT_PLACEHOLDER constant not found');
  assert.equal(
    describesModelTimesQuantity(placeholder),
    true,
    `placeholder must name a model and show >=2 quantities, got: ${JSON.stringify(placeholder)}`,
  );
});

test('A5: the LP requirement textarea ships empty', () => {
  const element = extractTextareaElement(readSource(LANDING_PAGE_PATH), 'f-message');
  assert.notEqual(element, '', '#f-message textarea not found');
  assert.equal(extractTextareaInnerText(element).trim(), '', 'the LP textarea must not be pre-filled');
  assert.doesNotMatch(element, /\svalue="/, 'the LP textarea must not carry a value attribute');
});

test('A5: the LP placeholder shows a real model x quantity example', () => {
  const element = extractTextareaElement(readSource(LANDING_PAGE_PATH), 'f-message');
  const placeholder = /placeholder="([^"]*)"/.exec(element)?.[1] ?? '';
  assert.equal(
    describesModelTimesQuantity(placeholder),
    true,
    `LP placeholder must name a model and show >=2 quantities, got: ${JSON.stringify(placeholder)}`,
  );
});

test('A5: describesModelTimesQuantity rejects abstract instructions', () => {
  assert.equal(describesModelTimesQuantity('Paste model list, packing needs or target quantity...'), false);
  assert.equal(describesModelTimesQuantity('e.g. I need 50x iPhone 15 Pro OLED screens'), false);
  assert.equal(describesModelTimesQuantity('iPhone 13 OLED x20\niPhone 14 battery x30'), true);
});

// ---------------------------------------------------------------------------
// B / C — form-shape rules for this phase
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// P0-2 — the client gate must mirror the real server contract, and the message
// it validates must be the buyer's own text, not the '[Wholesale Inquiry]'
// prefix this page always prepends.
// ---------------------------------------------------------------------------

test('P0-2: the client gates on exactly what the server rejects on', () => {
  const required = extractClientRequiredFields(readSource(WHOLESALE_INQUIRY_PATH));
  assert.deepEqual(
    required,
    SERVER_REQUIRED_FIELDS,
    'send-rfq-email:70 rejects unless name + email + message are present; the client must match',
  );
});

test('P0-2: the server contract this is mirroring is stated accurately', () => {
  const route = readSource('src/app/api/send-rfq-email/route.ts');
  assert.match(
    route,
    /if\s*\(!name\s*\|\|\s*!email\s*\|\|\s*!message\)/,
    'send-rfq-email must still require name, email and message',
  );

  const client = readSource('src/lib/rfq-client.ts');
  assert.match(client, /Message is required/, 'rfq-client must still reject an empty message');
});

test('P0-2: an empty requirement box is blocked before submit', () => {
  const validateBody = extractValidateBody(readSource(WHOLESALE_INQUIRY_PATH));
  assert.notEqual(validateBody, '', 'validate() body not found');
  assert.match(
    validateBody,
    /!formData\.message\.trim\(\)/,
    'validate() must reject a blank requirement box',
  );
  assert.match(validateBody, /errs\.message\s*=/, 'a blank requirement must surface an error to the buyer');
});

test('P0-2: the message gate reads the buyer field, not the assembled payload', () => {
  const validateBody = extractValidateBody(readSource(WHOLESALE_INQUIRY_PATH));
  assert.match(validateBody, /formData\.message/, 'must validate the buyer-typed field');
  assert.doesNotMatch(validateBody, /msgParts|\[Wholesale Inquiry\]/, 'must not validate system-generated text');
});

test('P0-2: system boilerplate alone cannot satisfy the message requirement', () => {
  const source = readSource(WHOLESALE_INQUIRY_PATH);
  // The page still prefixes the payload — that is exactly why the gate has to
  // sit on formData.message rather than on the assembled string.
  assert.match(source, /'\[Wholesale Inquiry\]'/, 'payload prefix still present');
  const validateBody = extractValidateBody(source);
  assert.match(validateBody, /!formData\.message\.trim\(\)/);
});

test('P0-2: the buyer-facing error explains what to write', () => {
  const validateBody = extractValidateBody(readSource(WHOLESALE_INQUIRY_PATH));
  const message = /errs\.message\s*=\s*'([^']+)'/.exec(validateBody)?.[1] ?? '';
  assert.notEqual(message, '', 'a message error string is required');
  assert.ok(message.length > 10, `error copy should be actionable, got: ${JSON.stringify(message)}`);
});

// ---------------------------------------------------------------------------
// V2 (2026-08-05) — the four deleted controls are gone; the three required and
// five optional controls stay; the deep-link category survives the deletion.
// ---------------------------------------------------------------------------

test('V2: the four deleted controls no longer render as form controls', () => {
  const controls = extractFormControlNames(readSource(WHOLESALE_INQUIRY_PATH));
  for (const name of ['products', 'quantity', 'quality', 'monthlyVolume']) {
    assert.equal(
      controls.includes(name),
      false,
      `name="${name}" must not render as an <input>/<select>/<textarea> control any more`,
    );
  }
});

test('V2: buyer-facing control names are the exact allowed set, each exactly once', () => {
  const controls = extractFormControlNames(readSource(WHOLESALE_INQUIRY_PATH));
  assert.deepEqual(controls, ALLOWED_CONTROL_NAMES);
  assert.equal(new Set(controls).size, controls.length, 'duplicate buyer-facing control name detected');
});

test('V2: the three required upper controls still render', () => {
  const controls = extractFormControlNames(readSource(WHOLESALE_INQUIRY_PATH));
  for (const name of ['name', 'email', 'message']) {
    assert.ok(controls.includes(name), `required control name="${name}" must stay on the form`);
  }
  assert.deepEqual([...REQUIRED_CONTROL_NAMES].sort(), ['email', 'message', 'name']);
});

test('V2: the five optional lower controls still render and never block submission', () => {
  const source = readSource(WHOLESALE_INQUIRY_PATH);
  const controls = extractFormControlNames(source);
  for (const name of ['heardAbout', 'company', 'country', 'phone', 'models']) {
    assert.ok(controls.includes(name), `optional control name="${name}" must stay on the form`);
  }
  assert.deepEqual([...OPTIONAL_CONTROL_NAMES].sort(), ['company', 'country', 'heardAbout', 'models', 'phone']);

  // None of the five may become a hard gate — only name/email/message block.
  const required = extractClientRequiredFields(source);
  for (const name of OPTIONAL_CONTROL_NAMES) {
    assert.equal(required.includes(name), false, `optional field ${name} must not block submission`);
  }
});

test('V2: the deleted dropdown fields do not gate submission', () => {
  const required = extractClientRequiredFields(readSource(WHOLESALE_INQUIRY_PATH));
  for (const name of REMOVED_CONTROL_NAMES) {
    assert.equal(required.includes(name), false, `deleted field ${name} must not block submission`);
  }
});

test('V2: the deep-link category survives the dropdown removal', () => {
  const source = readSource(WHOLESALE_INQUIRY_PATH);
  // products has no control...
  assert.equal(extractFormControlNames(source).includes('products'), false, 'products must not render a control');
  // ...but its state and payload path stay intact.
  assert.match(source, /formData\.products/, 'formData.products must still feed the payload');
  const effect = extractDeepLinkEffect(source);
  assert.match(effect, /(^|[{,\s])products\s*:/, 'the ?product= effect must still write the category into products');

  // And a real product-line deep link still resolves to a name + category.
  const resolveDeepLink = loadResolveDeepLink();
  const resolved = resolveDeepLink('iPhone 13 Pro Max OLED Screen Assembly', 'LCD/OLED Screens', '');
  assert.equal(resolved.category, 'LCD/OLED Screens');
  assert.equal(resolved.selectedProduct.name, 'iPhone 13 Pro Max OLED Screen Assembly');
});

test('V2: category-only context is visibly surfaced through the same Remove path', () => {
  const source = readSource(WHOLESALE_INQUIRY_PATH);
  assert.match(source, /\{\(selectedProductLine\s*\|\|\s*formData\.products\)\s*&&\s*\(/);
  assert.match(source, /'Selected category'/, 'category-only summary must identify the selected category');
  assert.match(source, /onClick=\{clearDeepLinkSelection\}/, 'the visible Remove button must use the unified handler');
});

test('V2: Remove clears both states and is wired to exact URL cleanup', () => {
  const source = readSource(WHOLESALE_INQUIRY_PATH);
  const clearBody = extractClearDeepLinkSelectionBody(source);
  assert.notEqual(clearBody, '', 'clearDeepLinkSelection handler not found');
  assert.match(clearBody, /setSelectedProductLine\(null\)/);
  assert.match(clearBody, /products:\s*''/);
  assert.match(clearBody, /replaceState\([\s\S]*clearDeepLinkParams\(window\.location\.href\)/);
  assert.match(source, /onClick=\{clearDeepLinkSelection\}/);
});

test('V2: deep-link URL cleanup removes only selection params and preserves attribution/hash', async (t) => {
  const clearDeepLinkParams = loadClearDeepLinkParams();
  const fixtures = [
    {
      name: 'product-only',
      input: 'https://www.phonerepairspares.com/wholesale-inquiry?utm_source=google&product=Screen&gclid=abc#quote-form',
      expected: '/wholesale-inquiry?utm_source=google&gclid=abc#quote-form',
    },
    {
      name: 'product + category',
      input: 'https://www.phonerepairspares.com/wholesale-inquiry?product=iPhone+13+OLED&category=Screen&utm_medium=cpc#quote-form',
      expected: '/wholesale-inquiry?utm_medium=cpc#quote-form',
    },
    {
      name: 'category-only',
      input: 'https://www.phonerepairspares.com/wholesale-inquiry?category=Rear+Camera&utm_campaign=parts#details',
      expected: '/wholesale-inquiry?utm_campaign=parts#details',
    },
    {
      name: 'productUrl',
      input: 'https://www.phonerepairspares.com/wholesale-inquiry?productUrl=%2Fproducts%2Fscreens%23one&gclid=xyz#quote-form',
      expected: '/wholesale-inquiry?gclid=xyz#quote-form',
    },
  ];

  for (const fixture of fixtures) {
    await t.test(fixture.name, () => {
      assert.equal(clearDeepLinkParams(fixture.input), fixture.expected);
    });
  }
});

test('V2: productInterest joins non-empty parts and never leads with a separator', () => {
  const buildProductInterest = loadBuildProductInterest();

  // Product-only deep link: category is empty (the Products dropdown is gone),
  // so productInterest must be exactly the product name — no leading " | ".
  assert.equal(
    buildProductInterest('', 'iPhone 13 Pro Max OLED Screen Assembly'),
    'iPhone 13 Pro Max OLED Screen Assembly',
    'a product-only deep link must not produce a leading " | " separator',
  );

  // Category + product still joins as "Category | Product".
  assert.equal(
    buildProductInterest('LCD/OLED Screens', 'iPhone 13 Pro Max OLED Screen Assembly'),
    'LCD/OLED Screens | iPhone 13 Pro Max OLED Screen Assembly',
  );

  // Category-only (no selected product line) is exactly the category.
  assert.equal(buildProductInterest('LCD/OLED Screens', ''), 'LCD/OLED Screens');

  // Neither present -> empty string, never a bare separator.
  assert.equal(buildProductInterest('', ''), '');
});

test('V2: checkWholesaleFormShape rejects a leading-separator productInterest', () => {
  const broken = readSource(WHOLESALE_INQUIRY_PATH).replace(
    /function buildProductInterest\(category: string, productName: string\): string \{[\s\S]*?\n\}/,
    'function buildProductInterest(category: string, productName: string): string {\n  return `${category} | ${productName}`;\n}',
  );
  const codesOut = codes(checkWholesaleFormShape(broken, 'fixture'));
  assert.ok(codesOut.includes('PRODUCT_INTEREST_LEADING_SEP'), JSON.stringify(codesOut));
});

test('V2: retained fields assemble into the exact deterministic admin message', () => {
  const buildRfqMessage = loadBuildRfqMessage();
  assert.equal(
    buildRfqMessage(
      'Small Parts',
      'Rear Camera',
      'https://www.phonerepairspares.com/products/small-parts#rear-camera',
      'iPhone 15 Pro, Samsung S24',
      'Kenya',
      'Google Search',
      'Please quote 20 pieces.\nOEM and aftermarket options.',
    ),
    [
      '[Wholesale Inquiry]',
      'Selected product: Rear Camera',
      'Product source: https://www.phonerepairspares.com/products/small-parts#rear-camera',
      'Products: Small Parts',
      'Models/Brands: iPhone 15 Pro, Samsung S24',
      'Country: Kenya',
      'Heard about us: Google Search',
      'Details: Please quote 20 pieces.',
      'OEM and aftermarket options.',
    ].join('\n'),
  );
});

test('V2: cleared selection cannot leak into message, productInterest, or submitted pageUrl', () => {
  const source = readSource(WHOLESALE_INQUIRY_PATH);
  const buildRfqMessage = loadBuildRfqMessage();
  const buildProductInterest = loadBuildProductInterest();
  const clearDeepLinkParams = loadClearDeepLinkParams();
  const message = buildRfqMessage('', '', '', 'iPhone 15 Pro', 'Kenya', 'Referral', 'Need 20 pieces.');

  assert.match(source, /productInterest:\s*buildProductInterest\(formData\.products,/);
  assert.match(source, /message:\s*msgParts/);
  assert.match(source, /pageUrl:\s*window\.location\.href/);

  assert.equal(
    message,
    '[Wholesale Inquiry]\nModels/Brands: iPhone 15 Pro\nCountry: Kenya\nHeard about us: Referral\nDetails: Need 20 pieces.',
  );
  assert.doesNotMatch(message, /Products:|Selected product:|Product source:/);
  assert.equal(buildProductInterest('', ''), '');
  assert.equal(
    clearDeepLinkParams(
      'https://www.phonerepairspares.com/wholesale-inquiry?utm_source=google&product=Screen&category=Screen&productUrl=%2Fproducts%2Fscreens#g',
    ),
    '/wholesale-inquiry?utm_source=google#g',
  );
});

test('V2: retained company/phone stay top-level and models/country/heardAbout stay in message assembly', () => {
  const source = readSource(WHOLESALE_INQUIRY_PATH);
  const payload = extractSubmitPayload(source);
  assert.match(payload, /company:\s*formData\.company\.trim\(\)/);
  assert.match(payload, /phone:\s*formData\.phone\.trim\(\)/);
  assert.match(
    source,
    /buildRfqMessage\([\s\S]*formData\.models,[\s\S]*formData\.country,[\s\S]*formData\.heardAbout,[\s\S]*formData\.message/,
  );
});

test('V2: deleted-field values are no longer assembled into the email body', () => {
  const source = readSource(WHOLESALE_INQUIRY_PATH);
  for (const ref of ['formData.quantity', 'formData.quality', 'formData.monthlyVolume']) {
    assert.equal(source.includes(ref), false, `${ref} must no longer be read`);
  }
});

test('V2: checkWholesaleFormShape passes against the real page', () => {
  const result = checkWholesaleFormShape(readSource(WHOLESALE_INQUIRY_PATH));
  assert.equal(result.ok, true, JSON.stringify(result.violations, null, 2));
});

test('V2: checkWholesaleFormShape catches a re-added deleted control', () => {
  const withQuantity = `${readSource(WHOLESALE_INQUIRY_PATH)}
    <select id="quantity" name="quantity"><option value="">x</option></select>`;
  const codesOut = codes(checkWholesaleFormShape(withQuantity, 'fixture'));
  assert.ok(codesOut.includes('CONTROL_NOT_REMOVED'), JSON.stringify(codesOut));
});

test('V2: checkWholesaleFormShape catches an unexpected ninth control and duplicates', () => {
  const source = readSource(WHOLESALE_INQUIRY_PATH);
  const withNinth = `${source}\n<input name="fax" />`;
  assert.ok(codes(checkWholesaleFormShape(withNinth, 'fixture')).includes('CONTROL_SET_MISMATCH'));

  const withDuplicate = `${source}\n<input name="email" />`;
  const duplicateCodes = codes(checkWholesaleFormShape(withDuplicate, 'fixture'));
  assert.ok(duplicateCodes.includes('CONTROL_SET_MISMATCH'));
  assert.ok(duplicateCodes.includes('CONTROL_DUPLICATE'));
});

test('V2: custom message validation and optional accordion expose ARIA state', () => {
  const source = readSource(WHOLESALE_INQUIRY_PATH);
  const messageElement = /<textarea[\s\S]*?name="message"[\s\S]*?\/>/.exec(source)?.[0] ?? '';
  assert.notEqual(messageElement, '', 'message textarea not found');
  assert.doesNotMatch(messageElement, /\srequired(?:\s|=|\/>)/, 'native required would bypass the custom error path');
  assert.match(messageElement, /aria-required="true"/);
  assert.match(messageElement, /aria-invalid=\{Boolean\(errors\.message\)\}/);
  assert.match(messageElement, /aria-describedby=\{errors\.message/);
  assert.match(source, /id="message-error"\s+role="alert"/);
  assert.match(source, /aria-expanded=\{showOptional\}/);
  assert.match(source, /aria-controls="wholesale-optional-details"/);
  assert.match(source, /id="wholesale-optional-details"/);
});

test('C: LP category values are mergeable with main-site categories', () => {
  const values = extractSelectValues(readSource(LANDING_PAGE_PATH), 'f-product');
  assert.ok(values.length >= 5, 'LP must keep its category options');
  const canonical = ['LCD/OLED Screens', 'Batteries', 'Small Parts', 'IC Chips & Repair Tools', 'Multiple Categories'];
  for (const value of values) {
    assert.ok(
      canonical.includes(value.split('|')[0].trim()),
      `LP category "${value}" must start with a main-site category`,
    );
  }
});

test('C: the LP keeps its endpoint and adds no hard-required geo field', () => {
  const result = checkLandingPageForm(readSource(LANDING_PAGE_PATH));
  const failures = codes(result).filter((code) => code === 'ENDPOINT_CHANGED' || code === 'LP_HARD_REQUIRED_GEO');
  assert.deepEqual(failures, [], JSON.stringify(result.violations, null, 2));
});

// ---------------------------------------------------------------------------
// Safety invariants — files outside this phase's edit scope
// ---------------------------------------------------------------------------

test('safety: Supabase write still precedes the admin email, and only a double failure fails the request', () => {
  const result = checkServerInvariants();
  assert.equal(result.ok, true, JSON.stringify(result.violations, null, 2));
});

// ---------------------------------------------------------------------------
// Aggregate checkers
// ---------------------------------------------------------------------------

test('aggregate: wholesale-inquiry form satisfies the whole contract', () => {
  const result = checkWholesaleInquiryForm(readSource(WHOLESALE_INQUIRY_PATH));
  assert.equal(result.ok, true, JSON.stringify(result.violations, null, 2));
});

test('aggregate: wholesale-inquiry V2 form shape satisfies the whole contract', () => {
  const result = checkWholesaleFormShape(readSource(WHOLESALE_INQUIRY_PATH));
  assert.equal(result.ok, true, JSON.stringify(result.violations, null, 2));
});

test('aggregate: landing page form satisfies the whole contract', () => {
  const result = checkLandingPageForm(readSource(LANDING_PAGE_PATH));
  assert.equal(result.ok, true, JSON.stringify(result.violations, null, 2));
});

// ---------------------------------------------------------------------------
// Fixture tests — prove the checker actually detects regressions
// ---------------------------------------------------------------------------

const GOOD_VALIDATE = `const validate = (): boolean => {
      if (!formData.name) errs.name = 'x';
      if (!formData.email) errs.email = 'y';
      if (!formData.message.trim()) errs.message = 'Please tell us what you need so we can quote';
    };`;

function fixtureSource({ validate = GOOD_VALIDATE, effect, payload } = {}) {
  return `
    const REQUIREMENT_PLACEHOLDER = \`iPhone 13 OLED x20\niPhone 14 battery x30\`;
    ${validate}
    ${effect ?? "useEffect(() => { const p = url.searchParams.get('product'); }, []);"}
    const state = { message: '' };
    await submitRfqAndNotify(${payload ?? '{ name, email, message, productInterest, pageUrl }'});
  `;
}

test('fixture: a clean source passes every rule', () => {
  const result = checkWholesaleInquiryForm(fixtureSource(), 'fixture');
  assert.equal(result.ok, true, JSON.stringify(result.violations, null, 2));
});

test('fixture: a deep-link effect that writes message is rejected', () => {
  const source = fixtureSource({
    effect: `useEffect(() => {
      const productParam = url.searchParams.get('product');
      setFormData((prev) => ({ ...prev, message: 'canned sentence' }));
    }, []);`,
  });
  assert.deepEqual(codes(checkWholesaleInquiryForm(source, 'fixture')), ['DEEPLINK_WRITES_MESSAGE']);
});

test('fixture: a stricter-than-server client gate is rejected', () => {
  const source = fixtureSource({
    validate: `const validate = (): boolean => {
      if (!formData.name) errs.name = 'x';
      if (!formData.email) errs.email = 'y';
      if (!formData.message.trim()) errs.message = 'z';
      if (!formData.quantity) errs.quantity = 'q';
    };`,
  });
  assert.deepEqual(codes(checkWholesaleInquiryForm(source, 'fixture')), ['CLIENT_GATE_STRICTER']);
});

test('fixture: dropping the message gate is rejected (the P0-2 regression)', () => {
  const source = fixtureSource({
    validate: `const validate = (): boolean => {
      if (!formData.name) errs.name = 'x';
      if (!formData.email) errs.email = 'y';
    };`,
  });
  const violations = codes(checkWholesaleInquiryForm(source, 'fixture'));
  assert.ok(violations.includes('CLIENT_GATE_LOOSER'), JSON.stringify(violations));
  assert.ok(violations.includes('MESSAGE_GATE_NOT_BUYER_TEXT'), JSON.stringify(violations));
});

test('fixture: gating on the assembled payload instead of the buyer field is rejected', () => {
  const source = fixtureSource({
    validate: `const validate = (): boolean => {
      if (!formData.name) errs.name = 'x';
      if (!formData.email) errs.email = 'y';
      if (!msgParts) errs.message = 'z';
    };`,
  });
  assert.ok(codes(checkWholesaleInquiryForm(source, 'fixture')).includes('MESSAGE_GATE_NOT_BUYER_TEXT'));
});

test('fixture: a dropped payload key is rejected', () => {
  const source = fixtureSource({ payload: '{ name, email, message, productInterest }' });
  assert.deepEqual(codes(checkWholesaleInquiryForm(source, 'fixture')), ['PAYLOAD_KEY']);
});

test('fixture: loadResolveDeepLink fails loudly if an annotation escapes the strip list', () => {
  const broken = `
    const DEEP_LINK_CATEGORY_MAP: Record<string, string> = { Screens: 'LCD/OLED Screens' };
    function resolveDeepLink(productParam: string, categoryParam: string, productUrl: string, extra: number): DeepLinkResolution {
      return { category: '', selectedProduct: null };
    }
  `;
  assert.throws(() => loadResolveDeepLink(broken), /SyntaxError|Unexpected/);
});

test('fixture: a pre-filled LP textarea is rejected', () => {
  const html = `
    <textarea id="f-message" name="message" placeholder="iPhone 13 OLED x20 iPhone 14 battery x30">Landing Page Inquiry</textarea>
    <select id="f-product"><option value="LCD/OLED Screens">Screens</option></select>
    apiEndpoint: '/api/lp-inquiry'
    if (!response.ok) {}
    event: 'generate_lead'
  `;
  assert.ok(codes(checkLandingPageForm(html, 'fixture')).includes('TEXTAREA_PREFILLED'));
});

test('fixture: an LP that fires generate_lead before the ok guard is rejected', () => {
  const html = `
    <textarea id="f-message" name="message" placeholder="iPhone 13 OLED x20 iPhone 14 battery x30"></textarea>
    <select id="f-product"><option value="LCD/OLED Screens">Screens</option></select>
    apiEndpoint: '/api/lp-inquiry'
    event: 'generate_lead'
    if (!response.ok) {}
  `;
  assert.ok(codes(checkLandingPageForm(html, 'fixture')).includes('LEAD_ORDER'));
});
