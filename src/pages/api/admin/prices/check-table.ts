import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('=== Check Table API Called ===');

  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE;
  const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!SERVICE_KEY || !URL) {
    return res.status(500).json({
      error: 'Missing environment variables',
      hasServiceRole: Boolean(SERVICE_KEY),
      hasUrl: Boolean(URL),
    });
  }

  const supabase = createClient(URL, SERVICE_KEY, {
    auth: { persistSession: false },
    db: { schema: 'public' },
  });

  try {
    // Try to check if table exists
    const { data, error } = await supabase
      .from('product_prices')
      .select('*')
      .limit(1);

    if (error) {
      if (error.code === '42P01') {
        // Table doesn't exist
        return res.status(200).json({
          tableExists: false,
          message: 'product_prices table does not exist',
          errorCode: error.code,
          error: error.message
        });
      } else {
        // Other error
        return res.status(200).json({
          tableExists: true,
          message: 'product_prices table exists but has other errors',
          errorCode: error.code,
          error: error.message
        });
      }
    }

    // Table exists and query succeeded
    return res.status(200).json({
      tableExists: true,
      message: 'product_prices table exists and is accessible',
      recordCount: data?.length || 0
    });
  } catch (e: any) {
    return res.status(500).json({
      error: e?.message || 'Server error',
      tableExists: false
    });
  }
}
