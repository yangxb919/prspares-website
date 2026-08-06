import net from 'node:net';
import tls from 'node:tls';

export interface RfqEmailInput {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  productInterest?: string;
  message: string;
  pageUrl?: string;
  ip?: string;
  submittedAt?: string;
}

interface SmtpResponse {
  code: number;
  lines: string[];
}

type SocketLike = net.Socket | tls.TLSSocket;

type Waiter = {
  resolve: (value: SmtpResponse) => void;
  reject: (reason: Error) => void;
  timer: NodeJS.Timeout;
};

class SmtpResponseReader {
  private buffer = '';
  private currentLines: string[] = [];
  private queuedResponses: SmtpResponse[] = [];
  private waiters: Waiter[] = [];
  private isClosed = false;

  constructor(private socket: SocketLike) {
    this.socket.on('data', this.onData);
    this.socket.on('error', this.onError);
    this.socket.on('close', this.onClose);
    this.socket.on('end', this.onClose);
  }

  private onData = (chunk: Buffer) => {
    this.buffer += chunk.toString('utf8');
    let delimiterIndex = this.buffer.indexOf('\r\n');
    while (delimiterIndex !== -1) {
      const line = this.buffer.slice(0, delimiterIndex);
      this.buffer = this.buffer.slice(delimiterIndex + 2);
      if (line) {
        this.currentLines.push(line);
        const match = /^(\d{3})([ -])/.exec(line);
        if (match && match[2] === ' ') {
          const response: SmtpResponse = {
            code: Number(match[1]),
            lines: [...this.currentLines],
          };
          this.currentLines = [];
          const waiter = this.waiters.shift();
          if (waiter) {
            clearTimeout(waiter.timer);
            waiter.resolve(response);
          } else {
            this.queuedResponses.push(response);
          }
        }
      }
      delimiterIndex = this.buffer.indexOf('\r\n');
    }
  };

  private onError = (error: Error) => this.rejectAll(error);
  private onClose = () => {
    this.isClosed = true;
    this.rejectAll(new Error('SMTP connection closed'));
  };

  private rejectAll(error: Error) {
    while (this.waiters.length > 0) {
      const waiter = this.waiters.shift();
      if (!waiter) continue;
      clearTimeout(waiter.timer);
      waiter.reject(error);
    }
  }

  nextResponse(timeoutMs = 15000): Promise<SmtpResponse> {
    if (this.queuedResponses.length > 0) {
      return Promise.resolve(this.queuedResponses.shift() as SmtpResponse);
    }
    if (this.isClosed) {
      return Promise.reject(new Error('SMTP connection is closed'));
    }
    return new Promise<SmtpResponse>((resolve, reject) => {
      const timer = setTimeout(() => {
        const idx = this.waiters.findIndex((w) => w.timer === timer);
        if (idx >= 0) this.waiters.splice(idx, 1);
        reject(new Error('SMTP response timeout'));
      }, timeoutMs);
      this.waiters.push({ resolve, reject, timer });
    });
  }

  dispose() {
    this.socket.off('data', this.onData);
    this.socket.off('error', this.onError);
    this.socket.off('close', this.onClose);
    this.socket.off('end', this.onClose);
    this.rejectAll(new Error('SMTP reader disposed'));
  }
}

function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

async function openSocket(
  host: string,
  port: number,
  timeoutMs: number,
  onSocket?: (socket: net.Socket) => void
): Promise<net.Socket> {
  return new Promise<net.Socket>((resolve, reject) => {
    const socket = net.createConnection({ host, port });
    // Expose the socket synchronously so an overall-timeout guard can destroy it
    // even while the connection is still being established (a destroy(err) here
    // rejects this promise via the 'error' listener below).
    if (onSocket) onSocket(socket);
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => resolve(socket));
    socket.once('timeout', () => {
      socket.destroy();
      reject(new Error('SMTP socket connection timeout'));
    });
    socket.once('error', reject);
  });
}

/**
 * Arm a one-shot overall-timeout for an SMTP exchange. When it fires it destroys
 * whatever socket `getSocket()` currently returns, so no SMTP work continues in
 * the background — a real teardown, not a timeout that leaves the socket running.
 * Returns a disposer that cancels the timer. `timeoutMs <= 0`
 * disables it (used by the admin path, whose behaviour must stay unchanged).
 *
 * Pure of network I/O so it is unit-testable with a fake socket and a short timer.
 */
export function armSmtpOverallTimeout(timeoutMs: number, getSocket: () => SocketLike | null): () => void {
  if (!(timeoutMs > 0)) return () => {};
  const timer = setTimeout(() => {
    const socket = getSocket();
    if (socket) socket.destroy(new Error('SMTP overall timeout'));
  }, timeoutMs);
  return () => clearTimeout(timer);
}

async function upgradeSocketToTLS(socket: net.Socket, host: string, timeoutMs: number): Promise<tls.TLSSocket> {
  const rejectUnauthorized = process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false';
  const servername = net.isIP(host) ? undefined : host;
  return new Promise<tls.TLSSocket>((resolve, reject) => {
    const secureSocket = tls.connect(
      { socket, servername, minVersion: 'TLSv1.2', rejectUnauthorized },
      () => resolve(secureSocket)
    );
    secureSocket.setTimeout(timeoutMs);
    secureSocket.once('timeout', () => {
      secureSocket.destroy();
      reject(new Error('SMTP TLS handshake timeout'));
    });
    secureSocket.once('error', reject);
  });
}

async function sendCommand(
  socket: SocketLike,
  reader: SmtpResponseReader,
  command: string,
  expectedCodes: number[],
  stepName: string
): Promise<SmtpResponse> {
  socket.write(`${command}\r\n`);
  const response = await reader.nextResponse();
  if (!expectedCodes.includes(response.code)) {
    throw new Error(`${stepName} failed (${response.code}): ${response.lines.join(' | ')}`);
  }
  return response;
}

async function sendMailWithSmtp(params: {
  host: string;
  port: number;
  user: string;
  pass: string;
  to: string;
  subject: string;
  textBody: string;
  /** Display name for the From header. Defaults to the admin RFQ identity. */
  fromName?: string;
  /** Extra headers (e.g. Auto-Submitted). Key + value are injection-sanitised. */
  headers?: Record<string, string>;
  /**
   * Optional wall-clock cap on the whole exchange. When it fires the active
   * socket is destroyed so the exchange cannot hang past this bound. `<= 0`
   * (the default) disables it, preserving the admin path's existing behaviour.
   */
  overallTimeoutMs?: number;
}) {
  const timeoutMs = 15000;
  const ehloName = process.env.SMTP_EHLO_NAME || 'localhost';
  const fromAddress = sanitizeHeaderValue(params.user);
  const toAddress = sanitizeHeaderValue(params.to);
  const fromName = sanitizeHeaderValue(params.fromName || 'PRSPARES RFQ');

  // Bound the whole exchange (connect through QUIT) and tear the socket down if
  // it overruns. activeSocket always points at the socket currently in use.
  let activeSocket: SocketLike | null = null;
  const cancelOverallTimeout = armSmtpOverallTimeout(params.overallTimeoutMs ?? 0, () => activeSocket);

  try {
    const plainSocket = await openSocket(params.host, params.port, timeoutMs, (socket) => {
      activeSocket = socket;
    });
    let plainReader = new SmtpResponseReader(plainSocket);

    try {
      const greeting = await plainReader.nextResponse();
      if (greeting.code !== 220) {
        throw new Error(`SMTP greeting failed (${greeting.code}): ${greeting.lines.join(' | ')}`);
      }
      await sendCommand(plainSocket, plainReader, `EHLO ${ehloName}`, [250], 'EHLO');
      await sendCommand(plainSocket, plainReader, 'STARTTLS', [220], 'STARTTLS');
      plainReader.dispose();

      const secureSocket = await upgradeSocketToTLS(plainSocket, params.host, timeoutMs);
      activeSocket = secureSocket;
      const secureReader = new SmtpResponseReader(secureSocket);

      try {
        await sendCommand(secureSocket, secureReader, `EHLO ${ehloName}`, [250], 'EHLO after STARTTLS');
        await sendCommand(secureSocket, secureReader, 'AUTH LOGIN', [334], 'AUTH LOGIN');
        await sendCommand(
          secureSocket, secureReader,
          Buffer.from(params.user, 'utf8').toString('base64'),
          [334], 'SMTP username'
        );
        await sendCommand(
          secureSocket, secureReader,
          Buffer.from(params.pass, 'utf8').toString('base64'),
          [235], 'SMTP password'
        );
        await sendCommand(secureSocket, secureReader, `MAIL FROM:<${fromAddress}>`, [250], 'MAIL FROM');
        await sendCommand(secureSocket, secureReader, `RCPT TO:<${toAddress}>`, [250, 251], 'RCPT TO');
        await sendCommand(secureSocket, secureReader, 'DATA', [354], 'DATA');

        const headerLines = [
          `From: ${fromName} <${fromAddress}>`,
          `To: ${toAddress}`,
          `Subject: ${sanitizeHeaderValue(params.subject)}`,
          `Date: ${new Date().toUTCString()}`,
          'MIME-Version: 1.0',
          'Content-Type: text/plain; charset=UTF-8',
          'Content-Transfer-Encoding: 8bit',
        ];
        // Optional extra headers. Sanitise both key and value so a caller can never
        // inject a CRLF (fake header) or a stray colon into the header block.
        for (const [rawKey, rawValue] of Object.entries(params.headers || {})) {
          const key = sanitizeHeaderValue(rawKey).replace(/[\s:]+$/, '').replace(/[\s:]+/g, '-');
          const value = sanitizeHeaderValue(rawValue);
          if (key && value) headerLines.push(`${key}: ${value}`);
        }

        const emailMessage = [...headerLines, '', params.textBody]
          .join('\r\n')
          .replace(/^\./gm, '..');

        secureSocket.write(`${emailMessage}\r\n.\r\n`);
        const dataResponse = await secureReader.nextResponse();
        if (dataResponse.code !== 250) {
          throw new Error(`Message body rejected (${dataResponse.code}): ${dataResponse.lines.join(' | ')}`);
        }
        await sendCommand(secureSocket, secureReader, 'QUIT', [221], 'QUIT');
        secureSocket.end();
      } finally {
        secureReader.dispose();
      }
    } finally {
      plainReader.dispose();
      plainSocket.end();
    }
  } finally {
    cancelOverallTimeout();
  }
}

/**
 * Send an RFQ notification email. Throws on any failure (env missing, SMTP error, etc.).
 * Caller is responsible for catching and deciding HTTP response.
 */
export async function sendRfqEmail(input: RfqEmailInput): Promise<void> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPortRaw = process.env.SMTP_PORT || '587';
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const adminEmail = process.env.SMTP_TEST_TO || process.env.SMTP_USER;
  const smtpPort = Number(smtpPortRaw);

  if (!smtpHost || !smtpUser || !smtpPass || !adminEmail || Number.isNaN(smtpPort)) {
    throw new Error('SMTP is not fully configured (need SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS).');
  }

  const payload: Required<Omit<RfqEmailInput, 'company' | 'phone' | 'productInterest' | 'pageUrl' | 'ip' | 'submittedAt'>> & RfqEmailInput = {
    name: input.name,
    email: input.email,
    company: input.company || '',
    phone: input.phone || '',
    productInterest: input.productInterest || '',
    message: input.message,
    pageUrl: input.pageUrl || '',
    ip: input.ip || '',
    submittedAt: input.submittedAt || new Date().toISOString(),
  };

  const emailBody = [
    'New RFQ Submission',
    '',
    `name: ${payload.name}`,
    `email: ${payload.email}`,
    `company: ${payload.company || 'N/A'}`,
    `phone: ${payload.phone || 'N/A'}`,
    `productInterest: ${payload.productInterest || 'N/A'}`,
    'message:',
    payload.message,
    '',
    `pageUrl: ${payload.pageUrl || 'N/A'}`,
    `ip: ${payload.ip || 'N/A'}`,
    `submittedAt: ${payload.submittedAt}`,
  ].join('\n');

  const subjectSuffix = payload.company ? ` - ${payload.company}` : '';
  const subject = `[RFQ] ${payload.name}${subjectSuffix}`;

  console.info('[RFQ email] Sending notification:', {
    host: smtpHost, port: smtpPort, to: adminEmail, from: smtpUser, requester: payload.email,
  });

  await sendMailWithSmtp({
    host: smtpHost, port: smtpPort, user: smtpUser, pass: smtpPass,
    to: adminEmail, subject, textBody: emailBody,
  });

  console.info('[RFQ email] Notification sent successfully:', {
    to: adminEmail, requester: payload.email, submittedAt: payload.submittedAt,
  });
}

export interface RfqCustomerAckInput {
  /** Buyer's name — used only for a friendly greeting. */
  name?: string;
  /** Buyer's email — the acknowledgement recipient. Required. */
  email: string;
  /** Buyer-facing product interest. Never the internal source fallback. */
  productInterest?: string;
  /** The buyer's own message. Internal channel markers are stripped on echo. */
  message?: string;
}

export interface RfqCustomerAckContent {
  subject: string;
  textBody: string;
}

/**
 * Build the plain-text buyer acknowledgement (subject + body).
 *
 * Pure and deterministic — no env, no I/O, no clock — so it is unit-testable
 * without SMTP. It only ever emits buyer-facing content: the buyer's own name,
 * the product interest they selected, and their own message. It deliberately
 * does NOT accept (so cannot echo) IP, user-agent, attribution, UTM/gclid,
 * internal source values, pageUrl, admin subject prefixes, or SMTP config.
 * Any internal channel markers that slipped into an assembled message
 * (`[Wholesale Inquiry]`, `Product source: <url>`) are stripped before echo.
 */
export function buildRfqCustomerAckContent(input: RfqCustomerAckInput): RfqCustomerAckContent {
  // Lines that must never be shown to the buyer even if they appear inside an
  // assembled admin message: internal channel markers, the internal product-source
  // URL, and the "heard about us" marketing-attribution answer. Everything else
  // (models, country, selected product, the buyer's own details) is their own text.
  const internalLine = /^\s*(\[(?:wholesale inquiry|landing page inquiry|rfq)\]|product source\s*:|(?:how did you hear|heard) about us\s*:)/i;

  const trimmedName = (input.name || '').replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
  const name = trimmedName || 'there';
  const productInterest = (input.productInterest || '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Evolving-array pattern (let + push) keeps this annotation-free so the same
  // source can be lifted and executed directly by the contract test.
  let keptLines = [];
  for (const rawLine of String(input.message || '').split(/\r?\n/)) {
    const line = rawLine.replace(/\t+/g, ' ').replace(/\s+$/, '');
    if (internalLine.test(line)) continue;
    keptLines.push(line);
  }
  let message = keptLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  if (message.length > 1500) message = `${message.slice(0, 1500).trim()}…`;

  const lines = [
    `Hi ${name},`,
    '',
    'Thank you for contacting PRSPARES — we have received your inquiry.',
    'Our sales team will review your request and get back to you within 24 hours.',
  ];
  if (productInterest) lines.push('', `Product interest: ${productInterest}`);
  if (message) lines.push('', 'Your message:', message);
  lines.push(
    '',
    'If anything is missing, simply reply to this email with the exact models and quantities you need and we will send you an accurate quote.',
    '',
    'Best regards,',
    'PRSPARES Sales Team',
  );

  return {
    // ASCII-only Subject: the raw SMTP client does not RFC 2047-encode headers
    // nor negotiate SMTPUTF8, so a non-ASCII subject would be mojibake on the
    // wire. Body UTF-8 is fine (8bit + charset=UTF-8).
    subject: 'PRSPARES - Inquiry received, response within 24 hours',
    textBody: lines.join('\n'),
  };
}

/**
 * Wall-clock cap for the buyer acknowledgement exchange. It runs after the lead
 * is already captured (DB + admin notification), so a slow/hung SMTP server must
 * not keep the request open — that would make the courtesy behave like a fatal
 * step and invite duplicate client retries. No route/platform maxDuration is
 * configured in this repo, so this bound is what keeps the request bounded; keep
 * it short but with margin after the earlier work. On overrun the socket is torn
 * down and the captured-lead response returns regardless.
 */
export const CUSTOMER_ACK_TIMEOUT_MS = 5_000;

/**
 * Send the buyer acknowledgement. Throws on any failure (env missing, SMTP
 * error, missing recipient, overall timeout). This is a best-effort courtesy,
 * NOT a capture channel: callers must catch and must never fail a captured RFQ
 * on its account.
 */
export async function sendRfqCustomerAck(input: RfqCustomerAckInput): Promise<void> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPortRaw = process.env.SMTP_PORT || '587';
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPort = Number(smtpPortRaw);

  if (!smtpHost || !smtpUser || !smtpPass || Number.isNaN(smtpPort)) {
    throw new Error('SMTP is not fully configured (need SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS).');
  }

  const recipient = sanitizeHeaderValue(input.email || '');
  if (!recipient) {
    throw new Error('Customer acknowledgement requires a recipient email address.');
  }

  const { subject, textBody } = buildRfqCustomerAckContent(input);

  await sendMailWithSmtp({
    host: smtpHost,
    port: smtpPort,
    user: smtpUser,
    pass: smtpPass,
    to: recipient,
    subject,
    textBody,
    fromName: 'PRSPARES Sales',
    // RFC 3834 — mark as automated so the buyer's mailbox does not fire an
    // out-of-office/auto-reply back into the RFQ inbox and start a loop.
    headers: {
      'Auto-Submitted': 'auto-generated',
      'X-Auto-Response-Suppress': 'All',
    },
    // Bound the courtesy so it can never hang a captured request.
    overallTimeoutMs: CUSTOMER_ACK_TIMEOUT_MS,
  });

  console.info('[RFQ ack] Customer acknowledgement sent:', { to: recipient });
}
