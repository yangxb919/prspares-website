import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ProductCard } from '@/types/product';
import Breadcrumb, { BreadcrumbItem } from '@/components/shared/Breadcrumb';
import { createPublicClient } from '@/utils/supabase-public';
import { CheckCircle, ShieldCheck, Truck, Zap } from 'lucide-react';
import ProductDetailClient from '@/components/features/ProductDetailClient';
import ProductInfoTabs from '@/components/features/ProductInfoTabs';

// 强制重新验证每次请求
export const revalidate = 0;

// Function to get related products from database
async function getRelatedProducts(currentProductId: string, limit: number = 3) {
  const supabase = createPublicClient();

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, slug, short_desc, regular_price, images')
      .eq('status', 'publish')
      .neq('id', currentProductId) // Exclude current product
      .order('created_at', { ascending: false }) // Get latest products
      .limit(limit);

    if (error) {
      console.error('Error fetching related products:', error);
      return [];
    }

    return products?.map(product => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      shortDescription: product.short_desc || 'High-quality mobile repair part',
      category: 'Mobile Parts',
      price: product.regular_price || 0,
      currency: 'USD',
      imageSrc: Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : '/placeholder-product.jpg',
      features: ['OEM Quality', 'Perfect Fit', 'Tested']
    })) || [];
  } catch (error) {
    console.error('Error in getRelatedProducts:', error);
    return [];
  }
}

// 生成动态元数据
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createPublicClient();
  
  const { data: product } = await supabase
    .from('products')
    .select('name, short_desc')
    .eq('slug', params.slug)
    .eq('status', 'publish')
    .single();
  
  if (!product) {
    return {
      title: 'Product Not Found - PRSPARES',
      description: 'Sorry, the mobile repair part you are looking for does not exist.'
    };
  }
  
  return {
    title: `${product.name} - PRSPARES Mobile Parts`,
    description: product.short_desc || `Details for ${product.name} - high-quality mobile repair parts.`
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createPublicClient();
  
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', params.slug)
      .eq('status', 'publish')
      .single();
    
    if (error) throw error;
    if (!product) notFound();

    const breadcrumbItems: BreadcrumbItem[] = [
      { label: 'Home', href: '/' },
      { label: 'Parts', href: '/products' }, 
      { label: product.name, href: `/products/${product.slug}`, isCurrent: true }
    ];

    const relatedProducts = await getRelatedProducts(product.id, 3);

    return (
      <main className="min-h-screen bg-gray-100">
        <div className="bg-white border-b border-gray-200 py-4 shadow-sm">
            <div className="max-w-[1200px] mx-auto px-4">
                <Breadcrumb items={breadcrumbItems} />
            </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-12">
          <ProductDetailClient product={product} />

          {/* Product Information Tabs */}
          <ProductInfoTabs product={product} />

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-1 h-8 bg-green-600 rounded-full mr-3"></span>
                You Might Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedProducts.map((relatedProd) => (
                  <div key={relatedProd.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
                    <Link href={`/products/${relatedProd.slug}`} className="block">
                      <div className="relative h-40 overflow-hidden">
                        <Image
                          src={relatedProd.imageSrc}
                          alt={relatedProd.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          style={{objectFit: 'cover'}}
                          className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
                        />
                      </div>
                    </Link>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-sm font-semibold text-gray-800 mb-4 group-hover:text-[#00B140] transition-colors line-clamp-2 min-h-[2.25em]">
                        <Link href={`/products/${relatedProd.slug}`}>{relatedProd.name}</Link>
                      </h3>
                      <Link
                        href={`/products/${relatedProd.slug}`}
                        className="mt-auto block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-center text-sm">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Shipping Info */}
            <div className="bg-white p-4 rounded-lg shadow-lg text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Fast Shipping</h3>
              <p className="text-sm text-gray-600">Free shipping on orders over $50</p>
            </div>

            {/* Quality Guarantee */}
            <div className="bg-white p-4 rounded-lg shadow-lg text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Quality Tested</h3>
              <p className="text-sm text-gray-600">All parts tested before shipping</p>
            </div>

            {/* Support */}
            <div className="bg-white p-4 rounded-lg shadow-lg text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Expert Support</h3>
              <p className="text-sm text-gray-600">Technical support available</p>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Product detail page error:', error);
    notFound();
  }
} 