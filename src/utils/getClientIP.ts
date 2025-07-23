// Utility function to get client IP address from the browser
export const getClientIP = async (): Promise<string> => {
  try {
    // Try multiple IP detection services
    const ipServices = [
      'https://api.ipify.org?format=json',
      'https://ipapi.co/json/',
      'https://ipinfo.io/json',
      'https://api.ip.sb/jsonip',
      'https://httpbin.org/ip'
    ];

    for (const service of ipServices) {
      try {
        // Create timeout controller
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(service, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) continue;

        const data = await response.json();
        
        // Different services return IP in different fields
        const ip = data.ip || data.IPv4 || data.query || data.origin;
        
        if (ip && typeof ip === 'string') {
          // Clean up the IP (remove any extra info)
          const cleanIP = ip.split(',')[0].trim();
          if (isValidIP(cleanIP)) {
            console.log(`✅ Got IP from ${service}: ${cleanIP}`);
            return cleanIP;
          }
        }
      } catch (serviceError) {
        console.warn(`❌ IP service ${service} failed:`, serviceError);
        continue;
      }
    }

    // If all services fail, return localhost for development
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return '127.0.0.1 (localhost)';
    }

    throw new Error('All IP detection services failed');
  } catch (error) {
    console.error('Failed to get client IP:', error);
    return 'unknown';
  }
};

// Simple IP validation
const isValidIP = (ip: string): boolean => {
  // IPv4 regex
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
  // IPv6 regex (simplified)
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

// Get browser information
export const getBrowserInfo = (): string => {
  if (typeof window === 'undefined') {
    return 'Server-side';
  }

  const userAgent = navigator.userAgent;
  
  // Extract browser name and version
  let browserInfo = 'Unknown Browser';
  
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    const match = userAgent.match(/Chrome\/([0-9.]+)/);
    browserInfo = `Chrome ${match ? match[1] : 'Unknown'}`;
  } else if (userAgent.includes('Firefox')) {
    const match = userAgent.match(/Firefox\/([0-9.]+)/);
    browserInfo = `Firefox ${match ? match[1] : 'Unknown'}`;
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    const match = userAgent.match(/Version\/([0-9.]+)/);
    browserInfo = `Safari ${match ? match[1] : 'Unknown'}`;
  } else if (userAgent.includes('Edg')) {
    const match = userAgent.match(/Edg\/([0-9.]+)/);
    browserInfo = `Edge ${match ? match[1] : 'Unknown'}`;
  }
  
  // Add OS info
  let osInfo = 'Unknown OS';
  if (userAgent.includes('Windows')) {
    osInfo = 'Windows';
  } else if (userAgent.includes('Mac')) {
    osInfo = 'macOS';
  } else if (userAgent.includes('Linux')) {
    osInfo = 'Linux';
  } else if (userAgent.includes('Android')) {
    osInfo = 'Android';
  } else if (userAgent.includes('iOS')) {
    osInfo = 'iOS';
  }
  
  return `${browserInfo} on ${osInfo}`;
};
