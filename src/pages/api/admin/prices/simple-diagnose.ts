import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('=== Simple Diagnose API Called ===');

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
    const results: any = {
      environment: {
        hasServiceRole: Boolean(SERVICE_KEY),
        hasUrl: Boolean(URL),
      },
      tests: {}
    };

    // Test 1: Check if product_prices table exists by trying to query it
    try {
      const { data, error } = await supabase
        .from('product_prices')
        .select('title')
        .limit(1);

      if (error) {
        results.tests.tableExists = {
          success: false,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          }
        };
      } else {
        results.tests.tableExists = {
          success: true,
          recordCount: data?.length || 0,
          hasTitleColumn: true
        };
      }
    } catch (e: any) {
      results.tests.tableExists = {
        success: false,
        error: {
          message: e.message,
          exception: true
        }
      };
    }

    // Test 2: Try to insert a test record
    try {
      const testTitle = 'diagnostic_test_' + Date.now();
      const { data, error } = await supabase
        .from('product_prices')
        .insert({
          title: testTitle
        })
        .select('id, title')
        .single();

      if (error) {
        results.tests.insertTest = {
          success: false,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          }
        };
      } else {
        results.tests.insertTest = {
          success: true,
          insertedRecord: data
        };

        // Clean up
        if (data?.id) {
          await supabase
            .from('product_prices')
            .delete()
            .eq('id', data.id);
        }
      }
    } catch (e: any) {
      results.tests.insertTest = {
        success: false,
        error: {
          message: e.message,
          exception: true
        }
      };
    }

    // Test 3: Check service role permissions
    try {
      const { data, error } = await supabase.auth.getUser();
      results.tests.authCheck = {
        success: !error,
        user: data?.user || null,
        error: error ? {
          code: error.code,
          message: error.message
        } : null
      };
    } catch (e: any) {
      results.tests.authCheck = {
        success: false,
        error: {
          message: e.message,
          exception: true
        }
      };
    }

    return res.status(200).json(results);
  } catch (e: any) {
    return res.status(500).json({
      error: e?.message || 'Server error',
      results: null
    });
  }
}
