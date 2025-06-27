'use client';

import { useEffect, useState } from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

const TableOfContents = ({ content }: TableOfContentsProps) => {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // 解析Markdown内容中的标题
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const title = match[2].trim();
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      
      headings.push({ id, title, level });
    }

    setToc(headings);
  }, [content]);

  useEffect(() => {
    const observerOptions = {
      rootMargin: '-20% 0% -35% 0%',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      const visibleHeadings = entries
        .filter(entry => entry.isIntersecting)
        .map(entry => entry.target.id);
      
      if (visibleHeadings.length > 0) {
        setActiveId(visibleHeadings[0]);
      }
    }, observerOptions);

    // 观察所有标题元素
    toc.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [toc]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // 顶部偏移量
      const elementPosition = element.offsetTop - offset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  if (toc.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg sticky top-24">
      <div className="flex items-center mb-6">
        <BookOpen className="w-6 h-6 text-[#00B140] mr-3" />
        <h3 className="text-xl font-bold text-gray-900">Table of Contents</h3>
      </div>
      
      <nav className="space-y-1">
        {toc.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToHeading(item.id)}
            className={`
              group flex items-start w-full text-left py-2 px-3 rounded-lg transition-all duration-200
              ${activeId === item.id 
                ? 'bg-green-50 text-[#00B140] border-l-4 border-[#00B140] shadow-sm' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-[#00B140]'
              }
            `}
            style={{ paddingLeft: `${(item.level - 1) * 16 + 12}px` }}
          >
            <ChevronRight 
              className={`
                w-4 h-4 mt-0.5 mr-2 flex-shrink-0 transition-transform duration-200
                ${activeId === item.id ? 'text-[#00B140] rotate-90' : 'text-gray-400 group-hover:text-[#00B140]'}
              `}
            />
            <span className={`
              text-sm leading-relaxed font-medium break-words
              ${item.level === 1 ? 'font-semibold text-base' : ''}
              ${item.level === 2 ? 'font-medium' : ''}
              ${item.level >= 4 ? 'text-xs text-gray-600' : ''}
            `}>
              {item.title}
            </span>
          </button>
        ))}
      </nav>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 leading-relaxed">
          Click any section to jump to that content
        </p>
      </div>
    </div>
  );
};

export default TableOfContents; 