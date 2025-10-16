export interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  image: string;
  path: string;
  featured: boolean;
  tags: string[];
  readTime: number; // minutes
  excerpt: string;
  // Optional fields for extended metadata (not required by UI but useful)
  slug?: string;
  cover?: string;
  readingTime?: number; // alias for readTime
}

export const reportCategories = [
  'All Reports',
  'Market Analysis',
  'Technology Trends'
];

export const reports: Report[] = [
  {
    id: 'east-asia-oled-analysis',
    title: 'East Asia OLED Display Market Analysis',
    description: 'Comprehensive analysis of OLED display manufacturers, market trends, and competitive landscape in East Asia',
    category: 'Market Analysis',
    date: '2024-09-15',
    image: '/images/news/oled_factory_hero.jpg',
    path: '/industry-insights',
    featured: true,
    tags: ['OLED', 'East Asia', 'Manufacturing', 'Samsung', 'BOE', 'LG Display'],
    readTime: 12,
    excerpt: 'East Asia dominates 60% of global OLED production capacity, with Chinese manufacturers achieving 50.7% market share in 2024. This comprehensive report analyzes the competitive landscape, production capabilities, and future trends shaping the industry.'
  },
  {
    id: 'lcd-oled-quality-testing-whitepaper',
    title: 'LCD/OLED Quality & Testing Whitepaper - Equipment Procurement Guide',
    description: 'Comprehensive whitepaper on LCD/OLED quality assessment, testing methodologies, and procurement decision support',
    category: 'Technology Trends',
    date: '2024-09-10',
    image: '/images/news/hero-display-tech.jpg',
    path: '/news/lcd-oled-whitepaper',
    featured: true,
    tags: ['LCD', 'OLED', 'Quality Testing', 'Procurement', 'Technical Standards'],
    readTime: 18,
    excerpt: 'In-depth technical analysis of LCD and OLED display technologies, covering quality parameters, testing standards, reliability assessment, and procurement decision frameworks for professional equipment buyers.'
  },
  {
    id: 'phone-repair-parts-buying-guide-2024',
    slug: 'phone-repair-parts-buying-guide',
    title: 'Phone Repair Parts Buying Guide',
    description: 'How to select, verify quality, and source phone repair parts efficiently across screens, batteries, and camera modules with practical QA and sourcing tips.',
    category: 'Technology Trends',
    date: '2024-09-15',
    image: '/images/news/phone-repair-parts-buying-guide-cover.jpg',
    cover: '/images/news/phone-repair-parts-buying-guide-cover.jpg',
    path: '/news/phone-repair-parts-buying-guide',
    featured: true,
    tags: ['Buying Guide', 'Phone Parts', 'Quality', 'B2B', 'Featured'],
    readTime: 14,
    readingTime: 14,
    excerpt: 'A practical guide to evaluating and sourcing phone repair parts: key specs, compatibility checks, batch QA and traceability, pricing factors, supplier vetting, and common pitfalls to avoid.'
  },
  {
    id: 'mobile-phone-battery-guide-2025',
    slug: 'mobile-phone-battery-guide',
    title: 'Professional Mobile Phone Battery Guide',
    description: 'Comprehensive mobile phone battery guide covering bulk selection strategies, warranty policies, and professional iPad battery replacement solutions.',
    category: 'Technology Trends',
    date: '2025-09-18',
    image: '/images/news/mobile-phone-battery-guide-cover.jpg',
    cover: '/images/news/mobile-phone-battery-guide-cover.jpg',
    path: '/news/mobile-phone-battery-guide',
    featured: true,
    tags: ['Battery Technology', 'Bulk Procurement', 'iPad Replacement', 'Warranty Guide', 'Featured'],
    readTime: 16,
    readingTime: 16,
    excerpt: 'Complete guide to mobile phone battery technology, bulk selection strategies, warranty rights analysis, and professional iPad battery replacement solutions with 2025 technology trends and market insights.'
  },
  {
    id: 'complete-guide-to-buying-phone-repair-parts-2024',
    slug: 'complete-guide-to-buying-phone-repair-parts',
    title: '2024 Complete Guide to Buying Phone Repair Parts',
    description: 'Comprehensive guide to mobile phone repair parts including screens, batteries, cameras, and authentic vs compatible parts comparison.',
    category: 'Technology Trends',
    date: '2024-09-12',
    image: '/images/news/complete-guide-to-buying-phone-repair-parts-cover.jpg',
    cover: '/images/news/complete-guide-to-buying-phone-repair-parts-cover.jpg',
    path: '/news/complete-guide-to-buying-phone-repair-parts',
    featured: true,
    tags: ['Featured', 'Guide', 'Mobile Repair', 'OEM Parts'],
    readTime: 25,
    readingTime: 25,
    excerpt: 'Complete guide to mobile phone repair parts covering screen technologies, battery specifications, camera modules, and comprehensive comparison of original vs compatible parts with market insights and quality identification tips.'
  }
];

export const getFeaturedReports = () => reports.filter(report => report.featured);

export const getReportsByCategory = (category: string) => {
  if (category === 'All Reports') return reports;
  return reports.filter(report => report.category === category);
};

export const getRecentReports = (limit: number = 3) => {
  return reports
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

export const searchReports = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return reports.filter(report => 
    report.title.toLowerCase().includes(lowercaseQuery) ||
    report.description.toLowerCase().includes(lowercaseQuery) ||
    report.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    report.excerpt.toLowerCase().includes(lowercaseQuery)
  );
};
