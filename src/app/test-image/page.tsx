export default function TestImagePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Test Page</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Supabase Image (应该显示)</h2>
          <img 
            src="https://eiikisplpnbeiscunkap.supabase.co/storage/v1/object/public/post-images/bf93cce6-898f-4ca6-aa35-7d6f48ed6061/983eylpwa74.png"
            alt="Supabase test"
            className="max-w-full h-auto"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. Cloudinary Image (测试是否显示)</h2>
          <img 
            src="https://pplx-res.cloudinary.com/image/upload/v1748692368/pplx_project_search_images/d8cf7d6d7831eafef87a76eeeb1c7326234de637.jpg"
            alt="Cloudinary test"
            className="max-w-full h-auto"
            referrerPolicy="no-referrer"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">3. res.cloudinary.com Image (测试是否显示)</h2>
          <img 
            src="https://res.cloudinary.com/demo/image/upload/sample.jpg"
            alt="Cloudinary demo"
            className="max-w-full h-auto"
            referrerPolicy="no-referrer"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">4. 检查浏览器控制台</h2>
          <p className="text-gray-600">
            打开浏览器开发者工具 (F12) → Console 和 Network 标签页
            <br />
            查看是否有图片加载错误或被阻止的请求
          </p>
        </div>
      </div>
    </div>
  );
}

