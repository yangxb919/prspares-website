import AboutHero from '@/components/features/AboutHero';
import AboutContent from '@/components/features/AboutContent';
// import VideoPlayer from '@/components/features/VideoPlayer'; // Assuming no direct video for now
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About PRSPARES - Your Mobile Repair Parts Specialist',
  description: 'Learn about PRSPARES, your trusted partner for high-quality mobile repair parts, with 10 years of experience in Shenzhen Huaqiangbei.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <AboutHero />
      
      <AboutContent />
      
      {/* Removed VideoPlayer section, can be added back if a company video is available */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#333333] mb-4">Discover PRSPARES</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Watch our introductory video to see how PRSPARES provides top-quality mobile parts and expert service.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <VideoPlayer 
              thumbnailSrc="https://picsum.photos/seed/prspares-video/1200/675" 
              title="PRSPARES - Your Partner for Mobile Repair Parts"
              description="Learn about our commitment to quality and customer satisfaction in the mobile parts industry."
            />
          </div>
        </div>
      </section> */}
      
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#333333] mb-4">Our Strengths</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Why PRSPARES is your premier choice for mobile repair parts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-[#00B140] font-bold text-6xl mb-4">10+</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">Years of Experience</h3>
              <p className="text-gray-600 leading-relaxed">
                Leveraging a decade of leadership in Shenzhen Huaqiangbei, the heart of electronics.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
               <div className="text-[#00B140] font-bold text-6xl mb-4">OEM</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">Genuine OEM Parts</h3>
              <p className="text-gray-600 leading-relaxed">
                As authorized agents for multiple brands, we provide authentic, high-quality components.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-[#00B140] flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users-round"><path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/></svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">Expert Repair Team</h3>
              <p className="text-gray-600 leading-relaxed">
                Our team of seasoned repair professionals ensures you get the best advice and parts.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
