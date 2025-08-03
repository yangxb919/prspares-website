import Image from 'next/image';

const AboutHero = () => {
  return (
    <div className="relative w-full h-[400px] md:h-[500px]">
      <Image
        src="/prspares-about-us-banner-mobile-repair-parts-supplier-professional.jpg"
        alt="PRSPARES About Us - Leading mobile repair parts supplier from Shenzhen"
        fill
        className="object-cover"
        priority
        sizes="100vw"
        quality={85}
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl max-w-2xl mx-auto px-4">
            Leading supplier of mobile repair parts, empowering professionals worldwide
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutHero;
