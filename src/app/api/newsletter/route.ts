import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

type NewsletterSource = 'footer' | 'blog' | 'unknown';

interface NewsletterSubscriptionPayload {
  email?: string;
  source?: string;
}

const NEWSLETTER_SOURCES: NewsletterSource[] = ['footer', 'blog', 'unknown'];

const normalizeSource = (source?: string): NewsletterSource => {
  if (!source) return 'unknown';
  const normalized = source.trim().toLowerCase() as NewsletterSource;
  return NEWSLETTER_SOURCES.includes(normalized) ? normalized : 'unknown';
};

const resolveClientIP = (request: NextRequest): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();

  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP.trim();

  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) return cfIP.trim();

  const clientIP = request.headers.get('x-client-ip');
  if (clientIP) return clientIP.trim();

  if (process.env.NODE_ENV === 'development') {
    return '127.0.0.1 (localhost)';
  }

  return 'unknown';
};

const getNewsletterClient = () => getAdminClient();

export async function POST(request: NextRequest) {
  try {
    const body: NewsletterSubscriptionPayload = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const source = normalizeSource(body.source);

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

    const clientIP = resolveClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const supabase = getNewsletterClient();

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Newsletter subscription debug info:');
      console.log('Headers:', Object.fromEntries(request.headers.entries()));
      console.log('Detected IP:', clientIP);
      console.log('User Agent:', userAgent);
      console.log('Source:', source);
    }

    // Check if email already exists
    const { data: existingSubscription, error: checkError } = await supabase
      .from('newsletter_subscriptions')
      .select('id, status, source')
      .eq('email', email)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing subscription:', checkError);
      return NextResponse.json(
        { error: checkError.code === 'PGRST205' ? 'Newsletter storage table is missing' : 'Database error occurred' },
        { status: 500 }
      );
    }

    if (existingSubscription) {
      if (existingSubscription.status === 'active') {
        if (existingSubscription.source === 'unknown' && source !== 'unknown') {
          const { error: sourceUpdateError } = await supabase
            .from('newsletter_subscriptions')
            .update({ source })
            .eq('id', existingSubscription.id);
          if (sourceUpdateError) {
            console.error('Error updating unknown source:', sourceUpdateError);
          }
        }
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
            user_agent: userAgent,
            source
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
      source,
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
  const email = searchParams.get('email')?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json(
      { error: 'Email parameter is required' },
      { status: 400 }
    );
  }

  try {
    const supabase = getNewsletterClient();
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .select('email, status, source, subscribed_at')
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
