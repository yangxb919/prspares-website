import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('=== Diagnose API Called ===');

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
      env: {
        hasServiceRole: Boolean(SERVICE_KEY),
        hasUrl: Boolean(URL),
      },
      tests: {}
    };

    // Test 1: Check if we can access the product_prices table
    try {
      const { data, error } = await supabase
        .from('product_prices')
        .select('*')
        .limit(1);

      if (error) {
        results.tests.tableAccess = {
          success: false,
          error: error,
          code: error.code,
          message: error.message
        };
      } else {
        results.tests.tableAccess = {
          success: true,
          recordCount: data?.length || 0,
          data: data
        };
      }
    } catch (e: any) {
      results.tests.tableAccess = {
        success: false,
        error: e.message,
        exception: true
      };
    }

    // Test 2: Try to check table schema (if RPC available)
    try {
      const { data, error } = await supabase.rpc('get_table_schema', {
        table_name: 'product_prices'
      });

      if (error) {
        results.tests.schemaCheck = {
          success: false,
          error: error
        };
      } else {
        results.tests.schemaCheck = {
          success: true,
          schema: data
        };
      }
    } catch (e: any) {
      results.tests.schemaCheck = {
        success: false,
        error: e.message,
        exception: true
      };
    }

    // Test 3: Try a simple insert
    try {
      const { data, error } = await supabase
        .from('product_prices')
        .insert({
          title: 'test_insert_' + Date.now(),
          created_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) {
        results.tests.insertTest = {
          success: false,
          error: error,
          code: error.code,
          message: error.message
        };
      } else {
        results.tests.insertTest = {
          success: true,
          insertedId: data?.id
        };

        // Clean up the test record
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
        error: e.message,
        exception: true
      };
    }

    // Test 4: Check if we can list all tables (visibility depends on RLS/permissions)
    try {
      const { data, error } = await supabase
        .from('pg_tables')
        .select('*')
        .eq('schemaname', 'public')
        .like('tablename', '%product_prices%');

      if (error) {
        results.tests.tableList = {
          success: false,
          error: error
        };
      } else {
        results.tests.tableList = {
          success: true,
          tables: data
        };
      }
    } catch (e: any) {
      results.tests.tableList = {
        success: false,
        error: e.message,
        exception: true
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
