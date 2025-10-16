import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { parse } from 'csv-parse/sync';
import * as iconv from 'iconv-lite';

console.log('🚀 CSV IMPORT API MODULE LOADED - THIS SHOULD APPEAR ON SERVER START');

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
      return content; // fallback
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

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function mapColumns(sample: Record<string, any>) {
  const pick = (cands: string[]) => cands.find((k) => k in sample);
  const title = pick(['Product Title', 'Product Name', 'title', 'name', 'product', 'product_name', '产品', '产品名称', '商品名称', '品名']);
  const image = pick(['Product Image URL', 'Product Image', 'image', 'image_url', 'img', 'picture', '图片', '图片链接', '产品图片', '产品图片_URL']);
  const url = pick(['url', 'link', 'product_url', 'Product URL', 'Product Link', '产品链接', '商品链接']);
  const price = pick(['Price', 'price', '售价', '单价', '金额', '价格']);
  const currency = pick(['currency', 'Currency', '币种', '货币']);
  const slug = pick(['slug', 'Slug', '短链', '别名']);
  return { title, image, url, price, currency, slug };
}

export const config = {
  api: {
    bodyParser: { sizeLimit: '25mb' },
  },
};

// Function to check if product_prices table exists
async function checkTableExists(supabase: any): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('product_prices')
      .select('*')
      .limit(1);

    if (error && error.code === '42P01') { // Undefined table error
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// Function to check if a column exists in the product_prices table
async function checkColumnExists(supabase: any, columnName: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('product_prices')
      .select(columnName)
      .limit(1);

    if (error && error.code === '42703') { // Undefined column error
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// Function to create product_prices table with all necessary columns using raw SQL
async function createProductPricesTable(supabase: any): Promise<boolean> {
  try {
    // Use a simpler approach - try to insert a basic record to create the table
    const { error: insertError } = await supabase
      .from('product_prices')
      .insert({
        title: 'temp_record_for_table_creation',
        created_at: new Date().toISOString()
      });

    if (insertError && insertError.code === '42P01') {
      // Table doesn't exist, try using RPC to create it
      console.log('Table does not exist, attempting to create via RPC...');

      // Try using Postgres RPC
      const { error: rpcError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.product_prices (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            title text NOT NULL,
            url text,
            image text,
            price numeric(12,2),
            currency text DEFAULT 'USD',
            slug text,
            clicks integer DEFAULT 0,
            created_at timestamptz NOT NULL DEFAULT now()
          );

          CREATE INDEX IF NOT EXISTS product_prices_created_at_idx ON public.product_prices(created_at DESC);
          CREATE UNIQUE INDEX IF NOT EXISTS product_prices_slug_unique_idx ON public.product_prices(slug) WHERE slug IS NOT NULL;
          CREATE UNIQUE INDEX IF NOT EXISTS product_prices_url_unique_idx ON public.product_prices(url) WHERE url IS NOT NULL;
        `
      });

      if (rpcError) {
        console.error('RPC failed, will try simple insert:', rpcError);
        // If RPC fails, just try a simple insert which might work
        return false;
      }
      return true;
    }

    // If we got here, either the table exists or we created it successfully
    return true;
  } catch (error) {
    console.error('Exception creating products table:', error);
    return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('=== CSV Import API Called ===');
  console.log('Method:', req.method);

  // Lightweight health check: returns whether required envs are present (no secrets leaked)
  if (req.method === 'GET') {
    const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return res.status(200).json({
      ok: hasServiceRole && Boolean(supabaseUrl),
      hasServiceRole,
      hasUrl: Boolean(supabaseUrl),
    });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Authorization: allow EITHER admin token OR logged-in admin/author
  const ADMIN_TOKEN = process.env.ADMIN_IMPORT_TOKEN || process.env.ADMIN_IMPORT_KEY;
  const clientToken = (req.headers['x-admin-token'] || req.headers['x-admin-secret']) as string | undefined;

  let authorized = false;
  if (ADMIN_TOKEN && clientToken === ADMIN_TOKEN) {
    authorized = true;
  } else {
    // Try session-based auth: accept Authorization: Bearer <access_token> or cookie 'sb-access-token'
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
            // Prefer checking via anon client (RLS). If blocked, fall back to service role read.
            let role: string | null = null;
            try {
              const { data: profile } = await userClient
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();
              role = (profile as any)?.role || null;
            } catch (_) {
              // ignore
            }
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
    } catch (_) {
      // fall through
    }
  }

  if (!authorized) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Basic auth check: must have a Supabase session cookie; we tolerate for now and rely on admin UI access control.
  // For stricter control, check user role from profiles.

  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE;
  const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!SERVICE_KEY || !URL) {
    return res.status(500).json({
      error: 'Server is missing SUPABASE_SERVICE_ROLE or SUPABASE_URL',
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

    // Check if product_prices table exists, create if it doesn't
    const tableExists = await checkTableExists(supabase);
    console.log('product_prices table exists:', tableExists);

    if (!tableExists) {
      console.log('Creating product_prices table...');
      const tableCreated = await createProductPricesTable(supabase);
      if (!tableCreated) {
        return res.status(500).json({ error: 'Failed to create product_prices table' });
      }
      console.log('product_prices table created successfully');
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
          console.log('Empty CSV detected');
          results.push({ file: f.name, inserted: 0, error: 'Empty CSV' });
          continue;
        }

        const map = mapColumns(records[0] as Record<string, any>);
        console.log('Column mapping:', map);

        if (!map.title) {
          console.log('No title column found');
          results.push({ file: f.name, inserted: 0, error: 'Missing title/name column' });
          continue;
        }

        // Check which columns exist in the database
        const columnsExist = {
          url: await checkColumnExists(supabase, 'url'),
          image: await checkColumnExists(supabase, 'image'),
          price: await checkColumnExists(supabase, 'price'),
          currency: await checkColumnExists(supabase, 'currency'),
        };
        console.log('Column existence check:', columnsExist);

        const rows = records.map((r: any, index: number) => {
          const title = map.title ? (r[map.title] ?? null) : null;

          // Skip rows without a title
          if (!title || String(title).trim() === '') {
            console.log(`Skipping row ${index + 1}: missing title`);
            return null;
          }

          // Parse price and currency
          const priceValue = map.price ? parsePrice(r[map.price]) : null;
          const currencyValue = map.currency && r[map.currency] ? String(r[map.currency]).toUpperCase() : (String((r[map.price as any])||'').trim().startsWith('US$') ? 'USD' : 'USD');

          // Extract URL and image
          const urlValue = map.url && r[map.url] ? String(r[map.url]) : null;
          const imageValue = map.image && r[map.image] ? String(r[map.image]) : null;

          return {
            title: String(title).trim(),
            url: urlValue,
            image: imageValue,
            price: priceValue,
            currency: currencyValue,
            columnsExist,
          };
        }).filter(row => row !== null);

        // Batch upsert for performance
        const batchRows = rows.map((row: any) => {
          const insertData: any = { title: row.title };
          if (row.columnsExist.url && row.url !== null) insertData.url = row.url;
          if (row.columnsExist.image && row.image !== null) insertData.image = row.image;
          if (row.columnsExist.price && row.price !== null) insertData.price = row.price;
          if (row.columnsExist.currency && row.currency !== null) insertData.currency = row.currency;
          return insertData;
        });

        let inserted = 0;
        const chunkSize = 500;
        for (let start = 0; start < batchRows.length; start += chunkSize) {
          const chunk = batchRows.slice(start, start + chunkSize);
          console.log(`Upserting rows ${start + 1}-${Math.min(start + chunk.length, batchRows.length)} of ${batchRows.length}`);
          const { data, error, count } = await supabase
            .from('product_prices')
            .upsert(chunk, { onConflict: 'url', ignoreDuplicates: false })
            .select('id');
          if (error) {
            console.error('Batch upsert error:', error);
            continue;
          }
          inserted += Array.isArray(data) ? data.length : (count || 0);
        }

        console.log(`Finished processing file ${f.name}. Upserted: ${inserted}/${rows.length}`);
        total += inserted;
        results.push({ file: f.name, inserted });
      } catch (e: any) {
        results.push({ file: f.name, inserted: 0, error: e?.message || 'Import failed' });
      }
    }

    return res.status(200).json({ total, results });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}
