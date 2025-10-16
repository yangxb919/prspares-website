import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { createPublicClient } from '@/utils/supabase-public';

export default function TestTablePage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createPublicClient();

  useEffect(() => {
    const testTable = async () => {
      try {
        const testResults: any = {};

        // Test 1: Basic access
        try {
          const { data, error } = await supabase
            .from('product_prices')
            .select('title')
            .limit(1);

          testResults.tableAccess = {
            success: !error,
            error: error?.message,
            data: data
          };
        } catch (e: any) {
          testResults.tableAccess = {
            success: false,
            error: e.message
          };
        }

        // Test 2: Insert test
        try {
          const testTitle = 'test_' + Date.now();
          const { data, error } = await supabase
            .from('product_prices')
            .insert({ title: testTitle })
            .select('id')
            .single();

          if (!error && data?.id) {
            testResults.insertTest = { success: true, id: data.id };
            // Clean up
            await supabase.from('product_prices').delete().eq('id', data.id);
          } else {
            testResults.insertTest = { success: false, error: error?.message };
          }
        } catch (e: any) {
          testResults.insertTest = { success: false, error: e.message };
        }

        // Test 3: Count records
        try {
          const { data, error } = await supabase
            .from('product_prices')
            .select('*', { count: 'exact', head: true });

          testResults.recordCount = {
            success: !error,
            count: (data as any)?.count || 0,
            error: error?.message
          };
        } catch (e: any) {
          testResults.recordCount = { success: false, error: e.message };
        }

        setResults(testResults);
      } catch (e: any) {
        setResults({ error: e.message });
      } finally {
        setLoading(false);
      }
    };

    testTable();
  }, [supabase]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Testing Products Table</h1>
          <p>Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Products Table Test Results</h1>

        {results?.error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error:</p>
            <p>{results.error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Table Access Test</h2>
              <p className={`font-semibold ${results?.tableAccess?.success ? 'text-green-600' : 'text-red-600'}`}>
                {results?.tableAccess?.success ? '✅ SUCCESS' : '❌ FAILED'}
              </p>
              {results?.tableAccess?.error && (
                <p className="text-red-600 text-sm">Error: {results.tableAccess.error}</p>
              )}
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Insert Test</h2>
              <p className={`font-semibold ${results?.insertTest?.success ? 'text-green-600' : 'text-red-600'}`}>
                {results?.insertTest?.success ? '✅ SUCCESS' : '❌ FAILED'}
              </p>
              {results?.insertTest?.error && (
                <p className="text-red-600 text-sm">Error: {results.insertTest.error}</p>
              )}
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Record Count</h2>
              <p className={`font-semibold ${results?.recordCount?.success ? 'text-green-600' : 'text-red-600'}`}>
                {results?.recordCount?.success ? `✅ ${results.recordCount.count} records` : '❌ FAILED'}
              </p>
              {results?.recordCount?.error && (
                <p className="text-red-600 text-sm">Error: {results.recordCount.error}</p>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">API Endpoints for Testing:</h3>
              <ul className="space-y-2 text-sm">
                <li>• <a href="/api/admin/prices/simple-diagnose" className="text-blue-600 underline" target="_blank">/api/admin/prices/simple-diagnose</a></li>
                <li>• <a href="/api/admin/prices/table-status" className="text-blue-600 underline" target="_blank">/api/admin/prices/table-status</a></li>
                <li>• <a href="/api/admin/prices/check-table" className="text-blue-600 underline" target="_blank">/api/admin/prices/check-table</a></li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
