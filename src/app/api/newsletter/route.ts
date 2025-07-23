import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface NewsletterSubscription {
  email: string;
  clientIP?: string;
  browserInfo?: string;
}

// 创建 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body: NewsletterSubscription = await request.json();
    const { email, clientIP: providedIP, browserInfo: providedBrowser } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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

    // Get client IP address - try multiple methods
    const getClientIP = () => {
      // Try x-forwarded-for header (most common in production)
      const forwarded = request.headers.get('x-forwarded-for');
      if (forwarded) {
        return forwarded.split(',')[0].trim();
      }

      // Try x-real-ip header
      const realIP = request.headers.get('x-real-ip');
      if (realIP) {
        return realIP.trim();
      }

      // Try cf-connecting-ip (Cloudflare)
      const cfIP = request.headers.get('cf-connecting-ip');
      if (cfIP) {
        return cfIP.trim();
      }

      // Try x-client-ip
      const clientIP = request.headers.get('x-client-ip');
      if (clientIP) {
        return clientIP.trim();
      }

      // For local development, try to get the actual IP or return localhost
      if (process.env.NODE_ENV === 'development') {
        // Check if we're getting IPv6 localhost
        const host = request.headers.get('host');
        if (host && host.includes('localhost')) {
          return '127.0.0.1 (localhost)';
        }
        return '127.0.0.1 (localhost)';
      }

      return 'unknown';
    };

    // Use client-provided IP if available, otherwise try to get from headers
    const clientIP = providedIP || getClientIP();

    // Use client-provided browser info if available, otherwise get from headers
    const userAgent = providedBrowser || request.headers.get('user-agent') || 'unknown';

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Newsletter subscription debug info:');
      console.log('Headers:', Object.fromEntries(request.headers.entries()));
      console.log('Detected IP:', clientIP);
      console.log('User Agent:', userAgent);
    }

    // Check if email already exists
    const { data: existingSubscription, error: checkError } = await supabase
      .from('newsletter_subscriptions')
      .select('id, status')
      .eq('email', email)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing subscription:', checkError);
      return NextResponse.json(
        { error: 'Database error occurred' },
        { status: 500 }
      );
    }

    if (existingSubscription) {
      if (existingSubscription.status === 'active') {
        return NextResponse.json(
          { error: 'This email is already subscribed to our newsletter' },
          { status: 409 }
        );
      } else if (existingSubscription.status === 'unsubscribed') {
        // Reactivate subscription
        const { error: updateError } = await supabase
          .from('newsletter_subscriptions')
          .update({
            status: 'active',
            resubscribed_at: new Date().toISOString(),
            ip_address: clientIP,
            user_agent: userAgent
          })
          .eq('id', existingSubscription.id);

        if (updateError) {
          console.error('Error reactivating subscription:', updateError);
          return NextResponse.json(
            { error: 'Failed to reactivate subscription' },
            { status: 500 }
          );
        }

        console.log('✅ Newsletter subscription reactivated:', email);
        return NextResponse.json(
          {
            success: true,
            message: 'Welcome back! Your newsletter subscription has been reactivated.',
            action: 'reactivated'
          },
          { status: 200 }
        );
      }
    }

    // Create new subscription
    const subscriptionData = {
      email: email,
      status: 'active',
      ip_address: clientIP,
      user_agent: userAgent,
      subscribed_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .insert([subscriptionData])
      .select();

    if (error) {
      console.error('Database save error:', error);
      return NextResponse.json(
        { error: 'Failed to save subscription. Please try again.' },
        { status: 500 }
      );
    }

    console.log('✅ Newsletter subscription saved:', data);

    // Log subscription info
    const logInfo = {
      time: new Date().toISOString(),
      email: email,
      ipAddress: clientIP,
      userAgent: userAgent
    };

    console.log('📧 New newsletter subscription:', logInfo);

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for subscribing! You will receive our latest updates and guides.',
        action: 'subscribed'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing newsletter subscription:', error);
    return NextResponse.json(
      { error: 'Server error, please try again later' },
      { status: 500 }
    );
  }
}

// GET method to retrieve subscription status (optional)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'Email parameter is required' },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .select('email, status, subscribed_at')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Error checking subscription:', error);
      return NextResponse.json(
        { error: 'Database error occurred' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      subscribed: !!data && data.status === 'active',
      subscription: data
    });

  } catch (error) {
    console.error('Error processing subscription check:', error);
    return NextResponse.json(
      { error: 'Server error, please try again later' },
      { status: 500 }
    );
  }
}
