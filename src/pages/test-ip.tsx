import { useState, useEffect } from 'react';
import { getClientIP, getBrowserInfo } from '@/utils/getClientIP';

export default function TestIP() {
  const [clientIP, setClientIP] = useState<string>('Loading...');
  const [browserInfo, setBrowserInfo] = useState<string>('Loading...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const ip = await getClientIP();
        const browser = getBrowserInfo();
        setClientIP(ip);
        setBrowserInfo(browser);
      } catch (error) {
        console.error('Error fetching client info:', error);
        setClientIP('Error getting IP');
        setBrowserInfo('Error getting browser info');
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, []);

  const testNewsletterAPI = async () => {
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          clientIP: clientIP,
          browserInfo: browserInfo
        }),
      });

      const data = await response.json();
      console.log('Newsletter API response:', data);
      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Newsletter API error:', error);
      alert('Error: ' + error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">IP Detection Test</h1>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Client Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client IP Address
                  </label>
                  <div className="bg-white p-3 rounded border">
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
                    ) : (
                      <code className="text-sm text-blue-600">{clientIP}</code>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Browser Information
                  </label>
                  <div className="bg-white p-3 rounded border">
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
                    ) : (
                      <code className="text-sm text-green-600">{browserInfo}</code>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Newsletter API Test</h2>
              <p className="text-gray-600 mb-4">
                Test the newsletter subscription API with the detected client information.
              </p>
              <button
                onClick={testNewsletterAPI}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Loading...' : 'Test Newsletter API'}
              </button>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Development Notes</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>In local development, IP might show as localhost (127.0.0.1 or ::1)</li>
                <li>In production, the IP should show the actual client IP address</li>
                <li>Browser info is detected from the user agent string</li>
                <li>The newsletter API will use this information for tracking subscriptions</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Raw Headers Information</h2>
              <div className="bg-white p-4 rounded border">
                <pre className="text-xs text-gray-600 overflow-x-auto">
                  {typeof window !== 'undefined' ? (
                    `User Agent: ${navigator.userAgent}\n` +
                    `Language: ${navigator.language}\n` +
                    `Platform: ${navigator.platform}\n` +
                    `Cookie Enabled: ${navigator.cookieEnabled}\n` +
                    `Online: ${navigator.onLine}`
                  ) : (
                    'Client-side information not available'
                  )}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
