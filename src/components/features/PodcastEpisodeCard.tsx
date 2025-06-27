'use client';

import { Play, Pause, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  audioSrc: string;
  relatedPost?: {
    title: string;
    href: string;
  };
}

interface PodcastEpisodeCardProps {
  episode: PodcastEpisode;
}

const PodcastEpisodeCard = ({ episode }: PodcastEpisodeCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    // Simplified version, actual project needs complete audio processing logic
    setIsPlaying(!isPlaying);
    
    // In actual project, audio play/pause logic needs to be added here
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#333333] mb-2">{episode.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{episode.description}</p>
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <span>{episode.date}</span>
            <span>{episode.duration}</span>
          </div>
        </div>
        
        <button 
          onClick={handlePlayPause}
          className="bg-[#00B140] hover:bg-[#008631] text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors ml-4"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" />}
        </button>
      </div>
      
      {episode.relatedPost && (
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-500 mb-1">
            Read related article: {episode.relatedPost.title}
          </p>
          <Link 
            href={episode.relatedPost.href} 
            className="text-[#00B140] text-sm hover:text-[#008631] transition-colors"
          >
            {episode.relatedPost.title}
          </Link>
        </div>
      )}
    </div>
  );
};

export default PodcastEpisodeCard;
