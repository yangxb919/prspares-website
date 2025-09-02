import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { Product } from '@/types/product';
import Breadcrumb, { BreadcrumbItem } from '@/components/shared/Breadcrumb';
import { createPublicClient } from '@/utils/supabase-public';
import { CheckCircle, ShieldCheck, Truck, Zap } from 'lucide-react';
import ProductDetailClient from '@/components/features/ProductDetailClient';
import ProductInfoTabs from '@/components/features/ProductInfoTabs';

// 使用项目中已定义的Product类型，无需重复定义

// 数据库Product类型转换函数
function convertSupabaseToProduct(data: any): Product {
  return {
    id: Number(data.id) || 0,
    name: String(data.name || ''),
    slug: String(data.slug || ''),
    status: (data.status === 'publish' || data.status === 'draft') ? data.status : 'draft',
    author_id: String(data.author_id || ''),
    sku: data.sku ? String(data.sku) : undefined,
    type: data.type ? String(data.type) : undefined,
    short_desc: data.short_desc ? String(data.short_desc) : undefined,
    description: data.description ? String(data.description) : undefined,
    regular_price: data.regular_price ? Number(data.regular_price) : undefined,
    sale_price: data.sale_price ? Number(data.sale_price) : undefined,
    sale_start: data.sale_start ? String(data.sale_start) : undefined,
    sale_end: data.sale_end ? String(data.sale_end) : undefined,
    tax_status: data.tax_status ? String(data.tax_status) : undefined,
    stock_status: data.stock_status ? String(data.stock_status) : undefined,
    stock_quantity: data.stock_quantity ? Number(data.stock_quantity) : undefined,
    weight: data.weight ? Number(data.weight) : undefined,
    dim_length: data.dim_length ? Number(data.dim_length) : undefined,
    dim_width: data.dim_width ? Number(data.dim_width) : undefined,
    dim_height: data.dim_height ? Number(data.dim_height) : undefined,
    attributes: Array.isArray(data.attributes) ? data.attributes : [],
    images: Array.isArray(data.images) ? data.images : [],
    created_at: data.created_at ? String(data.created_at) : undefined,
    updated_at: data.updated_at ? String(data.updated_at) : undefined,
    meta: data.meta || undefined
  };
}

// ProductDetailClient组件期望的Product类型适配器
function convertToClientProduct(dbProduct: Product): any {
  // 处理图片数组
  const images = Array.isArray(dbProduct.images)
    ? dbProduct.images.map(img => typeof img === 'string' ? img : img.url || '/placeholder-product.jpg')
    : ['/placeholder-product.jpg'];

  return {
    id: String(dbProduct.id),
    name: dbProduct.name,
    sku: dbProduct.sku || '',
    description: dbProduct.description || dbProduct.short_desc || '',
    price: dbProduct.regular_price || 0,
    images: images,
    category: 'Mobile Parts', // 默认分类
    subcategory: 'Generic', // 默认子分类
    brand: 'OEM', // 默认品牌
    compatibility: [], // 兼容性信息
    specifications: {}, // 规格信息
    stock_status: dbProduct.stock_status || 'instock'
  };
}

// 强制重新验证每次请求
export const revalidate = 0;

// Function to get related products from database
async function getRelatedProducts(currentProductId: number, limit: number = 3) {
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
      id: String(product.id),
      slug: String(product.slug),
      name: String(product.name),
      shortDescription: String(product.short_desc || 'High-quality mobile repair part'),
      category: 'Mobile Parts',
      price: Number(product.regular_price) || 0,
      currency: 'USD',
      imageSrc: Array.isArray(product.images) && product.images.length > 0
        ? String(product.images[0])
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
  
  const { data: productData } = await supabase
    .from('products')
    .select('name, short_desc')
    .eq('slug', params.slug)
    .eq('status', 'publish')
    .single();

  if (!productData) {
    return {
      title: 'Product Not Found - PRSPARES',
      description: 'Sorry, the mobile repair part you are looking for does not exist.'
    };
  }

  // 使用类型安全的转换函数
  const product = convertSupabaseToProduct(productData);

  return {
    title: `${product.name} - PRSPARES Mobile Parts`,
    description: product.short_desc || `Details for ${product.name} - high-quality mobile repair parts.`
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createPublicClient();
  
  try {
    const { data: productData, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', params.slug)
      .eq('status', 'publish')
      .single();

    if (error) throw error;
    if (!productData) notFound();

    // 使用类型安全的转换函数
    const product = convertSupabaseToProduct(productData);

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
          <ProductDetailClient product={convertToClientProduct(product)} />

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