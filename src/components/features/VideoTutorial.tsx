import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

const VideoTutorial = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const tutorials = [
    {
      id: 1,
      title: 'Basic Injection Molding Machine Operation Tutorial',
      thumbnail: 'https://picsum.photos/seed/moldall2/600/400',
      duration: '15:30',
    },
    {
      id: 2,
      title: 'Mold Design and Manufacturing',
      thumbnail: 'https://picsum.photos/seed/moldall3/600/400',
      duration: '12:45',
    },
    {
      id: 3,
      title: 'Plastic Material Properties Analysis',
      thumbnail: 'https://picsum.photos/seed/moldall4/600/400',
      duration: '18:20',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#333333] mb-4">Video Tutorials</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore practical applications and operational techniques of injection molding technology through our professional video tutorials
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Main video display */}
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
            <Image 
              src="https://picsum.photos/seed/moldall5/800/450" 
              alt="Main video tutorial" 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-[#00B140] hover:bg-[#008631] text-white rounded-full w-16 h-16 flex items-center justify-center transition-colors"
                aria-label="Play video"
              >
                <Play size={32} fill="white" />
              </button>
            </div>
            {/* If you need to embed real videos in actual projects, you can display a video player here based on isPlaying state */}
            {isPlaying && (
              <div className="absolute inset-0 bg-black flex items-center justify-center">
                <p className="text-white">Video player will display here</p>
                {/* In a real project, a real video player component would be placed here */}
              </div>
            )}
          </div>

          {/* Video list */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#333333] mb-4">Recommended Videos</h3>
            {tutorials.map((tutorial) => (
              <div 
                key={tutorial.id} 
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setIsPlaying(true)}
              >
                <div className="relative w-24 h-16 rounded overflow-hidden flex-shrink-0">
                  <Image 
                    src={tutorial.thumbnail} 
                    alt={tutorial.title}
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play size={16} className="text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-[#333333]">{tutorial.title}</h4>
                  <span className="text-sm text-gray-500">{tutorial.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoTutorial;
