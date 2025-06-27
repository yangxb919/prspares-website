import Image from 'next/image';

const BlogHeader = () => {
  return (
    <div className="relative w-full h-[400px] md:h-[500px]">
      <Image
        src="/prspares-mobile-phone-parts-camera-speakers-charging-ports-components.jpg"
        alt="PRSPARES Blog - Mobile Repair Guides and Industry Insights"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Repair Guides & Industry Insights</h1>
          <p className="text-xl max-w-2xl mx-auto px-4">
            Your source for expert mobile phone repair tutorials, troubleshooting tips, and the latest news from PRSPARES
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogHeader;
