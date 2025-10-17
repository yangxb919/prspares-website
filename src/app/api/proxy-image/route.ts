import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    // 验证 URL 是否来自允许的域名
    const allowedDomains = [
      'pplx-res.cloudinary.com',
      'res.cloudinary.com',
      'cloudinary.com',
      'images.unsplash.com',
      'unsplash.com',
    ];

    const url = new URL(imageUrl);
    const isAllowed = allowedDomains.some(domain => 
      url.hostname === domain || url.hostname.endsWith(`.${domain}`)
    );

    if (!isAllowed) {
      return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 });
    }

    // 获取图片，模拟真实浏览器请求
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site',
      },
      // 不发送 Referrer
      referrerPolicy: 'no-referrer',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[proxy-image] Failed to fetch image from ${imageUrl}`);
      console.error(`[proxy-image] Status: ${response.status} ${response.statusText}`);
      console.error(`[proxy-image] Response: ${errorText.substring(0, 500)}`);
      console.error(`[proxy-image] Headers:`, Object.fromEntries(response.headers.entries()));

      return NextResponse.json(
        {
          error: 'Failed to fetch image',
          status: response.status,
          statusText: response.statusText,
          url: imageUrl,
          details: errorText.substring(0, 200)
        },
        { status: response.status }
      );
    }

    // 获取图片数据
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // 返回图片，设置缓存
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error proxying image:', error);
    return NextResponse.json(
      { error: 'Failed to proxy image' },
      { status: 500 }
    );
  }
}

