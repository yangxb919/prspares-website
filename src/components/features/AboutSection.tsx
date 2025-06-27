import Image from 'next/image';
import Link from 'next/link';

const AboutSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#333333] mb-4">About PRSPARES</h2>
            <p className="text-gray-600 mb-6">
              PRSPARES is a leading supplier of high-quality mobile repair parts and OEM components, based in Shenzhen Huaqiangbei electronics market. We specialize in providing genuine parts for all major phone brands.
            </p>
            <p className="text-gray-600 mb-6">
              Our mission is to help repair shops and technicians succeed by providing reliable, authentic parts and expert technical support. We combine over 10 years of industry experience with cutting-edge quality control.
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6 ml-4 space-y-2">
              <li>Genuine OEM parts for all major phone brands</li>
              <li>Expert technical support and repair guidance</li>
              <li>Professional community for repair technicians</li>
              <li>Fast shipping and reliable customer service</li>
            </ul>
            <Link 
              href="/about" 
              className="bg-[#00B140] hover:bg-[#008631] text-white py-3 px-6 rounded-md font-medium transition-colors inline-block"
            >
              Learn More About Us
            </Link>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
            <Image 
              src="https://picsum.photos/seed/prspares6/700/500" 
              alt="About PRSPARES" 
              fill 
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
