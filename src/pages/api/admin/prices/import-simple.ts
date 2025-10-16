import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { parse } from 'csv-parse/sync';
import * as iconv from 'iconv-lite';

console.log('🚀 SIMPLE CSV IMPORT API MODULE LOADED');

type ImportResult = {
  file: string;
  inserted: number;
  error?: string;
};

function detectAndDecode(buffer: Buffer): string {
  let content = buffer.toString('utf8');
  const head = content.slice(0, 400);
  const ratio = (head.match(/�/g)?.length || 0) / Math.max(1, head.length);
  if (ratio > 0.02) {
    try {
      return iconv.decode(buffer, 'gb18030');
    } catch {
      return content;
    }
  }
  return content;
}

function parsePrice(input: any): number | null {
  if (input == null) return null;
  const cleaned = String(input).trim().replace(/[^0-9.\-]/g, '').replace(/\u00A0/g, '');
  const num = Number.parseFloat(cleaned);
  return Number.isFinite(num) ? num : null;
}

export const config = {
  api: {
    bodyParser: { sizeLimit: '25mb' },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('=== Simple CSV Import API Called ===');
  console.log('Method:', req.method);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Authorization: allow EITHER admin token OR logged-in admin/author
  const ADMIN_TOKEN = process.env.ADMIN_IMPORT_TOKEN || process.env.ADMIN_IMPORT_KEY;
  const clientToken = (req.headers['x-admin-token'] || req.headers['x-admin-secret']) as string | undefined;

  let authorized = false;
  if (ADMIN_TOKEN && clientToken === ADMIN_TOKEN) {
    authorized = true;
  } else {
    try {
      const accessHeader = (req.headers['authorization'] as string | undefined) || '';
      const bearer = accessHeader.startsWith('Bearer ') ? accessHeader.slice(7) : undefined;
      const cookieToken = (req.cookies as any)?.['sb-access-token'] as string | undefined;
      const accessToken = bearer || cookieToken;

      if (accessToken) {
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (anonKey && supabaseUrl) {
          const userClient = createClient(supabaseUrl, anonKey, {
            global: { headers: { Authorization: `Bearer ${accessToken}` } },
            auth: { persistSession: false },
          });
          const { data: userData } = await userClient.auth.getUser();
          const user = userData?.user;
          if (user?.id) {
            let role: string | null = null;
            try {
              const { data: profile } = await userClient
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();
              role = (profile as any)?.role || null;
            } catch (_) {}
            if (!role) {
              const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
              const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE;
              if (URL && SERVICE_KEY) {
                const adminRead = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } });
                const { data: profile2 } = await adminRead
                  .from('profiles')
                  .select('role')
                  .eq('id', user.id)
                  .single();
                role = (profile2 as any)?.role || null;
              }
            }
            if (role === 'admin' || role === 'author') {
              authorized = true;
            }
          }
        }
      }
    } catch (_) {}
  }

  if (!authorized) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE;
  const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!SERVICE_KEY || !URL) {
    return res.status(500).json({
      error: 'Server is missing SUPABASE_SERVICE_ROLE or NEXT_PUBLIC_SUPABASE_URL',
      hasServiceRole: Boolean(SERVICE_KEY),
      hasUrl: Boolean(URL),
    });
  }

  const supabase = createClient(URL, SERVICE_KEY, {
    auth: { persistSession: false },
    db: { schema: 'public' },
    global: { headers: { 'Cache-Control': 'no-cache' } }
  });

  try {
    const body = req.body as { files?: { name: string; base64: string }[] };
    const files = body?.files || [];
    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const results: ImportResult[] = [];
    let total = 0;

    for (const f of files) {
      try {
        console.log(`Processing file: ${f.name}`);
        const buffer = Buffer.from(f.base64, 'base64');
        const decoded = detectAndDecode(buffer);
        console.log(`Decoded content length: ${decoded.length}`);

        const records = parse(decoded, { bom: true, columns: true, skip_empty_lines: true, trim: true });
        console.log(`Parsed ${records.length} records`);

        if (!Array.isArray(records) || records.length === 0) {
          results.push({ file: f.name, inserted: 0, error: 'Empty CSV' });
          continue;
        }

        // Simple column mapping for the specific CSV format
        const firstRecord = records[0];
        console.log('First record:', firstRecord);

        let inserted = 0;
        for (let i = 0; i < records.length; i++) {
          const record = records[i] as Record<string, any>;

          try {
            // Extract data from CSV record
            const title = record['Product Title'] || record['title'] || record['name'];
            const imageUrl = record['Product Image URL'] || record['image'] || record['image_url'];
            const priceStr = record['Price'] || record['price'];

            if (!title || String(title).trim() === '') {
              console.log(`Skipping row ${i + 1}: missing title`);
              continue;
            }

            // Parse price
            const price = parsePrice(priceStr);

            // Build insert data
            const insertData: any = {
              title: String(title).trim(),
            };

            if (imageUrl) insertData.image = String(imageUrl);
            if (price !== null) insertData.price = price;
            insertData.currency = 'USD'; // Default currency

            console.log(`Inserting row ${i + 1}:`, insertData);

            const { data, error } = await supabase
              .from('product_prices')
              .insert(insertData)
              .select('id')
              .single();

            if (error) {
              console.error('Insert error for row:', title, error);
              // Try without optional fields if there's an error
              if (error.message.includes('column') || error.code === 'PGRST204') {
                const simpleData = { title: String(title).trim() };
                const { data: simpleDataResult, error: simpleError } = await supabase
                  .from('product_prices')
                  .insert(simpleData)
                  .select('id')
                  .single();

                if (simpleError) {
                  console.error('Simple insert also failed:', simpleError);
                  continue;
                }
                console.log('Successfully inserted with simple data:', title);
                inserted++;
              } else {
                continue;
              }
            } else {
              console.log('Successfully inserted:', title, 'with ID:', data?.id);
              inserted++;
            }
          } catch (e) {
            console.error('Exception inserting row:', i + 1, e);
            continue;
          }
        }

        console.log(`Finished processing file ${f.name}. Inserted: ${inserted}/${records.length}`);
        total += inserted;
        results.push({ file: f.name, inserted });
      } catch (e: any) {
        console.error('Error processing file:', f.name, e);
        results.push({ file: f.name, inserted: 0, error: e?.message || 'Import failed' });
      }
    }

    return res.status(200).json({ total, results });
  } catch (e: any) {
    console.error('Global error:', e);
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}
