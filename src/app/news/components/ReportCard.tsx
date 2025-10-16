import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Star } from 'lucide-react';
import type { Report } from '@/data/reports';

interface ReportCardProps {
  report: Report;
  featured?: boolean;
}

export default function ReportCard({ report, featured = false }: ReportCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (featured) {
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
        <div className="relative h-64 md:h-80">
          <Image
            src={report.image}
            alt={report.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute top-4 left-4">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-semibold">
                Featured
              </span>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3">
              <span className="inline-block bg-[#00B140] text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                {report.category}
              </span>
              <h3 className="text-white font-bold text-xl mb-2 line-clamp-2">
                {report.title}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {report.excerpt}
          </p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(report.date)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{report.readTime} min read</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {report.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
              >
                {tag}
              </span>
            ))}
            {report.tags.length > 3 && (
              <span className="text-gray-500 text-xs">
                +{report.tags.length - 3} more
              </span>
            )}
          </div>
          
          <Link
            href={report.path}
            className="inline-flex items-center bg-[#00B140] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#008631] transition-colors group"
          >
            Read Full Report
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-48">
        <Image
          src={report.image}
          alt={report.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute top-3 left-3">
          <span className="bg-[#00B140] text-white px-2 py-1 rounded-full text-xs font-medium">
            {report.category}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 hover:text-[#00B140] transition-colors">
          <Link href={report.path}>
            {report.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
          {report.excerpt}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(report.date)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{report.readTime} min</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {report.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <Link
          href={report.path}
          className="inline-flex items-center text-[#00B140] font-medium text-sm hover:text-[#008631] transition-colors group"
        >
          Read More
          <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
