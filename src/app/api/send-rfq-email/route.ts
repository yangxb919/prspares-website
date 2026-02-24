import { NextRequest, NextResponse } from 'next/server';
import net from 'node:net';
import tls from 'node:tls';

export const runtime = 'nodejs';

interface RfqEmailPayload {
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

  private onError = (error: Error) => {
    this.rejectAll(error);
  };

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
        const idx = this.waiters.findIndex((waiter) => waiter.timer === timer);
        if (idx >= 0) {
          this.waiters.splice(idx, 1);
        }
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

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIP) return realIP;
  if (cfConnectingIP) return cfConnectingIP;
  return request.ip || 'unknown';
}

function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

function isValidEmail(email: string): boolean {
  return /^\S+@\S+\.\S+$/.test(email);
}

async function openSocket(host: string, port: number, timeoutMs: number): Promise<net.Socket> {
  return new Promise<net.Socket>((resolve, reject) => {
    const socket = net.createConnection({ host, port });
    socket.setTimeout(timeoutMs);

    socket.once('connect', () => resolve(socket));
    socket.once('timeout', () => {
      socket.destroy();
      reject(new Error('SMTP socket connection timeout'));
    });
    socket.once('error', reject);
  });
}

async function upgradeSocketToTLS(socket: net.Socket, host: string, timeoutMs: number): Promise<tls.TLSSocket> {
  const rejectUnauthorized = process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false';
  const servername = net.isIP(host) ? undefined : host;
  return new Promise<tls.TLSSocket>((resolve, reject) => {
    const secureSocket = tls.connect(
      {
        socket,
        servername,
        minVersion: 'TLSv1.2',
        rejectUnauthorized,
      },
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
}) {
  const timeoutMs = 15000;
  const ehloName = process.env.SMTP_EHLO_NAME || 'localhost';
  const fromAddress = sanitizeHeaderValue(params.user);
  const toAddress = sanitizeHeaderValue(params.to);

  const plainSocket = await openSocket(params.host, params.port, timeoutMs);
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
    const secureReader = new SmtpResponseReader(secureSocket);

    try {
      await sendCommand(secureSocket, secureReader, `EHLO ${ehloName}`, [250], 'EHLO after STARTTLS');
      await sendCommand(secureSocket, secureReader, 'AUTH LOGIN', [334], 'AUTH LOGIN');
      await sendCommand(
        secureSocket,
        secureReader,
        Buffer.from(params.user, 'utf8').toString('base64'),
        [334],
        'SMTP username'
      );
      await sendCommand(
        secureSocket,
        secureReader,
        Buffer.from(params.pass, 'utf8').toString('base64'),
        [235],
        'SMTP password'
      );

      await sendCommand(secureSocket, secureReader, `MAIL FROM:<${fromAddress}>`, [250], 'MAIL FROM');
      await sendCommand(secureSocket, secureReader, `RCPT TO:<${toAddress}>`, [250, 251], 'RCPT TO');
      await sendCommand(secureSocket, secureReader, 'DATA', [354], 'DATA');

      const emailMessage = [
        `From: PRSPARES RFQ <${fromAddress}>`,
        `To: ${toAddress}`,
        `Subject: ${sanitizeHeaderValue(params.subject)}`,
        `Date: ${new Date().toUTCString()}`,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        '',
        params.textBody,
      ]
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
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<RfqEmailPayload>;

    const name = body.name?.trim();
    const email = body.email?.trim();
    const message = body.message?.trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'name, email, and message are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPortRaw = process.env.SMTP_PORT || '587';
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const adminEmail = process.env.SMTP_TEST_TO || process.env.SMTP_USER;

    const smtpPort = Number(smtpPortRaw);
    if (!smtpHost || !smtpUser || !smtpPass || !adminEmail || Number.isNaN(smtpPort)) {
      return NextResponse.json(
        {
          error:
            'SMTP is not fully configured. Required: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (SMTP_TEST_TO optional).',
        },
        { status: 500 }
      );
    }

    const payload: RfqEmailPayload = {
      name,
      email,
      company: body.company?.trim() || '',
      phone: body.phone?.trim() || '',
      productInterest: body.productInterest?.trim() || '',
      message,
      pageUrl: body.pageUrl?.trim() || '',
      ip: body.ip?.trim() || getClientIP(request),
      submittedAt: body.submittedAt?.trim() || new Date().toISOString(),
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
      `submittedAt: ${payload.submittedAt || 'N/A'}`,
    ].join('\n');

    const subjectSuffix = payload.company ? ` - ${payload.company}` : '';
    const subject = `[RFQ] ${payload.name}${subjectSuffix}`;

    console.info('[RFQ email] Sending notification:', {
      host: smtpHost,
      port: smtpPort,
      to: adminEmail,
      from: smtpUser,
      requester: payload.email,
    });

    await sendMailWithSmtp({
      host: smtpHost,
      port: smtpPort,
      user: smtpUser,
      pass: smtpPass,
      to: adminEmail,
      subject,
      textBody: emailBody,
    });

    console.info('[RFQ email] Notification sent successfully:', {
      to: adminEmail,
      requester: payload.email,
      submittedAt: payload.submittedAt,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[RFQ email] Failed to send notification:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to send RFQ email',
      },
      { status: 500 }
    );
  }
}
