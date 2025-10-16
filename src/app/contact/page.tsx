import ContactHeader from '@/components/features/ContactHeader';
import ContactForm from '@/components/features/ContactForm';
import ContactInfo from '@/components/features/ContactInfo';
import MapSection from '@/components/features/MapSection';
import Breadcrumb from '@/components/shared/Breadcrumb';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact PRSPARES - Mobile Repair Part Experts',
  description: 'Get in touch with PRSPARES for inquiries about mobile repair parts, OEM components, or expert repair advice. Located in Shenzhen Huaqiangbei.',
};

export default function ContactPage() {
  // Breadcrumb navigation data
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Contact Us', href: '/contact', isCurrent: true },
  ];

  return (
    <main className="min-h-screen">
      <ContactHeader />
      
      <section className="py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="my-8 md:my-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">We're Here to Help</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you have questions about our mobile repair parts, need a quote, or require technical assistance, our team at PRSPARES is ready to assist you. Your satisfaction is our priority.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 md:mb-16 p-6 md:p-8 bg-white rounded-xl shadow-xl">
            <div className="lg:col-span-5">
              <ContactInfo 
                companyName="PRSPARES"
                address="Huaqiangbei, Shenzhen, China"
                phone="+8618588999234" // Replace with actual phone
                email="parts.info@phonerepairspares.com" // Replace with actual email
                description="Your trusted source for mobile repair parts and expert advice. We are committed to providing quality components and excellent customer service."
              />
            </div>
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
          
          <div className="mt-12 md:mt-16">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">Visit Us in Huaqiangbei</h3>
            <MapSection />
          </div>
        </div>
      </section>
    </main>
  );
}
