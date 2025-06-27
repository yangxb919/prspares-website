import Link from 'next/link';
import { Book, VideoIcon, FileText, Users } from 'lucide-react';

const QuickLinks = () => {
  const links = [
    {
      icon: <Book size={32} className="text-[#00B140]" />,
      title: 'Tutorial Courses',
      description: 'Offering injection molding courses from beginner to advanced levels',
      href: '/blog'
    },
    {
      icon: <VideoIcon size={32} className="text-[#00B140]" />,
      title: 'Video Demonstrations',
      description: 'Watch professional demonstrations of injection molding processes',
      href: '/podcast'
    },
    {
      icon: <FileText size={32} className="text-[#00B140]" />,
      title: 'Technical Resources',
      description: 'Download practical injection molding guides and manuals',
      href: '#'
    },
    {
      icon: <Users size={32} className="text-[#00B140]" />,
      title: 'Industry Community',
      description: 'Join our community and connect with industry professionals',
      href: '/contact'
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#333333]">Start Your Learning Journey</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {links.map((link, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4">{link.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-[#333333]">{link.title}</h3>
              <p className="text-gray-600 mb-4">{link.description}</p>
              <Link 
                href={link.href} 
                className="text-[#00B140] hover:text-[#008631] font-medium inline-flex items-center transition-colors"
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickLinks;
