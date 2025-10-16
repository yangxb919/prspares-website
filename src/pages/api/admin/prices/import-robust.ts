import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { parse } from 'csv-parse/sync';
import * as iconv from 'iconv-lite';

console.log('🚀 ROBUST CSV IMPORT API MODULE LOADED');

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

// Function to create prices table using raw SQL
async function createPricesTableManually(supabase: any): Promise<boolean> {
  try {
    // Try to create table using raw SQL query
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.prices (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        brand VARCHAR(50) NOT NULL,
        model VARCHAR(100) NOT NULL,
        series VARCHAR(100),
        product_title VARCHAR(255) NOT NULL,
        product_type VARCHAR(100),
        image_url TEXT,
        price DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        description TEXT,
        availability_status VARCHAR(20) DEFAULT 'available',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_prices_brand ON prices(brand);
      CREATE INDEX IF NOT EXISTS idx_prices_model ON prices(model);
      CREATE INDEX IF NOT EXISTS idx_prices_series ON prices(series);
      CREATE INDEX IF NOT EXISTS idx_prices_product_title ON prices(product_title);

      ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;

      CREATE POLICY IF NOT EXISTS "Prices are viewable by everyone" ON public.prices FOR SELECT USING (true);
      CREATE POLICY IF NOT EXISTS "Enable insert for authenticated users" ON public.prices FOR INSERT WITH CHECK (true);
    `;

    // Try to execute the SQL using Supabase's query method
    const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });

    if (error) {
      console.log('RPC method failed, trying simple insert method...');

      // Try creating the table by attempting an insert (Postgres will auto-create basic table)
      const { error: insertError } = await supabase
        .from('prices')
        .insert({
          brand: 'Test',
          model: 'Test',
          product_title: 'auto_create_table_test',
          price: 1.00,
          created_at: new Date().toISOString()
        });

      if (insertError && insertError.code === '42P01') {
        // Table still doesn't exist, we can't create it automatically
        console.error('Cannot create table automatically:', insertError.message);
        return false;
      } else if (insertError) {
        console.log('Insert error but table might exist:', insertError.message);
        return true; // Table probably exists but insert failed for other reasons
      } else {
        console.log('Table created successfully via insert method');
        // Clean up the test record
        await supabase
          .from('prices')
          .delete()
          .eq('product_title', 'auto_create_table_test');
        return true;
      }
    }

    console.log('Table created successfully via RPC');
    return true;
  } catch (error) {
    console.error('Error creating table:', error);
    return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('=== Robust CSV Import API Called ===');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Body type:', typeof req.body);
  console.log('Body keys:', req.body ? Object.keys(req.body) : 'no body');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_KEY;
  const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

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

    // First, check if prices table exists and create it if needed
    console.log('Checking if prices table exists...');
    const { data: testData, error: testError } = await supabase
      .from('prices')
      .select('id')
      .limit(1);

    if (testError && testError.code === '42P01') {
      console.log('Prices table does not exist, attempting to create it...');
      const tableCreated = await createPricesTableManually(supabase);

      if (!tableCreated) {
        return res.status(500).json({
          error: 'Prices table does not exist and could not be created automatically. Please run the SQL in create_prices_table.sql manually in your Supabase SQL editor.',
          diagnostic: {
            tableMissing: true,
            autoCreateFailed: true,
            supabaseError: testError.message
          }
        });
      }

      console.log('Prices table created successfully');
    } else if (testError) {
      console.log('Table exists but has other error:', testError.message);
    } else {
      console.log('Prices table exists and is accessible');
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

        let inserted = 0;
        for (let i = 0; i < records.length; i++) {
          const record = records[i];

          try {
            // Extract data from CSV record - map to prices table fields
            const brand = record['brand'] || record['Brand'] || record['品牌'] || 'Unknown';
            const model = record['model'] || record['Model'] || record['型号'] || 'Unknown';
            const series = record['series'] || record['Series'] || record['系列'] || null;
            const productTitle = record['product_title'] || record['Product Title'] || record['title'] || record['name'] || record['产品'] || record['产品名称'];
            const productType = record['product_type'] || record['Product Type'] || record['type'] || record['类型'] || null;
            const imageUrl = record['image_url'] || record['Product Image URL'] || record['image'] || record['图片'] || record['产品图片'];
            const priceStr = record['price'] || record['Price'] || record['价格'];
            const currency = record['currency'] || record['Currency'] || record['币种'] || 'USD';
            const description = record['description'] || record['Description'] || record['描述'] || null;

            if (!productTitle || String(productTitle).trim() === '') {
              console.log(`Skipping row ${i + 1}: missing product title`);
              continue;
            }

            if (!brand || String(brand).trim() === '') {
              console.log(`Skipping row ${i + 1}: missing brand`);
              continue;
            }

            if (!model || String(model).trim() === '') {
              console.log(`Skipping row ${i + 1}: missing model`);
              continue;
            }

            // Parse price
            const price = parsePrice(priceStr);
            if (price === null || isNaN(price)) {
              console.log(`Skipping row ${i + 1}: invalid price`);
              continue;
            }

            // Build insert data for prices table
            const insertData: any = {
              brand: String(brand).trim(),
              model: String(model).trim(),
              product_title: String(productTitle).trim(),
              price: price,
              currency: String(currency).trim(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };

            // Add optional fields if they exist and are valid
            if (series && String(series).trim()) {
              insertData.series = String(series).trim();
            }

            if (productType && String(productType).trim()) {
              insertData.product_type = String(productType).trim();
            }

            if (imageUrl && String(imageUrl).trim()) {
              insertData.image_url = String(imageUrl).trim();
            }

            if (description && String(description).trim()) {
              insertData.description = String(description).trim();
            }

            console.log(`Inserting row ${i + 1}:`, insertData);

            const { data, error } = await supabase
              .from('prices')
              .insert(insertData)
              .select('id')
              .single();

            if (error) {
              console.error('Insert error for row:', productTitle, error);

              // Try minimal insert if full insert fails
              if (error.code === 'PGRST204' || error.message.includes('column')) {
                const minimalData = {
                  brand: String(brand).trim(),
                  model: String(model).trim(),
                  product_title: String(productTitle).trim(),
                  price: price,
                  currency: 'USD',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                };

                const { data: minimalResult, error: minimalError } = await supabase
                  .from('prices')
                  .insert(minimalData)
                  .select('id')
                  .single();

                if (minimalError) {
                  console.error('Minimal insert also failed:', minimalError);
                  continue;
                }

                console.log('Successfully inserted with minimal data:', productTitle);
                inserted++;
              } else {
                continue;
              }
            } else {
              console.log('Successfully inserted:', productTitle, 'with ID:', data?.id);
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