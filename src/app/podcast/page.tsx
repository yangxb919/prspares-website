import PodcastHeader from '@/components/features/PodcastHeader';
import PodcastList from '@/components/features/PodcastList';
import Breadcrumb from '@/components/shared/Breadcrumb';
import { PodcastEpisode } from '@/components/features/PodcastEpisodeCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Podcast - PRSPARES Mobile Repair Parts',
  description: 'Listen to industry experts share insights about mobile repair techniques, parts sourcing, and industry trends',
};

export default function PodcastPage() {
  // Breadcrumb navigation data
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Podcast', href: '/podcast', isCurrent: true },
  ];

  // Example podcast data
  const episodes: PodcastEpisode[] = [
    {
      id: 'ep001',
      title: 'The Evolution of Mobile Repair: Past, Present and Future',
      description: 'In this episode, we invite industry expert John Smith to discuss the evolution of mobile repair technology, current market trends, and future innovations. How has mobile repair evolved from basic battery replacements to complex microsoldering?',
      duration: '38:25',
      date: 'May 1, 2025',
      audioSrc: '/podcast/ep001.mp3', // Replace with actual audio file path in real project
      relatedPost: {
        title: 'Introduction to Mobile Repair',
        href: '/blog/introduction-to-mobile-repair'
      }
    },
    {
      id: 'ep002',
      title: 'iPhone Screen Replacement: Best Practices and Common Pitfalls',
      description: 'Professional repair technician Sarah Johnson shares the essential elements of successful iPhone screen replacements. Discussion includes proper tools, techniques for different iPhone models, and how to avoid common mistakes that can damage devices.',
      duration: '45:12',
      date: 'April 15, 2025',
      audioSrc: '/podcast/ep002.mp3',
      relatedPost: {
        title: 'Advanced iPhone Screen Repair Techniques',
        href: '/blog/advanced-iphone-screen-repair'
      }
    },
    {
      id: 'ep003',
      title: 'Sourcing Quality Parts: OEM vs Aftermarket',
      description: 'Parts sourcing expert Mike Chen explains the critical differences between OEM and aftermarket parts, quality control processes, and how to identify genuine components. Learn about the latest developments in part authentication and supply chain management.',
      duration: '42:08',
      date: 'April 1, 2025',
      audioSrc: '/podcast/ep003.mp3',
      relatedPost: {
        title: 'Quality Parts Sourcing Guide',
        href: '/blog/quality-parts-sourcing-guide'
      }
    },
    {
      id: 'ep004',
      title: 'Microsoldering and Advanced Repair Techniques',
      description: 'Microsoldering specialist Lisa Wang shares how advanced repair techniques are changing the repair industry, including board-level repairs, component replacement, and the tools needed for precision work. Real-world case studies and troubleshooting tips.',
      duration: '51:33',
      date: 'March 15, 2025',
      audioSrc: '/podcast/ep004.mp3',
      relatedPost: {
        title: 'Microsoldering in Mobile Repair',
        href: '/blog/microsoldering-in-mobile-repair'
      }
    },
    {
      id: 'ep005',
      title: 'Building a Successful Repair Business',
      description: 'Business consultant David Lee brings practical advice on building and scaling a mobile repair business, analyzing customer service strategies, inventory management, and marketing techniques. Learn from successful repair shop owners about their journey and lessons learned.',
      duration: '47:20',
      date: 'March 1, 2025',
      audioSrc: '/podcast/ep005.mp3',
      relatedPost: {
        title: 'Mobile Repair Business Success Stories',
        href: '/blog/repair-business-success-stories'
      }
    }
  ];

  return (
    <main className="min-h-screen">
      <PodcastHeader />
      
      <section className="py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#333333] mb-4">Latest Podcast Episodes</h2>
            <p className="text-gray-600">
              Subscribe to our podcast channel to listen to industry experts share unique insights on mobile repair techniques, parts sourcing, repair business management, and industry trends. New episodes are updated every two weeks.
            </p>
          </div>
          
          <PodcastList episodes={episodes} />
          
          <div className="mt-10 bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-[#333333] mb-3">How to Listen</h3>
            <p className="text-gray-600 mb-4">
              In addition to listening on this website, you can subscribe to our podcast on the following platforms:
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#" className="bg-white py-2 px-4 rounded-md border border-gray-300 hover:shadow-md transition-shadow text-gray-700">
                Apple Podcasts
              </a>
              <a href="#" className="bg-white py-2 px-4 rounded-md border border-gray-300 hover:shadow-md transition-shadow text-gray-700">
                Spotify
              </a>
              <a href="#" className="bg-white py-2 px-4 rounded-md border border-gray-300 hover:shadow-md transition-shadow text-gray-700">
                Google Podcasts
              </a>
              <a href="#" className="bg-white py-2 px-4 rounded-md border border-gray-300 hover:shadow-md transition-shadow text-gray-700">
                Podcast Addict
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
