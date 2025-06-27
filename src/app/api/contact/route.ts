import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  productName?: string;
  productSku?: string;
  requestType?: 'contact' | 'quote';
}

// 创建 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    const { name, email, message, phone, productName, productSku, requestType } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Get client IP address
    const getClientIP = (request: NextRequest): string => {
      // Try to get real IP from various headers
      const forwarded = request.headers.get('x-forwarded-for');
      const realIP = request.headers.get('x-real-ip');
      const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare

      if (forwarded) {
        return forwarded.split(',')[0].trim();
      }
      if (realIP) {
        return realIP;
      }
      if (cfConnectingIP) {
        return cfConnectingIP;
      }

      // fallback to request IP
      return request.ip || 'Unknown IP';
    };

    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';

    // 保存到数据库
    try {
      const submissionData = {
        name: name,
        email: email,
        phone: phone || null,
        message: message,
        ip_address: clientIP,
        user_agent: userAgent,
        status: 'unread',
        request_type: requestType || 'contact',
        product_name: productName || null,
        product_sku: productSku || null,
        metadata: {
          requestType: requestType,
          productInfo: productName ? {
            name: productName,
            sku: productSku
          } : null
        }
      };

      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([submissionData])
        .select();

      if (error) {
        console.error('Database save error:', error);
        // 即使数据库保存失败，也不要阻止表单提交成功
        // 这样用户体验更好
      } else {
        console.log('✅ Contact form saved to database:', data);
      }
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      // 继续处理，不阻止表单提交
    }

    // 记录到控制台（用于调试）
    const logInfo = {
      time: new Date().toISOString(),
      name: name,
      email: email,
      phone: phone,
      message: message,
      requestType: requestType,
      productName: productName,
      productSku: productSku,
      ipAddress: clientIP,
      userAgent: userAgent
    };

    if (requestType === 'quote') {
      console.log('💰 Received quote request:', logInfo);
    } else {
      console.log('📝 Received contact form submission:', logInfo);
    }

    // 这里可以添加邮件发送逻辑
    const emailType = requestType === 'quote' ? 'Quote Request' : 'Contact Form';
    console.log(`📧 ${emailType} notification would be sent to: lijiedong08@gmail.com`);
    console.log(`📝 Email content:
    Type: ${emailType}
    From: ${name} (${email})
    Phone: ${phone || 'Not provided'}
    IP Address: ${clientIP}
    ${productName ? `Product: ${productName} (SKU: ${productSku || 'N/A'})` : ''}
    Message: ${message}
    `);

    // Return success response
    const successMessage = requestType === 'quote' 
      ? 'Quote request submitted successfully! We will send you a detailed quote within 24 hours.'
      : 'Message sent successfully! We will reply to you soon.';

    return NextResponse.json(
      {
        success: true,
        message: successMessage,
        requestType: requestType,
        clientIP: clientIP
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Server error, please try again later' },
      { status: 500 }
    );
  }
}

