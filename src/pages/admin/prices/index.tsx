import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { createPublicClient } from '@/utils/supabase-public';
import Link from 'next/link';

type UploadFile = { file: File; name: string; size: number };

type Product = {
  id: string;
  brand: string;
  model: string;
  series: string;
  product_title: string;
  product_type: string;
  image_url: string;
  price: string;
  currency: string;
  created_at: string;
};

export default function AdminPrices() {
  const supabase = useMemo(() => createPublicClient(), []);
  const [userOk, setUserOk] = useState(false);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // 新增状态
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('upload');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const itemsPerPage = 20;

  useEffect(() => {
    const check = async () => {
      try {
        const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
        const role = localStorage.getItem('userRole');
        if (isLoggedIn && (role === 'admin' || role === 'author')) {
          setUserOk(true);
          return;
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data: p } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
        if (p && (p.role === 'admin' || p.role === 'author')) setUserOk(true);
      } catch (e) {
        // ignore
      }
    };
    check();
  }, [supabase]);

  // 加载产品数据
  const loadProducts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('prices')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (searchTerm) {
        query = query.or(`product_title.ilike.%${searchTerm}%,product_type.ilike.%${searchTerm}%`);
      }
      if (selectedBrand) {
        query = query.eq('brand', selectedBrand);
      }
      if (selectedModel) {
        query = query.eq('model', selectedModel);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      setProducts((data || []) as any);
      setTotalCount(count || 0);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userOk && activeTab === 'manage') {
      loadProducts();
    }
  }, [userOk, activeTab, currentPage, searchTerm, selectedBrand, selectedModel]);

  // 删除产品
  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from('prices').delete().eq('id', id);
      if (error) throw error;
      loadProducts();
      setDeleteConfirm(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  // 批量删除
  const bulkDelete = async (ids: string[]) => {
    try {
      const { error } = await supabase.from('prices').delete().in('id', ids);
      if (error) throw error;
      loadProducts();
    } catch (e: any) {
      setError(e.message);
    }
  };

  // 保存编辑
  const saveEdit = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('prices')
        .update({
          brand: product.brand,
          model: product.model,
          series: product.series,
          product_title: product.product_title,
          product_type: product.product_type,
          image_url: product.image_url,
          price: product.price,
          currency: product.currency,
        })
        .eq('id', product.id);
      if (error) throw error;
      setEditingProduct(null);
      loadProducts();
    } catch (e: any) {
      setError(e.message);
    }
  };

  // 添加新产品
  const addProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase.from('prices').insert([product]);
      if (error) throw error;
      setShowAddModal(false);
      loadProducts();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files || []);
    const mapped = list.map((f) => ({ file: f, name: f.name, size: f.size }));
    setFiles((prev) => [...prev, ...mapped]);
  };

  const clear = () => { setFiles([]); setResult(null); setError(null); };

  function abToBase64(ab: ArrayBuffer): string {
    const uint8 = new Uint8Array(ab);
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < uint8.length; i += chunk) {
      binary += String.fromCharCode.apply(null as any, uint8.subarray(i, i + chunk) as any);
    }
    return typeof window !== 'undefined' ? window.btoa(binary) : Buffer.from(ab as any).toString('base64');
  }

  const upload = async () => {
    try {
      setUploading(true); setError(null); setResult(null);
      const payload = {
        files: await Promise.all(files.map(async (f) => {
          const ab = await f.file.arrayBuffer();
          const b64 = abToBase64(ab);
          return { name: f.name, base64: b64 };
        }))
      };
      const res = await fetch('/api/admin/prices/import-robust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Upload failed');
      setResult(json);
    } catch (e: any) {
      setError(e?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (!userOk) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-2">Prices Management</h1>
          <p className="text-gray-600">Please login as admin/author to access this page. <Link href="/auth/signin" className="underline">Sign in</Link></p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Prices Management</h1>
          <p className="text-gray-600">产品价格管理：批量上传CSV、查询、修改、删除产品数据</p>
        </div>

        {/* Tab 切换 */}
        <div className="flex gap-4 border-b">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'upload'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            批量上传 CSV
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'manage'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            产品管理
          </button>
        </div>

        {/* 上传 Tab */}
        {activeTab === 'upload' && (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">选择 CSV 文件（可多选）</p>
                  <p className="text-sm text-gray-500">建议 UTF-8 或 GB18030；价格可含 US$、逗号分隔，会自动清洗。</p>
                </div>
                <button onClick={clear} className="text-sm text-gray-600 underline">清空列表</button>
              </div>
              <input type="file" multiple accept=".csv,text/csv" onChange={onSelect} className="block" />
              {files.length > 0 && (
                <ul className="mt-4 space-y-1 text-sm text-gray-700">
                  {files.map((f, i) => (
                    <li key={i} className="flex items-center justify-between border-b py-1">
                      <span>{f.name}</span>
                      <span className="text-gray-400">{(f.size/1024).toFixed(1)} KB</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-4 flex gap-3">
                <button onClick={upload} disabled={uploading || files.length === 0} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50">
                  {uploading ? '导入中…' : '上传并导入'}
                </button>
                <Link href="/pricing" className="px-4 py-2 rounded-md border">查看前台 /pricing</Link>
              </div>
              {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
              {result && (
                <div className="mt-4 text-sm">
                  <p className="font-medium">导入完成：共 {result.total} 条</p>
                  <ul className="mt-2 space-y-1">
                    {result.results?.map((r: any, i: number) => (
                      <li key={i} className="text-gray-700">
                        {r.file}: {r.inserted} {r.error ? `（错误：${r.error}）` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <p className="font-medium mb-2">字段映射说明</p>
              <p className="text-sm text-gray-600">自动识别列名：
                <code className="ml-2 bg-gray-100 px-1 rounded">title/name/产品/产品名称/商品名称</code>，
                <code className="ml-2 bg-gray-100 px-1 rounded">image/图片/产品图片_URL</code>，
                <code className="ml-2 bg-gray-100 px-1 rounded">price/价格/售价</code>，
                <code className="ml-2 bg-gray-100 px-1 rounded">currency/币种</code>，
                <code className="ml-2 bg-gray-100 px-1 rounded">url/链接</code>。
              </p>
            </div>
          </>
        )}
        {/* 管理 Tab */}
        {activeTab === 'manage' && (
          <>
            {/* 搜索和筛选 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="搜索产品名称或类型..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="品牌筛选..."
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="px-4 py-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="型号筛选..."
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="px-4 py-2 border rounded-md"
                />
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                  + 添加新产品
                </button>
              </div>
            </div>

            {/* 产品列表 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <p className="font-medium">产品列表（共 {totalCount} 条）</p>
              </div>

              {loading ? (
                <div className="p-8 text-center text-gray-500">加载中...</div>
              ) : products.length === 0 ? (
                <div className="p-8 text-center text-gray-500">暂无数据</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">图片</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">品牌</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">型号</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">产品名称</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">价格</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            {product.image_url ? (
                              <img src={product.image_url} alt="" className="w-12 h-12 object-cover rounded" />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">无图</div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">{product.brand}</td>
                          <td className="px-4 py-3 text-sm">{product.model}</td>
                          <td className="px-4 py-3 text-sm max-w-xs truncate">{product.product_title}</td>
                          <td className="px-4 py-3 text-sm">{product.product_type}</td>
                          <td className="px-4 py-3 text-sm font-medium">{product.currency}{product.price}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingProduct(product)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                编辑
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(product.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 分页 */}
              {totalCount > itemsPerPage && (
                <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    显示 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalCount)} / {totalCount}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      上一页
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={currentPage * itemsPerPage >= totalCount}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      下一页
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* 编辑模态框 */}
        {editingProduct && (
          <ProductModal
            product={editingProduct}
            onSave={saveEdit}
            onClose={() => setEditingProduct(null)}
          />
        )}

        {/* 添加模态框 */}
        {showAddModal && (
          <ProductModal
            onSave={addProduct}
            onClose={() => setShowAddModal(false)}
          />
        )}

        {/* 删除确认 */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md">
              <h3 className="text-lg font-bold mb-4">确认删除</h3>
              <p className="text-gray-600 mb-6">确定要删除这个产品吗？此操作无法撤销。</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 border rounded-md"
                >
                  取消
                </button>
                <button
                  onClick={() => deleteProduct(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// 产品编辑/添加模态框组件
function ProductModal({
  product,
  onSave,
  onClose
}: {
  product?: Product;
  onSave: (product: any) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    brand: product?.brand || '',
    model: product?.model || '',
    series: product?.series || '',
    product_title: product?.product_title || '',
    product_type: product?.product_type || '',
    image_url: product?.image_url || '',
    price: product?.price || '',
    currency: product?.currency || 'US$',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      onSave({ ...product, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">{product ? '编辑产品' : '添加新产品'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">品牌 *</label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">型号 *</label>
              <input
                type="text"
                required
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">系列</label>
            <input
              type="text"
              value={formData.series}
              onChange={(e) => setFormData({ ...formData, series: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">产品名称 *</label>
            <input
              type="text"
              required
              value={formData.product_title}
              onChange={(e) => setFormData({ ...formData, product_title: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">产品类型</label>
            <input
              type="text"
              value={formData.product_type}
              onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="例如: LCD Screen, Battery, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">图片URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">价格 *</label>
              <input
                type="text"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="18.19"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">币种</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="US$">US$</option>
                <option value="€">€</option>
                <option value="£">£</option>
                <option value="¥">¥</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              {product ? '保存修改' : '添加产品'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
