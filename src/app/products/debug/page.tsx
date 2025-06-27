import { createPublicClient } from '@/utils/supabase-public';

export default async function ProductsDebugPage() {
  const supabase = createPublicClient();

  if (!supabase) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">产品数据调试页面</h1>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>Supabase 未配置。请检查环境变量设置。</p>
            <p>需要设置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
          </div>
        </div>
      </div>
    );
  }

  // 查询所有产品
  const { data: allProducts, error: allError } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  // 查询已发布的产品
  const { data: publishedProducts, error: publishedError } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'publish')
    .order('created_at', { ascending: false });

  // 查询产品分类
  const { data: categories, error: categoriesError } = await supabase
    .from('product_categories')
    .select('*');

  // 查询产品分类关联
  const { data: productCategories, error: productCategoriesError } = await supabase
    .from('product_to_category')
    .select(`
      product_id,
      category_id,
      products(id, name, status),
      product_categories(id, name, slug)
    `);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">产品数据调试页面</h1>

        {/* 产品详细数据 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">产品详细数据</h2>
          {publishedProducts?.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>ID:</strong> {product.id}</p>
                  <p><strong>Slug:</strong> {product.slug}</p>
                  <p><strong>状态:</strong> {product.status}</p>
                  <p><strong>价格:</strong> ${product.regular_price}</p>
                </div>
                <div>
                  <p><strong>Images数据:</strong></p>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                    {JSON.stringify(product.images, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 所有产品 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">所有产品 ({allProducts?.length || 0})</h2>
          {allError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              错误: {allError.message}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">名称</th>
                  <th className="px-4 py-2 text-left">Slug</th>
                  <th className="px-4 py-2 text-left">状态</th>
                  <th className="px-4 py-2 text-left">价格</th>
                  <th className="px-4 py-2 text-left">创建时间</th>
                </tr>
              </thead>
              <tbody>
                {allProducts?.map((product) => (
                  <tr key={product.id} className="border-t">
                    <td className="px-4 py-2">{product.id}</td>
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">{product.slug}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        product.status === 'publish' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">${product.regular_price || 'N/A'}</td>
                    <td className="px-4 py-2">{new Date(product.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 已发布产品 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">已发布产品 ({publishedProducts?.length || 0})</h2>
          {publishedError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              错误: {publishedError.message}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {publishedProducts?.map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.short_desc}</p>
                <p className="text-sm">价格: ${product.regular_price}</p>
                <p className="text-sm">库存: {product.stock_status}</p>
                <p className="text-sm">作者ID: {product.author_id || '未设置'}</p>
                <p className="text-sm">图片: {Array.isArray(product.images) ? product.images.length + '张' : '格式异常'}</p>
                <p className="text-sm">Meta: {product.meta ? 'Yes' : 'No'}</p>
                <div className="mt-2">
                  <a
                    href={`/products/${product.slug}`}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    查看详情页 →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 产品分类 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">产品分类 ({categories?.length || 0})</h2>
          {categoriesError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              错误: {categoriesError.message}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories?.map((category) => (
              <div key={category.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-gray-600">Slug: {category.slug}</p>
                <p className="text-sm">{category.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 产品分类关联 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">产品分类关联 ({productCategories?.length || 0})</h2>
          {productCategoriesError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              错误: {productCategoriesError.message}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">产品ID</th>
                  <th className="px-4 py-2 text-left">产品名称</th>
                  <th className="px-4 py-2 text-left">分类ID</th>
                  <th className="px-4 py-2 text-left">分类名称</th>
                </tr>
              </thead>
              <tbody>
                {productCategories?.map((relation, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{relation.product_id}</td>
                    <td className="px-4 py-2">{(relation as any).products?.name}</td>
                    <td className="px-4 py-2">{relation.category_id}</td>
                    <td className="px-4 py-2">{(relation as any).product_categories?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-100 rounded-lg">
          <h3 className="font-semibold mb-2">调试说明:</h3>
          <ul className="text-sm space-y-1">
            <li>• 检查产品状态是否为 "publish"</li>
            <li>• 检查产品是否有分类关联</li>
            <li>• 检查数据库权限设置</li>
            <li>• 检查images字段的数据格式</li>
            <li>• 访问 /products 查看前端显示</li>
          </ul>
        </div>
      </div>
    </div>
  );
}