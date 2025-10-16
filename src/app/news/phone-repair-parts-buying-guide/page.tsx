import Link from 'next/link';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';

// Static, script-free migration (English only)
// No <script>, no inline events, no inline styles.

export const metadata = {
  title: 'Phone Repair Parts Buying Guide',
  description:
    'How to select, verify quality, and source phone repair parts across screens, batteries, and camera modules with practical QA and sourcing tips.',
};

export default function PhoneRepairPartsBuyingGuidePage() {
  const baseDir = path.join(process.cwd(), 'src', 'app', 'news', 'phone-repair-parts-buying-guide');
  const enPath = path.join(baseDir, 'sanitized.en.html');
  const zhPath = path.join(baseDir, 'sanitized.html');
  const pick = fs.existsSync(enPath) ? enPath : zhPath;
  const sanitizedRaw = fs.existsSync(pick) ? fs.readFileSync(pick, 'utf8') : '';
  // Remove non-body decorative sections from source (navbar/hero) to match requested view
  const sanitizedHtml = sanitizedRaw
    // strip top navbar
    .replace(/<nav[^>]*class=["'][^"']*\bnavbar\b[^"']*["'][\s\S]*?<\/nav>/gi, '')
    // strip hero section
    .replace(/<section[^>]*class=["'][^"']*\bhero\b[^"']*["'][\s\S]*?<\/section>/gi, '');
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header / Breadcrumb */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center text-sm text-gray-600">
          <Link href="/" className="hover:text-green-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/news" className="hover:text-green-700">News</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Phone Repair Parts Buying Guide</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/news/phone-repair-parts-buying-guide-cover.jpg"
            alt="Cover — Phone repair parts buying guide"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-white">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Phone Repair Parts Buying Guide
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl">
            Practical guidance for selecting screens, batteries, and camera modules — from key specs and compatibility checks to supplier vetting, batch QA, pricing, and warranties.
          </p>
          <p className="mt-6 text-sm opacity-80">Published: 2024-09 (static)</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar (static TOC) */}
          <aside className="hidden lg:block lg:w-1/4">
            <div className="sticky top-24">
              <div className="bg-white border rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold mb-4">Contents</h3>
                <nav className="space-y-2 text-sm">
                  <a href="#introduction" className="block px-3 py-2 rounded hover:bg-gray-50">Overview</a>
                  <a href="#screen-parts" className="block px-3 py-2 rounded hover:bg-gray-50">Screen Assemblies</a>
                  <a href="#battery-parts" className="block px-3 py-2 rounded hover:bg-gray-50">Batteries</a>
                  <a href="#camera-parts" className="block px-3 py-2 rounded hover:bg-gray-50">Cameras & Sensors</a>
                  <a href="#comparison" className="block px-3 py-2 rounded hover:bg-gray-50">OEM vs Compatible</a>
                  <a href="#pricing" className="block px-3 py-2 rounded hover:bg-gray-50">Pricing Factors</a>
                  <a href="#suppliers" className="block px-3 py-2 rounded hover:bg-gray-50">Recommended Suppliers</a>
                  <a href="#guide" className="block px-3 py-2 rounded hover:bg-gray-50">Pitfalls to Avoid</a>
                </nav>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:w-3/4 space-y-8">
            {/* Inject sanitized full body (footer removed) */}
            <section className="bg-white border rounded-2xl p-6 shadow-sm prose prose-gray max-w-none">
              <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
            </section>

            {/* CTA (footer) */}
            <section className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl p-8">
              <div className="text-center max-w-3xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold mb-3">Ready to source with confidence?</h3>
                <p className="opacity-90 mb-6">Get model compatibility lists and QA templates tailored to your needs.</p>
                <Link href="/products" className="inline-flex px-6 py-3 bg-white text-emerald-700 rounded-lg font-semibold hover:bg-gray-100">Browse Products</Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
