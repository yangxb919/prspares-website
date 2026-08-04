import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * RFQ form contract checker (V2 safety pass).
 *
 * Companion to tracking-contract.mjs. That module guards the *tracking* shape
 * (one awaited submit, one generate_lead, correct order). This module guards the
 * *payload and form* shape that the sales team actually reads:
 *
 *   - the RFQ payload keeps the fields Hermes/Zoho triage depends on;
 *   - a `?product=` deep link never ghost-writes the buyer's requirement text;
 *   - the requirement textarea is genuinely empty by default, so a placeholder
 *     can never be submitted as if the buyer had typed it;
 *   - the client never gates submission harder than the server does
 *     (2026-06-17 leak: strict client + lenient server = real buyers blocked).
 *
 * Like tracking-contract.mjs this is deliberately text/regex based so it stays
 * dependency-free. It is not a TypeScript or HTML parser. Keep the anchors it
 * relies on (named constants, direct call syntax, stable element ids) intact.
 */

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const WHOLESALE_INQUIRY_PATH = 'src/app/wholesale-inquiry/page.tsx';
export const LANDING_PAGE_PATH = 'public/lp/google-ads-factory-direct.html';
export const SEND_RFQ_ROUTE_PATH = 'src/app/api/send-rfq-email/route.ts';
export const LP_INQUIRY_ROUTE_PATH = 'src/app/api/lp-inquiry/route.ts';
export const SEND_RFQ_EMAIL_PATH = 'src/lib/email/sendRfqEmail.ts';

/** Payload keys the admin RFQ email and Supabase row are built from. */
export const REQUIRED_PAYLOAD_KEYS = ['name', 'email', 'message', 'productInterest', 'pageUrl'];

/**
 * What the RFQ path actually rejects on:
 *   src/app/api/send-rfq-email/route.ts:70 -> `if (!name || !email || !message)`
 *   src/lib/rfq-client.ts validate()       -> throws 'Message is required'
 * (Only /api/lp-inquiry is the looser name+email pair.)
 */
export const SERVER_REQUIRED_FIELDS = ['email', 'message', 'name'];

/**
 * The exact sentence the old deep-link prefill injected into `message`.
 * Regression anchor: buyers saw a pre-filled box and stopped writing their real
 * need, which is how RFQs arrived with mutually contradictory fields.
 */
export const DEEPLINK_TEMPLATE_SENTENCE = 'Please quote a better wholesale price for this product line';

/** Model tokens that make an example read as a real procurement line. */
const MODEL_TOKEN_PATTERN = /\b(iPhone|Samsung|Galaxy|Redmi|Xiaomi|Oppo|Vivo|Tecno|Infinix|Pixel|iPad)\b/i;
/** Quantity tokens such as `x20` / `x 30`. */
const QUANTITY_TOKEN_PATTERN = /\bx\s?\d{1,4}\b/gi;

export function readSource(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

/**
 * Does an object-literal source send `key`? Accepts both `key: value` and ES6
 * shorthand (`{ key, other }`) — a payload that switches to shorthand still
 * sends the field, and treating that as "missing" would be a false alarm.
 */
export function payloadSendsKey(objectSource, key) {
  return new RegExp(`(^|[{,\\s])${key}\\s*(?=[:,}])`).test(objectSource);
}

function violation(code, message) {
  return { code, message };
}

function result(label, violations) {
  return { label, ok: violations.length === 0, violations };
}

/**
 * Slice a balanced block starting at the first `open` character found at or
 * after `startPattern`. Returns '' when the anchor is missing.
 */
export function sliceBalanced(source, startPattern, open = '{', close = '}') {
  const anchor = new RegExp(startPattern.source, startPattern.flags).exec(source);
  if (!anchor) return '';

  const start = source.indexOf(open, anchor.index);
  if (start === -1) return '';

  let depth = 0;
  for (let i = start; i < source.length; i += 1) {
    const char = source[i];
    if (char === open) depth += 1;
    else if (char === close) {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  return '';
}

/** The `useEffect` body that reads `?product=` / `?category=` / `?productUrl=`. */
export function extractDeepLinkEffect(source) {
  return sliceBalanced(source, /useEffect\(\s*\(\)\s*=>\s*\{[\s\S]{0,400}?searchParams\.get\(\s*'product'/);
}

/** The argument object literal passed to `submitRfqAndNotify(...)`. */
export function extractSubmitPayload(source) {
  return sliceBalanced(source, /await\s+submitRfqAndNotify\s*\(/, '{', '}');
}

/** The body of the client-side `validate()` guard. */
export function extractValidateBody(source) {
  return sliceBalanced(source, /const\s+validate\s*=\s*\(\)/);
}

/** Field names the client blocks submission on, e.g. ['email','message','name']. */
export function extractClientRequiredFields(source) {
  const body = extractValidateBody(source);
  const fields = new Set();
  for (const match of body.matchAll(/\berrs\.([A-Za-z0-9_]+)\s*=/g)) {
    fields.add(match[1]);
  }
  return [...fields].sort();
}

/**
 * Lift `resolveDeepLink` (and the category map it closes over) out of the page
 * and return it as a live, callable function.
 *
 * This executes the production code itself rather than a mirror of it. The page
 * is TSX, so a narrow, explicit set of type annotations is stripped first; the
 * strip list is exhaustive for this function by design, and anything missed
 * surfaces immediately as a SyntaxError from `new Function`.
 */
export function loadResolveDeepLink(source = readSource(WHOLESALE_INQUIRY_PATH)) {
  const mapSource = sliceBalanced(source, /const\s+DEEP_LINK_CATEGORY_MAP/);
  if (!mapSource) throw new Error('DEEP_LINK_CATEGORY_MAP not found in the page source');

  const fnStart = source.indexOf('function resolveDeepLink');
  if (fnStart === -1) throw new Error('resolveDeepLink not found in the page source');
  const fnBody = sliceBalanced(source.slice(fnStart), /function\s+resolveDeepLink/);
  if (!fnBody) throw new Error('resolveDeepLink body could not be sliced');

  const signature = source
    .slice(fnStart, source.indexOf('{', fnStart))
    .replace('productParam: string, categoryParam: string, productUrl: string', 'productParam, categoryParam, productUrl')
    .replace(': DeepLinkResolution', '');

  const program = `
    const DEEP_LINK_CATEGORY_MAP = ${mapSource};
    ${signature}${fnBody}
    return resolveDeepLink;
  `;

  // A SyntaxError here means an annotation escaped the strip list — fail loudly.
  return new Function(program)();
}

/** Value of a named template-literal constant, e.g. REQUIREMENT_PLACEHOLDER. */
export function extractTemplateConstant(source, constantName) {
  const pattern = new RegExp(`const\\s+${constantName}\\s*=\\s*\`([\\s\\S]*?)\``);
  return pattern.exec(source)?.[1] ?? '';
}

/** Full `<textarea ...>...</textarea>` element text for a given id. */
export function extractTextareaElement(html, elementId) {
  const start = html.indexOf(`<textarea id="${elementId}"`);
  if (start === -1) return '';
  const end = html.indexOf('</textarea>', start);
  if (end === -1) return '';
  return html.slice(start, end + '</textarea>'.length);
}

/** Text between `>` and `</textarea>` — must be blank for an empty default. */
export function extractTextareaInnerText(element) {
  const open = element.indexOf('>');
  const close = element.indexOf('</textarea>');
  if (open === -1 || close === -1) return '';
  return element.slice(open + 1, close);
}

export function extractAttribute(element, attributeName) {
  const pattern = new RegExp(`${attributeName}="([^"]*)"`);
  return pattern.exec(element)?.[1] ?? '';
}

/** `<option value="...">` values of a `<select>` with the given id. */
export function extractSelectValues(html, elementId) {
  const start = html.indexOf(`<select id="${elementId}"`);
  if (start === -1) return [];
  const end = html.indexOf('</select>', start);
  if (end === -1) return [];
  const block = html.slice(start, end);
  return Array.from(block.matchAll(/<option\s+value="([^"]*)"/g))
    .map((match) => match[1])
    .filter((value) => value.length > 0);
}

/**
 * An example is "real" when it names at least one phone model and shows at
 * least two explicit quantities — i.e. it demonstrates the model x qty shape we
 * want buyers to copy, not an abstract instruction.
 */
export function describesModelTimesQuantity(text) {
  const quantityMatches = text.match(QUANTITY_TOKEN_PATTERN) ?? [];
  return MODEL_TOKEN_PATTERN.test(text) && quantityMatches.length >= 2;
}

export function checkWholesaleInquiryForm(source, label = WHOLESALE_INQUIRY_PATH) {
  const violations = [];

  // --- payload shape -------------------------------------------------------
  const payload = extractSubmitPayload(source);
  if (!payload) {
    violations.push(violation('PAYLOAD_MISSING', `${label}: could not locate the submitRfqAndNotify payload.`));
  } else {
    for (const key of REQUIRED_PAYLOAD_KEYS) {
      if (!payloadSendsKey(payload, key)) {
        violations.push(violation('PAYLOAD_KEY', `${label}: RFQ payload no longer sends "${key}".`));
      }
    }
  }

  // --- deep link must not ghost-write the buyer's words --------------------
  if (source.includes(DEEPLINK_TEMPLATE_SENTENCE)) {
    violations.push(
      violation('DEEPLINK_TEMPLATE', `${label}: deep-link template sentence must not be written into the form.`),
    );
  }

  const deepLinkEffect = extractDeepLinkEffect(source);
  if (!deepLinkEffect) {
    violations.push(violation('DEEPLINK_EFFECT_MISSING', `${label}: could not locate the ?product= deep-link effect.`));
  } else if (/(^|[{,\s])message\s*:/.test(deepLinkEffect)) {
    violations.push(
      violation('DEEPLINK_WRITES_MESSAGE', `${label}: the ?product= effect must not assign to "message".`),
    );
  }

  // --- requirement textarea is empty by default ---------------------------
  if (!/message:\s*''/.test(source)) {
    violations.push(violation('MESSAGE_NOT_EMPTY', `${label}: form state must initialise "message" to an empty string.`));
  }
  if (/name="message"[\s\S]{0,400}?defaultValue=/.test(source)) {
    violations.push(
      violation('MESSAGE_DEFAULT_VALUE', `${label}: the requirement textarea must not use defaultValue.`),
    );
  }

  // --- placeholder carries a real model x qty example ---------------------
  const placeholder = extractTemplateConstant(source, 'REQUIREMENT_PLACEHOLDER');
  if (!placeholder) {
    violations.push(
      violation('PLACEHOLDER_MISSING', `${label}: expected a REQUIREMENT_PLACEHOLDER template constant.`),
    );
  } else if (!describesModelTimesQuantity(placeholder)) {
    violations.push(
      violation('PLACEHOLDER_WEAK', `${label}: placeholder must show a real model x quantity example.`),
    );
  }

  // --- client gate must mirror the server, no more and no less -------------
  // /api/send-rfq-email:70 rejects unless name + email + message are present,
  // and rfq-client validate() throws 'Message is required' before that. The
  // client must gate on exactly those three: fewer means the page ships an
  // empty requirement that only its own '[Wholesale Inquiry]' prefix satisfies;
  // more re-creates the 2026-06-17 over-blocking leak.
  const clientRequired = extractClientRequiredFields(source);
  const extraGates = clientRequired.filter((field) => !SERVER_REQUIRED_FIELDS.includes(field));
  const missingGates = SERVER_REQUIRED_FIELDS.filter((field) => !clientRequired.includes(field));

  if (extraGates.length > 0) {
    violations.push(
      violation(
        'CLIENT_GATE_STRICTER',
        `${label}: client blocks on ${extraGates.join(', ')}, which the server does not require.`,
      ),
    );
  }
  if (missingGates.length > 0) {
    violations.push(
      violation(
        'CLIENT_GATE_LOOSER',
        `${label}: client does not gate on ${missingGates.join(', ')}, but the server requires it.`,
      ),
    );
  }

  // The message gate must read the buyer's field, not the assembled payload.
  const validateBody = extractValidateBody(source);
  if (validateBody && !/formData\.message/.test(validateBody)) {
    violations.push(
      violation(
        'MESSAGE_GATE_NOT_BUYER_TEXT',
        `${label}: the message gate must validate formData.message, not system-generated text.`,
      ),
    );
  }

  return result(label, violations);
}

export function checkLandingPageForm(html, label = LANDING_PAGE_PATH) {
  const violations = [];

  const textarea = extractTextareaElement(html, 'f-message');
  if (!textarea) {
    violations.push(violation('TEXTAREA_MISSING', `${label}: could not locate the #f-message textarea.`));
  } else {
    if (extractTextareaInnerText(textarea).trim() !== '') {
      violations.push(
        violation('TEXTAREA_PREFILLED', `${label}: the requirement textarea must ship empty, not pre-filled.`),
      );
    }
    if (/\svalue="/.test(textarea)) {
      violations.push(violation('TEXTAREA_VALUE_ATTR', `${label}: the requirement textarea must not carry a value attribute.`));
    }
    const placeholder = extractAttribute(textarea, 'placeholder');
    if (!describesModelTimesQuantity(placeholder)) {
      violations.push(
        violation('PLACEHOLDER_WEAK', `${label}: placeholder must show a real model x quantity example.`),
      );
    }
  }

  // The submit path is out of scope for this phase — pin it so it stays put.
  if (!/apiEndpoint:\s*['"]\/api\/lp-inquiry['"]/.test(html)) {
    violations.push(violation('ENDPOINT_CHANGED', `${label}: LP endpoint must remain /api/lp-inquiry.`));
  }

  const leadPushes = Array.from(html.matchAll(/event:\s*'generate_lead'/g)).length;
  if (leadPushes !== 1) {
    violations.push(violation('LEAD_COUNT', `${label}: expected exactly one generate_lead push; found ${leadPushes}.`));
  }

  const okGuardIndex = html.indexOf('if (!response.ok)');
  const leadIndex = html.indexOf("event: 'generate_lead'");
  if (okGuardIndex === -1 || leadIndex === -1 || leadIndex < okGuardIndex) {
    violations.push(
      violation('LEAD_ORDER', `${label}: generate_lead must fire only after the response.ok guard.`),
    );
  }

  // No hard-required destination field on the paid LP (friction red line).
  if (/<input[^>]*name="(country|city)"[^>]*\srequired/i.test(html)) {
    violations.push(violation('LP_HARD_REQUIRED_GEO', `${label}: LP must not hard-require a city/country field.`));
  }

  // Category vocabulary must be mergeable with the main site.
  const canonicalRoots = ['LCD/OLED Screens', 'Batteries', 'Small Parts', 'IC Chips & Repair Tools', 'Multiple Categories'];
  const lpValues = extractSelectValues(html, 'f-product');
  if (lpValues.length === 0) {
    violations.push(violation('CATEGORY_MISSING', `${label}: could not read #f-product option values.`));
  } else {
    for (const value of lpValues) {
      const root = value.split('|')[0].trim();
      if (!canonicalRoots.includes(root)) {
        violations.push(
          violation('CATEGORY_VOCABULARY', `${label}: category "${value}" does not start with a main-site category.`),
        );
      }
    }
  }

  return result(label, violations);
}

/**
 * Production invariants this phase must not disturb. Read-only assertions over
 * files that are explicitly out of the allowed edit scope.
 */
export function checkServerInvariants() {
  const violations = [];

  const lpRoute = readSource(LP_INQUIRY_ROUTE_PATH);
  const sendRoute = readSource(SEND_RFQ_ROUTE_PATH);
  const mailer = readSource(SEND_RFQ_EMAIL_PATH);

  for (const [label, source] of [[LP_INQUIRY_ROUTE_PATH, lpRoute], [SEND_RFQ_ROUTE_PATH, sendRoute]]) {
    const dbIndex = source.indexOf("from('contact_submissions')");
    const mailIndex = source.indexOf('sendRfqEmail(');
    if (dbIndex === -1 || mailIndex === -1 || dbIndex > mailIndex) {
      violations.push(violation('DUAL_CHANNEL_ORDER', `${label}: must write Supabase before sending the admin email.`));
    }
    if (!/if\s*\(!dbOk\s*&&\s*!emailOk\)/.test(source)) {
      violations.push(
        violation('FAIL_ONLY_IF_BOTH', `${label}: must only fail the request when both DB and email failed.`),
      );
    }
  }

  if (!/to:\s*adminEmail/.test(mailer)) {
    violations.push(violation('ADMIN_RECIPIENT', `${SEND_RFQ_EMAIL_PATH}: admin email recipient must stay adminEmail.`));
  }
  if (!/`\[RFQ\]\s\$\{payload\.name\}/.test(mailer)) {
    violations.push(violation('SUBJECT_PREFIX', `${SEND_RFQ_EMAIL_PATH}: admin email subject must keep the [RFQ] prefix.`));
  }

  return result('server invariants', violations);
}
