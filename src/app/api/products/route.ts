import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with service role key for admin access.
// Fallback to anon key if service role is not set (read-only access must be allowed by RLS).
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const EFFECTIVE_KEY = SERVICE_KEY || ANON_KEY || '';
const supabaseAdmin = createClient(SUPABASE_URL, EFFECTIVE_KEY);

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 API - Fetching products from prices table...");

    // Get search parameters
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');
    const model = searchParams.get('model');
    const series = searchParams.get('series');
    const search = searchParams.get('search');

    // Try to fetch from Supabase first
    try {
      let query = supabaseAdmin
        .from('prices')
        .select('id,brand,model,series,product_title,product_type,image_url,price,currency,description,created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      // Add filters
      if (brand) {
        query = query.eq('brand', brand);
      }
      if (model) {
        // Special handling for iPhone 15 Pro Max to include all variants
        if (model === 'iPhone15 Pro Max') {
          query = query.or('model.eq.iPhone15 Pro Max,model.ilike.*iPhone15 Pro Max*,model.ilike.*iPhone15*Pro*Max*');
        } else {
          // Use exact match for other models to avoid confusion
          query = query.eq('model', model);
        }
      }
      if (series) {
        query = query.ilike('series', `%${series}%`);
      }
      if (search) {
        query = query.ilike('product_title', `%${search}%`);
      }

      const { data: pricesData, error: queryError } = await query;

      if (!queryError && pricesData) {
        // Transform data to match expected format
        const products = pricesData.map((item: any) => ({
          id: item.id,
          title: item.product_title,
          slug: item.product_title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          specs: {
            brand: item.brand,
            model: item.model,
            series: item.series,
            product_type: item.product_type,
            price: `US$${item.price}`,
            currency: item.currency,
            description: item.description
          },
          images: item.image_url ? [item.image_url] : [],
          created_at: item.created_at
        }));

        console.log("🔍 API - Products from Supabase:", {
          count: products.length,
          filters: { brand, model, series, search }
        });

        return NextResponse.json({ products });
      }
    } catch (supabaseError) {
      console.log("⚠️ Supabase query failed:", supabaseError);
      return NextResponse.json({ products: [] });
    }

    // If we reach here, return empty products
    console.log("📝 No products found, returning empty array");
    return NextResponse.json({ products: [] });
  } catch (err) {
    console.error("❌ API - Unexpected error:", err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


