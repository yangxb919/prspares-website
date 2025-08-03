'use client';

import { useEffect, useState, useRef } from 'react';
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
  const tocRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Parse Markdown content for headings
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
      threshold: [0, 0.25, 0.5, 0.75, 1]
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Find the heading that's most visible
      let mostVisibleEntry: IntersectionObserverEntry | undefined;
      let maxRatio = 0;

      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          mostVisibleEntry = entry;
        }
      }

      // If no heading is intersecting, find the closest one above the viewport
      if (!mostVisibleEntry) {
        const headingElements = toc
          .map(({ id }) => document.getElementById(id))
          .filter((el): el is HTMLElement => el !== null);

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let closestHeading: HTMLElement | undefined;
        let minDistance = Infinity;

        for (const element of headingElements) {
          const elementTop = element.offsetTop;
          const distance = Math.abs(scrollTop - elementTop);

          if (elementTop <= scrollTop + 200 && distance < minDistance) {
            minDistance = distance;
            closestHeading = element;
          }
        }

        if (closestHeading) {
          setActiveId(closestHeading.id);
        }
      } else {
        const target = mostVisibleEntry.target as HTMLElement;
        setActiveId(target.id);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Observe all heading elements
    toc.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [toc]);

  // Auto-scroll TOC to keep active item visible
  useEffect(() => {
    if (activeId && tocRef.current && activeItemRef.current) {
      const tocContainer = tocRef.current;
      const activeItem = activeItemRef.current;

      const containerRect = tocContainer.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();

      // Check if active item is outside the visible area
      const isAbove = itemRect.top < containerRect.top;
      const isBelow = itemRect.bottom > containerRect.bottom;

      if (isAbove || isBelow) {
        const scrollTop = tocContainer.scrollTop;
        const itemOffsetTop = activeItem.offsetTop;
        const containerHeight = tocContainer.clientHeight;
        const itemHeight = activeItem.clientHeight;

        let newScrollTop;
        if (isAbove) {
          // Scroll up to show the item at the top
          newScrollTop = itemOffsetTop - 20;
        } else {
          // Scroll down to show the item at the bottom
          newScrollTop = itemOffsetTop - containerHeight + itemHeight + 20;
        }

        tocContainer.scrollTo({
          top: newScrollTop,
          behavior: 'smooth'
        });
      }
    }
  }, [activeId]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Top offset
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
    <div className="bg-white rounded-xl shadow-lg sticky top-24 max-h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center p-6 pb-4 border-b border-gray-100">
        <BookOpen className="w-6 h-6 text-[#00B140] mr-3" />
        <h3 className="text-xl font-bold text-gray-900">Table of Contents</h3>
      </div>

      <nav
        ref={tocRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {toc.map((item) => (
          <button
            key={item.id}
            ref={activeId === item.id ? activeItemRef : null}
            onClick={() => scrollToHeading(item.id)}
            className={`
              group flex items-start w-full text-left py-2 px-3 rounded-lg transition-all duration-300 transform
              ${activeId === item.id
                ? 'bg-gradient-to-r from-green-50 to-green-25 text-[#00B140] border-l-4 border-[#00B140] shadow-sm scale-105'
                : 'text-gray-700 hover:bg-gray-50 hover:text-[#00B140] hover:scale-102'
              }
            `}
            style={{ paddingLeft: `${(item.level - 1) * 16 + 12}px` }}
          >
            <ChevronRight
              className={`
                w-4 h-4 mt-0.5 mr-2 flex-shrink-0 transition-all duration-300
                ${activeId === item.id
                  ? 'text-[#00B140] rotate-90 scale-110'
                  : 'text-gray-400 group-hover:text-[#00B140] group-hover:rotate-45'
                }
              `}
            />
            <span className={`
              text-sm leading-relaxed font-medium break-words transition-all duration-200
              ${item.level === 1 ? 'font-semibold text-base' : ''}
              ${item.level === 2 ? 'font-medium' : ''}
              ${item.level >= 4 ? 'text-xs text-gray-600' : ''}
              ${activeId === item.id ? 'font-semibold' : ''}
            `}>
              {item.title}
            </span>
          </button>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 leading-relaxed">
          Click any section to jump to that content
        </p>
        <div className="mt-2 flex items-center text-xs text-gray-400">
          <div className="w-2 h-2 bg-[#00B140] rounded-full mr-2"></div>
          <span>Current section</span>
        </div>
      </div>
    </div>
  );
};

export default TableOfContents; 