import { NextResponse } from 'next/server';

const DEPRECATION_MESSAGE =
  'Deprecated endpoint: /api/contact is disabled. Use RFQ flow (insert into rfqs, then POST /api/send-rfq-email).';

function deprecatedResponse() {
  return NextResponse.json(
    {
      deprecated: true,
      error: DEPRECATION_MESSAGE,
      replacement: {
        clientHelper: 'submitRfqAndNotify',
        table: 'public.rfqs',
        emailApi: '/api/send-rfq-email',
      },
    },
    { status: 410 }
  );
}

export async function POST() {
  console.warn('[DEPRECATED] /api/contact called. This endpoint is disabled.');
  return deprecatedResponse();
}

export async function GET() {
  return deprecatedResponse();
}
