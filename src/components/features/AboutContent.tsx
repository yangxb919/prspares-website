import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const AboutContent = () => {
  return (
    <section className="py-16">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text content section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#333333]">
              PRSPARES <span className="text-[#00B140]">Mobile Parts Platform</span>
            </h2>
            <p className="text-gray-600">
              We are a professional mobile repair parts supplier dedicated to providing high-quality OEM components. Since our founding in 2015, we have been committed to becoming the most trusted source for mobile repair parts in Shenzhen, helping countless repair shops and technicians enhance their service quality.
            </p>
            <p className="text-gray-600">
              Our team consists of industry veterans, experienced quality control specialists, and technical support experts who possess deep knowledge of mobile device components and repair techniques. By combining authentic OEM parts with comprehensive technical support, we provide our customers with reliable solutions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold text-[#333333] mb-2">Our Mission</h3>
                <p className="text-gray-600">To empower repair professionals with genuine OEM parts and expert technical support for superior mobile device repairs.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold text-[#333333] mb-2">Our Vision</h3>
                <p className="text-gray-600">To become the most trusted mobile repair parts supplier globally, setting the standard for quality and service.</p>
              </div>
            </div>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 bg-[#00B140] hover:bg-[#008631] text-white py-3 px-6 rounded-md font-medium transition-colors group"
            >
              Contact Us
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </div>
          
          {/* Image section */}
          <div className="relative rounded-lg overflow-hidden shadow-xl aspect-[4/3]">
            <Image 
              src="/prspares-company-team-workspace-mobile-parts-quality-control-professional.jpg" 
              alt="PRSPARES professional team workspace with mobile repair parts and quality control" 
              fill 
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutContent;
