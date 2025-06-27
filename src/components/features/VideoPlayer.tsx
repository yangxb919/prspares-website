'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

interface VideoPlayerProps {
  thumbnailSrc: string;
  title: string;
  description?: string;
}

const VideoPlayer = ({ thumbnailSrc, title, description }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-full">
      <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
        <Image 
          src={thumbnailSrc} 
          alt={title} 
          fill 
          className="object-cover"
        />
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
            <button 
              onClick={() => setIsPlaying(true)}
              className="bg-[#00B140] hover:bg-[#008631] text-white rounded-full w-16 h-16 flex items-center justify-center transition-colors mb-4"
              aria-label="Play video"
            >
              <Play size={32} fill="white" />
            </button>
            {title && <h3 className="text-white text-xl font-bold">{title}</h3>}
            {description && <p className="text-white/80 mt-2 max-w-md text-center px-4">{description}</p>}
          </div>
        )}
        {isPlaying && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            {/* In a real project, this would be replaced with an actual video player component */}
            <p className="text-white text-center px-4">
              Video player will display here.<br/>
              <button 
                onClick={() => setIsPlaying(false)} 
                className="mt-4 bg-[#00B140] hover:bg-[#008631] text-white py-2 px-4 rounded transition-colors"
              >
                Close Video
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
