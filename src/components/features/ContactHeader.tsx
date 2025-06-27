import Image from 'next/image';

const ContactHeader = () => {
  return (
    <div className="relative w-full h-[400px] md:h-[500px]">
      <Image
        src="/prspares-contact-banner-clean-professional-office-background.jpg"
        alt="PRSPARES Contact Page - Clean Professional Office Background for Mobile Repair Parts"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-2xl mx-auto px-4">
            Get in touch with mobile repair parts experts for professional support
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactHeader;
