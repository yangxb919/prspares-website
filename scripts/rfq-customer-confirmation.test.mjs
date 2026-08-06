import assert from 'node:assert/strict';
import test from 'node:test';
import {
  LP_INQUIRY_ROUTE_PATH,
  SEND_RFQ_EMAIL_PATH,
  SEND_RFQ_ROUTE_PATH,
  payloadSendsKey,
  readSource,
  sliceBalanced,
} from './rfq-form-contract.mjs';

/**
 * RFQ customer-acknowledgement contract.
 *
 * The website's /thank-you page promises the buyer "a confirmation email with
 * your inquiry details". This suite proves that promise is now kept safely:
 *
 *   - the acknowledgement body is built from a pure, deterministic function so
 *     it can be asserted without ever touching SMTP;
 *   - it only echoes buyer-facing content and strips internal channel markers;
 *   - both RFQ routes send it ONLY after a core capture channel succeeded, and
 *     its failure can never turn a captured lead into an HTTP error, nor be
 *     conflated with the admin notification.
 *
 * Like the sibling contract modules this is text/regex based (no TS parser). It
 * lifts and executes the real buildRfqCustomerAckContent so the content rules
 * assert production behaviour, not a mirror of it.
 */

// ---------------------------------------------------------------------------
// Lift the pure builder out of the .ts mailer and run it directly.
// ---------------------------------------------------------------------------

function loadBuildRfqCustomerAckContent(source = readSource(SEND_RFQ_EMAIL_PATH)) {
  const anchor = 'export function buildRfqCustomerAckContent';
  const fnStart = source.indexOf(anchor);
  if (fnStart === -1) throw new Error('buildRfqCustomerAckContent not found in the mailer source');

  const fnBody = sliceBalanced(source.slice(fnStart), /function\s+buildRfqCustomerAckContent/);
  if (!fnBody) throw new Error('buildRfqCustomerAckContent body could not be sliced');

  const signature = source
    .slice(fnStart, source.indexOf('{', fnStart))
    .replace('export function', 'function')
    .replace('input: RfqCustomerAckInput', 'input')
    .replace(': RfqCustomerAckContent', '');

  // A SyntaxError here means a type annotation escaped the strip list — fail loud.
  return new Function(`${signature}${fnBody}\nreturn buildRfqCustomerAckContent;`)();
}

// Lift the pure overall-timeout guard so the bounded-timeout/cleanup contract can
// be exercised with a fake socket and a short real timer — no network I/O.
function loadArmSmtpOverallTimeout(source = readSource(SEND_RFQ_EMAIL_PATH)) {
  const anchor = 'export function armSmtpOverallTimeout';
  const fnStart = source.indexOf(anchor);
  if (fnStart === -1) throw new Error('armSmtpOverallTimeout not found in the mailer source');

  const fnBody = sliceBalanced(source.slice(fnStart), /function\s+armSmtpOverallTimeout/);
  if (!fnBody) throw new Error('armSmtpOverallTimeout body could not be sliced');

  const signature = source
    .slice(fnStart, source.indexOf('{', fnStart))
    .replace('export function', 'function')
    .replace('timeoutMs: number, getSocket: () => SocketLike | null', 'timeoutMs, getSocket')
    .replace('): () => void', ')');

  return new Function(`${signature}${fnBody}\nreturn armSmtpOverallTimeout;`)();
}

const build = loadBuildRfqCustomerAckContent();
const armSmtpOverallTimeout = loadArmSmtpOverallTimeout();
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// The exact assembled admin message /wholesale-inquiry submits as `message`.
const ASSEMBLED_WHOLESALE_MESSAGE = [
  '[Wholesale Inquiry]',
  'Selected product: iPhone 13 Pro Max OLED Screen Assembly',
  'Product source: https://www.phonerepairspares.com/products/screens#line-x',
  'Products: LCD/OLED Screens',
  'Models/Brands: iPhone 13 Pro Max',
  'Country: Kenya',
  'Heard about us: Google Search',
  'Details: Please quote 100 pieces, DHL to Nairobi.',
].join('\n');

// Anything the acknowledgement must never contain, regardless of input, because
// none of it is ever passed into the builder.
const FORBIDDEN_TOKENS = [
  'utm_',
  'gclid',
  'user-agent',
  'User-Agent',
  'ip_address',
  'x-forwarded',
  'New RFQ Submission',
  '[RFQ]',
  'submittedAt',
  'attribution',
  'SMTP',
  'pageUrl',
];

// ---------------------------------------------------------------------------
// Content — the promise the website makes is actually kept.
// ---------------------------------------------------------------------------

test('content: a full inquiry produces a complete, on-promise acknowledgement', () => {
  const { subject, textBody } = build({
    name: 'Alice Chen',
    email: 'alice@example.com',
    productInterest: 'LCD/OLED Screens | iPhone 15 Pro OLED',
    message: 'Need 50x iPhone 15 Pro OLED and 30x iPhone 14 battery.',
  });

  assert.match(textBody, /^Hi Alice Chen,/, 'greets the buyer by name');
  assert.match(textBody, /received your inquiry/i, 'confirms receipt');
  assert.match(textBody, /within 24 hours/i, 'restates the 24-hour promise');
  assert.match(textBody, /LCD\/OLED Screens \| iPhone 15 Pro OLED/, 'echoes the product interest');
  assert.match(textBody, /Need 50x iPhone 15 Pro OLED and 30x iPhone 14 battery\./, 'echoes their own message');
  assert.match(textBody, /reply to this email with the exact models and quantities/i, 'invites models + quantities');
  assert.match(textBody, /PRSPARES Sales Team/, 'signs off as sales');

  assert.match(subject, /PRSPARES/, 'subject is branded');
  assert.match(subject, /24 hours/i, 'subject restates the promise');
});

test('content: a missing name falls back to a neutral greeting', () => {
  const { textBody } = build({ email: 'x@y.com', message: 'hello' });
  assert.match(textBody, /^Hi there,/);
});

test('content: absent product interest / message omit their blocks but keep the invite', () => {
  const { textBody } = build({ name: 'Bob', email: 'b@c.com' });
  assert.doesNotMatch(textBody, /Product interest:/, 'no empty product-interest line');
  assert.doesNotMatch(textBody, /Your message:/, 'no empty message block');
  assert.match(textBody, /reply to this email with the exact models and quantities/i);
  assert.match(textBody, /within 24 hours/i);
});

// ---------------------------------------------------------------------------
// Safety — no internal data, ever.
// ---------------------------------------------------------------------------

test('safety: internal channel markers are stripped, buyer content is preserved', () => {
  const { textBody } = build({
    name: 'Sam',
    email: 's@e.com',
    productInterest: 'LCD/OLED Screens',
    message: ASSEMBLED_WHOLESALE_MESSAGE,
  });

  assert.doesNotMatch(textBody, /\[Wholesale Inquiry\]/, 'the internal channel marker is removed');
  assert.doesNotMatch(textBody, /Product source:/, 'the internal source URL line is removed');
  assert.doesNotMatch(textBody, /Heard about us/i, 'internal marketing attribution is removed');

  // The buyer's own details survive the strip.
  assert.match(textBody, /Selected product: iPhone 13 Pro Max OLED Screen Assembly/);
  assert.match(textBody, /Details: Please quote 100 pieces, DHL to Nairobi\./);
  assert.match(textBody, /Models\/Brands: iPhone 13 Pro Max/);
  assert.match(textBody, /Country: Kenya/);
});

test('safety: "How did you hear about us" phrasing is stripped too', () => {
  const { textBody } = build({
    email: 'x@y.com',
    message: [
      'How did you hear about us: LinkedIn ad',
      'Models/Brands: Samsung S24',
      'Details: Need 40 pieces.',
    ].join('\n'),
  });
  assert.doesNotMatch(textBody, /hear about us/i, 'the marketing-attribution line is removed');
  assert.match(textBody, /Models\/Brands: Samsung S24/, 'genuine buyer details survive');
  assert.match(textBody, /Details: Need 40 pieces\./);
});

test('safety: the acknowledgement never carries internal tracking / config tokens', () => {
  const { subject, textBody } = build({
    name: 'Buyer',
    email: 'buyer@corp.com',
    productInterest: 'Batteries',
    message: 'Need 200x iPhone 14 battery.',
  });
  const haystack = `${subject}\n${textBody}`;
  for (const token of FORBIDDEN_TOKENS) {
    assert.equal(haystack.includes(token), false, `acknowledgement must not contain "${token}"`);
  }
});

test('safety: echoed product interest is collapsed to a single line (no header break-out)', () => {
  const { textBody } = build({
    email: 'x@y.com',
    productInterest: 'Screens\r\nInjected: fake header',
    message: 'ok',
  });
  const lines = textBody.split('\n');
  assert.equal(
    lines.filter((line) => line.trim() === 'Injected: fake header').length,
    0,
    'a CR/LF in product interest must not create its own line',
  );
  const interestLine = lines.find((line) => line.startsWith('Product interest:'));
  assert.ok(interestLine && !/\r/.test(interestLine), 'product interest stays a single clean line');
});

test('safety: a very long message is capped so the courtesy stays concise', () => {
  const { textBody } = build({ email: 'x@y.com', message: 'a'.repeat(3000) });
  assert.ok(textBody.length < 2500, `expected a capped body, got ${textBody.length} chars`);
  assert.match(textBody, /…/, 'truncation is marked with an ellipsis');
});

test('safety: the builder is pure — no env, no SMTP, no I/O', () => {
  const body = sliceBalanced(readSource(SEND_RFQ_EMAIL_PATH), /function\s+buildRfqCustomerAckContent/);
  assert.notEqual(body, '', 'builder body not found');
  assert.doesNotMatch(body, /process\.env/, 'builder must not read env');
  assert.doesNotMatch(body, /sendMailWithSmtp|await|fetch\(/, 'builder must not perform I/O');
});

test('safety: the Subject header is ASCII-only (raw SMTP client does not encode headers)', () => {
  // Even with non-ASCII input the static subject must stay pure ASCII, since the
  // client neither RFC 2047-encodes headers nor negotiates SMTPUTF8.
  const { subject } = build({
    name: 'Renée Fóo',
    email: 'x@y.com',
    productInterest: 'Screens — OLED',
    message: 'café — 100 pcs',
  });
  assert.ok(/^[\x20-\x7E]*$/.test(subject), `subject must be printable ASCII, got: ${JSON.stringify(subject)}`);
  assert.doesNotMatch(subject, /—|…/, 'no em dash / ellipsis in the subject');
  assert.match(subject, /24 hours/i, 'subject still restates the promise');
});

// ---------------------------------------------------------------------------
// Mailer wiring — a distinct, automated sender that leaves the admin path alone.
// ---------------------------------------------------------------------------

test('mailer: the customer sender is automated and distinct from the admin notification', () => {
  const mailer = readSource(SEND_RFQ_EMAIL_PATH);
  const ack = sliceBalanced(mailer, /export\s+async\s+function\s+sendRfqCustomerAck/);
  assert.notEqual(ack, '', 'sendRfqCustomerAck body not found');

  assert.match(ack, /fromName:\s*'PRSPARES Sales'/, 'customer mail uses a sales From name');
  assert.match(ack, /'Auto-Submitted':\s*'auto-generated'/, 'customer mail is marked auto-generated');
  assert.match(ack, /buildRfqCustomerAckContent\(input\)/, 'body comes from the pure builder');

  // The admin path is untouched: still targets the admin inbox with the [RFQ] subject.
  assert.match(mailer, /to:\s*adminEmail/, 'admin recipient preserved');
  assert.match(mailer, /`\[RFQ\]\s\$\{payload\.name\}/, 'admin [RFQ] subject preserved');
});

// ---------------------------------------------------------------------------
// Bounded acknowledgement timeout — a captured lead can't hang on a slow ack.
// ---------------------------------------------------------------------------

test('timeout: on overrun the active socket is destroyed with a timeout error', async () => {
  let destroyedWith = 'never-called';
  const fakeSocket = { destroy: (err) => { destroyedWith = err; } };
  const cancel = armSmtpOverallTimeout(5, () => fakeSocket);
  await delay(40);
  cancel();
  assert.ok(destroyedWith instanceof Error, 'the socket must be torn down on overrun (real teardown)');
  assert.match(destroyedWith.message, /timeout/i);
});

test('timeout: cancelling before the deadline prevents any teardown (clean cleanup)', async () => {
  let destroyed = false;
  const cancel = armSmtpOverallTimeout(40, () => ({ destroy: () => { destroyed = true; } }));
  cancel();
  await delay(80);
  assert.equal(destroyed, false, 'a cancelled guard must never fire');
});

test('timeout: a non-positive bound is a no-op so the admin path stays unbounded', async () => {
  let polled = false;
  const cancel = armSmtpOverallTimeout(0, () => { polled = true; return null; });
  await delay(20);
  cancel();
  assert.equal(polled, false, 'a disabled guard must not even schedule a teardown');
});

test('timeout: a null active socket at fire time is a safe no-op', async () => {
  const cancel = armSmtpOverallTimeout(5, () => null);
  await delay(30);
  cancel();
  assert.ok(true, 'firing with no active socket must not throw');
});

test('timeout: the mailer bounds the ack but leaves the admin email unbounded', () => {
  const mailer = readSource(SEND_RFQ_EMAIL_PATH);

  // A real, positive bound, opted into only by the customer sender, kept short
  // (<= 15s) since no route/platform maxDuration bounds the request otherwise.
  const boundMs = Number((/export const CUSTOMER_ACK_TIMEOUT_MS = ([\d_]+);/.exec(mailer)?.[1] ?? '').replace(/_/g, ''));
  assert.ok(boundMs > 0 && boundMs <= 15_000, `customer bound must be a positive value <= 15000ms, got ${boundMs}`);
  const ack = sliceBalanced(mailer, /export\s+async\s+function\s+sendRfqCustomerAck/);
  assert.match(ack, /overallTimeoutMs:\s*CUSTOMER_ACK_TIMEOUT_MS/, 'the ack passes the bound');

  const adminSend = sliceBalanced(mailer, /export\s+async\s+function\s+sendRfqEmail/);
  assert.notEqual(adminSend, '', 'admin sender body not found');
  assert.doesNotMatch(adminSend, /overallTimeoutMs/, 'admin email must remain unbounded (unchanged)');

  // sendMailWithSmtp arms the guard from the param and always cancels it.
  assert.match(
    mailer,
    /armSmtpOverallTimeout\(\s*params\.overallTimeoutMs\s*\?\?\s*0\s*,\s*\(\)\s*=>\s*activeSocket\s*\)/,
    'guard is armed from overallTimeoutMs and tracks the active socket',
  );
  assert.match(mailer, /finally\s*\{\s*cancelOverallTimeout\(\);\s*\}/, 'guard is cancelled in a finally (no timer leak)');

  // The guard performs a real teardown, not a background-leaking Promise.race.
  const guard = sliceBalanced(mailer, /export function armSmtpOverallTimeout/);
  assert.match(guard, /socket\.destroy\(/, 'guard destroys the underlying socket');
  assert.match(guard, /clearTimeout\(/, 'disposer clears the timer');
  assert.doesNotMatch(mailer, /Promise\.race/, 'no Promise.race left racing SMTP in the background');
});

// ---------------------------------------------------------------------------
// Route wiring — gating, non-fatal failure, no conflation, safe payload.
// ---------------------------------------------------------------------------

const ROUTES = [
  {
    label: SEND_RFQ_ROUTE_PATH,
    // send-rfq-email must never hand the ack IP / page URL / attribution / UA.
    forbiddenArgTokens: ['ip', 'pageUrl', 'attribution', 'userAgent', 'submittedAt'],
  },
  {
    label: LP_INQUIRY_ROUTE_PATH,
    // lp-inquiry must never echo the internal source, the structured admin
    // message, or the qualifier fields back to the buyer.
    forbiddenArgTokens: ['source', 'structuredMessage', 'monthlyVolume', 'heardAbout', 'ip', 'pageUrl', 'attribution', 'userAgent'],
  },
];

for (const route of ROUTES) {
  test(`route ${route.label}: ack is gated behind a successful core capture`, () => {
    const src = readSource(route.label);
    const idxGate = src.indexOf('if (!dbOk && !emailOk)');
    const idxGuard = src.indexOf('if (dbOk || emailOk)');
    const idxCall = src.indexOf('sendRfqCustomerAck(');

    assert.ok(idxGate !== -1, 'the double-failure 5xx gate must stay');
    assert.ok(idxGuard > idxGate, 'ack must be guarded by (dbOk || emailOk), after the 5xx gate');
    assert.ok(idxCall > idxGuard, 'the ack call must sit inside that guard');
    assert.equal(src.split('sendRfqCustomerAck(').length - 1, 1, 'exactly one ack call');
  });

  test(`route ${route.label}: ack is not a capture channel and cannot fail the request`, () => {
    const src = readSource(route.label);
    const idxGate = src.indexOf('if (!dbOk && !emailOk)');
    const idxGuard = src.indexOf('if (dbOk || emailOk)');
    const idxSuccess = src.indexOf('return NextResponse.json({ success: true', idxGuard);
    assert.ok(idxSuccess > idxGuard, 'a single success return must follow the ack block');

    const ackRegion = src.slice(idxGuard, idxSuccess);
    assert.match(ackRegion, /try\s*\{/, 'ack must be wrapped in try/catch');
    assert.match(ackRegion, /catch\s*\(/, 'ack must catch its own failure');
    assert.match(ackRegion, /customerAckError/, 'ack failure is captured for logging');
    assert.match(ackRegion, /console\.error/, 'ack failure is logged');
    assert.doesNotMatch(ackRegion, /status:\s*5\d\d/, 'ack failure must not emit a 5xx');
    assert.doesNotMatch(ackRegion, /\breturn\b/, 'ack failure must not short-circuit the handler');
    assert.doesNotMatch(ackRegion, /\bthrow\b/, 'ack failure must not rethrow');

    // The 5xx gate must ignore the ack entirely — it is not a third channel.
    const gateBlock = sliceBalanced(src.slice(idxGate), /if\s*\(!dbOk\s*&&\s*!emailOk\)/);
    assert.match(gateBlock, /status:\s*500/, 'gate still returns 500 on double failure');
    assert.doesNotMatch(gateBlock, /customerAck/, 'the 5xx gate must not consider the ack');
  });

  test(`route ${route.label}: ack status is reported separately from the admin email`, () => {
    const src = readSource(route.label);
    assert.match(
      src,
      /return NextResponse\.json\(\{\s*success:\s*true,\s*dbOk,\s*emailOk,\s*customerAckOk\s*\}\)/,
      'success response must expose customerAckOk alongside (not merged into) emailOk',
    );
  });

  test(`route ${route.label}: ack receives only safe buyer-facing fields`, () => {
    const src = readSource(route.label);
    const argObject = sliceBalanced(src, /sendRfqCustomerAck\s*\(/);
    assert.notEqual(argObject, '', 'could not read the sendRfqCustomerAck argument object');

    for (const key of ['name', 'email', 'productInterest', 'message']) {
      assert.ok(payloadSendsKey(argObject, key), `ack must send "${key}"`);
    }
    for (const token of route.forbiddenArgTokens) {
      assert.doesNotMatch(
        argObject,
        new RegExp(`\\b${token}\\b`),
        `ack argument must not include "${token}"`,
      );
    }
  });
}
