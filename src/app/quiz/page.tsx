import Breadcrumb from '@/components/shared/Breadcrumb';
import type { Metadata } from 'next';
import Link from 'next/link';
import { HardDrive, Smartphone, Settings, AlertTriangle } from 'lucide-react'; // Example icons

export const metadata: Metadata = {
  title: 'Mobile Repair FAQs & Troubleshooting - PRSPARES',
  description: 'Find answers to common mobile phone issues and learn basic troubleshooting steps. PRSPARES helps you diagnose and fix your device.',
};

interface FAQItem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ElementType;
  link?: string; // Optional link to a more detailed guide or product
}

export default function TroubleshootingPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Repair FAQs', href: '/quiz', isCurrent: true }, // Path remains /quiz for now
  ];

  const faqItems: FAQItem[] = [
    {
      id: 'cracked-screen',
      title: 'What to do with a Cracked Screen?',
      description: 'Learn about screen replacement options, the types of screens we offer (OEM vs. aftermarket), and the general process for repair.',
      category: 'Screen Issues',
      icon: Smartphone,
      link: '/products?category=screens'
    },
    {
      id: 'battery-drain',
      title: 'Phone Battery Draining Quickly?',
      description: 'Common causes for rapid battery drain, tips for extending battery life, and when to consider a battery replacement.',
      category: 'Battery Problems',
      icon: HardDrive, // Using HardDrive as a stand-in for battery icon
      link: '/products?category=batteries'
    },
    {
      id: 'charging-issues',
      title: 'Phone Not Charging Properly?',
      description: 'Troubleshooting steps for charging problems, from checking the cable and port to identifying potential internal issues.',
      category: 'Charging Faults',
      icon: Settings, // Using Settings as a stand-in for charging icon
      link: '/products?category=charging-ports'
    },
    {
      id: 'water-damage',
      title: 'Dropped Your Phone in Water?',
      description: 'Immediate steps to take if your phone suffers water damage, and what professional repair options are available.',
      category: 'Accidents',
      icon: AlertTriangle,
      link: '/contact'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-16 md:py-20 shadow-lg">
        <div className="max-w-[1000px] mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Mobile Repair FAQs & Troubleshooting</h1>
          <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto">
            Find quick answers to common phone problems and learn basic repair tips. 
            PRSPARES is here to help you get your device working perfectly again.
          </p>
        </div>
      </div>
      
      <section className="py-10 md:py-12">
        <div className="max-w-[1000px] mx-auto px-4">
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {faqItems.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="flex items-center mb-4">
                  <item.icon size={28} className="text-[#00B140] mr-4 flex-shrink-0" />
                  <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
                  {item.description}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200">Category: {item.category}</span>
                    {item.link && (
                    <Link href={item.link} className="text-sm font-medium text-[#00B140] hover:text-[#008631] hover:underline transition-colors">
                        {item.link.startsWith('/product') ? 'View Parts' : 'Learn More'}
                    </Link>
                    )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 md:mt-16 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow">
            <h3 className="font-semibold text-xl text-blue-800 mb-2">Need Professional Help?</h3>
            <p className="text-blue-700 mb-4">
              If you're unsure about a repair or dealing with a complex issue, our expert technicians are ready to assist. 
              We offer professional repair services and genuine OEM parts.
            </p>
            <Link href="/contact" className="inline-flex items-center bg-[#00B140] hover:bg-[#008631] text-white font-medium py-2.5 px-5 rounded-lg transition-colors shadow-md">
              Contact Our Experts
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
