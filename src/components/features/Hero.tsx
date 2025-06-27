'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
      <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Master Injection Molding
            <span className="text-[#00B140]"> Professional Skills</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Learn industrial injection molding technology through our educational platform and start your professional manufacturing journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="#" 
              className="bg-[#00B140] hover:bg-[#008631] text-white py-3 px-6 rounded-md font-medium transition-colors inline-flex items-center justify-center"
            >
              Start Learning
            </Link>
            <Link 
              href="#" 
              className="border border-white text-white py-3 px-6 rounded-md font-medium hover:bg-white hover:text-gray-900 transition-colors inline-flex items-center justify-center group"
            >
              Explore Resources
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </div>
        </div>
        <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl">
          <Image 
            src="https://picsum.photos/seed/moldall1/800/600" 
            alt="Injection molding machine" 
            fill 
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
