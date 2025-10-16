'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, TrendingUp, FileText } from 'lucide-react';
import { reports, reportCategories } from '@/data/reports';
import Breadcrumb from '@/components/shared/Breadcrumb';

import './styles.css';

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Reports');

  // Filter reports based on selected category
  const filteredReportsBase = selectedCategory === 'All Reports'
    ? reports
    : reports.filter(report => report.category === selectedCategory);

  // Ensure Latest News order by date (desc)
  const filteredReports = [...filteredReportsBase].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Breadcrumb navigation data
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'News', href: '/news', isCurrent: true },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-[#00B140] to-[#008631] text-white py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-[1200px] mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Industry News & Reports
            </h1>
            <p className="text-lg md:text-xl mb-6 opacity-90 max-w-2xl mx-auto">
              Stay ahead with comprehensive market analysis, technology trends, and industry insights for mobile repair professionals
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </section>

      {/* Category Filter */}
      <div className="bg-white sticky top-[70px] z-10 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-center py-6">
            <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
              {reportCategories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        {filteredReports.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Reports Found</h2>
            <p className="text-gray-500 mb-8">We are currently working on new reports. Please check back soon!</p>
            <Link href="/" className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Return to Home
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredReports.map((report) => (
                <Link key={report.id} href={report.path} className="group block h-full">
                  <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer h-full flex flex-col">
                    <div className="relative h-52 overflow-hidden flex-shrink-0">
                      <Image
                        src={report.image}
                        alt={report.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-flex items-center px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full text-xs font-medium shadow-sm">
                          {report.category}
                        </span>
                      </div>
                      {report.featured && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="inline-flex items-center px-2 py-1 bg-yellow-400 text-black rounded-full text-xs font-semibold">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Featured
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <h2 className="text-xl font-bold mb-3 line-clamp-2 text-gray-900 group-hover:text-[#00B140] transition-colors duration-300 min-h-[3.5rem] leading-tight">
                        {report.title}
                      </h2>

                      <p className="text-gray-600 mb-6 line-clamp-3 group-hover:text-gray-700 transition-colors duration-300 flex-grow leading-relaxed">
                        {report.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300 mt-auto">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(report.date)}</span>
                          </div>
                          <span>·</span>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{report.readTime} min read</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {report.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {report.tags.length > 2 && (
                          <span className="text-gray-500 text-xs">
                            +{report.tags.length - 2} more
                          </span>
                        )}
                      </div>

                      <div className="mt-5 flex items-center text-[#00B140] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                        <span className="text-sm font-semibold">Read Report</span>
                        <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex justify-center">
              <div className="flex items-center space-x-2">
                <button className="p-2.5 text-gray-400 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100 disabled:opacity-50" disabled>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="w-10 h-10 bg-[#00B140] text-white rounded-lg font-semibold text-sm shadow-md">1</button>
                <button className="p-2.5 text-gray-400 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated with Industry Insights</h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Get the latest market analysis, technology trends, and exclusive industry reports delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B140] focus:border-transparent bg-white shadow-sm"
              />
              <button className="px-7 py-3.5 bg-[#00B140] text-white rounded-lg font-semibold hover:bg-[#008631] transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              We value your privacy. No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
