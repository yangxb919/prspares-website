import assert from 'node:assert/strict';
import test from 'node:test';
import {
  checkTrackingContract,
  discoverTargets,
} from './tracking-contract.mjs';
import {
  DEEPLINK_TEMPLATE_SENTENCE,
  LANDING_PAGE_PATH,
  REQUIRED_PAYLOAD_KEYS,
  SERVER_REQUIRED_FIELDS,
  WHOLESALE_INQUIRY_PATH,
  checkLandingPageForm,
  checkServerInvariants,
  checkWholesaleInquiryForm,
  describesModelTimesQuantity,
  extractClientRequiredFields,
  extractDeepLinkEffect,
  extractSelectValues,
  extractSubmitPayload,
  extractTemplateConstant,
  extractTextareaElement,
  extractTextareaInnerText,
  extractValidateBody,
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
    name: 'product-only, specific product line (no productUrl) — the P0 case',
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
    /selectedProductLine\.url\s*&&\s*\(/,
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

test('B: quantity, quality and category are downgraded to optional but not deleted', () => {
  const source = readSource(WHOLESALE_INQUIRY_PATH);
  for (const field of ['quantity', 'quality', 'products']) {
    assert.match(source, new RegExp(`name="${field}"`), `${field} must still exist on the form`);
  }
  const required = extractClientRequiredFields(source);
  for (const field of ['quantity', 'products']) {
    assert.equal(required.includes(field), false, `${field} must no longer block submission`);
  }
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
