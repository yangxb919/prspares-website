import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ProductCard, ProductWithRelations } from '@/types/product';
import { createPublicClient } from '@/utils/supabase-public';

export const metadata: Metadata = {
  title: 'Mobile Repair Parts - PRSPARES',
  description: 'Browse our extensive catalog of high-quality mobile phone repair parts, including OEM screens, batteries, and components for all major brands.',
};

// Force revalidation on every request
export const revalidate = 0;

const categories = [
  { id: 'all', label: 'All Parts', href: '/products' },
  { id: 'screens', label: 'Screens', href: '/products?category=screens' },
  { id: 'batteries', label: 'Batteries', href: '/products?category=batteries' },
  { id: 'charging-ports', label: 'Charging Ports', href: '/products?category=charging-ports' },
  { id: 'cameras', label: 'Cameras', href: '/products?category=cameras' },
  { id: 'small-parts', label: 'Small Parts', href: '/products?category=small-parts' }, // e.g., buttons, flex cables
  { id: 'tools', label: 'Repair Tools', href: '/products?category=tools' },
];



export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const supabase = createPublicClient();
  const category = searchParams.category;

  console.log('Starting product data query for PRSPARES...');

  // Get product data from database
  let productsData: any[] = [];
  let error: any = null;

  try {
    console.log('Connecting to Supabase...');

    // Build query - use left join to include products without categories
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        short_desc,
        description,
        regular_price,
        sale_price,
        stock_status,
        images,
        status,
        created_at,
        meta,
        product_to_category(
          product_categories(id, name, slug)
        )
      `)
      .eq('status', 'publish')
      .order('created_at', { ascending: false })
      .limit(50);

    // If category filtering is needed, use separate query
    if (category && category !== 'all') {
      query = supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          short_desc,
          description,
          regular_price,
          sale_price,
          stock_status,
          images,
          status,
          created_at,
          meta,
          product_to_category!inner(
            product_categories(id, name, slug)
          )
        `)
        .eq('status', 'publish')
        .eq('product_to_category.product_categories.slug', category)
        .order('created_at', { ascending: false })
        .limit(20);
    }

    console.log('Query conditions:', { category });

    const result = await query;
    productsData = result.data || [];
    error = result.error;

    console.log('Query completed:', { success: !error, dataCount: productsData?.length || 0 });

    if (error) {
      console.error('Product query error:', error);
    }

    // Add detailed debug information
    if (productsData && productsData.length > 0) {
      console.log('Product data sample:', productsData[0]);
    } else {
      console.log('No product data found, possible reasons:');
      console.log('1. Product status is not "publish"');
      console.log('2. Database connection issue');
      console.log('3. Permission issue');

      // Try to query all products (including drafts)
      try {
        const allProductsResult = await supabase
          .from('products')
          .select('id, name, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        console.log('All products (including drafts):', allProductsResult.data);
        console.log('Query error:', allProductsResult.error);
      } catch (debugError) {
        console.error('Debug query failed:', debugError);
      }
    }

  } catch (err) {
    console.error('Product data query exception:', err);
    error = err;
  }

  // Convert database data to frontend format
  const products: ProductCard[] = productsData.map((product: any) => {
    // Get price (prioritize sale price)
    const price = product.sale_price || product.regular_price;

    // Get main image - handle different image data formats
    let imageSrc = 'https://picsum.photos/seed/prspares-part/400/300';

    if (product.images) {
      // If images is an array
      if (Array.isArray(product.images)) {
        // Check the first element in the array
        const firstImage = product.images[0];
        if (typeof firstImage === 'string' && firstImage.startsWith('http')) {
          // If it's a URL string array
          imageSrc = firstImage;
        } else if (firstImage?.url) {
          // If it's an object array
          imageSrc = firstImage.url;
        }
      }
      // If images is a string (possibly JSON string)
      else if (typeof product.images === 'string') {
        try {
          const parsedImages = JSON.parse(product.images);
          if (Array.isArray(parsedImages) && parsedImages.length > 0) {
            const firstImage = parsedImages[0];
            if (typeof firstImage === 'string' && firstImage.startsWith('http')) {
              // If it's a URL string array
              imageSrc = firstImage;
            } else if (firstImage?.url) {
              // If it's an object array
              imageSrc = firstImage.url;
            }
          }
        } catch (e) {
          // If not JSON, might be a direct URL
          if (product.images.startsWith('http')) {
            imageSrc = product.images;
          }
        }
      }
      // If images is an object
      else if (typeof product.images === 'object' && product.images.url) {
        imageSrc = product.images.url;
      }
    }

    console.log(`Product ${product.name} image processing:`, {
      originalImages: product.images,
      finalImageSrc: imageSrc
    });

    // Get category name - handle different possible structures
    let categoryName = 'Mobile Parts'; // default category

    if (product.product_to_category && Array.isArray(product.product_to_category) && product.product_to_category.length > 0) {
      const firstCategory = product.product_to_category[0];
      if (firstCategory?.product_categories?.name) {
        categoryName = firstCategory.product_categories.name;
      }
    }

    // Get features from meta
    let features = [];
    if (product.meta && typeof product.meta === 'object') {
      features = product.meta.features || [];
    }

    // Ensure features is an array
    if (!Array.isArray(features)) {
      features = [];
    }

    return {
      id: product.id.toString(),
      slug: product.slug || '',
      name: product.name || 'Unnamed Product',
      shortDescription: product.short_desc || (product.description ? product.description.substring(0, 120) + '...' : 'High-quality mobile repair part'),
      category: categoryName,
      price: price ? Number(price) : undefined,
      currency: 'USD',
      imageSrc,
      features: features
    };
  });

  // Filter products by category (if database query didn't handle category filtering)
  const filteredProducts = category && category !== 'all'
    ? products.filter(product =>
        product.category.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase()
      )
    : products;

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Mobile Phone Repair Parts</h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Find high-quality replacement screens, batteries, charging ports, cameras, and more for all major phone brands. Genuine OEM parts available.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white sticky top-[70px] z-30 shadow-md border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-5">
            <div className="flex items-center space-x-1 bg-gray-100 p-1.5 rounded-lg overflow-x-auto custom-scrollbar">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href={cat.href}
                  className={`px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 whitespace-nowrap flex items-center space-x-2 ${
                    ((!searchParams.category && cat.id === 'all') || searchParams.category === cat.id)
                      ? 'bg-[#00B140] text-white shadow-md ring-2 ring-green-200'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {/* Optional: Add icons to categories */}
                  <span>{cat.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-slash text-gray-400"><path d="m13.5 8.5-5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Products Found</h3>
              <p className="text-gray-600 mb-8">
                We couldn't find any products matching your criteria in this category. Try a different category or check back soon!
              </p>
              <Link href="/products" className="bg-[#00B140] hover:bg-[#008631] text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md">
                Browse All Parts
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product, index) => (
              <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col">
                <div className="relative h-56 sm:h-60 overflow-hidden">
                  <Image
                    src={product.imageSrc}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{objectFit: 'cover'}}
                    priority={index < 4} // Prioritize loading for first few images
                    className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
                  />
                  {product.category && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#00B140] text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-md">
                        {product.category}
                      </span>
                    </div>
                  )}

                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-[#00B140] transition-colors line-clamp-2 min-h-[2.5em]">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow min-h-[3.75em]">
                    {product.shortDescription}
                  </p>

                  {product.features && product.features.length > 0 && (
                    <div className="mb-4 h-12 overflow-y-auto custom-scrollbar-thin">
                      <div className="flex flex-wrap gap-1.5">
                        {product.features.slice(0, 4).map((feature, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs border border-gray-200">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/products/${product.slug}`}
                    className="mt-auto block w-full bg-[#00B140] hover:bg-[#008631] text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Pagination would go here if implemented */}
      </div>
    </main>
  );
}