import Image from 'next/image';

const PodcastHeader = () => {
  return (
    <div className="relative w-full h-[250px] md:h-[300px]">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://picsum.photos/seed/prspares-podcast/1920/400"
          alt="PRSPARES Podcast"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Podcast</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Listen to industry experts share insights about mobile repair techniques, parts sourcing, and industry trends
        </p>
      </div>
    </div>
  );
};

export default PodcastHeader;
